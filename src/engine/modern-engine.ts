/**
 * ModernEngine - Modern TypeScript implementation of Sandcastle Builder
 *
 * This engine implements the GameEngine interface to enable parity testing
 * against the legacy implementation. It uses extracted game data and
 * implements core mechanics in a clean, testable way.
 *
 * INCREMENTAL IMPLEMENTATION STRATEGY:
 * This engine is built incrementally using parity tests. Features are
 * deferred until parity tests require them (tracked in chainlink issues).
 * Each feature is verified against the legacy engine before proceeding.
 * See docs/architecture/parity-testing.md for the approach.
 */

import type { BoostState, ToolState, GameData, NPData } from '../types/game-data.js';
import type { GameEngine, GameStateSnapshot, TestAction } from '../parity/game-engine.js';
import { SaveParser, createSaveParser } from './save-parser.js';
import { SaveSerializer, createSaveSerializer, type SaveState, type CoreGameState } from './save-serializer.js';
import { UnlockChecker, type UnlockCheckState } from './unlock-checker.js';
import {
  calculateSandToolPurchasePrice,
  calculateCastleToolPrice,
  calculateBoostPrice,
  calculatePriceFactor,
  parsePriceValue,
  isPriceFree,
  calculateActivatableTools,
  calculateCastleProduction,
  calculateSandPerClick,
  calculateGlassChipProduction,
  calculateGlassBlockProduction,
  calculateChipsPerBlock,
  type PriceFactorState,
  type CastleToolPriceState,
  type ClickMultiplierState,
  type GlassChipProductionState,
  type GlassBlockProductionState,
  CASTLE_TOOL_SEEDS,
  CASTLE_TOOL_RATES,
} from './price-calculator.js';
import { allUnlockRules } from './unlock-conditions.js';
import {
  getBoostFunctions,
  type BoostFunctionContext,
} from './boost-functions.js';
import {
  calculateAllSandToolRates,
  calculateTotalSandRate,
  type SandToolRateState,
} from './sand-rate-calculator.js';
import { getDiscovery, hasDiscovery } from '../data/discoveries.js';
import { BadgeChecker } from './badge-checker.js';
import type { BadgeCheckState } from './badge-conditions.js';

/**
 * Internal state for a sand tool
 */
interface SandToolState {
  amount: number;
  bought: number;
  temp: number;
  totalSand: number;
  totalGlass: number;
}

/**
 * Internal state for a castle tool
 */
interface CastleToolState {
  amount: number;
  bought: number;
  temp: number;
  totalCastlesBuilt: number;
  totalCastlesDestroyed: number;
  totalCastlesWasted: number;
  currentActive: number;
  totalGlassBuilt: number;
  totalGlassDestroyed: number;
}

/**
 * Internal boost state with all fields
 */
interface InternalBoostState extends BoostState {
  /** Whether this toggle boost is enabled */
  isEnabled?: boolean;
  /** Whether this boost is permanently locked (cannot be unlocked again) */
  permalock?: boolean;
}

/**
 * Core game state
 */
interface CoreState {
  version: number;
  startDate: number;
  newpixNumber: number;
  highestNPvisited: number;
  beachClicks: number;
  ninjaFreeCount: number;
  ninjaStealth: number;
  ninjad: boolean;
  saveCount: number;
  loadCount: number;
}

/**
 * ONG (newpix transition) state machine
 *
 * State transitions:
 * - At ONG start: npbONG = 0, ninjad reset to false
 * - When ONGelapsed >= ninjaTime: npbONG = 1, NPBs activate
 * - On first click: ninjad = true
 *   - If npbONG = 1: StealthClick (good)
 *   - If npbONG = 0: NinjaUnstealth (bad, breaks streak)
 * - At next ONG: cycle repeats
 */
interface ONGState {
  /** Time (ms) since current newpix started */
  elapsed: number;
  /** Start timestamp of current newpix */
  startTime: number;
  /** NewPixBot ONG state: 0 = pre-ninja window, 1 = ninja window open */
  npbONG: 0 | 1;
  /** NewPix length in seconds (1800 for shortpix, 3600 for longpix) */
  npLength: number;
  /** Calculated ninja time in milliseconds */
  ninjaTime: number;
}

/**
 * Resource amounts (stored in special boosts in legacy)
 */
interface Resources {
  sand: number;
  castles: number;
  glassChips: number;
  glassBlocks: number;
}

/**
 * Castle building state - tracks Fibonacci cost sequence
 */
interface CastleBuildState {
  prevCastleSand: number;
  nextCastleSand: number;
  totalBuilt: number;
}

/**
 * Castle tool price cache - stores Fibonacci state per tool
 */
interface CastleToolPriceCache {
  [toolName: string]: CastleToolPriceState;
}

/**
 * ModernEngine implements the game logic in TypeScript.
 */
export class ModernEngine implements GameEngine {
  private gameData: GameData;
  private saveParser: SaveParser;
  private saveSerializer: SaveSerializer;
  private initialized = false;

  // Core state
  private core: CoreState = {
    version: 4.12,
    startDate: 0,
    newpixNumber: 1,
    highestNPvisited: 1,
    beachClicks: 0,
    ninjaFreeCount: 0,
    ninjaStealth: 0,
    ninjad: false,
    saveCount: 0,
    loadCount: 0,
  };

  // ONG state machine
  private ong: ONGState = {
    elapsed: 0,
    startTime: 0,
    npbONG: 0,
    npLength: 1800,
    ninjaTime: 400000, // 400 mNP * 1000 for shortpix default
  };

  // Resources
  private resources: Resources = {
    sand: 0,
    castles: 0,
    glassChips: 0,
    glassBlocks: 0,
  };

  // Castle building state (Fibonacci sequence for sand cost)
  private castleBuild: CastleBuildState = {
    prevCastleSand: 0,
    nextCastleSand: 1,
    totalBuilt: 0,
  };

  // Current price factor (1 = normal, <1 = discounted)
  private priceFactor = 1;

  // Cached sand per click value (recalculated when boosts/tools change)
  private cachedSandPerClick = 1;

  // Cached sand tool rates (per-tool and total)
  private cachedSandToolRates: Record<string, number> = {};
  private cachedTotalSandRate = 0;

  // Castle tool price cache
  private castleToolPrices: CastleToolPriceCache = {};

  // Tool states
  private sandTools: Map<string, SandToolState> = new Map();
  private castleTools: Map<string, CastleToolState> = new Map();

  // Boost states
  private boosts: Map<string, InternalBoostState> = new Map();

  // Badge states
  private badges: Map<string, boolean> = new Map();

  // Badge group counts (for unlock conditions)
  private badgeGroupCounts: Record<string, number> = {};

  // Unlock checker for auto-unlock logic
  private unlockChecker: UnlockChecker;

