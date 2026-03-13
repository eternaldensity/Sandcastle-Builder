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
import { calculateFactoryAutomationRuns } from './factory-automation.js';
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
  glassCeilingUnlockCheck,
  type BoostFunctionContext,
} from './boost-functions.js';
import {
  calculateAllSandToolRates,
  calculateTotalSandRate,
  type SandToolRateState,
} from './sand-rate-calculator.js';
import {
  calculateAllCastleToolRates,
  type CastleToolRateState,
  type CastleToolRates,
} from './castle-rate-calculator.js';
import { getDiscovery, hasDiscovery } from '../data/discoveries.js';
import { BadgeChecker } from './badge-checker.js';
import type { BadgeCheckState } from './badge-conditions.js';
import {
  calculateKittySpawnTime,
  calculateKittyDespawnTime,
  determineRewardType,
  calculateBlitzingReward,
  calculateNotLuckyReward,
  determineKittyClickAction,
  applyKittyClickResult,
  type RedundakittyState,
  type RedundakittyBoostState,
  type BlitzingReward,
  type NotLuckyReward
} from './redundakitty.js';
import { createLogicatState } from './logicat.js';
import {
  createInitialDragonSystemState,
  recalculateDragonSystem,
  processDragonDig,
  checkDiggingNotification,
  dragonFledge,
  processCombatOutcome,
  generateRedundaKnight,
  calculateHideTime,
  calculateDragonMultipliers,
  findOpponents,
  type DragonBoostState,
  type DragonDiggingBoostState,
  type CombatBoostState,
  type CombatOutcome,
  type FledgeResult,
  type DragonMultipliers,
  type DigType,
  type DigResult,
} from './dragon.js';
import type {
  DragonQueenState,
  DragonHatchlingsState,
  DragonNestState,
  DragonOverallState,
  DragonSystemState,
  OpponentInstance,
} from '../types/game-data.js';
import { isResourceInfinite } from '../utils/number-format.js';

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
  /** Whether this can be unlocked by Department of Redundancy (mutable at runtime) */
  department?: number;
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

  // Cached castle tool rates (per-tool)
  private cachedCastleToolRates: CastleToolRates = {
    NewPixBot: 3.5,
    Trebuchet: 6.25,
    Scaffold: 15.63,
    Wave: 39.06,
    River: 97.66,
  };

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

  // Redundakitty state
  private redundakitty: RedundakittyState = {
    totalClicks: 0,
    chainCurrent: 0,
    chainMax: 0,
    spawnCountdown: 0,
    despawnCountdown: 0,
    isActive: false,
    recursionDepth: 0,
    drawType: [],
    keepPosition: 0,
    logicatState: createLogicatState(),
  };

  // Dragon system state
  private dragons: DragonSystemState = createInitialDragonSystemState();

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

    // Initialize Tool Factory as virtual boost (acts as both boost and resource)
    // TF is unlocked when a tool price reaches Infinity (Shop Failed badge)
    // Its power represents Glass Chips loaded into it
    if (!this.boosts.has('TF')) {
      this.boosts.set('TF', { unlocked: 0, bought: 0, power: 0, countdown: 0 });
    }

    // Initialize Glass Ceiling 0-11 as virtual boosts
    // These are dynamically created in legacy via MakeGlassCeiling()
    // Reference: boosts.js:3366-3411
    for (let i = 0; i < 12; i++) {
      const name = `Glass Ceiling ${i}`;
      if (!this.boosts.has(name)) {
        this.boosts.set(name, { unlocked: 0, bought: 0, power: 0, countdown: 0 });
      }
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
    this.recalculateCastleRates();

    // Check for auto-unlocks (matches legacy CheckBuyUnlocks behavior)
    this.checkAutoUnlocks();

    // Run glass ceiling unlock cascade on fresh init
    glassCeilingUnlockCheck(this.createBoostFunctionContext('Glass Ceiling 0'));
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
    this.core.highestNPvisited = state.largestNPvisited?.[0] ?? state.newpixNumber;

    // Load ONG state
    this.ong.npbONG = (state.npbONG ?? 0) as 0 | 1;

    // Load redundakitty state
    if (state.redacted) {
      this.redundakitty.totalClicks = state.redacted.totalClicks ?? 0;
      this.redundakitty.chainCurrent = state.redacted.chainCurrent ?? 0;
      this.redundakitty.chainMax = state.redacted.chainMax ?? 0;
    }

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

    // Ensure virtual resource boosts exist before loading
    // These are not in game data but are created during save/export
    if (!this.boosts.has('Sand')) {
      this.boosts.set('Sand', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('Castles')) {
      this.boosts.set('Castles', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('GlassChips')) {
      this.boosts.set('GlassChips', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('GlassBlocks')) {
      this.boosts.set('GlassBlocks', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('TF')) {
      this.boosts.set('TF', { unlocked: 0, bought: 0, power: 0, countdown: 0 });
    }
    for (let i = 0; i < 12; i++) {
      const name = `Glass Ceiling ${i}`;
      if (!this.boosts.has(name)) {
        this.boosts.set(name, { unlocked: 0, bought: 0, power: 0, countdown: 0 });
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

    // Load badges - clear and reload all to ensure clean state
    this.badges.clear();
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

    // Load dragon npData
    if (state.npData) {
      this.dragons.npData.clear();
      for (const [npStr, data] of Object.entries(state.npData)) {
        const np = parseInt(npStr, 10);
        if (!isNaN(np)) {
          this.dragons.npData.set(np, data);
        }
      }
      this.dragons.recalcNeeded = true;
    }

    // Recalculate derived values after loading state
    this.recalculatePriceFactor();
    this.recalculateSandPerClick();
    this.recalculateSandRates();
    this.recalculateCastleRates();

    // Run glass ceiling unlock cascade after loading
    glassCeilingUnlockCheck(this.createBoostFunctionContext('Glass Ceiling 0'));
  }

  /**
   * Export current game state to a serialized save string.
   * Note: This produces raw format, not base64 encoded.
   * Reference: persist.js ToNeedlePulledThing
   */
  async exportState(): Promise<string> {
    this.ensureInitialized();

    // Sync resources to virtual boost powers before export
    // Ensure virtual resource boosts exist
    if (!this.boosts.has('Sand')) {
      this.boosts.set('Sand', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('Castles')) {
      this.boosts.set('Castles', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('GlassChips')) {
      this.boosts.set('GlassChips', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('GlassBlocks')) {
      this.boosts.set('GlassBlocks', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
    }
    if (!this.boosts.has('TF')) {
      this.boosts.set('TF', { unlocked: 0, bought: 0, power: 0, countdown: 0 });
    }
    for (let i = 0; i < 12; i++) {
      const name = `Glass Ceiling ${i}`;
      if (!this.boosts.has(name)) {
        this.boosts.set(name, { unlocked: 0, bought: 0, power: 0, countdown: 0 });
      }
    }
    this.syncResourceBoosts();

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
        totalClicks: this.redundakitty.totalClicks,
        chainCurrent: this.redundakitty.chainCurrent,
        chainMax: this.redundakitty.chainMax,
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

    // Convert dragon npData Map to Record
    const npDataRecord: Record<number, NPData> = {};
    for (const [np, data] of this.dragons.npData) {
      npDataRecord[np] = data;
    }

    // Build save state
    const saveState: SaveState = {
      core: coreState,
      sandTools: sandToolsRecord,
      castleTools: castleToolsRecord,
      boosts: boostsRecord,
      badges: badgesRecord,
      npData: npDataRecord,
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

    // Process redundakitty spawn/despawn countdowns
    this.tickRedundakitty();

    // Process boost countdowns (Blitzing, etc.)
    this.tickBoostCountdowns();

    this.syncResourceBoosts();

    // Check tick-based badges (e.g., Badge Collector for badge count milestones)
    this.badgeChecker.check('tick', this.buildBadgeCheckState());
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
   * Build state object for castle tool rate calculations.
   * Similar pattern to buildSandRateState().
   */
  private buildCastleRateState(): CastleToolRateState {
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

    // Collect owned glass ceilings
    const glassCeilings: number[] = [];
    for (let i = 0; i < 12; i++) {
      if (isBoostBought(`Glass Ceiling ${i}`)) {
        glassCeilings.push(i);
      }
    }

    return {
      // Tool amounts
      newPixBots: getToolAmount('NewPixBot'),
      trebuchets: getToolAmount('Trebuchet'),
      scaffolds: getToolAmount('Scaffold'),
      waves: getToolAmount('Wave'),
      rivers: getToolAmount('River'),

      // Glass Ceiling support
      glassCeilings,
      wwbBought: this.boosts.get('WWB')?.bought ?? 0,
      scaffoldAmount: getToolAmount('Scaffold'),

      // NewPixBot boost multipliers
      busyBot: isBoostBought('Busy Bot'),
      robotEfficiency: isBoostBought('Robot Efficiency'),
      robotEfficiencyPower: getBoostPower('Robot Efficiency'),
      recursivebot: isBoostBought('Recursivebot'),
      halOKitty: isBoostBought('HAL-0-Kitty'),
      halBoost: getBoostPower('HAL-0-Kitty'),

      // Trebuchet boost multipliers
      springFling: isBoostBought('Spring Fling'),
      trebuchetPong: isBoostBought('Trebuchet Pong'),
      trebuchetPongPower: getBoostPower('Trebuchet Pong'),
      flingbot: isBoostBought('Flingbot'),
      variedAmmo: isBoostBought('Varied Ammo'),
      variedAmmoPower: getBoostPower('Varied Ammo'),

      // Scaffold boost multipliers
      precisePlacement: isBoostBought('Precise Placement'),
      levelUp: isBoostBought('Level Up!'),
      propbot: isBoostBought('Propbot'),

      // Wave boost multipliers
      swell: isBoostBought('Swell'),
      surfbot: isBoostBought('Surfbot'),
      sbtf: isBoostBought('SBTF'),
      sbtfPower: getBoostPower('SBTF'),

      // River boost multipliers
      smallbot: isBoostBought('Smallbot'),
    };
  }

  /**
   * Recalculate cached castle tool rates.
   * Call this whenever boosts or tools change that affect castle production.
   */
  private recalculateCastleRates(): void {
    const state = this.buildCastleRateState();
    this.cachedCastleToolRates = calculateAllCastleToolRates(state);
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

    // Check ONG-based badges (currently no specific ONG badges, but system is ready)
    this.badgeChecker.check('ong', this.buildBadgeCheckState());
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
        this.doUnlockBoost('Time Travel');
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

    // Activate Factory Automation if owned
    // Reference: castle.js:3114
    this.activateFactoryAutomation();
  }

  /**
   * Activate Factory Automation.
   *
   * FA is a complex endgame system that runs automatically when NewPixBots activate.
   * It processes department boosts, mould work, blackprint construction, and more.
   *
   * Reference: castle.js:3117-3148
   */
  private activateFactoryAutomation(): void {
    const fa = this.boosts.get('Factory Automation');
    if (!fa || fa.bought === 0) return;

    const npb = this.castleTools.get('NewPixBot');
    if (!npb) return;

    const hasSafetyPumpkin = this.hasBoost('Safety Pumpkin');
    const hasSafetyGoggles = this.hasBoost('SG');
    const hasCracks = this.isBoostEnabled('Cracks');
    const hasAlephOne = this.isBoostEnabled('Aleph One');

    // Calculate how many FA runs we can activate
    const result = calculateFactoryAutomationRuns(
      fa.power,
      npb.amount,
      this.resources.sand,
      hasSafetyPumpkin,
      hasSafetyGoggles,
      hasCracks,
      hasAlephOne
    );

    // Handle industrial accident
    if (result.hadAccident && npb.amount > 0) {
      npb.amount--;
      // Unlock Safety Pumpkin if FA level > 14
      if (fa.power > 14) {
        this.doUnlockBoost('Safety Pumpkin');
      }
    }

    // Spend sand for FA runs
    if (result.sandSpent > 0) {
      this.resources.sand -= result.sandSpent;
      this.syncResourceBoosts();
    }

    // NOTE: FA run processing (mould work, blackprint construction, DoRD rewards)
    // is implemented in the redundakitty system which handles department boost execution.
    // FA activation here calculates and charges for runs; actual department work happens
    // when redundakitty clicks trigger DoRD or when the tick loop processes FA-enabled boosts.
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

  // =============================================================================
  // Monument System
  // =============================================================================
  // Monuments are created from discoveries through a multi-step process:
  // 1. Discovery -> Sand Monument (via Sand Mould Maker + Sand Mould Filler)
  // 2. Sand Monument -> Glass Monument (via Glass Mould Maker + Glass Mould Filler)
  // 3. Glass Monument -> Diamond Masterpiece (via Diamond Mould Maker + Filler)
  //
  // Each step requires:
  // - A "maker" boost that creates a mould (progress tracked in boost.power)
  // - A "filler" boost that fills the mould with resources
  // - Multiple Factory Automation (FA) runs to complete
  //
  // State is stored in boost.extra: { Making: number (NP being made) }
  // Progress is stored in boost.power: 0 = idle, 1-threshold = in progress, >threshold = complete
  // =============================================================================

  /**
   * Start making a sand mould from a discovery.
   * Reference: boosts.js:4538-4568
   */
  makeSandMould(np: number): void {
    const mname = `monums${np}`;

    // Check if badge exists
    if (!this.badges.has(mname)) {
      return; // No such mould exists
    }

    // Check if already earned
    if (this.badges.get(mname)) {
      return; // Don't need to make this mould
    }

    const smm = this.boosts.get('SMM');
    const smf = this.boosts.get('SMF');

    if (!smm || !smm.bought) {
      return; // Don't have Sand Mould Maker
    }

    if (smm.power > 0) {
      return; // Sand Mould Maker already in use
    }

    // Check if already filling this mould
    if (smf && smf.power > 0 && smf.extra?.Making === np) {
      return; // Already made this mould and filling it
    }

    // Start making the mould
    if (!smm.extra) smm.extra = {};
    smm.extra.Making = np;
    smm.power = 1;
  }

  /**
   * Process sand mould making work during Factory Automation.
   * Reference: boosts.js:4570-4596
   * @param runs Number of FA runs available
   * @returns Remaining FA runs
   */
  makeSandMouldWork(runs: number): number {
    const smm = this.boosts.get('SMM');
    if (!smm || smm.power === 0 || smm.power > 100) {
      return runs; // Not making, or already complete
    }

    const np = (smm.extra?.Making as number) ?? 0;
    let chipsPerRun = np * 100;
    if (chipsPerRun < 0) chipsPerRun *= chipsPerRun; // Square if negative

    while (runs > 0) {
      if (this.resources.glassChips < chipsPerRun) {
        return runs; // Not enough glass chips
      }

      this.resources.glassChips -= chipsPerRun;
      runs--;
      smm.power++;

      if (smm.power > 100) {
        // Mould creation complete
        return runs;
      }
    }

    return runs;
  }

  /**
   * Start filling a sand mould with sand to create a monument.
   * Reference: boosts.js:4598-4638
   */
  fillSandMould(np: number): void {
    const mname = `monums${np}`;
    const smm = this.boosts.get('SMM');
    const smf = this.boosts.get('SMF');

    if (!this.badges.has(mname)) {
      // Reset SMM if it was making this invalid mould
      if (smm && smm.extra?.Making === np) {
        smm.power = 0;
        if (smm.extra) smm.extra.Making = 0;
      }
      return;
    }

    if (this.badges.get(mname)) {
      // Already earned, reset SMM if needed
      if (smm && smm.extra?.Making === np) {
        smm.power = 0;
        if (smm.extra) smm.extra.Making = 0;
      }
      return;
    }

    if (!smf || !smf.bought) {
      return; // Don't have Sand Mould Filler
    }

    if (smf.power > 0) {
      return; // Sand Mould Filler already in use
    }

    if (!smm || smm.power <= 100) {
      return; // No mould ready to be filled
    }

    // Start filling the mould
    if (!smf.extra) smf.extra = {};
    smf.extra.Making = np;
    smf.power = 1;

    // Clear maker state
    if (smm.extra) smm.extra.Making = 0;
    smm.power = 0;
  }

  /**
   * Process sand mould filling work during Factory Automation.
   * Reference: boosts.js:4640-4668
   * @param runs Number of FA runs available
   * @returns Remaining FA runs
   */
  fillSandMouldWork(runs: number): number {
    const smf = this.boosts.get('SMF');
    if (!smf || smf.power === 0) {
      return runs; // Not filling
    }

    const np = (smf.extra?.Making as number) ?? 0;
    const sandPerRun = Math.pow(1.2, Math.abs(np)) * 100;
    const sandToSpend = np < 0 ? sandPerRun * sandPerRun : sandPerRun;

    while (runs > 0) {
      if (this.resources.sand < sandToSpend) {
        return runs; // Not enough sand
      }

      this.resources.sand -= sandToSpend;
      runs--;
      smf.power++;

      if (smf.power > 200) {
        // Sand mould filling complete - earn the badge
        const alias = `monums${np}`;
        this.earnBadge(alias);

        // Clear filler state
        if (smf.extra) smf.extra.Making = 0;
        smf.power = 0;
        return runs;
      }
    }

    return runs;
  }

  /**
   * Start making a glass mould from a sand monument.
   * Reference: boosts.js:4670-4700
   */
  makeGlassMould(np: number): void {
    const mname = `monumg${np}`;
    const gmm = this.boosts.get('GMM');
    const gmf = this.boosts.get('GMF');

    if (!this.badges.has(mname)) {
      return; // No such mould exists
    }

    if (this.badges.get(mname)) {
      return; // Don't need to make this mould
    }

    if (!gmm || !gmm.bought) {
      return; // Don't have Glass Mould Maker
    }

    if (gmm.power > 0) {
      return; // Glass Mould Maker already in use
    }

    // Check if already filling this mould
    if (gmf && gmf.power > 0 && gmf.extra?.Making === np) {
      return; // Already made this mould and filling it
    }

    // Start making the mould
    if (!gmm.extra) gmm.extra = {};
    gmm.extra.Making = np;
    gmm.power = 1;
  }

  /**
   * Process glass mould making work during Factory Automation.
   * Reference: boosts.js:4717-4744
   * @param runs Number of FA runs available
   * @returns Remaining FA runs
   */
  makeGlassMouldWork(runs: number): number {
    const gmm = this.boosts.get('GMM');
    if (!gmm || gmm.power === 0 || gmm.power > 400) {
      return runs; // Not making, or already complete
    }

    const np = (gmm.extra?.Making as number) ?? 0;
    const baseChips = Math.pow(1.01, Math.abs(np)) * 1000;
    const chipsPerRun = np < 0 ? baseChips * baseChips : baseChips;

    while (runs > 0) {
      if (this.resources.glassChips < chipsPerRun) {
        return runs; // Not enough glass chips
      }

      this.resources.glassChips -= chipsPerRun;
      runs--;
      gmm.power++;

      if (gmm.power > 400) {
        // Glass mould creation complete
        return runs;
      }
    }

    return runs;
  }

  /**
   * Start filling a glass mould with glass to create a glass monument.
   * Reference: boosts.js:4746-4785
   */
  fillGlassMould(np: number): void {
    const mname = `monumg${np}`;
    const gmm = this.boosts.get('GMM');
    const gmf = this.boosts.get('GMF');

    if (!this.badges.has(mname)) {
      // Reset GMM if it was making this invalid mould
      if (gmm && gmm.extra?.Making === np) {
        gmm.power = 0;
        if (gmm.extra) gmm.extra.Making = 0;
      }
      return;
    }

    if (this.badges.get(mname)) {
      // Already earned, reset GMM if needed
      if (gmm && gmm.extra?.Making === np) {
        gmm.power = 0;
        if (gmm.extra) gmm.extra.Making = 0;
      }
      return;
    }

    if (!gmf || !gmf.bought) {
      return; // Don't have Glass Mould Filler
    }

    if (gmf.power > 0) {
      return; // Glass Mould Filler already in use
    }

    if (!gmm || gmm.power <= 400) {
      return; // No mould ready to be filled
    }

    // Start filling the mould
    if (!gmf.extra) gmf.extra = {};
    gmf.extra.Making = np;
    gmf.power = 1;

    // Clear maker state
    if (gmm.extra) gmm.extra.Making = 0;
    gmm.power = 0;
  }

  /**
   * Process glass mould filling work during Factory Automation.
   * Reference: boosts.js:4787-4820
   * @param runs Number of FA runs available
   * @returns Remaining FA runs
   */
  fillGlassMouldWork(runs: number): number {
    const gmf = this.boosts.get('GMF');
    if (!gmf || gmf.power === 0) {
      return runs; // Not filling
    }

    const np = (gmf.extra?.Making as number) ?? 0;
    const baseGlass = Math.pow(1.02, Math.abs(np)) * 1000000;
    const glassToSpend = np < 0 ? baseGlass * baseGlass : baseGlass;

    while (runs > 0) {
      if (this.resources.glassBlocks < glassToSpend) {
        return runs; // Not enough glass blocks
      }

      this.resources.glassBlocks -= glassToSpend;
      runs--;
      gmf.power++;

      if (gmf.power > 800) {
        // Glass mould filling complete - earn the badge
        const alias = `monumg${np}`;
        this.earnBadge(alias);

        // Clear filler state
        if (gmf.extra) gmf.extra.Making = 0;
        gmf.power = 0;
        return runs;
      }
    }

    return runs;
  }

  /**
   * Process all mould work during Factory Automation.
   * Called during tick processing when Factory Automation is active.
   * Reference: castle.js:3166-3185
   * @param runs Number of FA runs available
   * @returns Remaining FA runs after all mould work
   */
  doMouldWork(runs: number): number {
    // Check if Cold Mould is enabled (disables mould work)
    const coldMould = this.boosts.get('Cold Mould');
    if (coldMould && coldMould.power > 0) {
      return runs; // Cold Mould disables mould work
    }

    // Process in order: Fill Glass -> Make Glass -> Fill Sand -> Make Sand
    // This order ensures moulds can be filled before new ones start
    if (runs > 0) runs = this.fillGlassMouldWork(runs);
    if (runs > 0) runs = this.makeGlassMouldWork(runs);
    if (runs > 0) runs = this.fillSandMouldWork(runs);
    if (runs > 0) runs = this.makeSandMouldWork(runs);

    // Mould Press: If AO + Mould Press, repeat mould work until no progress
    // Reference: castle.js:3173-3182
    if (this.hasBoost('AO') && this.hasBoost('MouldPress')) {
      while (runs > 0) {
        const start = runs;
        if (runs > 0) runs = this.fillGlassMouldWork(runs);
        if (runs > 0) runs = this.makeGlassMouldWork(runs);
        if (runs > 0) runs = this.fillSandMouldWork(runs);
        if (runs > 0) runs = this.makeSandMouldWork(runs);
        if (start === runs) break; // No progress made, exit loop
      }
    }

    return runs;
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

    // Build boost powers map
    const boostPowers: Record<string, number> = {};
    for (const [alias, state] of this.boosts) {
      boostPowers[alias] = state.power;
    }

    // Build badges map
    const badges: Record<string, boolean> = {};
    for (const [name, earned] of this.badges) {
      badges[name] = earned;
    }

    // Count glass ceilings owned
    let glassCeilingCount = 0;
    for (let i = 0; i < 12; i++) {
      const boost = this.boosts.get(`Glass Ceiling ${i}`);
      if (boost && boost.bought > 0) {
        glassCeilingCount++;
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
      boostPowers,
      badges,
      badgesOwned,
      boostsOwned,
      discoveryCount: this.badgeGroupCounts['discov'] ?? 0,
      monumentCount: (this.badgeGroupCounts['monums'] ?? 0) + (this.badgeGroupCounts['monumg'] ?? 0),
      glassCeilingCount,
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
   * Also updates highestNPvisited if this is a new high.
   */
  async setNewpix(np: number): Promise<void> {
    this.ensureInitialized();
    this.core.newpixNumber = np;

    // Update highest NP visited
    if (Math.abs(np) > Math.abs(this.core.highestNPvisited)) {
      this.core.highestNPvisited = np;
    }
  }

  /**
   * Calculate time travel cost in castles.
   * Reference: boosts.js:692-703 (Molpy.TimeTravelPrice)
   *
   * Formula:
   * price = newpixNumber + (castles * newpixNumber / 3094) + travelCount
   * if Flux Capacitor: price *= 0.2
   * price = Math.ceil(price / priceFactor)
   * price = Math.abs(price)
   */
  calculateTimeTravelPrice(): number {
    const boost = this.boosts.get('Time Travel');
    const travelCount = (typeof boost?.extra?.travelCount === 'number') ? boost.extra.travelCount : 0;
    const np = this.core.newpixNumber;

    let price = np;
    price += this.resources.castles * np / 3094;
    price += travelCount;

    if (this.hasBoost('Flux Capacitor')) {
      price *= 0.2;
    }

    price = Math.ceil(price / this.priceFactor);

    if (isNaN(price)) {
      return Infinity;
    }

    return Math.abs(price);
  }

  /**
   * Calculate glass chip cost for jumping to a specific newpix.
   * Reference: boosts.js:817-832 (Molpy.CalcJumpEnergy)
   *
   * Formula:
   * cost = (destNP - currentNP)^2 + travelCount
   * cost *= 100
   * if crossing sides: cost *= 1000000 (unless going to negative without AA)
   * if jumping to negative unknown discovery: cost *= 1.1
   * if Flux Capacitor: cost *= 0.2
   * if Mind Glow + sand monument at dest: cost *= 0.5
   * if Memory Singer + glass monument at dest: cost *= 0.5
   */
  calculateJumpCost(destNP: number): number {
    const boost = this.boosts.get('Time Travel');
    const travelCount = (typeof boost?.extra?.travelCount === 'number') ? boost.extra.travelCount : 0;
    const currentNP = this.core.newpixNumber;

    const gap = destNP - currentNP;
    let cost = gap * gap;
    cost += travelCount;
    cost *= 100;

    // Crossing between positive and negative sides
    if (destNP * currentNP < 0) {
      if (destNP < 0 || this.hasBoost('AA')) {
        cost *= 1000000;
      }
    }

    // Premium for jumping to unknown negative discovery
    if (destNP < 0 && !this.badges.get('discov' + destNP)) {
      cost *= 1.1;
    }

    if (this.hasBoost('Flux Capacitor')) {
      cost *= 0.2;
    }

    if (this.hasBoost('Mind Glow') && this.badges.get('monums' + destNP)) {
      cost *= 0.5;
    }

    if (this.hasBoost('Memory Singer') && this.badges.get('monumg' + destNP)) {
      cost *= 0.5;
    }

    return Math.ceil(cost);
  }

  /**
   * Time travel by a relative number of newpix (forwards or backwards).
   * Reference: boosts.js:705-727 (Molpy.TimeTravel)
   *
   * Awards time travel badges based on direction and travel count.
   */
  async timeTravel(npOffset: number): Promise<boolean> {
    const boost = this.boosts.get('Time Travel');
    if (!boost || boost.bought === 0) {
      return false;
    }

    const oldNP = this.core.newpixNumber;
    const frac = Number((Math.abs(oldNP) - Math.floor(Math.abs(oldNP))).toFixed(3));
    const sign = Math.sign(oldNP);
    const targetNP = Number((sign * (Math.floor(Math.abs(oldNP)) + frac) + npOffset).toFixed(3));

    if (await this.timeTravelTo(targetNP, false)) {
      // Award direction badges
      if (oldNP > 0) {
        if (npOffset > 0) this.earnBadge('Fast Forward');
        if (npOffset < 0) this.earnBadge('And Back');
      } else if (oldNP < 0) {
        if (npOffset > 0) this.earnBadge('Forward to the Past');
        if (npOffset < 0) this.earnBadge('Stuck in Reverse');
      }

      // Award travel count badges and unlock boosts
      const t = (typeof boost.extra?.travelCount === 'number') ? boost.extra.travelCount : 0;
      if (t >= 10) this.earnBadge('Primer');
      if (t >= 20) this.doUnlockBoost('Flux Capacitor');
      if (t >= 30 && this.hasBoost('Flux Capacitor')) this.doUnlockBoost('Flux Turbine');
      if (t >= 40) this.earnBadge('Wimey');
      if (t >= 160) this.earnBadge('Hot Tub');
      if (t >= 640) this.earnBadge("Dude, Where's my DeLorean?");

      return true;
    }

    return false;
  }

  /**
   * Time travel to a specific newpix using castles or glass chips.
   * Reference: boosts.js:729-799 (Molpy.TTT - Targeted Time Travel)
   *
   * @param np Target newpix number
   * @param useChips If true, use glass chips instead of castles
   * @returns True if travel succeeded
   */
  async timeTravelTo(np: number, useChips: boolean): Promise<boolean> {
    const boost = this.boosts.get('Time Travel');
    const oldNP = this.core.newpixNumber;

    // Validation checks
    if (np < 1 && !this.badges.get('Minus Worlds') && !this.badges.get('Absolute Zero')) {
      return false; // Cannot travel to negative NPs without unlocking
    }

    if (Math.sign(Math.floor(Math.abs(np))) === 0 && Math.sign(oldNP) !== 0) {
      if (!this.badges.get('Absolute Zero')) {
        return false; // Cannot cross into NP 0
      } else {
        return false; // Cannot pass into NP 0 directly, must charge signpost
      }
    }

    // Check timeline consistency (fractional part must match)
    const oldFrac = Number((Math.abs(oldNP) - Math.floor(Math.abs(oldNP))).toFixed(3));
    const newFrac = Number((Math.abs(np) - Math.floor(Math.abs(np))).toFixed(3));
    if (newFrac !== oldFrac) {
      return false; // Cannot travel across timelines
    }

    // Check if at NP 0 trying to go to non-edge
    if (oldNP === 0 && Math.abs(np) < 3095) {
      this.earnBadge('The Big Freeze');
      return false; // Can only abscond to edge of time from NP 0
    }

    // Check if trying to go beyond visited NPs
    if (Math.floor(Math.abs(np)) > Math.floor(Math.abs(this.core.highestNPvisited))) {
      return false; // Cannot travel to unvisited future
    }

    // Check if Time Travel boost is owned (not needed for chip-based travel)
    if ((!boost || boost.bought === 0) && !useChips) {
      return false;
    }

    // Calculate cost
    const castleCost = useChips ? 0 : this.calculateTimeTravelPrice();
    const chipCost = useChips ? this.calculateJumpCost(np) : 0;

    // Check if can afford
    if (!useChips && this.resources.castles < castleCost) {
      return false;
    }
    if (useChips && this.resources.glassChips < chipCost) {
      return false;
    }

    // Spend resources
    if (useChips) {
      this.resources.glassChips -= chipCost;
    } else {
      this.resources.castles -= castleCost;
    }

    // Unlock PG (Philosopher's Gloves) if returning to highest NP with 24+ prey
    const kitkat = this.boosts.get('kitkat');
    const preyArray = kitkat?.extra?.prey;
    const preyLength = Array.isArray(preyArray) ? preyArray.length : 0;
    if (oldNP !== np && np === this.core.highestNPvisited && preyLength >= 24) {
      this.doUnlockBoost('PG');
    }

    // Execute time travel
    this.core.newpixNumber = np;

    // Reset signpost
    const signpost = this.boosts.get('Signpost');
    if (signpost) {
      signpost.power = 0;
    }

    // Reset ONG timer
    this.ong.startTime = Date.now();

    // Handle periods
    this.handlePeriods();

    // Increment travel count (must check boost exists)
    if (boost) {
      if (!boost.extra) boost.extra = {};
      const currentCount = (typeof boost.extra.travelCount === 'number') ? boost.extra.travelCount : 0;
      boost.extra.travelCount = currentCount + 1;

      // Handle invaders if 10+ travels
      if (boost.extra.travelCount >= 10) {
        this.handleInvaders(useChips);
      }
    }

    // Crystal Memories + Flux Surge interaction
    if (useChips && this.hasBoost('CrystalMemories') && this.hasBoost('FluxSurge')) {
      const fluxSurge = this.boosts.get('FluxSurge');
      const tde = this.hasBoost('TDE') ? 1 : 0;
      const crystals = tde + 1;

      if (fluxSurge && typeof fluxSurge.extra?.countdown === 'number') {
        fluxSurge.extra.countdown *= 0.5;
      }

      this.addResource('FluxCrystals', crystals);
    }

    // Lock Muse boost
    this.lockBoost('Muse');

    return true;
  }

  /**
   * Handle temporal invaders (NewPixBots appearing when time traveling).
   * Reference: boosts.js:801-815 (Molpy.HandleInvaders)
   *
   * @param useMemory If true (chip-based travel), invaders are 10x less likely
   */
  private handleInvaders(useMemory: boolean): void {
    let incursionFactor = 20;

    if (this.hasBoost('AD')) {
      incursionFactor = 1.5;
    } else if (this.hasBoost('Flux Capacitor')) {
      incursionFactor = 4;
    } else if (this.hasBoost('Flux Turbine')) {
      incursionFactor = 8;
    }

    if (useMemory) {
      incursionFactor *= 10;
    }

    // Random chance of invader
    if (Math.random() >= 1 / incursionFactor) {
      return; // No invader
    }

    const npb = this.castleTools.get('NewPixBot');
    const navCode = this.boosts.get('NavCode');

    if (!npb) return;

    // Check if invader is prevented
    if (navCode && navCode.power > 0) {
      // Prevented
      return;
    }

    if (npb.temp >= 30) {
      // Prevented (already have 30+ temp NPBs)
      return;
    }

    // Add invader NewPixBot
    npb.amount++;
    npb.temp++;
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
    if (!isFinite(price)) {
      // Infinite price: unlock Tool Factory and earn Shop Failed badge
      // Reference: castle.js:598-600
      this.doUnlockBoost('TF');
      this.earnBadge(name + ' Shop Failed');

      // Glass chip fallback: if TF is owned and badge earned, buy with glass chips
      // Reference: castle.js:727-730 - GlassChips: 1000 * (id * 2 + 1)
      const tfState = this.boosts.get('TF');
      if (tfState && tfState.bought > 0) {
        const glassPrice = 1000 * (toolDef.id * 2 + 1);
        if (this.resources.glassChips >= glassPrice) {
          this.resources.glassChips -= glassPrice;
          state.amount++;
          state.bought++;
          this.syncResourceBoosts();
          this.recalculateSandRates();
          this.recalculateCastleRates();
          this.checkAutoUnlocks();
        }
      }
    } else if (this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;
      this.syncResourceBoosts();
      this.recalculateSandRates();
      this.recalculateCastleRates();
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

    const toolDef = this.gameData.castleTools.find(t => t.name === name);
    if (!toolDef) return;

    // Calculate Fibonacci price
    const priceState = calculateCastleToolPrice(
      seeds.price0,
      seeds.price1,
      state.amount
    );

    // Apply priceFactor
    const price = Math.floor(this.priceFactor * priceState.price);

    if (!isFinite(price)) {
      // Infinite price: unlock Tool Factory and earn Shop Failed badge
      // Reference: castle.js:910-912
      this.doUnlockBoost('TF');
      this.earnBadge(name + ' Shop Failed');

      // Glass chip fallback: if TF is owned and badge earned, buy with glass chips
      // Reference: castle.js:1128-1131 - GlassChips: 1000 * (id * 2 + 2)
      const tfState = this.boosts.get('TF');
      if (tfState && tfState.bought > 0) {
        const glassPrice = 1000 * (toolDef.id * 2 + 2);
        if (this.resources.glassChips >= glassPrice) {
          this.resources.glassChips -= glassPrice;
          state.amount++;
          state.bought++;
          this.castleToolPrices[name] = priceState;
          this.syncResourceBoosts();
          this.recalculateSandRates();
          this.recalculateCastleRates();
          this.checkAutoUnlocks();
        }
      }
    } else if (this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;

      // Cache the updated price state for next purchase
      this.castleToolPrices[name] = priceState;

      this.syncResourceBoosts();
      this.recalculateSandRates();
      this.recalculateCastleRates();
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
      this.recalculateCastleRates();
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
        // Guard: spending from infinite resource should keep it infinite
        // Infinity + (-Infinity) = NaN, but spending from infinite means it stays infinite
        if (!isFinite(this.resources.sand) && amount < 0) return;
        this.resources.sand += amount;
        return;
      case 'Castles':
        if (!isFinite(this.resources.castles) && amount < 0) return;
        this.resources.castles += amount;
        return;
      case 'GlassChips':
        if (!isFinite(this.resources.glassChips) && amount < 0) return;
        this.resources.glassChips += amount;
        return;
      case 'GlassBlocks':
        if (!isFinite(this.resources.glassBlocks) && amount < 0) return;
        this.resources.glassBlocks += amount;
        return;
    }

    // All other resources are stored as boost power
    const boost = this.boosts.get(resource);
    if (boost) {
      if (!isFinite(boost.power) && amount < 0) return;
      boost.power += amount;
    }
  }

  /**
   * Spend a resource if available.
   * Returns true if the resource was spent, false if insufficient amount.
   */
  private spendResource(resource: string, amount: number): boolean {
    // Check if we have enough
    const current = this.getResourceAmount(resource);
    if (current < amount) {
      return false;
    }

    // Spend the resource
    this.addResource(resource, -amount);
    return true;
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

    // Skip if already locked (prevents infinite recursion in cascade systems)
    if (state.unlocked === 0 && state.bought === 0) return;

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
      isBoostBought: (boostAlias) => {
        const boost = this.boosts.get(boostAlias);
        return (boost?.bought ?? 0) > 0;
      },
      isBadgeEarned: (name) => this.badges.get(name) === true,

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
   * Force boost extra data (for testing).
   */
  forceBoostExtra(alias: string, extra: Record<string, number | string | number[]>): void {
    this.ensureInitialized();
    const state = this.boosts.get(alias);
    if (state) {
      state.extra = extra;
    }
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
      extra: state.extra,
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
      this.recalculateCastleRates();
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

  /**
   * Down reset - Medium reset.
   * Resets resources, tools, most boost powers, but preserves badges.
   * Reference: persist.js:1255-1381
   */
  async down(): Promise<void> {
    this.ensureInitialized();

    // Preserve powers for specific boosts before reset
    // Reference: persist.js:1321-1329
    const kakBoost = this.boosts.get('Kite and Key');
    const kakPower = kakBoost?.power ?? 0;

    const libBoost = this.boosts.get('Lightning in a Bottle');
    const libPower = libBoost?.power ?? 0;

    const snBoost = this.boosts.get('Safety Net');
    const snPower = snBoost?.power ?? 0;

    // Check for bonemeal bag preservation (must spend bonemeal to preserve)
    // Reference: persist.js:1321-1329
    const preserveBoH = this.hasBoost('BoH') && this.spendResource('Bonemeal', 10);
    const preserveBoM = this.hasBoost('BoM') && this.spendResource('Bonemeal', 100);
    const preserveBoF = this.hasBoost('BoF') && this.spendResource('Bonemeal', 1000);
    const preserveBoJ = this.hasBoost('BoJ') && this.spendResource('Bonemeal', 10000);

    // Reset resource totals
    const castlesBuiltTotal = this.castleBuild.totalBuilt;
    if (isFinite(castlesBuiltTotal)) {
      // Track total castles built across all Downs (for badges/stats)
      // This is not directly exposed but could be tracked in core state if needed
    }

    // Reset resources
    this.resources.sand = 0;
    this.resources.castles = 0;
    this.resources.glassChips = 0;
    this.resources.glassBlocks = 0;

    // Reset castle build state
    this.castleBuild.prevCastleSand = 0;
    this.castleBuild.nextCastleSand = 1;
    this.castleBuild.totalBuilt = 0;

    // Reset ninja state
    this.core.ninjaFreeCount = 0;
    this.core.ninjaStealth = 0;
    this.core.ninjad = false;

    // Reset click counts
    this.core.beachClicks = 0;

    // Reset start date and newpix
    this.core.startDate = Date.now();
    this.core.newpixNumber = 1;
    this.ong.npLength = 0;

    // Reset all sand tools
    for (const [name, state] of this.sandTools) {
      state.amount = 0;
      state.bought = 0;
      state.temp = 0;
      state.totalSand = 0;
      state.totalGlass = 0;
    }

    // Reset all castle tools (except NewPixBot totalCastlesBuilt is preserved)
    for (const [name, state] of this.castleTools) {
      state.amount = 0;
      state.bought = 0;
      state.temp = 0;
      // NewPixBot's totalCastlesBuilt is preserved across Down (but not Coma)
      if (name !== 'NewPixBot') {
        state.totalCastlesBuilt = 0;
      }
      state.totalCastlesDestroyed = 0;
      state.totalCastlesWasted = 0;
      state.currentActive = 0;
      state.totalGlassBuilt = 0;
      state.totalGlassDestroyed = 0;
    }

    // Reset all boosts
    for (const [alias, state] of this.boosts) {
      const def = this.gameData.boosts[alias];

      // Reset unlocked/bought status
      state.unlocked = 0;
      state.bought = 0;

      // Reset power to startPower if defined
      if (def?.startPower !== undefined) {
        state.power = def.startPower;
      } else {
        state.power = 0;
      }

      // Reset countdown
      state.countdown = 0;

      // Clear extra data (used by monuments, etc)
      if (state.extra) {
        state.extra = {};
      }

      // Reset toggle state
      state.isEnabled = undefined;
      state.permalock = undefined;
    }

    // Badges are preserved in Down reset
    // (no change to this.badges)

    // Restore preserved boost powers
    // Reference: persist.js:1321-1329
    if (kakPower > 0 && kakBoost) {
      kakBoost.power = kakPower;
    }
    if (libPower > 0 && libBoost) {
      libBoost.power = libPower;
    }
    if (snPower > 0 && snBoost) {
      snBoost.power = snPower;
    }

    // Restore bonemeal bag boosts if preserved
    if (preserveBoH) {
      const boh = this.boosts.get('BoH');
      if (boh) {
        boh.unlocked = 1;
        boh.bought = 1;
      }
    }
    if (preserveBoM) {
      const bom = this.boosts.get('BoM');
      if (bom) {
        bom.unlocked = 1;
        bom.bought = 1;
      }
    }
    if (preserveBoF) {
      const bof = this.boosts.get('BoF');
      if (bof) {
        bof.unlocked = 1;
        bof.bought = 1;
      }
    }
    if (preserveBoJ) {
      const boj = this.boosts.get('BoJ');
      if (boj) {
        boj.unlocked = 1;
        boj.bought = 1;
      }
    }

    // Recalculate all derived state
    this.syncResourceBoosts();
    this.recalculateSandRates();
      this.recalculateCastleRates();
    this.recalculateSandPerClick();
    this.recalculatePriceFactor();

    // Earn "Not Ground Zero" badge for first Down
    this.earnBadge('Not Ground Zero');

    // Check for auto-unlocks that might trigger immediately
    this.checkAutoUnlocks();
  }

  /**
   * Coma reset - Hard reset (wipes everything including badges).
   * Reference: persist.js:1382-1427
   */
  async coma(): Promise<void> {
    this.ensureInitialized();

    // Preserve NewPixBot's totalCastlesBuilt before Down reset
    const npbState = this.castleTools.get('NewPixBot');
    const npbTotalPreserved = npbState?.totalCastlesBuilt ?? 0;

    // Perform Down reset first (handles most of the reset logic)
    await this.down();

    // Reset save/load counts
    this.core.saveCount = 0;
    this.core.loadCount = 0;

    // Reset highest NP visited
    this.core.highestNPvisited = 1;

    // Wipe all badges
    for (const [name] of this.badges) {
      this.badges.set(name, false);
    }
    this.badgeGroupCounts = {};
    this.badgeChecker.setEarnedBadges([]);

    // Reset NewPixBot's totalCastlesBuilt (unlike Down, Coma resets this too)
    if (npbState) {
      npbState.totalCastlesBuilt = 0;
    }

    // Reset additional tracking that survives Down but not Coma
    // (These would need to be added to core state if we want to track them)

    // Dragon Queen state reset (if/when DQ is implemented)
    const dqBoost = this.boosts.get('DragonQueen');
    if (dqBoost) {
      dqBoost.power = 0;
    }

    // Recalculate everything again
    this.syncResourceBoosts();
    this.recalculateSandRates();
      this.recalculateCastleRates();
    this.recalculateSandPerClick();
    this.recalculatePriceFactor();
    this.checkAutoUnlocks();
  }

  /**
   * Click the redundakitty and receive a reward.
   *
   * This handles complex chaining mechanics including Redunception and Logicat.
   *
   * Reference: castle.js:2304-2416
   */
  clickRedundakitty(level: number = 0): void {
    this.ensureInitialized();

    if (!this.redundakitty.isActive) {
      return; // No kitty to click
    }

    // Initialize drawType if empty
    if (this.redundakitty.drawType.length === 0) {
      this.redundakitty.drawType = ['show'];
    }

    // Build boost state for chaining logic
    const boostState = this.buildRedundakittyBoostState();

    // Check if Ranger is enabled and if logicat cage is full
    const hasRanger = this.boosts.get('Ranger')?.isEnabled ?? false;
    const logicatCurrent = this.boosts.get('Panther Poke')?.power ?? 0;
    const logicatMax = this.boosts.get('Panther Poke')?.countdown ?? 0; // PokeBar() max
    const logicatCageFull = logicatCurrent >= logicatMax;

    // Determine what happens when clicking this kitty
    const result = determineKittyClickAction(
      level,
      this.redundakitty.drawType,
      boostState,
      hasRanger,
      logicatCageFull
    );

    // Apply the result
    applyKittyClickResult(result, this.redundakitty, level);

    // Handle specific actions and determine if we should give reward/increment counters
    let shouldGiveReward = true;

    if (result.action === 'hide') {
      // Chain broken - schedule next spawn, don't give reward
      this.redundakitty.spawnCountdown = calculateKittySpawnTime(boostState);
      shouldGiveReward = false;
    } else if (result.action === 'reward') {
      // Normal reward - kitty disappears and gives reward
      this.redundakitty.spawnCountdown = calculateKittySpawnTime(boostState);
      shouldGiveReward = true;
    } else if (result.action === 'show' || result.action === 'recurse') {
      // Kitty rejumps - give reward
      shouldGiveReward = true;
    } else if (result.action === 'logicat') {
      if (!result.extendTimer) {
        // Ranger caught logicat - give Panther Poke instead
        const pp = this.boosts.get('Panther Poke');
        if (pp) {
          pp.power = (pp.power ?? 0) + 1;
        }
        shouldGiveReward = false;
      } else {
        // Normal logicat puzzle - start puzzle
        this.startLogicatPuzzle();
        shouldGiveReward = false;
      }
    } else if (result.action === 'rickroll') {
      // Rickroll - still give reward
      shouldGiveReward = true;
    }

    // Always update chain max
    this.redundakitty.chainMax = Math.max(
      this.redundakitty.chainMax,
      this.redundakitty.chainCurrent
    );

    // Increment click counter and process badges/rewards if appropriate
    if (shouldGiveReward) {
      this.redundakitty.totalClicks++;

      // Process kitty click badges
      this.processKittyClickBadges();

      // Give reward (unless deep recursion or position locked)
      if (this.redundakitty.drawType.length < 16 && this.redundakitty.keepPosition === 0) {
        this.giveKittyReward();
      }
    }

    // Update recursion depth
    this.redundakitty.recursionDepth = this.redundakitty.drawType.length;
  }

  /**
   * Process badges that trigger on kitty clicks.
   *
   * Reference: castle.js:2409-2416
   */
  private processKittyClickBadges(): void {
    const clicks = this.redundakitty.totalClicks;

    if (clicks >= 2) {
      this.earnBadge('Not So Redundant');
    }
    if (clicks >= 14) {
      this.earnBadge("Don't Litter!");
    }
    if (clicks >= 128) {
      this.earnBadge('Y U NO BELIEVE ME?');
    }

    // Unlock boosts at certain click thresholds
    if (clicks >= 16) {
      this.unlockBoost('Kitnip');
    }
    if (clicks >= 32) {
      this.unlockBoost('DoRD');
    }
    if (clicks >= 256) {
      this.unlockBoost('BKJ');
    }

    // Kitties Galore becomes department boost at 64 clicks
    if (clicks >= 64) {
      const kg = this.boosts.get('Kitties Galore');
      if (kg) {
        kg.department = 1;
      }
    }

    // Chain achievement
    if (this.redundakitty.chainMax >= 42) {
      this.earnBadge('Meaning');
    }
  }

  /**
   * Give a reward when clicking the redundakitty.
   *
   * Reference: castle.js:2755-2830
   */
  private giveKittyReward(): void {
    const boostState = this.buildRedundakittyBoostState();
    const isSandInfinite = isResourceInfinite(this.resources.sand);

    // Determine which reward to give
    const rewardType = determineRewardType(boostState, isSandInfinite);

    switch (rewardType) {
      case 'dord':
        this.giveDoRDReward();
        break;
      case 'not-lucky':
        this.giveNotLuckyReward();
        break;
      case 'blitzing':
        this.giveBlitzingReward();
        break;
      case 'blast-furnace':
        this.giveBlastFurnaceReward();
        break;
    }
  }

  /**
   * Give DoRD (Department of Redundancy Department) reward.
   *
   * This activates department boosts (25% chance) or gives castles/blitzing.
   *
   * Reference: castle.js:2786-2830
   */
  private giveDoRDReward(): void {
    // 25% chance for Blast Furnace if owned
    const hasBlastFurnace = this.boosts.get('Blast Furnace')?.bought ?? 0;
    if (hasBlastFurnace > 0 && Math.random() < 0.25) {
      this.giveBlastFurnaceReward();
      return;
    }

    // Try to unlock a department boost
    // (This would require a list of department boosts and unlock logic)
    // For now, fall through to Not Lucky or Blitzing

    // Increment BKJ power if owned
    const bkj = this.boosts.get('BKJ');
    if (bkj && bkj.bought > 0) {
      bkj.power = (bkj.power ?? 0) + 1;
    }

    // 50/50 between Not Lucky and Blitzing
    if (Math.random() < 0.5) {
      this.giveNotLuckyReward();
    } else {
      const isSandInfinite = isResourceInfinite(this.resources.sand);
      if (isSandInfinite) {
        this.giveBlastFurnaceReward();
      } else {
        this.giveBlitzingReward();
      }
    }
  }

  /**
   * Give Not Lucky reward (castle bonus).
   *
   * Reference: castle.js:2873-3023
   */
  private giveNotLuckyReward(): void {
    // Gather tool amounts
    const sandToolAmounts: Record<string, number> = {};
    for (const [name, tool] of this.sandTools) {
      sandToolAmounts[name] = tool.amount;
    }

    const castleToolAmounts: Record<string, number> = {};
    for (const [name, tool] of this.castleTools) {
      castleToolAmounts[name] = tool.amount;
    }

    // Count boosts and badges
    let boostsOwned = 0;
    for (const [, boost] of this.boosts) {
      if (boost.bought > 0) boostsOwned++;
    }

    let badgesOwned = 0;
    for (const [, earned] of this.badges) {
      if (earned) badgesOwned++;
    }

    // Get boost states
    const bkj = this.boosts.get('BKJ');
    const hasBKJ = (bkj?.bought ?? 0) > 0;
    const bkjPower = bkj?.power ?? 0;

    const blitzing = this.boosts.get('Blitzing');
    const hasBlitzing = (blitzing?.bought ?? 0) > 0;
    const blitzingPower = blitzing?.power ?? 0;

    const fractal = this.boosts.get('Fractal Sandcastles');
    const hasFractal = (fractal?.bought ?? 0) > 0;
    const fractalPower = fractal?.power ?? 0;

    // Calculate reward
    const reward = calculateNotLuckyReward(
      sandToolAmounts,
      castleToolAmounts,
      boostsOwned,
      badgesOwned,
      this.redundakitty.totalClicks,
      bkjPower,
      hasBKJ,
      hasBlitzing,
      blitzingPower,
      hasFractal,
      fractalPower,
      this.castleBuild.totalBuilt
    );

    // Grant castles
    this.resources.castles += reward.castles;
    this.castleBuild.totalBuilt += reward.castles;
    this.syncResourceBoosts();
  }

  /**
   * Give Blitzing reward (temporary sand rate boost).
   *
   * Reference: castle.js:3024-3049
   */
  private giveBlitzingReward(): void {
    const boostState = this.buildRedundakittyBoostState();
    const blitzing = this.boosts.get('Blitzing');
    const currentSpeed = blitzing?.power ?? 0;
    const currentCountdown = blitzing?.countdown ?? 0;

    const reward = calculateBlitzingReward(
      boostState,
      currentSpeed,
      currentCountdown
    );

    // Apply Blitzing boost
    if (blitzing) {
      blitzing.power = reward.speed;
      blitzing.countdown = reward.duration;
    } else {
      // Unlock and activate Blitzing
      this.unlockBoost('Blitzing');
      const newBlitzing = this.boosts.get('Blitzing');
      if (newBlitzing) {
        newBlitzing.bought = 1;
        newBlitzing.power = reward.speed;
        newBlitzing.countdown = reward.duration;
      }
    }

    // Recalculate sand rate with new Blitzing power
    this.recalculateSandRates();
  }

  /**
   * Give Blast Furnace reward (convert sand to castles).
   *
   * Reference: castle.js:2831-2872
   */
  private giveBlastFurnaceReward(): void {
    const isCastlesInfinite = !isFinite(this.resources.castles);
    if (isCastlesInfinite) {
      return; // No need to blast if castles are infinite
    }

    let blastFactor = 1000;

    // Check for Fractal Sandcastles reduction
    const fractal = this.boosts.get('Fractal Sandcastles');
    if (fractal && fractal.bought > 0) {
      blastFactor = Math.max(5, 1000 * Math.pow(0.94, fractal.power ?? 0));
    }

    // Calculate how many castles we can make
    let castles = Math.floor(this.resources.sand / blastFactor);

    // Cap at totalBuilt / 3 (or /5 with certain boosts - simplified for now)
    castles = Math.floor(Math.min(castles, this.castleBuild.totalBuilt / 3));

    if (castles > 0) {
      this.resources.sand -= castles * blastFactor;
      this.resources.castles += castles;
      this.castleBuild.totalBuilt += castles;
      this.syncResourceBoosts();
    }
  }

  /**
   * Build redundakitty boost state for calculations.
   */
  private buildRedundakittyBoostState(): RedundakittyBoostState {
    return {
      kitnip: (this.boosts.get('Kitnip')?.bought ?? 0) > 0,
      kittiesGalore: (this.boosts.get('Kitties Galore')?.bought ?? 0) > 0,
      rrsrUnlocked: (this.boosts.get('RRSR')?.unlocked ?? 0) > 0,
      rrsrBought: (this.boosts.get('RRSR')?.bought ?? 0) > 0,
      doRD: (this.boosts.get('DoRD')?.bought ?? 0) > 0,
      blastFurnace: (this.boosts.get('Blast Furnace')?.bought ?? 0) > 0,
      bkj: (this.boosts.get('BKJ')?.bought ?? 0) > 0,
      bkjPower: this.boosts.get('BKJ')?.power ?? 0,
      redunception: (this.boosts.get('Redunception')?.bought ?? 0) > 0,
      logicat: (this.boosts.get('Logicat')?.bought ?? 0) > 0,
      sgc: (this.boosts.get('SGC')?.bought ?? 0) > 0,
      doubleDepartment: (this.boosts.get('Double Department')?.bought ?? 0) > 0,
      schizoblitz: (this.boosts.get('Schizoblitz')?.bought ?? 0) > 0,
      seaMining: (this.boosts.get('Sea Mining')?.bought ?? 0) > 0,
      ventusVehemensEnabled: (this.boosts.get('Ventus Vehemens')?.bought ?? 0) > 0 &&
                             (this.boosts.get('Ventus Vehemens')?.isEnabled ?? false)
    };
  }

  /**
   * Process redundakitty spawn/despawn logic for one tick.
   *
   * Reference: castle.js:2179-2290
   */
  private tickRedundakitty(): void {
    if (this.redundakitty.isActive) {
      // Kitty is spawned - count down to despawn
      if (this.redundakitty.despawnCountdown > 0) {
        this.redundakitty.despawnCountdown--;

        if (this.redundakitty.despawnCountdown === 0) {
          // Kitty despawned without being clicked - chain broken
          this.redundakitty.isActive = false;
          this.redundakitty.drawType = [];
          this.redundakitty.chainCurrent = 0;
          this.redundakitty.keepPosition = 0;

          // Schedule next spawn
          const boostState = this.buildRedundakittyBoostState();
          this.redundakitty.spawnCountdown = calculateKittySpawnTime(boostState);
        }
      }
    } else {
      // Kitty is not spawned - count down to spawn
      if (this.redundakitty.spawnCountdown > 0) {
        this.redundakitty.spawnCountdown--;

        if (this.redundakitty.spawnCountdown === 0) {
          // Spawn the kitty
          this.redundakitty.isActive = true;
          this.redundakitty.drawType = ['show'];

          // Set despawn timer
          const boostState = this.buildRedundakittyBoostState();
          this.redundakitty.despawnCountdown = calculateKittyDespawnTime(boostState);
        }
      }
    }
  }

  /**
   * Process boost countdowns for one tick.
   *
   * Reference: castle.js:4050-4300 (Molpy.Loopist)
   */
  private tickBoostCountdowns(): void {
    for (const [name, boost] of this.boosts) {
      if (boost.countdown && boost.countdown > 0) {
        boost.countdown--;

        // Handle Blitzing expiration
        if (name === 'Blitzing' && boost.countdown === 0) {
          boost.power = 0;
          this.recalculateSandRates();
        }
      }
    }
  }

  /**
   * Start a logicat puzzle.
   *
   * Called when a logicat is triggered from redundakitty click.
   * The puzzle will be active until answered or timed out.
   */
  private startLogicatPuzzle(): void {
    const logicatBoost = this.boosts.get('Logicat');
    if (!logicatBoost) return;

    const logicatLevel = logicatBoost.bought ?? 0;

    // Generate and start the puzzle
    const { startLogicatPuzzle } = require('./logicat.js');
    this.redundakitty.logicatState = startLogicatPuzzle(
      this.redundakitty.logicatState,
      logicatLevel
    );
  }

  /**
   * Submit an answer to the current logicat puzzle.
   *
   * @param answer Player's answer (true or false)
   * @returns Whether the answer was correct
   */
  submitLogicatAnswer(answer: boolean): boolean {
    const { submitLogicatAnswer } = require('./logicat.js');
    const result = submitLogicatAnswer(this.redundakitty.logicatState, answer);
    this.redundakitty.logicatState = result.state;

    if (result.correct && result.points > 0) {
      // Award points to Logicat boost
      const logicatBoost = this.boosts.get('Logicat');
      if (logicatBoost) {
        // Add points which may trigger level ups
        this.addLogicatPoints(result.points);
      }
    }

    return result.correct;
  }

  /**
   * Add points to the Logicat boost and handle level ups.
   *
   * Reference: boosts.js:3595-3622 (Logicat.Add function)
   */
  private addLogicatPoints(points: number): void {
    const logicat = this.boosts.get('Logicat');
    if (!logicat) return;

    logicat.power = (logicat.power ?? 0) + points;

    // Calculate rewards: (power - bought*5) / 5 + 1
    const rewards = Math.floor(((logicat.power ?? 0) - (logicat.bought ?? 0) * 5) / 5 + 1);

    if (rewards > 0) {
      // Check for Tangled Tesseract multiplier
      const tt = this.boosts.get('Tangled Tesseract');
      const hasTT = tt && tt.bought > 0 && (tt.isEnabled ?? false);

      if (hasTT) {
        // Complex multiplier: ((2^(p-4))*(p)*(p-1)*(p-2))/3
        const p = tt.power ?? 0;
        const factor = (Math.pow(2, p - 4) * p * (p - 1) * (p - 2)) / 3;
        logicat.bought = (logicat.bought ?? 0) + Math.floor(rewards * factor);
        logicat.power = (logicat.bought ?? 0) * 5;
      } else {
        // Normal level up
        logicat.bought = (logicat.bought ?? 0) + rewards;
        logicat.power = (logicat.bought ?? 0) * 5;

        // Cap rewards at 5 and give excess to QQ
        if (rewards > 5) {
          const qqBoost = this.boosts.get('QQ');
          if (qqBoost) {
            qqBoost.power = (qqBoost.power ?? 0) + (rewards - 5);
          }

          // Check for Tangled Tesseract unlock
          if (qqBoost && (qqBoost.power ?? 0) >= 1e15) {
            // '1P' in molpy notation
            this.unlockBoost('Tangled Tesseract');
          }
        }

        // Give logicat rewards for each level gained
        for (let i = 0; i < Math.min(rewards, 5); i++) {
          this.giveLogicatReward(logicat.bought ?? 0);
        }

        // Check for Hubble Double unlock
        if ((logicat.bought ?? 0) > 1e93) {
          // '10GW' in molpy notation
          const qq = this.boosts.get('QQ');
          if (qq && (qq.power ?? 0) >= 1e93) {
            this.unlockBoost('Hubble Double');
          }
        }
      }
    }
  }

  /**
   * Give a reward based on Logicat level.
   *
   * Reference: castle.js:2724-2753 (Molpy.RewardLogicat)
   */
  private giveLogicatReward(level: number): void {
    // Find boosts that can be unlocked by logicat at this level
    // These are boosts with a 'logic' property indicating minimum logicat level
    const availableRewards: string[] = [];

    for (const [name, boost] of this.boosts) {
      const boostDef = this.gameData.boosts[name];
      if (!boostDef) continue;

      // Check if boost can be awarded by logicat and is not yet unlocked
      if (boostDef.logic && !boost.unlocked) {
        availableRewards.push(name);
      }
    }

    if (availableRewards.length > 0) {
      // Pick a random reward
      const reward = availableRewards[Math.floor(Math.random() * availableRewards.length)];
      this.unlockBoost(reward);
    } else {
      // Fall back to DoRD reward if no logicat-specific rewards available
      this.giveDoRDReward();
    }
  }

  /**
   * Cancel the current logicat puzzle (if any).
   */
  cancelLogicatPuzzle(): void {
    const { cancelLogicatPuzzle } = require('./logicat.js');
    this.redundakitty.logicatState = cancelLogicatPuzzle(this.redundakitty.logicatState);
  }

  /**
   * Tick the logicat puzzle timer (called every real-time second).
   *
   * This is separate from the game tick because logicat puzzles
   * run in real-time, not game time.
   */
  tickLogicatTimer(): void {
    const { tickLogicatTimer } = require('./logicat.js');
    this.redundakitty.logicatState = tickLogicatTimer(this.redundakitty.logicatState);
  }

  /**
   * Get the current active logicat puzzle (if any).
   */
  getActiveLogicatPuzzle() {
    return this.redundakitty.logicatState.activePuzzle;
  }

  /**
   * Get redundakitty state for testing.
   */
  getRedundakittyState(): RedundakittyState {
    return { ...this.redundakitty };
  }

  /**
   * Set redundakitty state for testing.
   */
  setRedundakittyState(state: Partial<RedundakittyState>): void {
    Object.assign(this.redundakitty, state);
  }

  /**
   * Force redundakitty to be active (for testing).
   */
  forceRedundakittyActive(): void {
    this.redundakitty.isActive = true;
    this.redundakitty.drawType = ['show'];
  }

  // ==========================================================================
  // Dragon System Methods
  // ==========================================================================

  /**
   * Get dragon system state for testing/inspection.
   */
  getDragonState(): DragonSystemState {
    return this.dragons;
  }

  /**
   * Get dragon data at a specific NP.
   */
  getDragonDataAtNP(np: number): NPData | undefined {
    return this.dragons.npData.get(np);
  }

  /**
   * Set dragon data at a specific NP.
   */
  setDragonDataAtNP(np: number, data: NPData): void {
    this.dragons.npData.set(np, data);
    this.dragons.recalcNeeded = true;
  }

  /**
   * Remove dragons from a specific NP.
   */
  removeDragonsAtNP(np: number): void {
    this.dragons.npData.delete(np);
    this.dragons.recalcNeeded = true;
  }

  /**
   * Get the Dragon Queen state.
   */
  getDragonQueenState(): DragonQueenState {
    return { ...this.dragons.queen };
  }

  /**
   * Set Dragon Queen level (dragon type that hatchlings mature into).
   */
  setDragonQueenLevel(level: number): void {
    this.dragons.queen.Level = level;
  }

  /**
   * Change Dragon Queen overall state.
   * Reference: dragons.js:1111-1117 (DragonsHide, ChangeState)
   *
   * @param state - 0=Digging, 1=Recovering, 2=Hiding, 3=Celebrating
   * @param countdown - Optional countdown in mNP for state to end
   */
  setDragonOverallState(state: DragonOverallState, countdown?: number): void {
    this.dragons.queen.overallState = state;
    if (countdown !== undefined) {
      this.dragons.queen.countdown = countdown;
    }
  }

  /**
   * Get hatchling breeding state.
   */
  getHatchlingsState(): DragonHatchlingsState {
    return {
      clutches: [...this.dragons.hatchlings.clutches],
      properties: [...this.dragons.hatchlings.properties],
      diet: [...this.dragons.hatchlings.diet],
      maturity: [...this.dragons.hatchlings.maturity],
    };
  }

  /**
   * Get dragon nest state.
   */
  getNestState(): DragonNestState {
    return {
      lining: { ...this.dragons.nest.lining },
    };
  }

  /**
   * Get total dragons across all NPs.
   */
  getTotalDragons(): number {
    return this.dragons.totalDragons;
  }

  /**
   * Get number of NPs with dragons.
   */
  getTotalNPsWithDragons(): number {
    return this.dragons.totalNPsWithDragons;
  }

  /**
   * Get highest NP number with dragons.
   */
  getHighestNPWithDragons(): number {
    return this.dragons.highestNPwithDragons;
  }

  /**
   * Get current dragon dig rate.
   */
  getDragonDigRate(): number {
    return this.dragons.digRate;
  }

  /**
   * Check if dragon recalculation is needed.
   */
  isDragonRecalcNeeded(): boolean {
    return this.dragons.recalcNeeded;
  }

  /**
   * Mark dragon recalculation as needed.
   */
  markDragonRecalcNeeded(): void {
    this.dragons.recalcNeeded = true;
  }

  /**
   * Build dragon boost state from current engine state.
   * This extracts all boost ownership/power values needed for dragon calculations.
   */
  private buildDragonBoostState(): DragonBoostState {
    const getBoost = (alias: string) => this.boosts.get(alias);
    const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;
    const getLevel = (alias: string) => getBoost(alias)?.power ?? 0;

    return {
      // Digging multiplier boosts
      hasBucketAndSpade: hasBoost('Bucket and Spade'),
      hasStrengthPotion: hasBoost('Strength Potion'),
      strengthPotionPower: getLevel('Strength Potion'),
      hasGoldenBull: hasBoost('Golden Bull'),

      // Defence multiplier boosts
      hasHealingPotion: hasBoost('Healing Potion'),
      healingPotionPower: getLevel('Healing Potion'),
      hasOohShiny: hasBoost('Ooh, Shiny!'),
      goldLevel: getLevel('Gold'),
      hasClannesque: hasBoost('Clannesque'),
      cryogenicsLevel: getLevel('Cryogenics'),
      hasSpines: hasBoost('Spines'),
      spinesLevel: getLevel('Spines'),
      hasAdamantineArmour: hasBoost('Adamantine Armour'),
      adamantineArmourLevel: getLevel('Adamantine Armour'),
      hasMirrorScales: hasBoost('Mirror Scales'),
      mirrorScalesLevel: getLevel('Mirror Scales'),
      hasBaobabTreeFort: hasBoost('Baobab Tree Fort'),
      hasWotT: hasBoost('WotT'),

      // Attack multiplier boosts
      hasBigTeeth: hasBoost('Big Teeth'),
      bigTeethLevel: getLevel('Big Teeth'),
      hasMagicTeeth: hasBoost('Magic Teeth'),
      magicTeethLevel: getLevel('Magic Teeth'),
      hasTusks: hasBoost('Tusks'),
      tusksLevel: getLevel('Tusks'),
      hasBigBite: hasBoost('Big Bite'),
      bigBiteLevel: getLevel('Big Bite'),
      hasDoubleByte: hasBoost('Double Byte'),
      doubleByteLevel: getLevel('Double Byte'),
      hasTrilobite: hasBoost('Trilobite'),
      trilobiteLevel: getLevel('Trilobite'),
      hasDiamondDentures: hasBoost('Diamond Dentures'),
      hasWotP: hasBoost('WotP'),

      // Breath multiplier boosts
      hasAutumnOfMatriarch: hasBoost('Autumn of the Matriarch'),
      dqTotalLoses: this.dragons.queen.totalloses,
      hasMQALLOBS: hasBoost('MQALLOBS'),
      catalyzerPower: getLevel('Catalyzer'),

      // Luck boosts
      hasLuckyRing: hasBoost('Lucky Ring'),
      hasCupOfTea: hasBoost('Cup of Tea'),
      cupOfTeaPower: getLevel('Cup of Tea'),

      // Hide modifier
      hasChintzyTiara: hasBoost('Chintzy Tiara'),
    };
  }

  /**
   * Recalculate dragon system if needed.
   * Reference: dragons.js:467-550 (DragonDigRecalc)
   *
   * @returns Array of boost aliases to unlock (based on consecutive NPs)
   */
  recalculateDragons(): string[] {
    if (!this.dragons.recalcNeeded) {
      return [];
    }

    const boostState = this.buildDragonBoostState();
    const unlocks = recalculateDragonSystem(this.dragons, boostState);

    // Unlock boosts based on consecutive NPs with dragons
    for (const alias of unlocks) {
      this.unlockBoost(alias);
    }

    return unlocks;
  }

  /**
   * Build digging boost state from current engine state.
   */
  private buildDragonDiggingBoostState(): DragonDiggingBoostState {
    const getBoost = (alias: string) => this.boosts.get(alias);
    const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;

    return {
      hasShades: hasBoost('Shades'),
      hasCutDiamonds: hasBoost('Cut Diamonds'),
      hasSparkle: hasBoost('Sparkle'),
      hasSeacoal: hasBoost('Seacoal'),
      hasSeaMining: hasBoost('Sea Mining'),
      seaMiningPower: getBoost('Sea Mining')?.power ?? 0,
    };
  }

  /**
   * Process dragon digging for mNP tick or beach click.
   * Reference: dragons.js:552-651
   *
   * @param type - 'mnp' for tick-based digging, 'beach' for beach click
   * @returns Dig result if something was found, null otherwise
   */
  processDragonDig(type: DigType): DigResult | null {
    // Ensure dragon state is up to date
    if (this.dragons.recalcNeeded) {
      this.recalculateDragons();
    }

    const boosts = this.buildDragonDiggingBoostState();
    const result = processDragonDig(type, this.dragons, boosts);

    if (result) {
      // Add resources
      if (result.resource && result.amount > 0) {
        this.addResource(result.resource, result.amount);
      }

      // Earn badges
      if (result.earnedBadge) {
        this.earnBadge(result.earnedBadge);
      }

      // First find badge
      if (result.resource) {
        this.earnBadge('Found Something!');
      }

      // Unlock Beach Dragon
      if (result.unlockBeachDragon) {
        this.unlockBoost('Beach Dragon');
      }

      // Handle Sea Mining power increment
      if (type === 'beach' && boosts.hasSeaMining && boosts.seaMiningPower > 0) {
        const seaMiningBoost = this.boosts.get('Sea Mining');
        if (seaMiningBoost) {
          seaMiningBoost.power++;
        }
      }
    }

    // Check for notification batch
    const finds = checkDiggingNotification(this.dragons);
    if (finds) {
      // In a real implementation, this would trigger a notification
      // For now, we just clear the finds (already done in checkDiggingNotification)
    }

    return result;
  }

  /**
   * Build combat boost state from current engine state.
   */
  private buildCombatBoostState(): CombatBoostState {
    const getBoost = (alias: string) => this.boosts.get(alias);
    const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;
    const getLevel = (alias: string) => getBoost(alias)?.power ?? 0;

    return {
      hasDragonBreath: hasBoost('Dragon Breath'),
      hasMouthwash: hasBoost('Mouthwash'),
      hasEthylAlcohol: hasBoost('Ethyl Alcohol'),
      ethylAlcoholAmount: getLevel('Ethyl Alcohol'),
      hasDragonfly: hasBoost('Dragonfly'),
      dragonflyLevel: getLevel('Dragonfly'),
      hasHealingPotion: hasBoost('Healing Potion'),
      healingPotionAmount: getLevel('Healing Potion'),
      hasCupOfTea: hasBoost('Cup of Tea'),
      cupOfTeaAmount: getLevel('Cup of Tea'),
      hasTupleOrNothing: hasBoost('Tuple or Nothing'),
      hasCamelflarge: hasBoost('Camelflarge'),
      camelflargeLevel: getLevel('Camelflarge'),
      hasHonorAmongSerpents: hasBoost('Honor Among Serpents'),
      hasCryogenics: hasBoost('Cryogenics'),
      cryogenicsLevel: getLevel('Cryogenics'),
      hasRoboticHatcher: hasBoost('Robotic Hatcher'),
      roboticHatcherEnabled: hasBoost('Robotic Hatcher') && (getBoost('Robotic Hatcher')?.isEnabled ?? true),
      goatsAmount: getLevel('Goats'),
    };
  }

  /**
   * Build dragon multipliers from current state.
   */
  private buildDragonMultipliers(): DragonMultipliers {
    return {
      digMultiplier: this.dragons.digMultiplier,
      attackMultiplier: this.dragons.attackMultiplier,
      defenceMultiplier: this.dragons.defenceMultiplier,
      breathMultiplier: this.dragons.breathMultiplier,
      luck: this.dragons.luck,
      hideMod: this.dragons.hideMod,
    };
  }

  /**
   * Fledge a clutch of dragons at the current NP.
   * Reference: dragons.js:680-785 (DragonFledge)
   *
   * @param clutchIndex - Index of the clutch to fledge
   * @returns Fledge result
   */
  fledgeDragons(clutchIndex: number): FledgeResult {
    // Ensure dragon state is up to date
    if (this.dragons.recalcNeeded) {
      this.recalculateDragons();
    }

    const combatBoosts = this.buildCombatBoostState();
    const hasTopiary = (this.boosts.get('Topiary')?.bought ?? 0) > 0;

    const result = dragonFledge(
      clutchIndex,
      this.core.newpixNumber,
      this.dragons,
      combatBoosts,
      hasTopiary
    );

    // Apply badges
    for (const badge of result.badges) {
      this.earnBadge(badge);
    }

    // Apply unlocks
    for (const unlock of result.unlocks) {
      this.unlockBoost(unlock);
    }

    // Unlock Topiary
    if (result.unlockTopiary) {
      this.unlockBoost('Topiary');
    }

    // Apply combat outcome state changes
    if (result.combatResult && result.combatResult.result !== 0) {
      this.applyCombatStateChanges(result.combatResult, result.opponents!);
    }

    // Recalculate dragon aggregates
    this.recalculateDragons();

    // Post-fledge unlocks
    if (this.dragons.totalNPsWithDragons > 11) {
      this.unlockBoost('Dragon Overview');
    }
    if (this.dragons.totalNPsWithDragons > 111 && (this.boosts.get('Dragon Overview')?.bought ?? 0) > 0) {
      this.unlockBoost('Woolly Jumper');
    }

    return result;
  }

  /**
   * Run combat at a specific NP against opponents.
   * Reference: dragons.js:827-1066 (OpponentsAttack)
   *
   * @param where - NP where combat occurs
   * @param opponents - Opponent instance
   * @param breathtype - Breath attack type index (0=none)
   * @param fighttype - 0=fledge, 1=RedundaKnight attack
   * @returns Combat outcome
   */
  runCombat(where: number, opponents: OpponentInstance, breathtype: number, fighttype: number): CombatOutcome | null {
    const npd = this.dragons.npData.get(where);
    if (!npd || npd.amount <= 0) return null;

    // Ensure dragon state is up to date
    if (this.dragons.recalcNeeded) {
      this.recalculateDragons();
    }

    const multipliers = this.buildDragonMultipliers();
    const combatBoosts = this.buildCombatBoostState();

    const outcome = processCombatOutcome(
      where, opponents, npd, this.dragons, multipliers, combatBoosts, breathtype, fighttype
    );

    this.applyCombatOutcome(outcome);
    return outcome;
  }

  /**
   * Apply combat outcome to engine state (rewards, state changes, etc).
   */
  private applyCombatOutcome(outcome: CombatOutcome): void {
    // Apply rewards
    for (const reward of outcome.rewards) {
      if (reward.resource !== 'Thing') {
        this.addResource(reward.resource, reward.amount);
      }
    }

    // Apply experience
    if (outcome.experience > 0) {
      this.addResource('exp', outcome.experience);
    }

    // Apply state changes
    if (outcome.stateChange !== null) {
      this.dragons.queen.overallState = outcome.stateChange;
      if (outcome.countdown > 0) {
        this.dragons.queen.countdown = outcome.countdown;
      }
    }

    // Apply badges
    for (const badge of outcome.badges) {
      this.earnBadge(badge);
    }

    // Apply unlocks
    for (const unlock of outcome.unlocks) {
      this.unlockBoost(unlock);
    }

    this.dragons.recalcNeeded = true;
  }

  /**
   * Apply combat state changes from a fledge combat result.
   */
  private applyCombatStateChanges(stats: import('../types/game-data.js').CombatStats, opponents: OpponentInstance): void {
    // State changes from combat are handled within dragonFledge -> opponentsAttack
    // The npd.amount is already mutated by opponentsAttack
    // We just need to apply recovery state if needed
    if (stats.recoveryTime > 0) {
      this.dragons.queen.overallState = 1; // Recovering
      this.dragons.queen.countdown = stats.recoveryTime;
    }
    if (stats.result === 3 && this.dragons.queen.overallState !== 0) {
      this.dragons.queen.overallState = 0; // Back to digging on easy victory
    }
  }

  /**
   * Generate and execute a RedundaKnight attack.
   * Reference: dragons.js:1068-1101
   *
   * @param breathtype - Breath type to use in response
   * @returns Combat outcome, or null if no dragons to attack
   */
  handleRedundaKnightAttack(breathtype: number): CombatOutcome | null {
    if (this.dragons.totalDragons === 0) return null;

    const princessLevel = this.boosts.get('Princesses')?.power ?? 0;
    const dragonflyLevel = this.boosts.get('Dragonfly')?.power ?? 0;

    const knight = generateRedundaKnight(this.dragons, dragonflyLevel, princessLevel);
    return this.runCombat(knight.target, knight, breathtype, 1);
  }

  /**
   * Make dragons hide from opponents.
   * Reference: dragons.js:1111-1117 (DragonsHide)
   *
   * @param opponentType - Type of opponent being hidden from
   */
  dragonsHide(opponentType: number): void {
    const camelflargeLevel = this.boosts.get('Camelflarge')?.power ?? 0;
    const hideTime = calculateHideTime(
      opponentType,
      this.dragons.queen.Level,
      camelflargeLevel,
      this.dragons.hideMod
    );

    this.dragons.queen.overallState = 2; // Hiding
    this.dragons.queen.countdown = hideTime;
  }

  // =============================================================================
  // Testing Helper Methods
  // =============================================================================

  /**
   * Get direct access to resources object for testing.
   * WARNING: Only use in tests! Direct manipulation bypasses state tracking.
   */
  getResourcesForTesting(): {
    sand: number;
    castles: number;
    glassChips: number;
    glassBlocks: number;
  } {
    return this.resources;
  }

  /**
   * Get sand tool state for testing.
   */
  getSandToolState(name: string): ToolState | undefined {
    return this.sandTools.get(name);
  }

  /**
   * Get castle tool state for testing.
   */
  getCastleToolState(name: string): ToolState | undefined {
    return this.castleTools.get(name);
  }

  /**
   * Manually trigger unlock checks (for testing badge/power-based unlocks).
   */
  async checkUnlocksForTesting(): Promise<void> {
    this.checkAutoUnlocks();
  }
}

/**
 * Create a ModernEngine from game data JSON.
 */
export function createModernEngine(gameData: GameData): ModernEngine {
  return new ModernEngine(gameData);
}
