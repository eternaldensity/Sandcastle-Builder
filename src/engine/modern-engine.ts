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
import { runToolFactory, type ToolFactoryState, type ToolFactoryResult } from './tool-factory.js';
import { calculatePapal, calculateChipsPerClick, type ChipClickState } from './chip-generation.js';
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
  calculateClickGlobalMultiplier,
  type SandToolRateState,
} from './sand-rate-calculator.js';
import {
  calculateAllCastleToolRates,
  type CastleToolRateState,
  type CastleToolRates,
} from './castle-rate-calculator.js';
import { discoveries, getDiscovery, hasDiscovery } from '../data/discoveries.js';
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
import {
  runPhoto,
  getPhoto,
  createInitialColorState,
  type PhotoColorState,
  type PhotoBoostAccess,
} from './photo-system.js';
import type {
  DragonQueenState,
  DragonHatchlingsState,
  DragonNestState,
  DragonOverallState,
  DragonSystemState,
  OpponentInstance,
} from '../types/game-data.js';
import { isResourceInfinite } from '../utils/number-format.js';
import {
  BLACKPRINT_COSTS,
  BLACKPRINT_ORDER,
  getBlackprintSubject,
  calculateConstructionRuns,
  processBlackprintConstruction,
  calculateMiloBlackprints,
  getAvailableBlackprints,
  type BlackprintPrereqState,
  type BlackprintConstructionState,
} from './blackprints.js';
import {
  processVacuumTick,
  calculateLogicatQQ,
  calculateVoidStareMultiplier,
  shouldUnlockBlackhat,
  type VacuumTickState,
} from './flux-system.js';
import {
  startSandMould,
  processSandMouldMaking,
  startSandMouldFill,
  processSandMouldFilling,
  startGlassMould,
  processGlassMouldMaking,
  startGlassMouldFill,
  processGlassMouldFilling,
  processAllMouldWork,
  type MonumentState,
} from './monument-system.js';

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
  /** Whether countdown continues during Coma Molpy Style (castle.js:3351) */
  countdownCMS?: boolean;
  /** Whether to call countdownFunction during CMS without decrementing (castle.js:3364) */
  callcountdownifCMS?: boolean;
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
  /** Game tick counter, incremented every mNP */
  life: number;
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
    life: 0,
  };

  // ONG state machine
  private ong: ONGState = {
    elapsed: 0,
    startTime: 0,
    npbONG: 0,
    npLength: 1800,
    ninjaTime: 720000, // 400 mNP * npLength(1800) for shortpix default
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

  // Rate recalculation flag (matches legacy Molpy.recalculateRates)
  private needsRateRecalc = 1;

  // Papal decree state
  private decreeName = '';
  private decreeValue = 1;
  private papalBoostFactor = 1;

  // Judgement level (Plan 26 placeholder)
  private judgeLevel = 0;

  // Doubletap recursion guard
  private _inDoubletap = false;

  // Cached TF chips per click (recalculated with rates)
  private cachedChipsPerClick = 0;

  // Mustard tool count (tools with NaN amount)
  private mustardToolCount = 0;

  // Monty Haul Problem state
  private montyDoors: string[] = ['A', 'B', 'C'];
  private montyPrize = '';    // door with prize
  private montyChosen = '';   // player's chosen door
  private montyGoat = '';     // revealed goat door
  private montyActive = false; // whether a round is in progress

  // Photo/Color reaction system state
  private photoColors: PhotoColorState = createInitialColorState();

  // Blackprint construction state
  private blackprintConstruction: BlackprintConstructionState = {
    isConstructing: false,
    constructionSubject: null,
    constructionProgress: 0,
    constructionTarget: 0,
  };

  // Milo (Mysterious Representations) accumulated power for blackprint generation
  private miloPower = 0;

  // Ketchup (catch-up) state
  private ketchupTime = false; // true while processing ketchup ticks

  // Cached badge count (avoids iterating 5600+ badges on every check)
  private _badgesOwnedCache = 0;

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

    // Set countdownCMS flags on boosts that count down during Coma
    // Reference: boosts.js - these boosts have countdownCMS: 1
    const cmsBoosts = [
      'ASHF', 'Sea Mining', 'TemporalRift', 'Crystal Dragon',
      'Cryogenics', 'Blitzing', 'Dragon', 'Dragon Forge',
      'splosion', 'Maps',
    ];
    for (const alias of cmsBoosts) {
      const boost = this.boosts.get(alias);
      if (boost) boost.countdownCMS = true;
    }

    // Set callcountdownifCMS flag
    // Reference: boosts.js:10774
    const cmsCallBoosts = ['Fireproof'];
    for (const alias of cmsCallBoosts) {
      const boost = this.boosts.get(alias);
      if (boost) boost.callcountdownifCMS = true;
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

    // Initialize static badges from game data
    for (const [name] of Object.entries(this.gameData.badges)) {
      this.badges.set(name, false);
    }

    // Register dynamic discovery badges (legacy badges.js:1288-2450)
    // Legacy creates badge entries for all discoveries at startup with earned=false.
    // Each discovery has 4 badge groups (discov, monums, monumg, diamm) for both
    // positive and negative NP variants.
    const badgeGroups = ['discov', 'monums', 'monumg', 'diamm'];
    for (const disc of discoveries) {
      const np = disc.np;
      for (const group of badgeGroups) {
        const name = `${group}${np}`;
        if (!this.badges.has(name)) this.badges.set(name, false);
        if (np > 0) {
          const negName = `${group}${-np}`;
          if (!this.badges.has(negName)) this.badges.set(negName, false);
        }
      }
    }

    // Set start date
    this.core.startDate = Date.now();

    // Initialize badge checker with no earned badges
    this.badgeChecker.setEarnedBadges([]);

    this.initialized = true;

    // Legacy Molpy.Down() (persist.js:1376) earns 'Not Ground Zero' on fresh game
    this.earnBadge('Not Ground Zero');

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
   * Ensure virtual resource boosts exist (Sand, Castles, GlassChips, GlassBlocks, TF, Glass Ceilings).
   * These are not in game data but are created during save/load/export.
   */
  private ensureVirtualBoosts(): void {
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
  }

  /** Convert sand tools Map to serializable Record. */
  private sandToolsToRecord(): Record<string, ToolState> {
    const record: Record<string, ToolState> = {};
    for (const [name, state] of this.sandTools) {
      record[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalSand: state.totalSand,
        totalGlass: state.totalGlass,
      };
    }
    return record;
  }

  /** Convert castle tools Map to serializable Record. */
  private castleToolsToRecord(): Record<string, ToolState> {
    const record: Record<string, ToolState> = {};
    for (const [name, state] of this.castleTools) {
      record[name] = {
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
    return record;
  }

  /** Convert boosts Map to serializable Record. */
  private boostsToRecord(): Record<string, BoostState> {
    const record: Record<string, BoostState> = {};
    for (const [alias, state] of this.boosts) {
      record[alias] = {
        unlocked: state.unlocked,
        bought: state.bought,
        power: state.power,
        countdown: state.countdown,
      };
    }
    return record;
  }

  /** Convert badges Map to serializable Record. */
  private badgesToRecord(): Record<string, boolean> {
    const record: Record<string, boolean> = {};
    for (const [name, earned] of this.badges) {
      record[name] = earned;
    }
    return record;
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

    this.ensureVirtualBoosts();

    // Load boosts (preserving flags set during init like countdownCMS)
    for (const [alias, boostState] of Object.entries(state.boosts)) {
      const existing = this.boosts.get(alias);
      if (existing) {
        existing.unlocked = boostState.unlocked;
        existing.bought = boostState.bought;
        existing.power = boostState.power;
        existing.countdown = boostState.countdown;
      }
    }

    // Load resources from special boosts
    this.resources.sand = this.getBoostPower('Sand');
    this.resources.castles = this.getBoostPower('Castles');
    this.resources.glassChips = this.getBoostPower('GlassChips');
    this.resources.glassBlocks = this.getBoostPower('GlassBlocks');

    // Load badges - clear and reload all to ensure clean state
    this.badges.clear();
    // Re-register static badges from game data
    for (const [name] of Object.entries(this.gameData.badges)) {
      this.badges.set(name, false);
    }
    // Re-register dynamic discovery badges
    const badgeGroups = ['discov', 'monums', 'monumg', 'diamm'];
    for (const disc of discoveries) {
      const np = disc.np;
      for (const group of badgeGroups) {
        if (!this.badges.has(`${group}${np}`)) this.badges.set(`${group}${np}`, false);
        if (np > 0 && !this.badges.has(`${group}${-np}`)) this.badges.set(`${group}${-np}`, false);
      }
    }
    // Apply loaded badge state on top
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
    this.recomputeBadgesOwnedCache();

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

    this.ensureVirtualBoosts();
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

    // Convert dragon npData Map to Record
    const npDataRecord: Record<number, NPData> = {};
    for (const [np, data] of this.dragons.npData) {
      npDataRecord[np] = data;
    }

    // Build save state
    const saveState: SaveState = {
      core: coreState,
      sandTools: this.sandToolsToRecord(),
      castleTools: this.castleToolsToRecord(),
      boosts: this.boostsToRecord(),
      badges: this.badgesToRecord(),
      npData: npDataRecord,
    };

    return this.saveSerializer.serialize(saveState);
  }

  /**
   * Get a snapshot of current game state for comparison.
   */
  async getStateSnapshot(): Promise<GameStateSnapshot> {
    this.ensureInitialized();

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
      sandTools: this.sandToolsToRecord(),
      castleTools: this.castleToolsToRecord(),
      boosts: this.boostsToRecord(),
      badges: this.badgesToRecord(),
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
   * Process elapsed time as ketchup (catch-up) ticks.
   * Reference: castle.js:4055-4090 (Molpy.Loopist)
   *
   * When the game detects elapsed time > 1 tick, it processes missed ticks
   * in a loop with ketchupTime=true, which skips ONG checks.
   * Lateness is capped at 7200ms (~4 ticks) to prevent infinite loops.
   * Excess lateness is converted to Shorks (if PoG+ASHF) or BB (Blackbook).
   *
   * @param elapsedMs - milliseconds elapsed since last loop iteration
   * @param mNPlength - milliseconds per tick (default 1800)
   */
  processKetchup(elapsedMs: number, mNPlength = 1800): { ticksProcessed: number; shorks: number; bb: number } {
    this.ensureInitialized();

    let lateness = elapsedMs;
    let shorks = 0;
    let bb = 0;

    // Cap lateness at 7200ms, convert excess (castle.js:4059-4078)
    if (lateness > 7200) {
      // PoG + ASHF: convert excess to Shorks
      if (this.isBoostEnabled('PoG') && this.hasBoost('ASHF')) {
        const npShorks = Math.floor(lateness / 1000 / mNPlength);
        if (npShorks > 0) {
          lateness -= npShorks * 1000 * mNPlength;
          let shorkGain = npShorks;
          if (this.hasBoost('SoS')) shorkGain += 1;
          if (this.hasBoost('Blitzing') && this.hasBoost('LSoS')) shorkGain *= 2;
          const shorkBoost = this.boosts.get('Shork');
          if (shorkBoost) shorkBoost.power += shorkGain;
          shorks = shorkGain;
        }
      }

      // Convert remaining excess to Blackbook entries
      const lateMill = (lateness - 7200) / mNPlength;
      const bbGain = Math.floor(lateMill);
      if (bbGain > 0) {
        const bbBoost = this.boosts.get('BB');
        if (bbBoost) bbBoost.power += bbGain;
        bb = bbGain;
      }

      lateness = 7200; // Hard cap
    }

    // Process ketchup ticks (castle.js:4079-4090)
    let ticksProcessed = 0;
    this.ketchupTime = true;
    while (lateness >= mNPlength) {
      this.processTick();
      lateness -= mNPlength;
      ticksProcessed++;
    }
    this.ketchupTime = false;

    return { ticksProcessed, shorks, bb };
  }

  /**
   * Run mustard cleanup - fix NaN resource values.
   * Reference: boosts.js:7850-7867
   */
  mustardCleanup(): boolean {
    let cleaned = false;
    const sand = this.boosts.get('Sand');
    if (sand && typeof sand.power === 'number' && isNaN(sand.power)) {
      sand.power = 0;
      cleaned = true;
    }
    if (sand && typeof (sand as any).totalDug === 'number' && isNaN((sand as any).totalDug)) {
      (sand as any).totalDug = 0;
      cleaned = true;
    }
    const castles = this.boosts.get('Castles');
    if (castles && typeof castles.power === 'number' && isNaN(castles.power)) {
      castles.power = 0;
      cleaned = true;
    }
    if (castles && typeof (castles as any).totalBuilt === 'number' && isNaN((castles as any).totalBuilt)) {
      (castles as any).totalBuilt = 0;
      cleaned = true;
    }
    if (cleaned) this.earnBadge('Mustard Cleanup');
    return cleaned;
  }

  /**
   * Process a single game tick.
   * Reference: castle.js:3338-3460 (Molpy.Think)
   *
   * Each tick represents ~1 mNP (milliNewPix) of game time.
   * The order of operations matches the legacy Molpy.Think() exactly.
   *
   * IMPORTANT: Castle tools do NOT produce during regular ticks!
   * Castle tools only run DestroyPhase/BuildPhase at ONG transitions.
   */
  private processTick(): void {
    // 1. Auto-convert sand to castles (castle.js:3340)
    this.toCastles();

    // 2. Price Protection countdown (castle.js:3343-3344)
    this.tickPriceProtection();

    // 3. Check ONG unless in ketchup or Coma (castle.js:3345)
    const isComa = this.isBoostEnabled('Coma Molpy Style');
    if (!(this.ketchupTime || isComa)) {
      this.tickCheckONG();
    }

    // 4. Boost countdown ticking (castle.js:3348-3366)
    this.tickBoostCountdowns();

    // 5. Recalculate rates if flagged (castle.js:3394)
    if (this.needsRateRecalc) {
      this.calculateRates();
    }

    // 6. Sand tool total tracking (castle.js:3395-3399)
    for (const [name, state] of this.sandTools) {
      if (state.amount > 0) {
        const rate = this.cachedSandToolRates[name] ?? 0;
        const produced = rate * state.amount;
        state.totalSand = isFinite(state.totalSand) ? state.totalSand + produced : Infinity;
      }
    }

    // 7. Sand digging with Papal multiplier (castle.js:3401)
    const sandPermNP = this.cachedTotalSandRate;
    const papalSand = this.papal('Sand');
    this.digSand(sandPermNP * papalSand);

    // 8. Glass block/chip rate calculation (castle.js:3436-3437)
    // Already handled by chip-generation module when rates recalculate

    // 9. Tool Factory per-tick processing (castle.js:3441)
    this.tickToolFactory();

    // 10. Dragon digging per mNP (castle.js:3443)
    this.processDragonDig('mnp');

    // 10b. Photo/color reaction system per mNP (castle.js:3461)
    if (this.hasBoost('Camera') || this.photoColors.blueness > 0 || this.photoColors.otherness > 0) {
      runPhoto(this.photoColors, this.buildPhotoBoostAccess());
    }

    // 10c. Vacuum Cleaner per mNP (castle.js:3403-3434)
    this.tickVacuumCleaner();

    // 11. Second rate recalc pass (castle.js:3444)
    if (this.needsRateRecalc) {
      this.calculateRates();
    }

    // 12. Judgement Dip (castle.js:3454)
    this.performJudgement();

    // 12b. Donkey auto-buy (castle.js:3455)
    this.donkey();

    // 13. Redundakitty spawn/despawn countdowns
    this.tickRedundakitty();

    // 13. Badge checking
    this.badgeChecker.check('tick', this.buildBadgeCheckState());

    // 13b. Final rate recalc if badges triggered it (castle.js:2090 via EarnBadge)
    if (this.needsRateRecalc) {
      this.calculateRates();
    }

    // 14. Sync resource boosts
    this.syncResourceBoosts();

    // 15. Life counter (castle.js:3447)
    this.core.life++;
  }

  /**
   * Check ONG timing during tick.
   * Reference: castle.js:3661-3686 (Molpy.CheckONG)
   */
  private tickCheckONG(): void {
    // Update ONG elapsed time (1 tick = ~1000ms)
    this.ong.elapsed += 1000;

    // Check if npbONG window should open
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
    // In testing mode, we let advanceToONG() be called explicitly
    // In a live game loop, this would auto-trigger ONG
  }

  /**
   * Price Protection countdown.
   * Reference: castle.js:3343-3344
   */
  private tickPriceProtection(): void {
    const pp = this.boosts.get('Price Protection');
    if (pp && pp.power > 1) {
      pp.power--;
    }
  }

  /**
   * Dig sand and add to resources.
   * Reference: boosts.js:7473-7530 (Sand.dig)
   *
   * @param amount - Amount of sand to dig (sandPermNP * Papal)
   */
  private digSand(amount: number): void {
    if (!isFinite(this.resources.sand)) {
      amount = 0; // No point digging if already infinite
    }

    this.resources.sand += amount;

    // Float epsilon correction (boosts.js:7482-7487)
    const gap = Math.ceil(this.resources.sand) - this.resources.sand;
    if (gap > 0 && gap < 1e-10) {
      this.resources.sand = Math.ceil(this.resources.sand);
    }

    // Sand milestone badges (boosts.js:7496-7530)
    if (this.resources.sand >= 80000000) {
      this.doUnlockBoost('Glass Furnace');
    }

    // Auto-convert sand to castles after digging
    this.toCastles();
  }

  /**
   * Run Tool Factory per tick.
   * Reference: castle.js:3441 (Molpy.RunToolFactory)
   */
  private tickToolFactory(): void {
    const tfBoost = this.boosts.get('TF');
    if (!tfBoost || !tfBoost.bought) return;

    const state = this.buildToolFactoryState();
    if (!state) return;

    const result = runToolFactory(state);

    // Apply results
    if (result.totalBuilt > 0) {
      // Update TF chip buffer
      tfBoost.power = result.remainingChips;

      // Add tools
      for (const [toolName, count] of result.toolsCreated) {
        const sandTool = this.sandTools.get(toolName);
        const castleTool = this.castleTools.get(toolName);
        if (sandTool) {
          sandTool.amount += count;
          sandTool.temp += count;
        } else if (castleTool) {
          castleTool.amount += count;
          castleTool.temp += count;
        }
      }

      // Earn badges
      for (const badge of result.badgesEarned) {
        this.earnBadge(badge);
      }

      // Flag rate recalculation since tools changed
      this.flagRateRecalc();
    }
  }

  /**
   * Build ToolFactoryState from current engine state.
   */
  private buildToolFactoryState(): ToolFactoryState | null {
    const tf = this.boosts.get('TF');
    if (!tf) return null;

    const pc = this.boosts.get('PC');
    const aa = this.boosts.get('AA');
    const ac = this.boosts.get('AC');
    const flipside = this.boosts.get('Flipside');

    // Count glass ceilings
    const glassCeilings: boolean[] = [];
    let glassCeilingCount = 0;
    for (let i = 0; i < 12; i++) {
      const owned = (this.boosts.get(`Glass Ceiling ${i}`)?.bought ?? 0) > 0;
      glassCeilings.push(owned);
      if (owned) glassCeilingCount++;
    }

    // Get tool prices for TF_ORDER
    const TF_ORDER = [
      'Bucket', 'Cuegan', 'Flag', 'Ladder', 'Bag',
      'NewPixBot', 'Trebuchet', 'Scaffold', 'Wave', 'River',
      'Helicopter', 'Aeroplane',
    ];
    const toolPrices = TF_ORDER.map(name => {
      const sandTool = this.gameData.sandTools.find(t => t.name === name);
      const castleTool = this.gameData.castleTools.find(t => t.name === name);
      const tool = this.sandTools.get(name) ?? this.castleTools.get(name);
      const basePrice = sandTool?.basePrice ?? castleTool?.basePrice ?? 0;
      const amount = tool?.amount ?? 0;
      // Approximate price
      return basePrice * Math.pow(1.1, amount);
    });

    return {
      tfBought: (tf.bought ?? 0) > 0,
      tfChipBuffer: tf.power ?? 0,
      pcPower: pc?.power ?? 1,
      aaEnabled: (aa?.isEnabled ?? false),
      acBought: (ac?.bought ?? 0) > 0,
      acPower: ac?.power ?? 0,
      flipsidePower: flipside?.power ?? 0,
      glassCeilingCount,
      glassCeilings,
      toolPrices,
      priceFactor: this.priceFactor,
      papalToolF: this.papal('ToolF'),
      tdFactor: 1, // TDFactor default
    };
  }

  /**
   * Papal decree multiplier.
   * Reference: boosts.js:10006-10008
   *
   * @param raptor - The system to check (e.g. 'Sand', 'Chips', 'ToolF')
   * @returns Multiplier (1 if no decree active for this system)
   */
  papal(raptor: string): number {
    return calculatePapal(this.decreeName, raptor, this.decreeValue, this.papalBoostFactor);
  }

  /**
   * Orchestrated rate recalculation.
   * Reference: castle.js:476-487 (Molpy.calculateRates)
   */
  private calculateRates(): void {
    if (this.needsRateRecalc > 1) {
      this.needsRateRecalc--;
    } else {
      this.needsRateRecalc = 0;
    }

    this.calculateNinjaTime();
    this.recalculateSandRates();
    this.recalculateCastleRates();
    this.recalculateSandPerClick();
    this.calcReportJudgeLevel();
  }

  /**
   * Flag that rates need recalculation.
   * Reference: castle.js:473-474 (Molpy.RatesRecalculate)
   */
  flagRateRecalc(times = 1): void {
    this.needsRateRecalc = Math.max(this.needsRateRecalc, times);
  }


  /**
   * Perform Judgement Dip - destroy castles based on judge level.
   * Reference: castle.js:3637-3659
   */
  private performJudgement(): void {
    // Fireproof + NavCode disabled: wipe all castles
    // NavCode is a toggle - check isEnabled directly
    const navCodeState = this.boosts.get('NavCode');
    if (this.hasBoost('Fireproof') && navCodeState && navCodeState.bought > 0 &&
        !navCodeState.isEnabled) {
      this.resources.castles = 0;
      this.syncResourceBoosts();
      return;
    }

    if (this.judgeLevel > 1 && Math.floor(this.ong.elapsed / 1000) % 25 === 0) {
      const j = this.jDestroyAmount();
      const npb = this.castleTools.get('NewPixBot');
      const npbAmount = npb?.amount ?? 0;
      let dAmount = j * npbAmount * 25;

      // Bacon unlock check
      const bacon = this.boosts.get('Bacon');
      if (bacon && !bacon.unlocked && !isFinite(dAmount) &&
          this.hasBoost('Frenchbot')) {
        const logicat = this.boosts.get('LogiPuzzle');
        if (logicat && logicat.power >= 100) {
          logicat.power -= 100;
          this.doUnlockBoost('Bacon');
        }
      }

      dAmount = Math.ceil(Math.min(this.resources.castles * 0.9, dAmount));

      if (this.resources.castles > 0 && dAmount > 0) {
        this.resources.castles -= dAmount;
        if (npb) {
          npb.totalCastlesDestroyed += dAmount;
        }
      }
    }
  }

  /**
   * Calculate judge destroy amount per NPB per mNP.
   * Reference: badges.js:457-463
   */
  private jDestroyAmount(): number {
    const j = this.judgeLevel - 1;
    if (j < 1) return 0;
    const a = Math.pow(j, 1 + Math.min(1, j / 1000000) - Math.min(1, j / 1e150));
    const b = Math.max(1, Math.min(1e12, j / 1e150));
    return a * b;
  }

  /**
   * Calculate judgement dip threshold.
   * Reference: badges.js:340-358
   */
  private judgementDipThreshold(): number {
    let baseVal = 500000000;
    let div = 1;

    for (const [name, state] of this.boosts) {
      if (state.bought > 0) {
        // Check boost group from game data
        const def = this.gameData.boosts[name];
        if (def && (def.group === 'cyb' || def.group === 'chron' || def.group === 'hpt')) {
          div++;
          if (div > 25) div *= 1.35;
          if (div > 40) div *= 1.35;
        }
      }
    }

    if (!this.hasBoost('DORD')) {
      div /= 2;
    }

    return baseVal / div;
  }

  /**
   * Calculate and report judge level from NPB castle production.
   * Reference: castle.js:489-524, badges.js:370-401
   */
  private calcReportJudgeLevel(): void {
    const navCode = this.boosts.get('NavCode');
    if (navCode && navCode.power) {
      this.judgeLevel = 0;
      return;
    }

    const npb = this.castleTools.get('NewPixBot');
    if (!npb) {
      this.judgeLevel = 0;
      return;
    }

    let bots = npb.amount;
    const np = Math.abs(this.core.newpixNumber);
    if (this.hasBoost('Time Travel') || np < 20) {
      bots -= 2;
    }

    const botCastles = npb.totalCastlesBuilt * bots;
    const thresh = this.judgementDipThreshold();
    let level = Math.max(0, Math.floor(botCastles / thresh));

    // Coma Molpy Style halves the level
    if (this.isBoostEnabled('ComaMolpyStyle')) {
      level = Math.floor(level / 2);
    }

    // Badges
    if (level > 0) this.earnBadge('Judgement Dip Warning');
    if (level > 1) this.earnBadge('Judgement Dip');

    this.judgeLevel = level;
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

    // Collect owned glass ceilings (0-11)
    const glassCeilings: number[] = [];
    for (let i = 0; i <= 11; i++) {
      if (this.hasBoost(`GlassCeiling${i}`)) {
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
      biggerBucketsPower: this.getBoostPower('Bigger Buckets'),
      helpingHandPower: this.getBoostPower('HelpingHand'),
      flagBearerPower: this.getBoostPower('FlagBearer'),
      extensionLadderPower: this.getBoostPower('ExtensionLadder'),

      // Glass Ceiling
      glassCeiling: glassCeilings,

      // Per-tool boost flags
      hugeBuckets: this.hasBoost('Huge Buckets'),
      trebuchetPong: this.hasBoost('TrebuchetPong'),
      carrybot: this.hasBoost('Carrybot'),
      buccaneer: this.hasBoost('Buccaneer'),
      flyingBuckets: this.hasBoost('FlyingBuckets'),
      megball: this.hasBoost('Megball'),
      cooperation: this.hasBoost('Cooperation'),
      stickbot: this.hasBoost('Stickbot'),
      theForty: this.hasBoost('TheForty'),
      humanCannonball: this.hasBoost('HumanCannonball'),
      magicMountain: this.hasBoost('MagicMountain'),
      standardbot: this.hasBoost('Standardbot'),
      balancingAct: this.hasBoost('BalancingAct'),
      sbtf: this.hasBoost('SBTF'),
      flyTheFlag: this.hasBoost('FlyTheFlag'),
      ninjaClimber: this.hasBoost('Ninja Climber'),
      levelUp: this.hasBoost('LevelUp'),
      climbbot: this.hasBoost('Climbbot'),
      brokenRung: this.hasBoost('BrokenRung'),
      upUpAndAway: this.hasBoost('UpUpAndAway'),
      embaggening: this.hasBoost('Embaggening'),
      sandbag: this.hasBoost('Sandbag'),
      luggagebot: this.hasBoost('Luggagebot'),
      bagPuns: this.hasBoost('Bag Puns'),
      airDrop: this.hasBoost('AirDrop'),
      frenchbot: this.hasBoost('Frenchbot'),
      bacon: this.hasBoost('Bacon'),

      // For ninja multiplier
      ninjaStealth: this.core.ninjaStealth,

      // Badge count
      badgesOwned: this.countBadgesOwned(),

      // Glass usage (placeholder - will be calculated from glass chip/block production)
      glassUse: 0,

      // Global multiplier boosts
      molpies: this.hasBoost('Molpies'),
      grapevine: this.hasBoost('Grapevine'),
      chirpies: this.hasBoost('Chirpies'),
      facebugs: this.hasBoost('Facebugs'),
      overcompensating: this.hasBoost('Overcompensating'),
      overcompensatingPower: this.getBoostPower('Overcompensating'),
      blitzing: this.hasBoost('Blitzing'),
      blitzingPower: this.getBoostPower('Blitzing'),
      bbc: this.hasBoost('BBC'),
      bbcPower: this.getBoostPower('BBC'),
      rbBought: this.getBoostBought('RB'),
      hugo: this.hasBoost('Hugo'),
      npLength: this.ong.npLength,
      wwbBought: this.getBoostBought('WWB'),
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

    // Collect owned glass ceilings
    const glassCeilings: number[] = [];
    for (let i = 0; i < 12; i++) {
      if (this.hasBoost(`Glass Ceiling ${i}`)) {
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
      wwbBought: this.getBoostBought('WWB'),
      scaffoldAmount: getToolAmount('Scaffold'),

      // NewPixBot boost multipliers
      busyBot: this.hasBoost('Busy Bot'),
      robotEfficiency: this.hasBoost('Robot Efficiency'),
      robotEfficiencyPower: this.getBoostPower('Robot Efficiency'),
      recursivebot: this.hasBoost('Recursivebot'),
      halOKitty: this.hasBoost('HAL-0-Kitty'),
      halBoost: this.getBoostPower('HAL-0-Kitty'),

      // Trebuchet boost multipliers
      springFling: this.hasBoost('Spring Fling'),
      trebuchetPong: this.hasBoost('Trebuchet Pong'),
      trebuchetPongPower: this.getBoostPower('Trebuchet Pong'),
      flingbot: this.hasBoost('Flingbot'),
      variedAmmo: this.hasBoost('Varied Ammo'),
      variedAmmoPower: this.getBoostPower('Varied Ammo'),

      // Scaffold boost multipliers
      precisePlacement: this.hasBoost('Precise Placement'),
      levelUp: this.hasBoost('Level Up!'),
      propbot: this.hasBoost('Propbot'),

      // Wave boost multipliers
      swell: this.hasBoost('Swell'),
      surfbot: this.hasBoost('Surfbot'),
      sbtf: this.hasBoost('SBTF'),
      sbtfPower: this.getBoostPower('SBTF'),

      // River boost multipliers
      smallbot: this.hasBoost('Smallbot'),
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
   *
   * Includes both rule-based unlocks and custom aggregate-count unlocks
   * that can't easily be expressed as rules (they need total tool/badge/boost counts).
   *
   * Reference: data.js:649-826 (CheckBuyUnlocks)
   */
  private checkAutoUnlocks(): void {
    const state = this.buildUnlockCheckState();
    const toUnlock = this.unlockChecker.check(state);

    for (const alias of toUnlock) {
      this.doUnlockBoost(alias);
    }

    // Fractal Sandcastles auto-buy (data.js:723-730)
    // When unlocked via Fractals Forever badge, it auto-buys for free
    const fractal = this.boosts.get('Fractal Sandcastles');
    if (fractal && fractal.unlocked > 0 && !fractal.bought) {
      fractal.bought = 1;
      fractal.power = 0;
      this.flagRateRecalc();
    }

    // Click-threshold + tool combo unlocks (data.js:1249-1260)
    const clicks = this.core.beachClicks;
    const hasBucket = (this.sandTools.get('Bucket')?.amount ?? 0) >= 1;
    const hasCuegan = (this.sandTools.get('Cuegan')?.amount ?? 0) >= 1;
    const hasFlag = (this.sandTools.get('Flag')?.amount ?? 0) >= 1;
    const hasLadder = (this.sandTools.get('Ladder')?.amount ?? 0) >= 1;
    if (clicks >= 100 && hasBucket && hasCuegan) this.doUnlockBoost('Helpful Hands');
    if (clicks >= 1000 && hasCuegan && hasFlag) this.doUnlockBoost('True Colours');
    if (clicks >= 3333 && hasFlag && hasLadder) this.doUnlockBoost('Raise the Flag');

    // Custom aggregate-count unlocks (data.js:740-768)
    const badgesOwned = this.countBadgesOwned();
    if (badgesOwned >= 69) this.doUnlockBoost('Ch*rpies');

    let boostsOwned = 0;
    for (const b of this.boosts.values()) {
      if (b.bought > 0) boostsOwned++;
    }
    if (boostsOwned >= 100) this.doUnlockBoost('favs');

    let sandToolsOwned = 0;
    for (const s of this.sandTools.values()) sandToolsOwned += s.amount;
    let castleToolsOwned = 0;
    for (const c of this.castleTools.values()) castleToolsOwned += c.amount;
    if (sandToolsOwned >= 123) this.doUnlockBoost('Sand Tool Multi-Buy');
    if (castleToolsOwned >= 234) this.doUnlockBoost('Castle Tool Multi-Buy');

    // Now Where Was I: >50 discoveries + Memories Revisited + far from highest NP
    // Reference: data.js:777-780
    const discovCount = this.badgeGroupCounts['discov'] ?? 0;
    if (discovCount > 50 && this.hasBoost('Memories Revisited')) {
      const npDist = Math.abs(this.core.newpixNumber - this.core.highestNPvisited);
      if (npDist >= 20) this.doUnlockBoost('Now Where Was I?');
    }

    // Knitted Beanies: RB bought high enough that 200^bought is Infinity
    // Reference: data.js:798
    const rbBought = this.getBoostBought('RB');
    if (!isFinite(Math.pow(200, rbBought))) this.doUnlockBoost('Knitted Beanies');

    // Space Elevator: WWB bought high enough that 2^(bought-5) is Infinity
    // Reference: data.js:799
    const wwbBought = this.getBoostBought('WWB');
    if (!isFinite(Math.pow(2, wwbBought - 5))) this.doUnlockBoost('Space Elevator');
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
    // NP==0 unlocks (castle.js:3739-3742)
    if (this.core.newpixNumber === 0) {
      this.doUnlockBoost('3DLens');
      const aperture = this.boosts.get('ApertureScience');
      const chBoost = this.boosts.get('ControlledHysteresis');
      if (aperture && aperture.bought >= (aperture.countdown || 1) && chBoost && !chBoost.bought) {
        this.doUnlockBoost('ControlledHysteresis');
      }
    }

    // Reset LA level to 1 if owned
    const laBoost = this.boosts.get('LA');
    if (laBoost && laBoost.bought > 0) {
      laBoost.power = 1;
    }

    // Reset Fractal Sandcastles power
    const fractalBoost = this.boosts.get('Fractal Sandcastles');
    if (fractalBoost) {
      fractalBoost.power = 0;
    }

    // Glass production - runs before castle tools
    // Reference: castle.js:3757-3762
    this.processGlassProduction();

    // Lucky Glass reset (castle.js:3763)
    const glassBlocks = this.boosts.get('GlassBlocks');
    const glassChiller = this.boosts.get('GlassChiller');
    if (glassBlocks) {
      glassBlocks.countdown = (glassChiller?.power ?? 0) + 1; // luckyGlass stored in countdown
    }

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
      const ninjaRitual = this.boosts.get('Ninja Ritual');
      const ninjaHerder = this.boosts.get('Ninja Herder');
      if (ninjaRitual && ninjaRitual.bought > 0) {
        if (!ninjaHerder || ninjaHerder.bought === 0) {
          // No Ninja Herder - check for Lost Goats badge
          if (ninjaRitual.power >= 5) {
            this.earnBadge('Lost Goats');
            this.doUnlockBoost('Ninja Herder');
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

    // Temporal Rift department setup (castle.js:3815-3818)
    this.setupTemporalRiftDepartment();

    // Bag Burning (castle.js:3820-3824)
    this.processBagBurning();

    // BBC processing (castle.js:3825-3840)
    this.processBBC();

    // MHP department random assignment (castle.js:3842)
    if (isFinite(this.resources.castles)) {
      const mhp = this.boosts.get('MHP');
      if (mhp) {
        mhp.department = Math.floor(Math.random() * 3) === 0 ? 1 : 0;
      }
    }

    // Time Lord reset & Logicat/WotA reset (castle.js:3846-3861)
    if (!this.hasBoost('TemporalRift') || !(this.boosts.get('TemporalRift')?.bought)) {
      this.resetTimeLord();
      this.resetLogicatAtONG();

      // Flux Harvest refresh - reset availability (castle.js:3848)
      const fluxHarvest = this.boosts.get('FluxHarvest');
      if (fluxHarvest && fluxHarvest.bought) {
        fluxHarvest.isEnabled = true;
      }

      // Shadow Feeder level reset (castle.js:3860)
      const shadowFeeder = this.boosts.get('ShadowFeeder');
      if (shadowFeeder && shadowFeeder.isEnabled) {
        shadowFeeder.power = 1;
      }
    }

    // Lightning Rod decay (castle.js:3862-3874)
    this.decayLightningRod();

    // Glass Trolling disable (castle.js:3876)
    this.disableGlassTrolling();

    // Papal decree reset (castle.js:3878)
    this.resetPapalDecree();

    // Controlled Hysteresis override (castle.js:3884)
    const ch = this.boosts.get('ControlledHysteresis');
    if (ch && ch.power > -1) {
      this.core.newpixNumber = ch.power;
    }

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
    return {
      sandRefineryPower: this.getBoostPower('SandRefinery'),
      goats: this.getBoostPower('Goats'),
      hasGlassGoat: this.hasBoost('GlassGoat'),
      papalChipsMult: this.papal('Chips'),
    };
  }

  /**
   * Build the state object for glass block production calculation.
   */
  private buildGlassBlockProductionState(): GlassBlockProductionState {
    return {
      glassChillerPower: this.getBoostPower('GlassChiller'),
      glassChips: this.resources.glassChips,
      goats: this.getBoostPower('Goats'),
      hasGlassGoat: this.hasBoost('GlassGoat'),
      papalBlocksMult: this.papal('Blocks'),
      hasRuthlessEfficiency: this.hasBoost('RuthlessEfficiency'),
      glassTrollingEnabled: this.isBoostEnabled('GlassTrolling'),
    };
  }

  /**
   * Setup Temporal Rift department availability at ONG.
   * Reference: castle.js:3815-3818
   */
  private setupTemporalRiftDepartment(): void {
    const temporalRift = this.boosts.get('TemporalRift');
    if (!temporalRift) return;

    temporalRift.department = 0;

    const hasTimeTravel = this.hasBoost('Time Travel') ? 1 : 0;
    const hasFluxCapacitor = this.hasBoost('FluxCapacitor') ? 1 : 0;
    const hasFluxTurbine = this.hasBoost('FluxTurbine') ? 1 : 0;
    const hasMinusWorlds = this.badges.get('Minus Worlds') ? 1 : 0;
    const modulo = 50 - (hasTimeTravel + hasFluxCapacitor + hasFluxTurbine + hasMinusWorlds) * 10;

    if (modulo > 0 && Math.floor(this.core.newpixNumber) % modulo === 0) {
      temporalRift.department = (Math.random() * 6 >= 5) ? 1 : 0;
    }
  }

  /**
   * Process Bag Burning at ONG.
   * Reference: castle.js:3820-3824
   */
  private processBagBurning(): void {
    if (!this.hasBoost('BagBurning')) return;
    if (this.isBoostEnabled('NavCode')) return;

    const bag = this.sandTools.get('Bag');
    if (!bag) return;

    // npbDoubleThreshold is typically 400 (400 mNP default ninja time)
    const threshold = 400;
    if (bag.amount > threshold + 1 && Math.floor(Math.random() * 36) === 0) {
      // Burn 1 bag
      if (bag.amount > 0) {
        bag.amount--;
      }
    }
  }

  /**
   * Process BBC (Beach Ball Convention) at ONG.
   * Reference: castle.js:3825-3840
   */
  private processBBC(): void {
    const bbc = this.boosts.get('BBC');
    if (!bbc || !bbc.bought) return;

    if (bbc.power >= 0) {
      if (this.resources.glassBlocks >= 5) {
        this.resources.glassBlocks -= 5;
        bbc.power = 1;

        const mhp = this.boosts.get('MHP');
        if (mhp && mhp.unlocked && mhp.power > 20 && Math.floor(Math.random() * 9) === 0) {
          mhp.power--;
        }
      } else {
        bbc.power = 0;
      }
    }
  }

  /**
   * Reset Time Lord at ONG (when no Temporal Rift).
   * Reference: castle.js:3847
   */
  private resetTimeLord(): void {
    const timeLord = this.boosts.get('TimeLord');
    if (timeLord) {
      timeLord.power = 0;
    }
  }

  /**
   * Reset Logicat puzzle count at ONG.
   * Reference: castle.js:3849-3858
   */
  private resetLogicatAtONG(): void {
    const logiPuzzle = this.boosts.get('LogiPuzzle');
    if (!logiPuzzle || !logiPuzzle.bought) return;

    const wota = this.boosts.get('WotA');
    const holdBase = 10 + (wota && wota.bought ? wota.power : 0);
    const hold = Math.min(1e55, Math.ceil(holdBase)); // 1WWQ ≈ 1e55

    if (logiPuzzle.power < 10) {
      logiPuzzle.power = 10;
    } else {
      if (logiPuzzle.power >= 50) {
        this.doUnlockBoost('WotA');
      }
      if (wota) {
        wota.power += Math.max(0, (logiPuzzle.power - hold) / 24);
      }
      logiPuzzle.power = Math.min(logiPuzzle.power, hold);
    }
  }

  /**
   * Decay Lightning Rod power at ONG.
   * Reference: castle.js:3862-3874
   */
  private decayLightningRod(): void {
    const lr = this.boosts.get('LR');
    if (!lr || lr.power <= 500) return;

    const lib = this.boosts.get('LightningInABottle');
    const kak = this.boosts.get('KiteAndKey');

    let minPower = 0;
    if (lib && lib.power > 0) {
      minPower = lib.power;
    } else if (kak && kak.power > 0) {
      minPower = kak.power;
    }

    const decreased = lr.power * 0.95;
    if (decreased < minPower) {
      lr.power = minPower;
    } else {
      lr.power *= 0.95;
    }
  }

  /**
   * Disable Glass Trolling at ONG.
   * Reference: castle.js:3876
   */
  private disableGlassTrolling(): void {
    const glassTrolling = this.boosts.get('GlassTrolling');
    if (glassTrolling) {
      glassTrolling.isEnabled = false;
    }
  }

  /**
   * Reset Papal decree at ONG unless Permanent Staff active.
   * Reference: castle.js:3878
   */
  private resetPapalDecree(): void {
    if (this.hasBoost('PermanentStaff') && this.isBoostEnabled('PermanentStaff')) {
      return; // Keep decree
    }

    const pope = this.boosts.get('ThePope');
    if (pope) {
      pope.power = 0;
    }

    // Reset cached papal state
    this.decreeName = '';
    this.decreeValue = 1;
  }

  /**
   * ONGs[0] - Default newpix number advancement.
   * Reference: castle.js:3886-3913
   *
   * Advances newpixNumber, respecting Temporal Anchor and Signpost.
   */
  private ongAdvanceNewpix(): void {
    const temporalAnchor = this.boosts.get('Temporal Anchor');
    const isAnchored = temporalAnchor && temporalAnchor.bought > 0 &&
      this.isBoostEnabled('Temporal Anchor');

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
    const imperviousNinja = this.boosts.get('Impervious Ninja');
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
    const ninjaHope = this.boosts.get('Ninja Hope');
    if (ninjaHope && ninjaHope.bought > 0 && ninjaHope.power > 0) {
      if (this.resources.castles >= 10) {
        this.resources.castles -= 10;
        ninjaHope.power--;
        return false; // Protected
      }
    }

    // Protection 3: Ninja Penance (costs 30 castles)
    const ninjaPenance = this.boosts.get('Ninja Penance');
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
      this.doUnlockBoost('Ninja Penance');
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
    const ninjaLockdown = this.boosts.get('Ninja Lockdown');
    const isLockdownEnabled = ninjaLockdown && ninjaLockdown.bought > 0 &&
      this.isBoostEnabled('Ninja Lockdown');

    if (!isLockdownEnabled) {
      if (this.hasBoost('Ninja League')) ninjaInc *= 100;
      if (this.hasBoost('Ninja Legion')) ninjaInc *= 1000;
      if (this.hasBoost('Ninja Ninja Duck')) ninjaInc *= 10;
      ninjaInc *= this.papal('Ninja');
    }

    this.core.ninjaStealth += ninjaInc;

    // Castle reward
    if (this.hasBoost('Ninja Builder')) {
      const stealthBuild = this.calcStealthBuild(true, true);
      this.resources.castles += stealthBuild + 1;

      // Factory Ninja: run factory automation during stealth (castle.js:334-340)
      const factoryNinja = this.boosts.get('Factory Ninja');
      if (factoryNinja && factoryNinja.bought && factoryNinja.power > 0) {
        this.activateFactoryAutomation();
        factoryNinja.power--;
        if (factoryNinja.power <= 0) {
          factoryNinja.bought = 0;
          factoryNinja.unlocked = 0;
        }
      }
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
      this.doUnlockBoost('Ninja Builder');
    }
    if (this.core.ninjaStealth >= 26) {
      this.earnBadge('Ninja Madness');
      this.doUnlockBoost('Ninja Hope');
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
    if (this.hasBoost('Ninja Assistants')) {
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
    if (this.hasBoost('Ninja Climber')) {
      const ladders = this.sandTools.get('Ladder');
      if (ladders) stealthBuild *= ladders.amount;
    }

    // Ninjasaw + VJ: multiply by VJ reward (costs 50 glass blocks)
    // Reference: castle.js:390-396
    const ninjasaw = this.boosts.get('Ninjasaw');
    if (useVJ && ninjasaw && ninjasaw.power && this.isBoostEnabled('VJ')) {
      if (this.resources.glassBlocks >= 50) {
        if (spend) this.resources.glassBlocks -= 50;
        // VJ reward is based on VJ power level
        const vj = this.boosts.get('VJ');
        const vjReward = vj ? Math.max(1, vj.power) : 1;
        stealthBuild *= vjReward;
      }
    }

    return stealthBuild;
  }

  /**
   * Ninja Ritual - Grant goats based on ritual level.
   * Reference: boosts.js:9115-9147 (simplified)
   */
  private ninjaRitual(): void {
    const ninjaRitual = this.boosts.get('Ninja Ritual');
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

    // Process FA runs: blackprint construction, Milo generation, then department work
    if (result.runs > 0) {
      let remainingRuns = result.runs;

      // 1. Blackprint construction (if CfB is active)
      if (this.blackprintConstruction.isConstructing && this.blackprintConstruction.constructionSubject) {
        const constructResult = processBlackprintConstruction(
          remainingRuns,
          this.blackprintConstruction.constructionProgress,
          this.blackprintConstruction.constructionTarget,
          this.blackprintConstruction.constructionSubject,
          this.hasBoost('Hubble Double')
        );

        if (constructResult.completed && constructResult.completedBoost) {
          // Unlock and buy the constructed boost
          this.doUnlockBoost(constructResult.completedBoost);
          const constructedState = this.boosts.get(constructResult.completedBoost);
          if (constructedState) {
            constructedState.bought = Math.max(1, constructedState.bought);
          }
          this.blackprintConstruction.isConstructing = false;
          this.blackprintConstruction.constructionSubject = null;
          this.blackprintConstruction.constructionProgress = 0;
          this.blackprintConstruction.constructionTarget = 0;
          remainingRuns = constructResult.remainingRuns;
        } else {
          this.blackprintConstruction.constructionProgress = constructResult.progress;
          remainingRuns = 0;
        }
      }

      // 2. Milo blackprint generation (if Milo boost is owned)
      if (remainingRuns > 0 && this.hasBoost('Milo')) {
        const vsMultiplier = this.isBoostEnabled('VS')
          ? calculateVoidStareMultiplier(this.getBoostPower('Vacuum'))
          : 1;
        const miloResult = calculateMiloBlackprints(
          this.miloPower,
          remainingRuns,
          this.hasBoost('Rush Job'),
          vsMultiplier,
          this.papal('BlackP')
        );
        this.miloPower = miloResult.remainingPower;
        if (miloResult.pages > 0) {
          this.addResource('Blackprints', miloResult.pages);
        }
      }
    }
  }

  /**
   * Process Vacuum Cleaner per mNP.
   * Consumes Flux Crystals + QQ, generates Vacuum.
   * Reference: castle.js:3403-3434
   */
  private tickVacuumCleaner(): void {
    if (!this.isBoostEnabled('Vacuum Cleaner')) return;

    const fc = this.getBoostPower('FluxCrystals');
    const qq = this.getBoostPower('QQ');
    const vacState: VacuumTickState = {
      vacuumCleanerEnabled: true,
      sandIsInfinite: !isFinite(this.resources.sand),
      thisSucksLevel: this.getBoostPower('TS'),
      fluxCrystals: fc,
      fluxCrystalsInfinite: !isFinite(fc),
      qq: qq,
      qqInfinite: !isFinite(qq),
      papalDyson: this.papal('Dyson'),
      hasBlackHole: this.hasBoost('Black Hole'),
      blackhatPower: this.getBoostPower('blackhat'),
      isLongpix: this.ong.npLength > 1800,
      hasOvertime: this.isBoostEnabled('Overtime'),
      hasTractorBeam: this.isBoostEnabled('Tractor Beam'),
      goatsLevel: this.getBoostPower('Goats'),
    };

    const result = processVacuumTick(vacState);
    if (result.wasActive) {
      this.addResource('FluxCrystals', -result.fluxCrystalsSpent);
      this.addResource('QQ', -result.qqSpent);

      if (result.vacuumGenerated > 0) {
        this.addResource('Vacuum', result.vacuumGenerated);
      }
      if (result.goatsGenerated > 0) {
        this.addResource('Goats', result.goatsGenerated);
      }

      // Black Hole unlock when Flux Crystals reach Infinity
      if (result.shouldUnlockBlackHole && !this.hasBoost('Black Hole')) {
        this.doUnlockBoost('Black Hole');
      }

      // Check if This Sucks should unlock blackhat
      if (shouldUnlockBlackhat(vacState.thisSucksLevel) && !this.hasBoost('blackhat')) {
        this.doUnlockBoost('blackhat');
      }
    }
  }

  /**
   * Start blackprint construction for the next available subject.
   * Reference: boosts.js:4252-4256 (StartBlackprintConstruction)
   */
  startBlackprintConstruction(): void {
    if (this.blackprintConstruction.isConstructing) return;

    const prereqState: BlackprintPrereqState = {
      hasBadge: (badge) => this.badges.has(badge),
      hasBoost: (alias) => this.hasBoost(alias),
      getBoostPower: (alias) => this.getBoostPower(alias),
      getBoostBought: (alias) => this.getBoostBought(alias),
      aaRuns: this.getBoostPower('AA'),
      redactedClicks: this.getBoostPower('Redacted'),
    };

    const boughtBoosts = new Set<string>();
    for (const [alias, state] of this.boosts) {
      if (state.bought > 0) boughtBoosts.add(alias);
    }

    const pages = this.getBoostPower('Blackprints');
    const subject = getBlackprintSubject(pages, boughtBoosts, prereqState);
    if (!subject) return;

    const target = calculateConstructionRuns(
      subject,
      this.hasBoost('AE'),
      this.hasBoost('AA')
    );

    this.blackprintConstruction = {
      isConstructing: true,
      constructionSubject: subject,
      constructionProgress: 0,
      constructionTarget: target,
    };
  }

  /**
   * Get current blackprint construction state (for UI/testing).
   */
  getBlackprintConstructionState(): BlackprintConstructionState {
    return { ...this.blackprintConstruction };
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
   * Get a boost's power value (0 if not found).
   */
  private getBoostPower(alias: string): number {
    return this.boosts.get(alias)?.power ?? 0;
  }

  /**
   * Get a boost's bought count (0 if not found).
   */
  private getBoostBought(alias: string): number {
    return this.boosts.get(alias)?.bought ?? 0;
  }

  /**
   * Earn a badge if not already earned.
   *
   * Matches legacy EarnBadge (castle.js:2081-2106):
   * - Increments badge group counts
   * - Flags rate recalculation
   * - Earns 'Redundant' badge on every badge earn (cascade)
   * - Calls checkAutoUnlocks() for unlock cascade
   */
  private earnBadge(name: string): void {
    if (!this.badges.has(name)) {
      this.badges.set(name, false);
    }
    if (!this.badges.get(name)) {
      // Legacy castle.js:2088 - check Redundant Redundancy BEFORE incrementing BadgesOwned
      if (this._badgesOwnedCache === 0) {
        this.badges.set('Redundant Redundancy', true);
        this._badgesOwnedCache++;
        const rrDef = this.gameData.badges['Redundant Redundancy'];
        if (rrDef) {
          this.badgeGroupCounts[rrDef.group] = (this.badgeGroupCounts[rrDef.group] ?? 0) + 1;
        }
      }

      this.badges.set(name, true);
      this._badgesOwnedCache++;
      // Update badge group counts
      const def = this.gameData.badges[name];
      if (def) {
        this.badgeGroupCounts[def.group] = (this.badgeGroupCounts[def.group] ?? 0) + 1;
      }
      // Flag rate recalculation (legacy castle.js:2090)
      this.flagRateRecalc();
      // Earn 'Redundant' on every badge earn (legacy castle.js:2099)
      if (name !== 'Redundant') {
        this.earnBadge('Redundant');
      }
      // Legacy gui.js:1258 - Notify() earns 'Notified' on every notification.
      // Every badge earn triggers a notification, so we cascade here.
      if (name !== 'Notified' && name !== 'Redundant') {
        this.earnBadge('Notified');
      }
      // Trigger unlock cascade (legacy castle.js:2100)
      this.checkAutoUnlocks();
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
  // Monument System (delegated to monument-system.ts)
  // =============================================================================

  /** Build the MonumentState interface for delegation to pure functions. */
  private buildMonumentState(): MonumentState {
    return {
      badges: this.badges,
      boosts: this.boosts,
      resources: this.resources,
      earnBadge: (alias: string) => this.earnBadge(alias),
      hasBoost: (alias: string) => this.hasBoost(alias),
    };
  }

  makeSandMould(np: number): void {
    startSandMould(this.buildMonumentState(), np);
  }

  makeSandMouldWork(runs: number): number {
    return processSandMouldMaking(this.buildMonumentState(), runs);
  }

  fillSandMould(np: number): void {
    startSandMouldFill(this.buildMonumentState(), np);
  }

  fillSandMouldWork(runs: number): number {
    return processSandMouldFilling(this.buildMonumentState(), runs);
  }

  makeGlassMould(np: number): void {
    startGlassMould(this.buildMonumentState(), np);
  }

  makeGlassMouldWork(runs: number): number {
    return processGlassMouldMaking(this.buildMonumentState(), runs);
  }

  fillGlassMould(np: number): void {
    startGlassMouldFill(this.buildMonumentState(), np);
  }

  fillGlassMouldWork(runs: number): number {
    return processGlassMouldFilling(this.buildMonumentState(), runs);
  }

  doMouldWork(runs: number): number {
    return processAllMouldWork(this.buildMonumentState(), runs);
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

    // Count badges owned (use cache for performance)
    const badgesOwned = this._badgesOwnedCache;

    // Build boost powers map using Proxy for lazy access (avoids copying 341 entries)
    const boostsRef = this.boosts;
    const boostPowers = new Proxy({} as Record<string, number>, {
      get(_target, prop: string) {
        return boostsRef.get(prop)?.power ?? 0;
      },
    });

    // Build badges map using Proxy for lazy access (avoids copying 5600+ entries)
    const badgesRef = this.badges;
    const badges = new Proxy({} as Record<string, boolean>, {
      get(_target, prop: string) {
        return badgesRef.get(prop) ?? false;
      },
    });

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
      newpixNumber: this.core.newpixNumber,
      beachClicks: this.core.beachClicks,
      totalCastlesBuilt: this.castleBuild.totalBuilt,
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
   * Count total badges owned (uses cached value for performance).
   */
  private countBadgesOwned(): number {
    return this._badgesOwnedCache;
  }

  /**
   * Recompute the badges owned cache from scratch.
   * Call after bulk badge operations (init, loadState).
   */
  private recomputeBadgesOwnedCache(): void {
    let count = 0;
    for (const earned of this.badges.values()) {
      if (earned) count++;
    }
    this._badgesOwnedCache = count;
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

    // 1. Boost-specific click handlers (castle.js:161-165)
    this.clickSandGain();
    this.clickToolFactoryChips();
    this.clickMustard();
    this.clickDragonQuest();

    // 1b. Photo click: generate Blueness on beach click (castle.js:3471)
    if (this.hasBoost('Camera') || this.photoColors.blueness > 0) {
      getPhoto(this.photoColors, this.buildPhotoBoostAccess(), 1);
    }

    // 2. Click achievements (castle.js:167)
    this.checkClickAchievements();

    // Check badge conditions for click trigger
    this.badgeChecker.check('click', this.buildBadgeCheckState());

    // 3. Ninja detection logic (castle.js:169-221)
    const npb = this.castleTools.get('NewPixBot');
    const hasNPB = npb && (npb.amount > 0 || !isFinite(npb.amount));

    if (!this.core.ninjad && hasNPB) {
      if (this.ong.npbONG === 1) {
        // First click after npbONG window opened - stealth click (good!)
        this.stealthClick();

        // Ritual Sacrifice/Rift preservation (castle.js:172-191)
        this.handleRitualPreservation();
      } else if (this.ong.npbONG === 0) {
        // First click BEFORE npbONG window - ninja break (bad!)
        // castle.js:194-201: unstealth and badge awards
        if (this.ninjaUnstealth()) {
          if (npb && npb.currentActive > 0) {
            this.earnBadge('Ninja');
          }
          if (npb && npb.currentActive >= 10) {
            this.earnBadge('Ninja Strike');
          }
        }

        // castle.js:202-211: Ninja Ritual (runs regardless of unstealth result)
        const ninjaRitual = this.boosts.get('Ninja Ritual');
        if (ninjaRitual && ninjaRitual.bought > 0) {
          this.ninjaRitual();
          if (ninjaRitual.power > 10) this.doUnlockBoost('WesternParadox');
          if (ninjaRitual.power > 24) this.doUnlockBoost('RitualSacrifice');
          const timeLord = this.boosts.get('TimeLord');
          if (ninjaRitual.power > 39 && timeLord && timeLord.bought > 8) {
            this.doUnlockBoost('RitualRift');
          }
        } else {
          const goats = this.boosts.get('Goats');
          if (goats && goats.power >= 10) {
            this.doUnlockBoost('Ninja Ritual');
          }
        }

        // castle.js:212-220: Kilo/Mega/Giga badges (also independent)
        if (npb && npb.currentActive >= 1000) {
          this.earnBadge('KiloNinja Strike');
          if (npb.currentActive >= 1e6) {
            this.earnBadge('MegaNinja Strike');
            if (npb.currentActive >= 1e9) {
              this.earnBadge('GigaNinja Strike');
            }
          }
        }
      }
    } else if (this.hasBoost('VJ')) {
      // 4. VJ (Vaulting Jackhammer) system (castle.js:222-279)
      this.processVJClick();
    }

    // 5. Bag Puns progression (castle.js:280-286)
    this.processBagPuns();

    // 6. Spare Tools (castle.js:288-291)
    if (this.hasBoost('SpareTools')) {
      this.createRandomTool();
    }

    // Mark that we've clicked this newpix
    this.core.ninjad = true;

    // 7. NP-specific badges (castle.js:295)
    this.handleClickNPBadges();

    // 8. Temporal Rift random jump (castle.js:297-300)
    this.checkTemporalRiftClick();

    // 9. Doubletap recursion (castle.js:303)
    if (!this._inDoubletap && this.hasBoost('Doubletap')) {
      this._inDoubletap = true;
      this.processBeachClick();
      this._inDoubletap = false;
    }

    // 10. Post-click sand-to-castles (castle.js:304)
    this.toCastles();
  }

  /**
   * Auto-convert sand to castles using Fibonacci cost sequence.
   * Matches legacy Molpy.Boosts['Sand'].toCastles() behavior.
   */
  private toCastles(): void {
    const builtBefore = this.castleBuild.totalBuilt;
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

    // Check castle-building badges if any castles were built
    if (this.castleBuild.totalBuilt > builtBefore) {
      this.badgeChecker.check('resource-change', this.buildBadgeCheckState());
    }
  }

  /**
   * Sand click handler - adds sand per click.
   * Reference: boosts.js:7534-7541 (Sand.clickBeach)
   */
  private clickSandGain(): void {
    const sandGained = this.cachedSandPerClick;
    this.resources.sand += sandGained;
    this.syncResourceBoosts();
  }

  /**
   * Tool Factory click handler - loads glass chips per click.
   * Reference: boosts.js:5117-5126 (TF.clickBeach)
   */
  private clickToolFactoryChips(): void {
    if (!this.hasBoost('TF')) return;

    const chipState: ChipClickState = {
      sandIsInfinite: !isFinite(this.resources.sand),
      bgBought: this.hasBoost('BG'),
      gmBought: this.hasBoost('GM'),
      boneClickerBought: this.hasBoost('Bone Clicker'),
      bonemealLevel: this.getBoostPower('Bonemeal'),
      boostsOwned: this.countBoughtBoosts(),
      loadedPermNP: this.getBoostPower('TF'),
    };

    const chips = calculateChipsPerClick(chipState);
    if (chips > 0) {
      const tf = this.boosts.get('TF');
      if (tf) {
        tf.power += chips;
      }
    }
  }

  /**
   * Mustard click handler - adds mustard from NaN tools.
   * Reference: boosts.js:7987-7992 (Mustard.clickBeach)
   */
  private clickMustard(): void {
    if (!this.hasBoost('Mustard') || this.mustardToolCount === 0) return;
    const mustard = this.boosts.get('Mustard');
    if (mustard) {
      mustard.power += this.mustardToolCount;
    }
  }

  /**
   * Dragon Quest click handler - triggers dragon digging on click.
   * Reference: boosts.js:8281-8285 (DQ.clickBeach)
   */
  private clickDragonQuest(): void {
    const dq = this.boosts.get('DQ');
    if (!dq || !dq.bought) return;
    if (!this.hasBoost('BeachDragon')) return;
    if (this.dragons.digRate <= 0) return;
    this.processDragonDig('beach');
  }

  /**
   * Check NP-specific click achievements.
   * Reference: castle.js:463-468 (Molpy.HandleClickNP)
   */
  private handleClickNPBadges(): void {
    const np = this.core.newpixNumber;
    if (np === 404) this.earnBadge('Badge Not Found');
    if (np === -404) this.earnBadge('Badge Found');
    if (np === 2101) this.earnBadge('War was beginning.');
  }

  /**
   * Check click count achievements.
   * Reference: castle.js:167 (Molpy.CheckClickAchievements)
   */
  private checkClickAchievements(): void {
    // Badge checks based on total beach clicks
    this.badgeChecker.check('click', this.buildBadgeCheckState());
  }

  /**
   * Handle Ritual Sacrifice/Rift to preserve ninja ritual streak on stealth click.
   * Reference: castle.js:172-191
   *
   * On stealth click, if Ninja Ritual power >= 25, spend 5 goats (Ritual Sacrifice)
   * or flux crystals (Ritual Rift) to preserve the ritual. Otherwise reset to 0.
   */
  private handleRitualPreservation(): void {
    const ninjaRitual = this.boosts.get('Ninja Ritual');
    if (!ninjaRitual || ninjaRitual.bought <= 0) return;

    let saveRitual = false;

    // Ritual Sacrifice: spend 5 goats (power 25-100)
    const ritualSacrifice = this.boosts.get('RitualSacrifice');
    if (ritualSacrifice && this.isBoostEnabled('RitualSacrifice') &&
        ninjaRitual.power >= 25 && ninjaRitual.power < 101) {
      const goats = this.boosts.get('Goats');
      if (goats && goats.power >= 5) {
        goats.power -= 5;
        saveRitual = true;
      }
    }

    // Ritual Rift: spend floor(ritual_power/10) flux crystals
    const ritualRift = this.boosts.get('RitualRift');
    if (ritualRift && this.isBoostEnabled('RitualRift') && !saveRitual) {
      const cost = Math.floor(ninjaRitual.power / 10);
      const fluxCrystals = this.boosts.get('FluxCrystals');
      if (fluxCrystals && fluxCrystals.power >= cost) {
        fluxCrystals.power -= cost;
        saveRitual = true;
      }
    }

    if (!saveRitual) {
      ninjaRitual.power = 0;
    }
  }

  /**
   * VJ (Vaulting Jackhammer) click processing.
   * Every Nth click (N=100, or 20 with Short Saw) triggers VJ reward.
   * Reference: castle.js:222-279
   */
  private processVJClick(): void {
    const vj = this.boosts.get('VJ');
    if (!vj || !vj.bought) return;

    const sawmod = this.hasBoost('ShortSaw') ? 20 : 100;
    if (this.core.beachClicks % sawmod !== 0) return;

    // Build castles as reward
    const reward = this.getVJReward();
    this.resources.castles += reward;
    vj.power++;

    // Glass Saw processing (castle.js:234-277)
    this.processGlassSaw();
  }

  /**
   * Get VJ reward amount.
   * Reference: boosts.js VJ.getReward
   */
  private getVJReward(): number {
    const vj = this.boosts.get('VJ');
    if (!vj) return 1;
    // Base reward scales with VJ power
    return Math.max(1, vj.power);
  }

  /**
   * Glass Saw processing during VJ click.
   * Converts TF chips to glass blocks.
   * Reference: castle.js:234-277
   */
  private processGlassSaw(): void {
    if (!this.hasBoost('GlassSaw')) return;
    const glassSaw = this.boosts.get('GlassSaw');
    if (!glassSaw || glassSaw.power <= 0) {
      if (glassSaw && !glassSaw.power) glassSaw.power = 1;
      return;
    }

    const tf = this.boosts.get('TF');
    if (!tf) return;

    const chipsPerBlock = this.getChipsPerBlock();
    if (chipsPerBlock <= 0) return;

    const glassCeilingCount = this.getGlassCeilingCount();
    const p = glassSaw.power;
    const absMaxGlass = glassCeilingCount * 10000000 * p;
    let maxGlass = Math.min(absMaxGlass, Math.floor(tf.power / chipsPerBlock));

    const glassBlocks = this.boosts.get('GlassBlocks');
    if (!glassBlocks) return;

    // Buzz Saw with Stretchable Block Storage
    if (this.hasBoost('BuzzSaw') && this.isBoostEnabled('StretchableBlockStorage')) {
      maxGlass = Math.max(maxGlass, 0) || 0;
    } else {
      // Normal capacity check
      const capacity = glassBlocks.bought * 50;
      maxGlass = Math.min(maxGlass, capacity - glassBlocks.power);
      maxGlass = Math.max(maxGlass, 0) || 0;

      // Backoff loop to ensure we don't exceed capacity
      let backoff = 1;
      while (glassBlocks.power + maxGlass > capacity) {
        maxGlass -= backoff;
        backoff *= 2;
      }
    }

    if (!isFinite(maxGlass)) {
      this.earnBadge('Infinite Saw');
    }

    if (!isFinite(glassBlocks.power)) {
      this.doUnlockBoost('BuzzSaw');
    }

    // Add glass blocks with Papal multiplier
    const papalMult = this.papal('GlassSaw');
    this.resources.glassBlocks += Math.floor(maxGlass * papalMult);

    // Spend TF chips
    tf.power -= maxGlass * chipsPerBlock;

    // Power growth based on available TF
    if (tf.power >= absMaxGlass * chipsPerBlock * 10) {
      glassSaw.power = p * (10 + 5 * (this.hasBoost('BuzzSaw') ? 1 : 0));
    } else if (tf.power >= absMaxGlass * chipsPerBlock * 2) {
      glassSaw.power = p * (2 + (this.hasBoost('BuzzSaw') ? 1 : 0));
    }
  }

  /**
   * Get chips per block conversion rate.
   */
  private getChipsPerBlock(): number {
    return calculateChipsPerBlock(
      this.hasBoost('RuthlessEfficiency'),
      this.isBoostEnabled('GlassTrolling')
    );
  }

  /**
   * Get count of Glass Ceiling boosts owned.
   */
  private getGlassCeilingCount(): number {
    let count = 0;
    for (const [name, state] of this.boosts) {
      if (name.startsWith('GlassCeiling') && state.bought > 0) count++;
    }
    return count;
  }

  /**
   * Bag Puns progression - every 20 clicks, increment power.
   * Eventually unlocks VJ at power > 100.
   * Reference: castle.js:280-286
   */
  private processBagPuns(): void {
    const bagPuns = this.boosts.get('Bag Puns');
    if (!bagPuns || !bagPuns.bought) return;

    // Only if VJ not yet bought
    const vj = this.boosts.get('VJ');
    if (vj && vj.bought) return;

    if (this.core.beachClicks % 20 === 0) {
      bagPuns.power++;
      if (bagPuns.power > 100) {
        this.doUnlockBoost('VJ');
      }
    }
  }

  /**
   * Create a random tool from tfOrder on click (Spare Tools boost).
   * Reference: castle.js:288-291
   */
  private createRandomTool(): void {
    // Pick a random tool from all tools
    const allTools = [...this.sandTools.keys(), ...this.castleTools.keys()];
    if (allTools.length === 0) return;

    const toolName = allTools[Math.floor(Math.random() * allTools.length)];

    // Try sand tool first, then castle tool
    const sandTool = this.sandTools.get(toolName);
    if (sandTool) {
      sandTool.amount++;
      sandTool.temp++;
      return;
    }

    const castleTool = this.castleTools.get(toolName);
    if (castleTool) {
      castleTool.amount++;
      castleTool.temp++;
    }
  }

  /**
   * Check for accidental temporal rift slip on click.
   * Reference: castle.js:297-300
   */
  private checkTemporalRiftClick(): void {
    const temporalRift = this.boosts.get('TemporalRift');
    if (!temporalRift || !temporalRift.bought) return;
    if (temporalRift.countdown >= 5) return;

    // 50% chance of slipping through
    if (Math.random() < 0.5) {
      this.riftJump();
    }
  }

  /**
   * Donkey - auto-buy system.
   * Reference: boosts.js:1672-1690
   * Called every tick (castle.js:3455) and on click (castle.js:301).
   */
  private donkey(): void {
    // Shopping Assistant + ASHF mode: auto-buy selected shop item at 1.05x price
    if (this.hasBoost('ShoppingAssistant') && this.hasBoost('ASHF')) {
      // Shopping item auto-buy would need UI state (shoppingItem)
      // Simplified: just the mechanism is in place
      return;
    }

    // Rob mode: auto-buy boosts from Rob's list
    if (this.hasBoost('Rob')) {
      const rob = this.boosts.get('Rob');
      if (!rob) return;

      const ashf = this.hasBoost('ASHF');
      // Rob only runs on even ticks unless ASHF owned
      if (!ashf && (rob.power & 1)) return;

      // Rob auto-buys boosts from its list (simplified)
      // Full implementation needs boost-by-ID mapping
    }
  }

  /**
   * Get your goat - add goats and check unlock thresholds.
   * Reference: boosts.js:488-498
   */
  private getYourGoat(n: number): void {
    const goats = this.boosts.get('Goats');
    if (!goats) return;

    goats.power += n;

    if (goats.power >= 2) this.earnBadge('Second Edition');
    if (goats.power >= 20) this.doUnlockBoost('HoM');
    if (goats.power >= 200) this.doUnlockBoost('BeretGuy');
  }

  /**
   * Start a Monty Haul Problem round. Sets prize door and marks round active.
   * Reference: boosts.js:429-431 (unlockFunction)
   */
  montyStart(): boolean {
    const mhp = this.boosts.get('MHP');
    if (!mhp || !mhp.bought) return false;

    // Generate random prize door
    this.montyPrize = this.montyDoors[Math.floor(Math.random() * 3)];
    this.montyGoat = '';
    this.montyChosen = '';
    this.montyActive = true;
    return true;
  }

  /**
   * Player selects a door in MHP. If first pick, reveals a goat door.
   * If second pick (after goat revealed), resolves the game.
   * Reference: boosts.js:439-466 (Molpy.Monty)
   */
  montyChoose(door: string): { result: 'goat-revealed' | 'win' | 'lose'; goatDoor?: string } | null {
    const mhp = this.boosts.get('MHP');
    if (!mhp || !mhp.bought || !this.montyActive) return null;

    this.montyChosen = door;

    if (this.montyGoat) {
      // Second pick — if choosing revealed goat door, need Beret Guy
      if (door === this.montyGoat && !this.hasBoost('BeretGuy')) {
        return null; // can't pick revealed goat without Beret Guy
      }
      // Resolve the game
      const won = door === this.montyPrize;
      this.rewardMonty(won);
      this.montyActive = false;
      // Lock MHP (increments power for price scaling)
      mhp.power++;
      return { result: won ? 'win' : 'lose' };
    } else {
      // First pick — reveal a goat door
      const goatDoor = this.montyRevealGoat(door);
      if (!goatDoor) {
        // Edge case: player picked the prize on first try with specific goat logic
        // Legacy uses encoded MontyMethod with randomness
        const won = door === this.montyPrize;
        this.rewardMonty(won);
        this.montyActive = false;
        mhp.power++;
        return { result: won ? 'win' : 'lose' };
      }
      this.montyGoat = goatDoor;
      return { result: 'goat-revealed', goatDoor };
    }
  }

  /**
   * Find a door to reveal as goat (not the player's choice, not the prize).
   * Reference: boosts.js MontyMethod encoded logic
   */
  private montyRevealGoat(chosen: string): string | null {
    const candidates = this.montyDoors.filter(d => d !== chosen && d !== this.montyPrize);
    if (candidates.length === 0) return null;
    // If player chose the prize, both others are goats — pick randomly
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Distribute rewards for MHP win/loss.
   * Reference: boosts.js:472-486 (Molpy.RewardMonty)
   */
  private rewardMonty(won: boolean): void {
    if (won) {
      // Win: gain 50% of current castles
      const gain = Math.floor(this.resources.castles / 2);
      this.resources.castles += gain;

      // Hall of Mirrors: gain 1/5 of glass chips
      if (this.isBoostEnabled('HoM')) {
        const chipGain = Math.floor(this.resources.glassChips / 5);
        this.resources.glassChips += chipGain;
      }

      // Gruff: gain 3 goats on win
      if (this.hasBoost('Gruff')) {
        this.getYourGoat(3);
      }
    } else {
      // Lose: destroy all castles
      this.resources.castles = 0;

      // Reduce MHP power for price scaling
      const mhp = this.boosts.get('MHP');
      if (mhp) {
        mhp.power = Math.ceil(Math.floor(mhp.power / 1.8));
      }

      // Hall of Mirrors: lose 1/3 of glass chips
      if (this.isBoostEnabled('HoM')) {
        const chipLoss = Math.floor(this.resources.glassChips / 3);
        this.resources.glassChips -= chipLoss;
      }

      // Always get 1 goat on loss
      this.getYourGoat(1);
    }
  }

  /**
   * Get MHP state for display/testing.
   */
  getMontyState(): { active: boolean; chosen: string; goatDoor: string; prize: string } {
    return {
      active: this.montyActive,
      chosen: this.montyChosen,
      goatDoor: this.montyGoat,
      prize: this.montyPrize,
    };
  }

  /**
   * Build PhotoBoostAccess adapter for the photo system.
   */
  private buildPhotoBoostAccess(): PhotoBoostAccess {
    return {
      hasBoost: (name: string) => this.hasBoost(name),
      isEnabled: (name: string) => this.isBoostEnabled(name),
      getLevel: (name: string) => {
        const b = this.boosts.get(name);
        return b ? b.bought : 0;
      },
      getPower: (name: string) => {
        const b = this.boosts.get(name);
        return b ? b.power : 0;
      },
      setPower: (name: string, value: number) => {
        const b = this.boosts.get(name);
        if (b) b.power = value;
      },
      addPower: (name: string, amount: number) => {
        const b = this.boosts.get(name);
        if (b) b.power += amount;
      },
      unlockBoost: (name: string) => this.doUnlockBoost(name),
      earnBadge: (name: string) => this.earnBadge(name),
      papal: (decree: string) => this.papal(decree),
    };
  }

  /**
   * Get photo color state for testing.
   */
  getPhotoColors(): PhotoColorState {
    return { ...this.photoColors };
  }

  /**
   * Set photo color state (for testing).
   */
  setPhotoColors(colors: Partial<PhotoColorState>): void {
    Object.assign(this.photoColors, colors);
  }

  /**
   * Void Stare multiplier for blackprint production.
   * Reference: boosts.js:9504-9512
   */
  private voidStareMultiplier(stareType: string): number {
    if (!this.isBoostEnabled(stareType)) return 1;
    const vacuumLevel = this.getBoostPower('Vacuum');
    if (vacuumLevel <= 0) return 1;

    const blackprints = this.getBoostPower('Blackprints');
    if (!isFinite(blackprints)) return 1;

    return calculateVoidStareMultiplier(vacuumLevel);
  }

  /**
   * Rift jump to a random NP.
   * Reference: boosts.js:1874
   */
  private riftJump(): void {
    const maxNP = Math.abs(this.core.highestNPvisited);
    if (maxNP <= 1) return;

    const targetNP = Math.floor(Math.random() * maxNP) + 1;
    if (targetNP !== this.core.newpixNumber) {
      this.timeTravelTo(targetNP, false);
    }
  }

  /**
   * Count total bought boosts (for chip per click calculation).
   */
  private countBoughtBoosts(): number {
    let count = 0;
    for (const [, state] of this.boosts) {
      if (state.bought > 0) count++;
    }
    return count;
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
      getNewpixNumber: () => this.core.newpixNumber,
      getBadgesOwned: () => this.countBadgesOwned(),

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
      setBoostBought: (boostAlias, bought) => {
        const boost = this.boosts.get(boostAlias);
        if (boost) {
          boost.bought = bought;
        }
      },
      setBoostEnabled: (boostAlias, enabled) => {
        const boost = this.boosts.get(boostAlias);
        if (boost) {
          boost.isEnabled = enabled;
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
      buyBoost: (boostAlias) => this.buyBoost(boostAlias),
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
    const familyDiscountState = this.boosts.get('Family Discount');

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
      biggerBuckets: getBoostPower('Bigger Buckets'),
      hugeBuckets: isBoostBought('Huge Buckets'),
      buccaneer: isBoostBought('Buccaneer'),
      helpfulHands: isBoostBought('Helpful Hands'),
      trueColours: isBoostBought('True Colours'),
      raiseTheFlag: isBoostBought('Raise the Flag'),
      handItUp: isBoostBought('Hand it Up'),
      bucketBrigade: isBoostBought('Bucket Brigade'),
      bagPuns: isBoostBought('Bag Puns'),
      boneClicker: isBoostBought('Bone Clicker'),
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
   *
   * Applies the click-applicable global multiplier (Molpies, Grapevine,
   * Ch*rpies, Blitzing) but NOT rate-only multipliers (Facebugs, BBC, etc.).
   * Reference: boosts.js:7449 - calculateSandPerClick receives the same
   * multiplier built in calculateSandRates (lines 7434-7447).
   */
  private recalculateSandPerClick(): void {
    const clickState = this.buildClickMultiplierState();
    const rateState = this.buildSandRateState();
    const globalMult = calculateClickGlobalMultiplier(rateState);
    this.cachedSandPerClick = calculateSandPerClick(clickState, globalMult);
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
    this._badgesOwnedCache = 0;
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
    const logicatCurrent = this.getBoostPower('Panther Poke');
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
      kitnip: this.hasBoost('Kitnip'),
      kittiesGalore: this.hasBoost('Kitties Galore'),
      rrsrUnlocked: (this.boosts.get('RRSR')?.unlocked ?? 0) > 0,
      rrsrBought: this.hasBoost('RRSR'),
      doRD: this.hasBoost('DoRD'),
      blastFurnace: this.hasBoost('Blast Furnace'),
      bkj: this.hasBoost('BKJ'),
      bkjPower: this.getBoostPower('BKJ'),
      redunception: this.hasBoost('Redunception'),
      logicat: this.hasBoost('Logicat'),
      sgc: this.hasBoost('SGC'),
      doubleDepartment: this.hasBoost('Double Department'),
      schizoblitz: this.hasBoost('Schizoblitz'),
      seaMining: this.hasBoost('Sea Mining'),
      ventusVehemensEnabled: this.hasBoost('Ventus Vehemens') &&
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
  /**
   * Process boost countdowns.
   * Reference: castle.js:3348-3375 (Molpy.Think countdown loop)
   *
   * For each bought boost with a countdown:
   * - Skip if Coma is enabled (unless boost has countdownCMS flag)
   * - Decrement countdown
   * - On expiry: call countdownLockFunction or lock boost + reset power
   * - While active: call countdownFunction if registered
   */
  private tickBoostCountdowns(): void {
    const isComa = this.isBoostEnabled('Coma Molpy Style');

    for (const [name, boost] of this.boosts) {
      if (!boost.bought || !boost.countdown || boost.countdown <= 0) continue;

      const funcs = getBoostFunctions(name);

      // Coma handling (castle.js:3351-3364)
      if (isComa) {
        if (boost.countdownCMS) {
          // countdownCMS boosts still count down during Coma
        } else if (funcs?.countdownFunction && boost.callcountdownifCMS) {
          // callcountdownifCMS: call countdown function but don't decrement
          funcs.countdownFunction(this.createBoostFunctionContext(name));
          continue;
        } else {
          // Normal boosts skip countdown during Coma
          continue;
        }
      }

      boost.countdown--;
      if (boost.countdown <= 0) {
        boost.countdown = 0;
        if (funcs?.countdownLockFunction) {
          // Call boost-specific lock function instead of generic lock
          funcs.countdownLockFunction(this.createBoostFunctionContext(name));
        } else {
          // Default: lock the boost and reset power
          this.lockBoost(name);
          boost.power = 0;
        }

        // Handle Blitzing expiration specially
        if (name === 'Blitzing') {
          this.recalculateSandRates();
        }
      } else {
        // Run countdown function if registered
        if (funcs?.countdownFunction) {
          funcs.countdownFunction(this.createBoostFunctionContext(name));
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
    const hasTopiary = this.hasBoost('Topiary');

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
    if (this.dragons.totalNPsWithDragons > 111 && this.hasBoost('Dragon Overview')) {
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

    const princessLevel = this.getBoostPower('Princesses');
    const dragonflyLevel = this.getBoostPower('Dragonfly');

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
    const camelflargeLevel = this.getBoostPower('Camelflarge');
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