  // Badge checker for auto-earn logic
  private badgeChecker: BadgeChecker;

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.saveParser = createSaveParser(gameData);
    this.saveSerializer = createSaveSerializer(gameData);
    this.unlockChecker = new UnlockChecker(allUnlockRules);
    this.badgeChecker = new BadgeChecker((badge) => this.earnBadge(badge));
  }

  /**
   * Initialize the engine with default state.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Initialize sand tools
    for (const tool of this.gameData.sandTools) {
      this.sandTools.set(tool.name, {
        amount: 0,
        bought: 0,
        temp: 0,
        totalSand: 0,
        totalGlass: 0,
      });
    }

    // Initialize castle tools
    for (const tool of this.gameData.castleTools) {
      this.castleTools.set(tool.name, {
        amount: 0,
        bought: 0,
        temp: 0,
        totalCastlesBuilt: 0,
        totalCastlesDestroyed: 0,
        totalCastlesWasted: 0,
        currentActive: 0,
        totalGlassBuilt: 0,
        totalGlassDestroyed: 0,
      });
    }

    // Initialize boosts with default values
    for (const [alias, def] of Object.entries(this.gameData.boosts)) {
      this.boosts.set(alias, {
        unlocked: 0,
        bought: 0,
        power: def.startPower ?? 0,
        countdown: def.startCountdown ?? 0,
      });
    }

    // Initialize badges
    for (const [name] of Object.entries(this.gameData.badges)) {
      this.badges.set(name, false);
    }

    // Set start date
    this.core.startDate = Date.now();

    // Initialize badge checker with no earned badges
    this.badgeChecker.setEarnedBadges([]);

    this.initialized = true;

    // Initialize cached rates
    this.recalculateSandPerClick();
    this.recalculateSandRates();
  }

  /**
   * Clean up resources.
   */
  async dispose(): Promise<void> {
    this.initialized = false;
    this.sandTools.clear();
    this.castleTools.clear();
    this.boosts.clear();
    this.badges.clear();
  }

  /**
   * Ensure engine is initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('ModernEngine not initialized. Call initialize() first.');
    }
  }

  /**
   * Load game state from a serialized save string.
   */
  async loadState(serialized: string): Promise<void> {
    this.ensureInitialized();

    // Decode the save (remove base64 encoding if present)
    // For now, assume raw format for testing
    const state = this.saveParser.parse(serialized);

    // Load core state
    this.core.version = state.version;
    this.core.startDate = state.startDate;
    this.core.newpixNumber = state.newpixNumber;
    this.core.beachClicks = state.beachClicks;
    this.core.ninjaFreeCount = state.ninjaFreeCount;
    this.core.ninjaStealth = state.ninjaStealth;
    this.core.ninjad = state.ninjad;
    this.core.saveCount = state.saveCount;
    this.core.loadCount = state.loadCount;

    // Load sand tools
    for (const [name, toolState] of Object.entries(state.sandTools)) {
      if (this.sandTools.has(name)) {
        this.sandTools.set(name, {
          amount: toolState.amount ?? 0,
          bought: toolState.bought ?? 0,
          temp: toolState.temp ?? 0,
          totalSand: toolState.totalSand ?? 0,
          totalGlass: toolState.totalGlass ?? 0,
        });
      }
    }

    // Load castle tools
    for (const [name, toolState] of Object.entries(state.castleTools)) {
      if (this.castleTools.has(name)) {
        this.castleTools.set(name, {
          amount: toolState.amount ?? 0,
          bought: toolState.bought ?? 0,
          temp: toolState.temp ?? 0,
          totalCastlesBuilt: toolState.totalCastlesBuilt ?? 0,
          totalCastlesDestroyed: toolState.totalCastlesDestroyed ?? 0,
          totalCastlesWasted: toolState.totalCastlesWasted ?? 0,
          currentActive: toolState.currentActive ?? 0,
          totalGlassBuilt: toolState.totalGlassBuilt ?? 0,
          totalGlassDestroyed: toolState.totalGlassDestroyed ?? 0,
        });
      }
    }

    // Load boosts
    for (const [alias, boostState] of Object.entries(state.boosts)) {
      if (this.boosts.has(alias)) {
        this.boosts.set(alias, {
          unlocked: boostState.unlocked,
          bought: boostState.bought,
          power: boostState.power,
          countdown: boostState.countdown,
        });
      }
    }

    // Load resources from special boosts
    const sandBoost = this.boosts.get('Sand');
    const castlesBoost = this.boosts.get('Castles');
    const glassChipsBoost = this.boosts.get('GlassChips');
    const glassBlocksBoost = this.boosts.get('GlassBlocks');

    this.resources.sand = sandBoost?.power ?? 0;
    this.resources.castles = castlesBoost?.power ?? 0;
    this.resources.glassChips = glassChipsBoost?.power ?? 0;
    this.resources.glassBlocks = glassBlocksBoost?.power ?? 0;

    // Load badges
    for (const [name, badgeState] of Object.entries(state.badges)) {
      this.badges.set(name, badgeState.earned);
    }

    // Sync badge checker with loaded badges
    const earnedBadges: string[] = [];
    for (const [name, earned] of this.badges) {
      if (earned) {
        earnedBadges.push(name);
      }
    }
    this.badgeChecker.setEarnedBadges(earnedBadges);

    // Recalculate derived values after loading state
    this.recalculatePriceFactor();
    this.recalculateSandPerClick();
    this.recalculateSandRates();
  }

  /**
   * Export current game state to a serialized save string.
   * Note: This produces raw format, not base64 encoded.
   * Reference: persist.js ToNeedlePulledThing
   */
  async exportState(): Promise<string> {
    this.ensureInitialized();

    // Build core game state for serialization
    const coreState: CoreGameState = {
      version: this.core.version,
      startDate: this.core.startDate,
      newpixNumber: this.core.newpixNumber,
      beachClicks: this.core.beachClicks,
      ninjaFreeCount: this.core.ninjaFreeCount,
      ninjaStealth: this.core.ninjaStealth,
      ninjad: this.core.ninjad,
      saveCount: this.core.saveCount,
      loadCount: this.core.loadCount,
      notifsReceived: 0,
      npbONG: this.ong.npbONG,
      lootPerPage: 20,
      largestNPvisited: { 0: this.core.highestNPvisited },
      redacted: {
        countup: 0,
        toggle: 0,
        location: 0,
        totalClicks: 0,
        chainCurrent: 0,
        chainMax: 0,
      },
    };

    // Convert sand tools map to record
    const sandToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.sandTools) {
      sandToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalSand: state.totalSand,
        totalGlass: state.totalGlass,
      };
    }

    // Convert castle tools map to record
    const castleToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.castleTools) {
      castleToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalCastlesBuilt: state.totalCastlesBuilt,
        totalCastlesDestroyed: state.totalCastlesDestroyed,
        totalCastlesWasted: state.totalCastlesWasted,
        currentActive: state.currentActive,
        totalGlassBuilt: state.totalGlassBuilt,
        totalGlassDestroyed: state.totalGlassDestroyed,
      };
    }

    // Convert boosts map to record
    const boostsRecord: Record<string, BoostState> = {};
    for (const [alias, state] of this.boosts) {
      boostsRecord[alias] = {
        unlocked: state.unlocked,
        bought: state.bought,
        power: state.power,
        countdown: state.countdown,
      };
    }

    // Convert badges map to record
    const badgesRecord: Record<string, boolean> = {};
    for (const [name, earned] of this.badges) {
      badgesRecord[name] = earned;
    }

    // Build save state
    const saveState: SaveState = {
      core: coreState,
      sandTools: sandToolsRecord,
      castleTools: castleToolsRecord,
      boosts: boostsRecord,
      badges: badgesRecord,
      npData: {},
    };

    return this.saveSerializer.serialize(saveState);
  }

  /**
   * Get a snapshot of current game state for comparison.
   */
  async getStateSnapshot(): Promise<GameStateSnapshot> {
    this.ensureInitialized();

    // Convert sand tools map to record
    const sandToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.sandTools) {
      sandToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalSand: state.totalSand,
        totalGlass: state.totalGlass,
      };
    }

    // Convert castle tools map to record
    const castleToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.castleTools) {
      castleToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalCastlesBuilt: state.totalCastlesBuilt,
        totalCastlesDestroyed: state.totalCastlesDestroyed,
        totalCastlesWasted: state.totalCastlesWasted,
        currentActive: state.currentActive,
        totalGlassBuilt: state.totalGlassBuilt,
        totalGlassDestroyed: state.totalGlassDestroyed,
      };
    }

    // Convert boosts map to record
    const boostsRecord: Record<string, BoostState> = {};
    for (const [alias, state] of this.boosts) {
      boostsRecord[alias] = {
        unlocked: state.unlocked,
        bought: state.bought,
        power: state.power,
        countdown: state.countdown,
      };
    }

    // Convert badges map to record
    const badgesRecord: Record<string, boolean> = {};
    for (const [name, earned] of this.badges) {
      badgesRecord[name] = earned;
    }

    return {
      version: this.core.version,
      newpixNumber: this.core.newpixNumber,
      sand: this.resources.sand,
      castles: this.resources.castles,
      glassChips: this.resources.glassChips,
      glassBlocks: this.resources.glassBlocks,
      beachClicks: this.core.beachClicks,
      ninjaFreeCount: this.core.ninjaFreeCount,
      ninjaStealth: this.core.ninjaStealth,
      ninjad: this.core.ninjad,
      sandTools: sandToolsRecord,
      castleTools: castleToolsRecord,
      boosts: boostsRecord,
      badges: badgesRecord,
    };
  }

  /**
   * Advance the game by a number of ticks.
   */
  async tick(count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      this.processTick();
    }
  }

  /**
   * Process a single game tick.
   * Reference: castle.js:3338-3460 (Molpy.Think)
   *
   * Each tick represents ~1 mNP (milliNewPix) of game time.
   * Handles:
   * - Sand production from sand tools
   * - Sand to castle conversion (Fibonacci sequence)
   * - ONG elapsed time tracking
   * - npbONG window detection
   *
   * IMPORTANT: Castle tools do NOT produce during regular ticks!
   * Castle tools only run DestroyPhase/BuildPhase at ONG transitions.
   * See castle.js:3768-3787 for the ONG-only castle tool processing.
   */
  private processTick(): void {
    // Update ONG elapsed time (1 tick = ~1000ms)
    this.ong.elapsed += 1000;

    // Check if npbONG window should open
    // Reference: castle.js:3675-3684
    if (this.ong.npbONG === 0 && !this.core.ninjad) {
      if (this.ong.elapsed >= this.ong.ninjaTime) {
        this.ong.npbONG = 1;
        // Activate NewPixBots if we're past NP 1
        if (Math.abs(this.core.newpixNumber) > 1) {
          this.activateNewPixBots();
        }
      }
    }

    // Check if ONG should trigger (end of newpix)
    if (this.ong.elapsed >= this.ong.npLength * 1000) {
      // Auto-ONG would happen here in real game
      // For testing, we let advanceToONG() be called explicitly
    }

    // Calculate sand production from sand tools
    // Reference: castle.js:3395-3401
    let sandProduced = 0;
    for (const [name, state] of this.sandTools) {
      if (state.amount > 0) {
        const produced = this.calculateSandToolProduction(name, state.amount);
        sandProduced += produced;
        state.totalSand += produced;
      }
    }

    // Add sand to resources
    this.resources.sand += sandProduced;

    // Auto-convert sand to castles (matches legacy Molpy.Boosts['Sand'].toCastles())
    // Reference: castle.js:3340
    this.toCastles();

    // NOTE: Castle tools do NOT produce during ticks - only at ONG!
    // The legacy game calls DestroyPhase/BuildPhase only in ONGBase.

    this.syncResourceBoosts();
  }


  /**
   * Calculate sand production for a tool using cached per-tool rate.
   * The rate is recalculated when boosts/tools change.
   */
  private calculateSandToolProduction(toolName: string, amount: number): number {
    const rate = this.cachedSandToolRates[toolName] ?? 0;
    return rate * amount;
  }

  /**
   * Sync resource values to their boost power fields.
   */
  private syncResourceBoosts(): void {
    const sandBoost = this.boosts.get('Sand');
    if (sandBoost) {
      sandBoost.power = this.resources.sand;
    }

    const castlesBoost = this.boosts.get('Castles');
    if (castlesBoost) {
      castlesBoost.power = this.resources.castles;
    }

    const glassChipsBoost = this.boosts.get('GlassChips');
    if (glassChipsBoost) {
      glassChipsBoost.power = this.resources.glassChips;
    }

    const glassBlocksBoost = this.boosts.get('GlassBlocks');
    if (glassBlocksBoost) {
      glassBlocksBoost.power = this.resources.glassBlocks;
    }
  }

  /**
   * Build the state object for unlock condition checking.
   */
  private buildUnlockCheckState(): UnlockCheckState {
    return {
      sandTools: this.sandTools,
      castleTools: this.castleTools,
      boosts: this.boosts,
      badges: this.badges,
      resources: this.resources,
      badgeGroupCounts: this.badgeGroupCounts,
    };
  }

  /**
   * Build state for sand rate calculation.
   */
  private buildSandRateState(): SandToolRateState {
    const getToolAmount = (name: string): number => {
      const tool = this.sandTools.get(name) ?? this.castleTools.get(name);
      return tool?.amount ?? 0;
    };

    const isBoostBought = (name: string): boolean => {
      const boost = this.boosts.get(name);
      return (boost?.bought ?? 0) > 0;
    };

    const getBoostPower = (name: string): number => {
      const boost = this.boosts.get(name);
      return boost?.power ?? 0;
    };

    // Collect owned glass ceilings (0-11)
    const glassCeilings: number[] = [];
    for (let i = 0; i <= 11; i++) {
      if (isBoostBought(`GlassCeiling${i}`)) {
        glassCeilings.push(i);
      }
    }

    return {
      // Tool amounts
      buckets: getToolAmount('Bucket'),
      cuegans: getToolAmount('Cuegan'),
      flags: getToolAmount('Flag'),
      ladders: getToolAmount('Ladder'),
      bags: getToolAmount('Bag'),
      laPetite: getToolAmount('LaPetite'),
      trebuchets: getToolAmount('Trebuchet'),
      scaffolds: getToolAmount('Scaffold'),
      waves: getToolAmount('Wave'),
      rivers: getToolAmount('River'),
      newPixBots: getToolAmount('NewPixBot'),

      // Boost powers
      biggerBucketsPower: getBoostPower('BiggerBuckets'),
      helpingHandPower: getBoostPower('HelpingHand'),
      flagBearerPower: getBoostPower('FlagBearer'),
      extensionLadderPower: getBoostPower('ExtensionLadder'),

      // Glass Ceiling
      glassCeiling: glassCeilings,

      // Per-tool boost flags
      hugeBuckets: isBoostBought('HugeBuckets'),
      trebuchetPong: isBoostBought('TrebuchetPong'),
      carrybot: isBoostBought('Carrybot'),
      buccaneer: isBoostBought('Buccaneer'),
      flyingBuckets: isBoostBought('FlyingBuckets'),
      megball: isBoostBought('Megball'),
      cooperation: isBoostBought('Cooperation'),
      stickbot: isBoostBought('Stickbot'),
      theForty: isBoostBought('TheForty'),
      humanCannonball: isBoostBought('HumanCannonball'),
      magicMountain: isBoostBought('MagicMountain'),
      standardbot: isBoostBought('Standardbot'),
      balancingAct: isBoostBought('BalancingAct'),
      sbtf: isBoostBought('SBTF'),
      flyTheFlag: isBoostBought('FlyTheFlag'),
      ninjaClimber: isBoostBought('NinjaClimber'),
      levelUp: isBoostBought('LevelUp'),
      climbbot: isBoostBought('Climbbot'),
      brokenRung: isBoostBought('BrokenRung'),
      upUpAndAway: isBoostBought('UpUpAndAway'),
      embaggening: isBoostBought('Embaggening'),
      sandbag: isBoostBought('Sandbag'),
      luggagebot: isBoostBought('Luggagebot'),
      bagPuns: isBoostBought('BagPuns'),
      airDrop: isBoostBought('AirDrop'),
      frenchbot: isBoostBought('Frenchbot'),
      bacon: isBoostBought('Bacon'),

      // For ninja multiplier
      ninjaStealth: this.core.ninjaStealth,

      // Badge count
      badgesOwned: this.countBadgesOwned(),

      // Glass usage (placeholder - will be calculated from glass chip/block production)
      glassUse: 0,

      // Global multiplier boosts
      molpies: isBoostBought('Molpies'),
      grapevine: isBoostBought('Grapevine'),
      chirpies: isBoostBought('Chirpies'),
      facebugs: isBoostBought('Facebugs'),
      overcompensating: isBoostBought('Overcompensating'),
      overcompensatingPower: getBoostPower('Overcompensating'),
      blitzing: isBoostBought('Blitzing'),
      blitzingPower: getBoostPower('Blitzing'),
      bbc: isBoostBought('BBC'),
      bbcPower: getBoostPower('BBC'),
      rbBought: this.boosts.get('RB')?.bought ?? 0,
      hugo: isBoostBought('Hugo'),
      npLength: this.ong.npLength,
      wwbBought: this.boosts.get('WWB')?.bought ?? 0,
      scaffoldAmount: getToolAmount('Scaffold'),
    };
  }

  /**
   * Recalculate cached sand rates.
   * Call this whenever boosts or tools change that affect sand production.
   */
  private recalculateSandRates(): void {
    const state = this.buildSandRateState();
    this.cachedSandToolRates = calculateAllSandToolRates(state);
    this.cachedTotalSandRate = calculateTotalSandRate(state);

    // Check badge conditions when sand rate changes
    this.badgeChecker.check('rate-update', this.buildBadgeCheckState());
  }

  /**
   * Check and process auto-unlocks based on current state.
   * This is called after state changes that might trigger unlocks.
   */
  private checkAutoUnlocks(): void {
    const state = this.buildUnlockCheckState();
    const toUnlock = this.unlockChecker.check(state);

    for (const alias of toUnlock) {
      this.doUnlockBoost(alias);
    }
  }

  /**
   * Internal unlock boost implementation.
   * Sets the unlocked flag and calls any unlock function.
   */
  private doUnlockBoost(alias: string): void {
    const state = this.boosts.get(alias);
    if (!state) return;

    // Check if permalocked - cannot unlock again
    if (state.permalock) return;

    // Only unlock if not already unlocked (or if it's a limited boost that can unlock multiple times)
    const def = this.gameData.boosts[alias];
    if (state.unlocked > 0 && !def?.department) return;

    state.unlocked++;

    // Call boost's unlockFunction if registered
    const functions = getBoostFunctions(alias);
    if (functions?.unlockFunction) {
      functions.unlockFunction(this.createBoostFunctionContext(alias));
    }
  }

  /**
   * Advance time to trigger an ONG (newpix transition).
   * Reference: castle.js:3722-3736 (Molpy.ONG) and castle.js:3738-3885 (Molpy.ONGBase)
   *
   * ONG sequence:
   * 1. ONGBase - core state reset and castle tool cycling
   * 2. ONGs[0] - newpix number advancement (story-specific variants exist)
   * 3. UpdateBeach, HandlePeriods
   */
  async advanceToONG(): Promise<void> {
    this.ensureInitialized();
    this.ongBase();
    this.ongAdvanceNewpix();
    this.handlePeriods();
  }

  /**
   * ONGBase - Core ONG processing.
   * Reference: castle.js:3738-3885
   *
   * Handles:
   * - Boost resets (LA, Fractal Sandcastles)
   * - Glass production (Sand Refinery, Glass Chiller)
   * - Castle tool destroy/build cycles
   * - Fibonacci cost reset
   * - Ninja detection for no-click newpix
   * - Various boost mechanics
   */
  private ongBase(): void {
    // Reset LA level to 1 if owned
    const laBoost = this.boosts.get('LA');
    if (laBoost && laBoost.bought > 0) {
      laBoost.power = 1;
    }

    // Reset Fractal Sandcastles power
    const fractalBoost = this.boosts.get('FractalSandcastles');
    if (fractalBoost) {
      fractalBoost.power = 0;
    }

    // Glass production - runs before castle tools
    // Reference: castle.js:3757-3762
    this.processGlassProduction();

    // Castle tool destroy/build cycles
    // Reference: castle.js:3765-3789
    const activateTimes = 1 + (this.hasBoost('Doublepost') ? 1 : 0);

    for (let cycle = 0; cycle < activateTimes; cycle++) {
      this.ongCastleToolCycle();
    }

    // Badge for castle price rollback
    if (this.castleBuild.nextCastleSand > 1) {
      this.earnBadge('Castle Price Rollback');
    }

    // Reset Fibonacci sequence for castle costs
    this.castleBuild.prevCastleSand = 0;
    this.castleBuild.nextCastleSand = 1;

    // Convert remaining sand to castles
    this.toCastles();

    // Ninja detection for no-click newpix
    // Reference: castle.js:3796-3811
    if (!this.core.ninjad) {
      const hadStealth = this.core.ninjaStealth > 0;
      if (this.ninjaUnstealth() && hadStealth) {
        this.earnBadge('Ninja Holidip');
      }

      // Ninja Ritual handling (simplified)
      const ninjaRitual = this.boosts.get('NinjaRitual');
      const ninjaHerder = this.boosts.get('NinjaHerder');
      if (ninjaRitual && ninjaRitual.bought > 0) {
        if (!ninjaHerder || ninjaHerder.bought === 0) {
          // No Ninja Herder - check for Lost Goats badge
          if (ninjaRitual.power >= 5) {
            this.earnBadge('Lost Goats');
            this.doUnlockBoost('NinjaHerder');
          }
          ninjaRitual.power = 0;
        } else {
          // Has Ninja Herder - grant goats via NinjaRitual
          this.ninjaRitual();
        }
      }
    }

    // Reset ninja flags for new newpix
    this.core.ninjad = false;
    this.ong.npbONG = 0;

    // Reset ONG timing
    this.ong.elapsed = 0;
    this.ong.startTime = Date.now();

    this.syncResourceBoosts();
  }

  /**
   * Castle tool destroy/build cycle during ONG.
   * Reference: castle.js:3768-3787
   *
   * All castle tools do destroy phase, then build phase.
   * NewPixBot is excluded from build phase (only builds when npbONG activates).
   * Backing Out boost reverses the order.
   */
  private ongCastleToolCycle(): void {
    const hasBackingOut = this.hasBoost('BackingOut');

    if (hasBackingOut) {
      // Forward order with Backing Out
      for (const [name, state] of this.castleTools) {
        this.castleToolDestroyPhase(name, state);
        if (name !== 'NewPixBot') {
          this.castleToolBuildPhase(name, state);
        }
      }
    } else {
      // Normal: reverse order for both phases
      const toolEntries = Array.from(this.castleTools.entries()).reverse();

      // Destroy phase (reverse order)
      for (const [name, state] of toolEntries) {
        this.castleToolDestroyPhase(name, state);
      }

      // Build phase (reverse order, skip NewPixBot)
      for (const [name, state] of toolEntries) {
        if (name !== 'NewPixBot') {
          this.castleToolBuildPhase(name, state);
        }
      }
    }
  }

  /**
   * Castle tool destroy phase - spend castles to activate tools.
   * Reference: tools.js DestroyPhase
   */
  private castleToolDestroyPhase(name: string, state: CastleToolState): void {
    if (state.amount <= 0) return;

    const rates = CASTLE_TOOL_RATES[name];
    if (!rates) return;

    const destroyCost = rates.baseDestroyC;
    if (destroyCost <= 0) return;

    // Calculate how many can be activated
    const activatable = calculateActivatableTools(
      state.amount,
      destroyCost,
      this.resources.castles
    );

    if (activatable <= 0) return;

    // Spend castles
    const destroyed = activatable * destroyCost;
    this.resources.castles -= destroyed;
    state.totalCastlesDestroyed += destroyed;
    state.currentActive = activatable;
  }

  /**
   * Castle tool build phase - active tools produce castles.
   * Reference: tools.js BuildPhase
   */
  private castleToolBuildPhase(name: string, state: CastleToolState): void {
    if (state.currentActive <= 0) return;

    const rates = CASTLE_TOOL_RATES[name];
    if (!rates) return;

    const buildRate = rates.baseBuildC;
    const built = calculateCastleProduction(state.currentActive, buildRate);

    this.resources.castles += built;
    state.totalCastlesBuilt += built;

    // Reset currentActive after build
    state.currentActive = 0;
  }

  /**
   * Process glass production at ONG.
   * Reference: castle.js:3757-3762
   *
   * Glass Furnace produces Glass Chips from Sand (via Sand Refinery).
   * Glass Blower produces Glass Blocks from Glass Chips (via Glass Chiller).
   */
  private processGlassProduction(): void {
    // Glass Furnace -> Sand Refinery -> Glass Chips
    // Reference: castle.js:3757-3759
    if (this.isBoostEnabled('GlassFurnace')) {
      const chipState = this.buildGlassChipProductionState();
      const chipsProduced = calculateGlassChipProduction(chipState);

      if (chipsProduced > 0 && isFinite(this.resources.glassChips)) {
        this.resources.glassChips += chipsProduced;
      }
    }

    // Glass Blower -> Glass Chiller -> Glass Blocks
    // Reference: castle.js:3760-3762
    if (this.isBoostEnabled('GlassBlower')) {
      const blockState = this.buildGlassBlockProductionState();
      const { blocksProduced, chipsConsumed } = calculateGlassBlockProduction(blockState);

      if (blocksProduced > 0 && isFinite(this.resources.glassBlocks)) {
        this.resources.glassChips -= chipsConsumed;
        this.resources.glassBlocks += blocksProduced;

        // Earn Glassblower badge on first block production
        this.earnBadge('Glassblower');
      }
    }
  }

  /**
   * Build the state object for glass chip production calculation.
   */
  private buildGlassChipProductionState(): GlassChipProductionState {
    const sandRefinery = this.boosts.get('SandRefinery');
    const glassGoat = this.boosts.get('GlassGoat');
    const goats = this.boosts.get('Goats');

    return {
      sandRefineryPower: sandRefinery?.power ?? 0,
      goats: goats?.power ?? 0,
      hasGlassGoat: (glassGoat?.bought ?? 0) > 0,
      papalChipsMult: 1, // Papal decree not yet implemented
    };
  }

  /**
   * Build the state object for glass block production calculation.
   */
  private buildGlassBlockProductionState(): GlassBlockProductionState {
    const glassChiller = this.boosts.get('GlassChiller');
    const glassGoat = this.boosts.get('GlassGoat');
    const goats = this.boosts.get('Goats');
    const ruthlessEfficiency = this.boosts.get('RuthlessEfficiency');
    const glassTrolling = this.boosts.get('GlassTrolling');

    return {
      glassChillerPower: glassChiller?.power ?? 0,
      glassChips: this.resources.glassChips,
      goats: goats?.power ?? 0,
      hasGlassGoat: (glassGoat?.bought ?? 0) > 0,
      papalBlocksMult: 1, // Papal decree not yet implemented
      hasRuthlessEfficiency: (ruthlessEfficiency?.bought ?? 0) > 0,
      glassTrollingEnabled: this.isBoostEnabled('GlassTrolling'),
    };
  }

  /**
   * ONGs[0] - Default newpix number advancement.
   * Reference: castle.js:3886-3913
   *
   * Advances newpixNumber, respecting Temporal Anchor and Signpost.
   */
  private ongAdvanceNewpix(): void {
    const temporalAnchor = this.boosts.get('TemporalAnchor');
    const isAnchored = temporalAnchor && temporalAnchor.bought > 0 &&
      this.isBoostEnabled('TemporalAnchor');

    if (!isAnchored && this.core.newpixNumber !== 0) {
      // Check Signpost for return to NP 0
      const signpost = this.boosts.get('Signpost');
      if (signpost && signpost.bought > 0 && signpost.power === 1) {
        this.core.newpixNumber = 0;
      } else {
        // Normal advancement
        this.core.newpixNumber += this.core.newpixNumber > 0 ? 1 : -1;
      }

      // Try to earn discovery for this newpix
      this.earnDiscovery();

      // Update highest visited
      const np = Math.abs(this.core.newpixNumber);
      if (np > Math.abs(this.core.highestNPvisited)) {
        this.core.highestNPvisited = this.core.newpixNumber;
        if (this.core.newpixNumber < 0) {
          this.earnBadge('Below the Horizon');
        }
      } else if (np > 2) {
        // In the past - unlock Time Travel
        this.doUnlockBoost('TimeTravel');
      }

      // Signpost unlock condition
      if (this.core.newpixNumber >= 3095) {
        const discovCount = this.badgeGroupCounts['discov'] ?? 0;
        if (discovCount >= 1362) {
          this.doUnlockBoost('Signpost');
        }
      }
    }

    // Reset Signpost and Controlled Hysteresis
    const signpost = this.boosts.get('Signpost');
    if (signpost) {
      signpost.power = 0;
    }

    const controlledHysteresis = this.boosts.get('ControlledHysteresis');
    if (controlledHysteresis) {
      controlledHysteresis.power = -1;
    }
  }

  /**
   * Handle period changes based on newpix number.
   * Reference: castle.js:3971-4044
   *
   * Sets NP length (shortpix vs longpix) and unlocks period-based boosts/badges.
   */
  private handlePeriods(): void {
    const np = Math.abs(this.core.newpixNumber);

    // NP 0-240 are shortpix (1800s), others are longpix (3600s)
    if (np <= 240 && np === Math.floor(np)) {
      this.ong.npLength = 1800;
    } else {
      this.ong.npLength = 3600;
    }

    // Recalculate ninja time based on NP length
    this.calculateNinjaTime();

    // Period-based badges
    if (this.core.newpixNumber < 0) {
      this.earnBadge('Minus Worlds');
    }
    if (this.core.newpixNumber === 0) {
      this.earnBadge('Absolute Zero');
    }
    if (np > 241 && np === Math.floor(np)) {
      this.earnBadge("Have you noticed it's slower?");
    }
    if (np >= 250 && np === Math.floor(np)) {
      this.doUnlockBoost('Overcompensating');
    }
    if (np > 5948 && np === Math.floor(np)) {
      this.earnBadge("And It Don't Stop");
    }
  }

  /**
   * Calculate ninja time based on boosts.
   * Reference: tools.js NewPixBot.calculateNinjaTime
   *
   * Base: 400 mNP (shortpix) or 200 mNP (longpix)
   * Divisors: Busy Bot (1.1), Stealthy Bot (1.1), Chequered Flag (1.2)
   * Western Paradox triples the time.
   */
  private calculateNinjaTime(): void {
    // Base time in mNP
    let baseTime = this.ong.npLength <= 1800 ? 400 : 200;

    // Calculate divisor based on boosts
    let divisor = 1;
    const hasBusyBot = this.hasBoost('BusyBot');
    const hasStealthyBot = this.hasBoost('StealthyBot');
    const hasChequeredFlag = this.hasBoost('ChequeredFlag');

    if (hasChequeredFlag) {
      if (hasBusyBot && hasStealthyBot) {
        divisor = 1.4;
      } else if (hasBusyBot || hasStealthyBot) {
        divisor = 1.3;
      } else {
        divisor = 1.2;
      }
    } else if (hasBusyBot && hasStealthyBot) {
      divisor = 1.2;
    } else if (hasBusyBot || hasStealthyBot) {
      divisor = 1.1;
    }

    baseTime = baseTime / divisor;

    // Western Paradox triples the time
    if (this.hasBoost('WesternParadox')) {
      baseTime *= 3;
    }

    // Convert mNP to milliseconds
    this.ong.ninjaTime = baseTime * this.ong.npLength;
  }

  /**
   * NinjaUnstealth - Called when ninja streak might break.
   * Reference: castle.js:419-461
   *
   * Returns true if ninja was unstealthed (streak broken).
   * Three protection tiers can prevent the break.
   */
  private ninjaUnstealth(): boolean {
    if (this.core.ninjaStealth === 0) {
      return false; // Nothing to lose
    }

    // Protection 1: Impervious Ninja (costs 1% of glass chips, min 100)
    const imperviousNinja = this.boosts.get('ImperviousNinja');
    if (imperviousNinja && imperviousNinja.bought > 0) {
      const payment = Math.floor(this.resources.glassChips * 0.01);
      if (payment >= 100) {
        this.resources.glassChips -= payment;
        imperviousNinja.power--;
        if (imperviousNinja.power <= 0) {
          imperviousNinja.bought = 0;
          imperviousNinja.unlocked = 0;
        }
        return false; // Protected
      }
    }

    // Protection 2: Ninja Hope (costs 10 castles)
    const ninjaHope = this.boosts.get('NinjaHope');
    if (ninjaHope && ninjaHope.bought > 0 && ninjaHope.power > 0) {
      if (this.resources.castles >= 10) {
        this.resources.castles -= 10;
        ninjaHope.power--;
        return false; // Protected
      }
    }

    // Protection 3: Ninja Penance (costs 30 castles)
    const ninjaPenance = this.boosts.get('NinjaPenance');
    if (ninjaPenance && ninjaPenance.bought > 0 && ninjaPenance.power > 0) {
      if (this.resources.castles >= 30) {
        this.resources.castles -= 30;
        ninjaPenance.power--;
        return false; // Protected
      }
    }

    // Ninja breaks - reset protections
    if (ninjaHope) ninjaHope.power = 1;
    if (ninjaPenance) ninjaPenance.power = 2;

    // Badge checks before resetting stealth
    if (this.core.ninjaStealth >= 7 && ninjaHope && ninjaHope.bought > 0) {
      this.doUnlockBoost('NinjaPenance');
    }
    if (this.core.ninjaStealth >= 30 && this.core.ninjaStealth < 36) {
      this.earnBadge('Ninja Shortcomings');
    }

    // Reset stealth
    this.core.ninjaStealth = 0;
    return true;
  }

  /**
   * StealthClick - Called when first click happens after npbONG window opens.
   * Reference: castle.js:309-371
   *
   * Grants ninja stealth, badges, and castle rewards.
   */
  private stealthClick(): void {
    this.earnBadge('No Ninja');
    this.core.ninjaFreeCount++;

    // Calculate stealth increment with multipliers
    let ninjaInc = 1;

    // Active Ninja: 3x if in longpix
    if (this.hasBoost('ActiveNinja') && this.ong.npLength > 1800) {
      ninjaInc *= 3;
    }

    // Check Ninja Lockdown (disables multipliers)
    const ninjaLockdown = this.boosts.get('NinjaLockdown');
    const isLockdownEnabled = ninjaLockdown && ninjaLockdown.bought > 0 &&
      this.isBoostEnabled('NinjaLockdown');

    if (!isLockdownEnabled) {
      if (this.hasBoost('NinjaLeague')) ninjaInc *= 100;
      if (this.hasBoost('NinjaLegion')) ninjaInc *= 1000;
      if (this.hasBoost('NinjaNinjaDuck')) ninjaInc *= 10;
      // Papal multiplier deferred
    }

    this.core.ninjaStealth += ninjaInc;

    // Castle reward
    if (this.hasBoost('NinjaBuilder')) {
      const stealthBuild = this.calcStealthBuild(true, true);
      this.resources.castles += stealthBuild + 1;
      // Factory Ninja interaction deferred
    } else {
      this.resources.castles += 1;
    }

    // Stealth milestone badges and unlocks
    if (this.core.ninjaStealth >= 6) {
      this.earnBadge('Ninja Stealth');
      this.doUnlockBoost('StealthyBot');
    }
    if (this.core.ninjaStealth >= 16) {
      this.earnBadge('Ninja Dedication');
      this.doUnlockBoost('NinjaBuilder');
    }
    if (this.core.ninjaStealth >= 26) {
      this.earnBadge('Ninja Madness');
      this.doUnlockBoost('NinjaHope');
    }
    if (this.core.ninjaStealth >= 36) {
      this.earnBadge('Ninja Omnipresence');
    }
    if (this.core.ninjaStealth > 4000) {
      this.earnBadge('Ninja Pact');
    }
    if (this.core.ninjaStealth > 4000000) {
      this.earnBadge('Ninja Unity');
    }

    // Check badge conditions for stealth-click trigger
    this.badgeChecker.check('stealth-click', this.buildBadgeCheckState());

    this.syncResourceBoosts();
  }

  /**
   * Calculate stealth build castle reward.
   * Reference: castle.js:372-397
   */
  private calcStealthBuild(useVJ: boolean, spend: boolean): number {
    let stealthBuild = this.core.ninjaStealth;

    // Ninja Assistants: multiply by NewPixBot count
    if (this.hasBoost('NinjaAssistants')) {
      const npb = this.castleTools.get('NewPixBot');
      if (npb) stealthBuild *= npb.amount;
    }

    // Skull and Crossbones: scale with Flag count
    if (this.hasBoost('SkullAndCrossbones')) {
      const flags = this.sandTools.get('Flag');
      if (flags) {
        stealthBuild = Math.floor(
          stealthBuild * Math.pow(1.05, Math.max(-1, flags.amount - 40))
        );
      }
    }

    // Glass Jaw: 100x multiplier (costs 1 glass block)
    const glassJaw = this.boosts.get('GlassJaw');
    if (glassJaw && this.isBoostEnabled('GlassJaw')) {
      if (this.resources.glassBlocks >= 1) {
        if (spend) this.resources.glassBlocks -= 1;
        stealthBuild *= 100;
      }
    }

    // Ninja Climber: multiply by Ladder count
    if (this.hasBoost('NinjaClimber')) {
      const ladders = this.sandTools.get('Ladder');
      if (ladders) stealthBuild *= ladders.amount;
    }

    // Ninjasaw + VJ interaction deferred

    return stealthBuild;
  }

  /**
   * Ninja Ritual - Grant goats based on ritual level.
   * Reference: boosts.js:9115-9147 (simplified)
   */
  private ninjaRitual(): void {
    const ninjaRitual = this.boosts.get('NinjaRitual');
    if (!ninjaRitual) return;

    const goats = this.boosts.get('Goats');
    if (!goats) return;

    const oldLevel = ninjaRitual.power;

    // Grant goats (simplified - full formula has many multipliers)
    goats.power += Math.floor(1 + oldLevel / 5);

    // Level up with exponential jumps
    let mult = 1;
    while (ninjaRitual.power <= oldLevel) {
      ninjaRitual.power += mult;
      mult *= 10;
    }

    // Badge thresholds
    if (ninjaRitual.power > 1000000) this.earnBadge('Mega Ritual');
    if (ninjaRitual.power > 1e12) this.earnBadge('Tera Ritual');
  }

  /**
   * Activate NewPixBots - called when npbONG window opens.
   * Reference: castle.js:3108-3116
   */
  private activateNewPixBots(): void {
    const npb = this.castleTools.get('NewPixBot');
    if (!npb || npb.amount <= 0) return;

    const rates = CASTLE_TOOL_RATES['NewPixBot'];
    if (!rates) return;

    // NewPixBot has destroyC = 0, so it only builds
    const built = calculateCastleProduction(npb.amount, rates.baseBuildC);
    this.resources.castles += built;
    npb.totalCastlesBuilt += built;
    npb.currentActive = npb.amount;

    this.syncResourceBoosts();
  }

  /**
   * Check if a boost is owned (bought > 0).
   */
  private hasBoost(alias: string): boolean {
    const state = this.boosts.get(alias);
    return !!state && state.bought > 0;
  }

  /**
   * Check if a toggle boost is enabled.
   * For toggle boosts, isEnabled must be explicitly true.
   * For non-toggle boosts, bought > 0 means it's active.
   */
  private isBoostEnabled(alias: string): boolean {
    const state = this.boosts.get(alias);
    if (!state || state.bought === 0) return false;

    // Check if this is a toggle boost
    const def = this.gameData.boosts[alias];
    if (def?.isToggle) {
      // For toggles, must be explicitly enabled
      return state.isEnabled === true;
    }

    // For non-toggles, bought > 0 means active
    return true;
  }

  /**
   * Earn a badge if not already earned.
   */
  private earnBadge(name: string): void {
    if (!this.badges.has(name)) {
      this.badges.set(name, false);
    }
    if (!this.badges.get(name)) {
      this.badges.set(name, true);
      // Update badge group counts
      const def = this.gameData.badges[name];
      if (def) {
        this.badgeGroupCounts[def.group] = (this.badgeGroupCounts[def.group] ?? 0) + 1;
      }
    }
  }

  /**
   * Earn discovery badge for current NewPix.
   *
   * Discoveries are special badges earned when visiting specific NewPix for the first time.
   * Each discovery creates 4 related badges (discov, monums, monumg, diamm).
   *
   * Reference: castle.js:3218-3235
   *
   * @returns true if discovery was earned, false otherwise
   */
  private earnDiscovery(): boolean {
    const np = this.core.newpixNumber;

    // Check if discovery exists for this NP
    if (!hasDiscovery(np)) {
      return false;
    }

    // Generate badge alias (handles both positive and negative NP)
    const alias = `discov${np}`;

    // Check if already earned
    if (this.badges.get(alias)) {
      return false;
    }

    // Special case: NP 2440 requires specific timing in legacy
    // For now, we just earn it when visiting
    if (Math.abs(np) === 2440) {
      // In legacy, this requires being at exactly the right sub-frame
      // We'll implement this timing check if needed for parity
    }

    // Earn the discovery badge
    this.earnBadge(alias);
    return true;
  }

  /**
   * Build state for badge condition checking.
   */
  private buildBadgeCheckState(): BadgeCheckState {
    // Count tools owned
    let sandToolsOwned = 0;
    for (const [, state] of this.sandTools) {
      sandToolsOwned += state.amount;
    }

    let castleToolsOwned = 0;
    for (const [, state] of this.castleTools) {
      castleToolsOwned += state.amount;
    }

    // Build tool amounts map
    const toolAmounts: Record<string, number> = {};
    for (const [name, state] of this.sandTools) {
      toolAmounts[name] = state.amount;
    }
    for (const [name, state] of this.castleTools) {
      toolAmounts[name] = state.amount;
    }

    // Calculate castles spent (total bought - current owned)
    let castlesSpent = 0;
    for (const [, state] of this.sandTools) {
      // Sand tools typically cost sand, not castles
      // This is a simplified calculation
    }
    for (const [, state] of this.castleTools) {
      // Castle tools cost castles
      // Need to calculate based on purchase history
      castlesSpent += state.bought; // Simplified
    }

    // Count boosts owned
    let boostsOwned = 0;
    for (const [, state] of this.boosts) {
      if (state.bought > 0) {
        boostsOwned++;
      }
    }

    // Count badges owned
    let badgesOwned = 0;
    for (const [, earned] of this.badges) {
      if (earned) {
        badgesOwned++;
      }
    }

    return {
      sand: this.resources.sand,
      castles: this.resources.castles,
      glassChips: this.resources.glassChips,
      glassBlocks: this.resources.glassBlocks,
      sandToolsOwned,
      castleToolsOwned,
      totalToolsOwned: sandToolsOwned + castleToolsOwned,
      toolAmounts,
      beachClicks: this.core.beachClicks,
      castlesSpent,
      ninjaStealth: this.core.ninjaStealth,
      ninjaFreeCount: this.core.ninjaFreeCount,
      sandPermNP: this.cachedTotalSandRate,
      badgesOwned,
      boostsOwned,
      discoveryCount: this.badgeGroupCounts['discov'] ?? 0,
      monumentCount: (this.badgeGroupCounts['monums'] ?? 0) + (this.badgeGroupCounts['monumg'] ?? 0),
    };
  }

  /**
   * Count total badges owned.
   */
  private countBadgesOwned(): number {
    let count = 0;
    for (const earned of this.badges.values()) {
      if (earned) count++;
    }
    return count;
  }

  /**
   * Set the current newpix number directly.
   */
  async setNewpix(np: number): Promise<void> {
    this.ensureInitialized();
    this.core.newpixNumber = np;
  }

  /**
   * Simulate beach clicks.
   */
  async clickBeach(count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      this.processBeachClick();
    }
  }

  /**
   * Process a single beach click.
   * Reference: castle.js:151-306 (Molpy.ClickBeach)
   *
   * Handles ninja detection:
   * - If npbONG = 1 and ninjad = 0: StealthClick (good)
   * - If npbONG = 0 and ninjad = 0: NinjaUnstealth (bad)
   */
  private processBeachClick(): void {
    this.core.beachClicks++;

    // Use cached sand per click (updated when boosts/tools change)
    const sandGained = this.cachedSandPerClick;

    this.resources.sand += sandGained;
    this.syncResourceBoosts();

    // Check badge conditions for click trigger
    this.badgeChecker.check('click', this.buildBadgeCheckState());

    // Ninja detection logic
    // Reference: castle.js:169-221
    const npb = this.castleTools.get('NewPixBot');
    const hasNPB = npb && (npb.amount > 0 || !isFinite(npb.amount));

    if (!this.core.ninjad && hasNPB) {
      if (this.ong.npbONG === 1) {
        // First click after npbONG window opened - stealth click (good!)
        this.stealthClick();
        // Ritual Sacrifice/Rift handling deferred
      } else if (this.ong.npbONG === 0) {
        // First click BEFORE npbONG window - ninja break (bad!)
        if (this.ninjaUnstealth()) {
          // Award ninja badges based on NPB count
          if (npb && npb.currentActive > 0) {
            this.earnBadge('Ninja');
          }
          if (npb && npb.currentActive >= 10) {
            this.earnBadge('Ninja Strike');
          }
          if (npb && npb.currentActive >= 1000) {
            this.earnBadge('KiloNinja Strike');
          }
          if (npb && npb.currentActive >= 1e6) {
            this.earnBadge('MegaNinja Strike');
          }
          if (npb && npb.currentActive >= 1e9) {
            this.earnBadge('GigaNinja Strike');
          }
        }

        // Ninja Ritual on ninja break
        const ninjaRitual = this.boosts.get('NinjaRitual');
        if (ninjaRitual && ninjaRitual.bought > 0) {
          this.ninjaRitual();
          if (ninjaRitual.power > 10) this.doUnlockBoost('WesternParadox');
          if (ninjaRitual.power > 24) this.doUnlockBoost('RitualSacrifice');
        } else {
          // Check for Ninja Ritual unlock
          const goats = this.boosts.get('Goats');
          if (goats && goats.power >= 10) {
            this.doUnlockBoost('NinjaRitual');
          }
        }
      }
    }

    // Mark that we've clicked this newpix
    this.core.ninjad = true;

    // Check for badge unlocks
    this.checkClickBadges();

    // Auto-convert sand to castles (like legacy toCastles)
    this.toCastles();
  }

  /**
   * Auto-convert sand to castles using Fibonacci cost sequence.
   * Matches legacy Molpy.Boosts['Sand'].toCastles() behavior.
   */
  private toCastles(): void {
    // Convert sand to castles while we have enough
    while (this.resources.sand >= this.castleBuild.nextCastleSand &&
           isFinite(this.resources.castles)) {
      // Build one castle (Fractal Sandcastles boost not implemented yet)
      this.resources.castles++;
      this.castleBuild.totalBuilt++;

      // Spend sand
      this.resources.sand -= this.castleBuild.nextCastleSand;

      // Advance Fibonacci sequence for castle cost
      const currentCost = this.castleBuild.nextCastleSand;
      this.castleBuild.nextCastleSand = this.castleBuild.prevCastleSand + currentCost;
      this.castleBuild.prevCastleSand = currentCost;

      // Safety check for infinite/invalid state
      if (!isFinite(this.resources.sand) || this.castleBuild.nextCastleSand <= 0) {
        this.castleBuild.nextCastleSand = 1;
        this.resources.castles = Infinity;
        break;
      }
    }

    this.syncResourceBoosts();
  }

  /**
   * Check for badges earned from clicking.
   */
  private checkClickBadges(): void {
    // Badge thresholds (simplified)
    const clickBadges: Record<string, number> = {
      'Click Ninja': 1,
      'Click Ninja Ninja': 10,
      // More badges would be added here
    };

    for (const [badge, threshold] of Object.entries(clickBadges)) {
      if (this.core.beachClicks >= threshold && !this.badges.get(badge)) {
        this.badges.set(badge, true);
      }
    }
  }

  /**
   * Buy a sand or castle tool.
   */
  async buyTool(type: 'sand' | 'castle', name: string, count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      if (type === 'sand') {
        this.buySandTool(name);
      } else {
        this.buyCastleTool(name);
      }

      // Check badge conditions after each tool purchase
      this.badgeChecker.check('tool-purchase', this.buildBadgeCheckState());
      this.badgeChecker.check('resource-change', this.buildBadgeCheckState());
    }

    // Recalculate click rate after tool purchase (affects pair bonuses)
    this.recalculateSandPerClick();
  }

  /**
   * Buy a sand tool.
   * Note: Sand tools cost CASTLES, not sand!
   * Formula: floor(priceFactor * basePrice * (1.1 ^ amount))
   */
  private buySandTool(name: string): void {
    const state = this.sandTools.get(name);
    if (!state) return;

    const toolDef = this.gameData.sandTools.find(t => t.name === name);
    if (!toolDef) return;

    // Calculate price using proper formula
    const price = calculateSandToolPurchasePrice(
      toolDef.basePrice,
      state.amount,
      this.priceFactor
    );

    // Sand tools cost castles
    if (isFinite(price) && this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;
      this.syncResourceBoosts();
      this.recalculateSandRates();
      this.checkAutoUnlocks();
    }
  }

  /**
   * Buy a castle tool.
   * Uses Fibonacci sequence pricing with price0/price1 seeds.
   * Formula: floor(priceFactor * fibonacciPrice)
   */
  private buyCastleTool(name: string): void {
    const state = this.castleTools.get(name);
    if (!state) return;

    // Get Fibonacci seeds for this tool
    const seeds = CASTLE_TOOL_SEEDS[name];
    if (!seeds) return;

    // Calculate Fibonacci price
    const priceState = calculateCastleToolPrice(
      seeds.price0,
      seeds.price1,
      state.amount
    );

    // Apply priceFactor
    const price = Math.floor(this.priceFactor * priceState.price);

    if (isFinite(price) && this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;

      // Cache the updated price state for next purchase
      this.castleToolPrices[name] = priceState;

      this.syncResourceBoosts();
      this.recalculateSandRates();
      this.checkAutoUnlocks();
    }
  }

  /**
   * Check if a boost is affordable at its current price.
   * Reference: castle.js:1522-1528 (Boost.isAffordable)
   *
   * @param alias - Boost alias to check
   * @returns True if the boost can be purchased
   */
  async isBoostAffordable(alias: string): Promise<boolean> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    const def = this.gameData.boosts[alias];

    if (!state || !def) return false;

    // Must be unlocked but not yet bought
    if (state.unlocked <= state.bought) return false;

    // Calculate price with priceFactor applied
    const realPrice = calculateBoostPrice(def.price, this.priceFactor);

    // Free boosts are always affordable
    if (isPriceFree(realPrice)) return true;

    // Check if we can afford the price
    return this.canAffordPrice(realPrice);
  }

  /**
   * Get the calculated price for a boost (after priceFactor).
   * Reference: castle.js:1531-1542 (Boost.CalcPrice)
   *
   * @param alias - Boost alias
   * @returns Calculated price object, or empty if boost not found
   */
  getBoostPrice(alias: string): Record<string, number> {
    const def = this.gameData.boosts[alias];
    if (!def) return {};

    return calculateBoostPrice(def.price, this.priceFactor);
  }

  /**
   * Buy/unlock a boost.
   * Applies priceFactor to boost price and checks affordability.
   * Reference: castle.js:1499-1520 (Boost.buy)
   */
  async buyBoost(alias: string): Promise<void> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (!state) return;

    const def = this.gameData.boosts[alias];
    if (!def) return;

    // Check if unlocked but not bought
    if (state.unlocked > state.bought) {
      // Calculate price with priceFactor applied
      const realPrice = calculateBoostPrice(def.price, this.priceFactor);
      const isFree = isPriceFree(realPrice);

      // Check if we can afford it
      if (!isFree && !this.canAffordPrice(realPrice)) {
        return; // Can't afford
      }

      // Spend the resources
      if (!isFree) {
        this.spendPrice(realPrice);
      }

      state.bought++;
      this.checkAutoUnlocks();

      // Call boost's buyFunction if registered
      const functions = getBoostFunctions(alias);
      if (functions?.buyFunction) {
        functions.buyFunction(this.createBoostFunctionContext(alias));
      }

      // Recalculate rates after boost purchase
      this.recalculatePriceFactor();
      this.recalculateSandPerClick();
      this.recalculateSandRates();
    }
  }

  /**
   * Check if player can afford a price.
   * Reference: castle.js:1284-1293 (Molpy.Has with object)
   */
  private canAffordPrice(price: Record<string, number>): boolean {
    for (const [resource, amount] of Object.entries(price)) {
      if (!this.hasResource(resource, amount)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Spend resources for a price.
   * Reference: castle.js:1300-1313 (Molpy.Spend with object)
   */
  private spendPrice(price: Record<string, number>): void {
    for (const [resource, amount] of Object.entries(price)) {
      this.subtractResource(resource, amount);
    }
    this.syncResourceBoosts();
  }

  /**
   * Get current amount of a resource.
   * In legacy, all resources are boosts where power = amount.
   * Reference: castle.js:1291-1292 (Molpy.Has delegates to boost.Has)
   */
  private getResourceAmount(resource: string): number {
    // Primary resources have dedicated fields for performance
    switch (resource) {
      case 'Sand': return this.resources.sand;
      case 'Castles': return this.resources.castles;
      case 'GlassChips': return this.resources.glassChips;
      case 'GlassBlocks': return this.resources.glassBlocks;
    }

    // All other resources are stored as boost power
    const boost = this.boosts.get(resource);
    return boost?.power ?? 0;
  }

  /**
   * Check if player has at least the specified amount of a resource.
   * Reference: castle.js:1284-1293 (Molpy.Has)
   */
  private hasResource(resource: string, amount: number): boolean {
    return this.getResourceAmount(resource) >= amount;
  }

  /**
   * Subtract from a resource.
   * Reference: castle.js:1300-1313 (Molpy.Spend)
   */
  private subtractResource(resource: string, amount: number): void {
    // Primary resources have dedicated fields
    switch (resource) {
      case 'Sand':
        this.resources.sand -= amount;
        return;
      case 'Castles':
        this.resources.castles -= amount;
        return;
      case 'GlassChips':
        this.resources.glassChips -= amount;
        return;
      case 'GlassBlocks':
        this.resources.glassBlocks -= amount;
        return;
    }

    // All other resources are stored as boost power
    const boost = this.boosts.get(resource);
    if (boost) {
      boost.power = Math.max(0, boost.power - amount);
    }
  }

  /**
   * Add to a resource.
   * Reference: castle.js:1295-1298 (Molpy.Add)
   */
  private addResource(resource: string, amount: number): void {
    // Primary resources have dedicated fields
    switch (resource) {
      case 'Sand':
        this.resources.sand += amount;
        return;
      case 'Castles':
        this.resources.castles += amount;
        return;
      case 'GlassChips':
        this.resources.glassChips += amount;
        return;
      case 'GlassBlocks':
        this.resources.glassBlocks += amount;
        return;
    }

    // All other resources are stored as boost power
    const boost = this.boosts.get(resource);
    if (boost) {
      boost.power += amount;
    }
  }

  /**
   * Toggle a boost on/off.
   */
  async toggleBoost(alias: string): Promise<void> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    const def = this.gameData.boosts[alias];

    if (!state || !def || !def.isToggle) return;

    // Toggle isEnabled state
    state.isEnabled = !state.isEnabled;
  }

  /**
   * Lock a boost (reset bought and unlocked to 0).
   * Calls the boost's lockFunction if registered.
   * Reference: castle.js Molpy.LockBoost
   */
  lockBoost(alias: string): void {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (!state) return;

    // Call boost's lockFunction before resetting state
    const functions = getBoostFunctions(alias);
    if (functions?.lockFunction) {
      functions.lockFunction(this.createBoostFunctionContext(alias));
    }

    // Reset the boost state
    state.bought = 0;
    state.unlocked = 0;

    // Recalculate rates after lock
    this.recalculatePriceFactor();
    this.recalculateSandPerClick();
  }

  /**
   * Permalock a boost (prevents it from being unlocked again).
   */
  permalockBoost(alias: string): void {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (state) {
      state.permalock = true;
    }
  }

  // ===========================================================================
  // Boost Function Context
  // ===========================================================================

  /**
   * Create a context object for boost function calls.
   * This provides a controlled interface for boost functions to interact with engine state.
   */
  private createBoostFunctionContext(alias: string): BoostFunctionContext {
    const state = this.boosts.get(alias);

    return {
      boostAlias: alias,
      boostPower: state?.power ?? 0,
      boostCountdown: state?.countdown ?? 0,
      boostBought: state?.bought ?? 0,

      // Engine queries
      getBeachClicks: () => this.core.beachClicks,
      getResource: (name) => {
        switch (name) {
          case 'sand': return this.resources.sand;
          case 'castles': return this.resources.castles;
          case 'glassChips': return this.resources.glassChips;
          case 'glassBlocks': return this.resources.glassBlocks;
        }
      },
      getBoostPower: (boostAlias) => this.boosts.get(boostAlias)?.power ?? 0,
      getBoostBought: (boostAlias) => this.boosts.get(boostAlias)?.bought ?? 0,
      isBoostEnabled: (boostAlias) => {
        const boost = this.boosts.get(boostAlias);
        return boost?.bought ? (boost.isEnabled ?? true) : false;
      },

      // Engine mutations
      setBoostPower: (boostAlias, power) => {
        const boost = this.boosts.get(boostAlias);
        if (boost) {
          boost.power = power;
          this.syncResourceBoosts();
        }
      },
      setBoostCountdown: (boostAlias, countdown) => {
        const boost = this.boosts.get(boostAlias);
        if (boost) {
          boost.countdown = countdown;
        }
      },
      addResource: (name, amount) => {
        switch (name) {
          case 'sand': this.resources.sand += amount; break;
          case 'castles': this.resources.castles += amount; break;
          case 'glassChips': this.resources.glassChips += amount; break;
          case 'glassBlocks': this.resources.glassBlocks += amount; break;
        }
        this.syncResourceBoosts();
      },
      subtractResource: (name, amount) => {
        switch (name) {
          case 'sand': this.resources.sand -= amount; break;
          case 'castles': this.resources.castles -= amount; break;
          case 'glassChips': this.resources.glassChips -= amount; break;
          case 'glassBlocks': this.resources.glassBlocks -= amount; break;
        }
        this.syncResourceBoosts();
      },
      lockBoost: (boostAlias) => this.lockBoost(boostAlias),
      unlockBoost: (boostAlias) => this.doUnlockBoost(boostAlias),
      permalockBoost: (boostAlias) => this.permalockBoost(boostAlias),
      recalculatePriceFactor: () => this.recalculatePriceFactor(),
      earnBadge: (name) => this.earnBadge(name),
      notify: (message) => {
        // In headless mode, notifications are logged or stored for testing
        // Could emit events for UI layer in future
        if (process.env.DEBUG) {
          console.log(`[Notify] ${message}`);
        }
      },
    };
  }

  /**
   * Recalculate priceFactor based on active discount boosts.
   * Called after boost purchases or countdown changes.
   */
  private recalculatePriceFactor(): void {
    const ashfState = this.boosts.get('ASHF');
    const familyDiscountState = this.boosts.get('FamilyDiscount');

    // ASHF is active if bought and has remaining countdown
    const hasASHF = !!ashfState && ashfState.bought > 0 && ashfState.countdown > 0;
    const ashfPower = hasASHF ? (ashfState?.power ?? 0.4) : 0;

    // Family Discount is a permanent boost
    const hasFamilyDiscount = !!familyDiscountState && familyDiscountState.bought > 0;

    const state: PriceFactorState = {
      hasASHF,
      ashfPower,
      hasFamilyDiscount,
    };

    this.priceFactor = calculatePriceFactor(state);
  }

  /**
   * Get current price factor (for testing/debugging).
   */
  getPriceFactor(): number {
    return this.priceFactor;
  }

  /**
   * Build the state object needed for click multiplier calculation.
   * Reference: boosts.js:7357-7392
   */
  private buildClickMultiplierState(): ClickMultiplierState {
    const getToolAmount = (name: string): number => {
      const tool = this.sandTools.get(name);
      return tool?.amount ?? 0;
    };

    const isBoostBought = (name: string): boolean => {
      const boost = this.boosts.get(name);
      return (boost?.bought ?? 0) > 0;
    };

    const getBoostPower = (name: string): number => {
      const boost = this.boosts.get(name);
      return boost?.power ?? 0;
    };

    // Calculate current sand production rate for Bucket Brigade
    let sandPermNP = 0;
    for (const [name, state] of this.sandTools) {
      if (state.amount > 0) {
        const rate = this.cachedSandToolRates[name] ?? 0;
        sandPermNP += rate * state.amount;
      }
    }

    return {
      biggerBuckets: getBoostPower('BiggerBuckets'),
      hugeBuckets: isBoostBought('HugeBuckets'),
      buccaneer: isBoostBought('Buccaneer'),
      helpfulHands: isBoostBought('HelpfulHands'),
      trueColours: isBoostBought('TrueColours'),
      raiseTheFlag: isBoostBought('RaiseTheFlag'),
      handItUp: isBoostBought('HandItUp'),
      bucketBrigade: isBoostBought('BucketBrigade'),
      bagPuns: isBoostBought('BagPuns'),
      boneClicker: isBoostBought('BoneClicker'),
      bonemeal: getBoostPower('Bonemeal'),
      buckets: getToolAmount('Bucket'),
      cuegans: getToolAmount('Cuegan'),
      flags: getToolAmount('Flag'),
      ladders: getToolAmount('Ladder'),
      bags: getToolAmount('Bag'),
      sandPermNP,
    };
  }

  /**
   * Recalculate the cached sand per click value.
   * Called after boost purchases, tool purchases, or state load.
   */
  private recalculateSandPerClick(): void {
    const state = this.buildClickMultiplierState();
    this.cachedSandPerClick = calculateSandPerClick(state);
  }

  /**
   * Get current sand per click value (for testing/debugging).
   */
  getSandPerClick(): number {
    return this.cachedSandPerClick;
  }

  // ===========================================================================
  // Test Helper Methods
  // ===========================================================================

  /**
   * Force a boost to a specific state (for testing).
   * Automatically recalculates derived values.
   */
  forceBoostState(alias: string, state: Partial<BoostState>): void {
    this.ensureInitialized();

    const existing = this.boosts.get(alias);
    if (existing) {
      if (state.unlocked !== undefined) existing.unlocked = state.unlocked;
      if (state.bought !== undefined) existing.bought = state.bought;
      if (state.power !== undefined) existing.power = state.power;
      if (state.countdown !== undefined) existing.countdown = state.countdown;

      // Recalculate derived values
      this.recalculatePriceFactor();
      this.recalculateSandPerClick();
    }
  }

  /**
   * Force resources to specific values (for testing).
   */
  forceResources(resources: Partial<{ sand: number; castles: number; glassChips: number; glassBlocks: number }>): void {
    this.ensureInitialized();

    if (resources.sand !== undefined) this.resources.sand = resources.sand;
    if (resources.castles !== undefined) this.resources.castles = resources.castles;
    if (resources.glassChips !== undefined) this.resources.glassChips = resources.glassChips;
    if (resources.glassBlocks !== undefined) this.resources.glassBlocks = resources.glassBlocks;

    this.syncResourceBoosts();
  }

  /**
   * Force a sand tool to a specific amount (for testing).
   */
  forceSandToolAmount(name: string, amount: number): void {
    this.ensureInitialized();

    const tool = this.sandTools.get(name);
    if (tool) {
      tool.amount = amount;
      this.recalculateSandPerClick();
    }
  }

  /**
   * Get the current sand production rate per tick.
   */
  async getSandRate(): Promise<number> {
    this.ensureInitialized();
    return this.cachedTotalSandRate;
  }

  /**
   * Get the theoretical castle production rate per ONG.
   * This is the NET rate (built - destroyed) assuming all tools can be activated.
   *
   * IMPORTANT: Castle tools do NOT produce during regular ticks!
   * They only run DestroyPhase/BuildPhase at ONG (newpix transitions).
   * This method returns the theoretical per-ONG production rate.
   *
   * Note: Actual production depends on having enough castles to activate tools.
   */
  async getCastleRate(): Promise<number> {
    this.ensureInitialized();

    let netRate = 0;

    for (const [name, state] of this.castleTools) {
      // NewPixBot only produces at ONG, not during ticks
      if (name === 'NewPixBot' || state.amount <= 0) {
        continue;
      }

      const rates = CASTLE_TOOL_RATES[name];
      if (!rates) {
        continue;
      }

      // Net rate = (buildRate - destroyCost) * amount
      const netPerTool = rates.baseBuildC - rates.baseDestroyC;
      netRate += netPerTool * state.amount;
    }

    return netRate;
  }

  /**
   * Get boost state by alias.
   */
  async getBoostState(alias: string): Promise<BoostState> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (!state) {
      return {
        unlocked: 0,
        bought: 0,
        power: 0,
        countdown: 0,
      };
    }

    return {
      unlocked: state.unlocked,
      bought: state.bought,
      power: state.power,
      countdown: state.countdown,
    };
  }

  /**
   * Check if a badge has been earned.
   */
  async getBadgeState(name: string): Promise<boolean> {
    this.ensureInitialized();
    return this.badges.get(name) ?? false;
  }

  /**
   * Execute a test action.
   */
  async executeAction(action: TestAction): Promise<void> {
    switch (action.type) {
      case 'click':
        if (action.target === 'beach') {
          await this.clickBeach(action.count ?? 1);
        }
        break;

      case 'tick':
        await this.tick(action.count ?? 1);
        break;

      case 'wait':
        await this.tick(action.ticks);
        break;

      case 'ong':
        await this.advanceToONG();
        break;

      case 'buy-tool':
        await this.buyTool(action.toolType, action.toolName, action.count ?? 1);
        break;

      case 'buy-boost':
        await this.buyBoost(action.boostAlias);
        break;

      case 'toggle-boost':
        await this.toggleBoost(action.boostAlias);
        break;

      case 'set-newpix':
        await this.setNewpix(action.np);
        break;

      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  // --- Direct state manipulation for testing ---

  /**
   * Set sand amount directly (for testing).
   */
  setSand(amount: number): void {
    this.resources.sand = amount;
    this.syncResourceBoosts();
  }

  /**
   * Set castles amount directly (for testing).
   */
  setCastles(amount: number): void {
    this.resources.castles = amount;
    this.syncResourceBoosts();
  }

  /**
   * Set a sand tool amount directly (for testing).
   */
  setSandToolAmount(name: string, amount: number): void {
    const state = this.sandTools.get(name);
    if (state) {
      state.amount = amount;
      state.bought = Math.max(state.bought, amount);
      this.recalculateSandRates();
    }
  }

  /**
   * Unlock a boost (for testing).
   * Calls the internal doUnlockBoost which handles permalock and unlock functions.
   */
  unlockBoost(alias: string): void {
    this.ensureInitialized();
    this.doUnlockBoost(alias);
  }
}

/**
 * Create a ModernEngine from game data JSON.
 */
export function createModernEngine(gameData: GameData): ModernEngine {
  return new ModernEngine(gameData);
}
