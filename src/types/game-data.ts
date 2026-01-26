/**
 * Sandcastle Builder Game Data Types
 *
 * These types define the static game data (boosts, badges, tools)
 * extracted from the legacy codebase for use in the modern implementation.
 */

// =============================================================================
// Resource Types
// =============================================================================

/**
 * Currency/resource identifiers used in prices and costs.
 * In the legacy game, all resources are stored as boosts where power = amount.
 * Reference: castle.js:1284-1293 (Molpy.Has checks boost.Has)
 */
export type ResourceId =
  // Primary resources
  | 'Sand'
  | 'Castles'
  | 'GlassChips'
  | 'GlassBlocks'
  // Glass-related
  | 'TF'           // Temporal Flux (glass)
  | 'Shards'
  | 'Panes'
  // Secondary resources
  | 'Goats'
  | 'Bonemeal'
  | 'Mustard'
  | 'FluxCrystals'
  | 'Logicat'
  | 'LogiPuzzle'
  | 'Blackprints'
  | 'Vacuum'
  | 'QQ'
  | 'Diamonds'
  | 'Maps'
  | 'Coal'
  | 'Princesses'
  | 'Shork'
  | 'exp'
  // Color resources (used by some boosts)
  | 'Blackness'
  | 'Whiteness'
  | 'Grayness'
  | 'Blueness'
  | 'Otherness';

/** Price specification - can be number or string like "1.5M" */
export type PriceValue = number | string;

/** Price object mapping resources to amounts */
export type Price = Partial<Record<ResourceId, PriceValue>>;

// =============================================================================
// Boost Types
// =============================================================================

/** Boost group categories */
export type BoostGroup =
  | 'boosts'     // Default boosts
  | 'hpt'        // Hill People Tech
  | 'ninj'       // Ninjutsu
  | 'chron'      // Chronotech
  | 'cyb'        // Cybernetics
  | 'bean'       // Beanie Tech
  | 'ceil'       // Glass Ceilings
  | 'drac'       // Draconic
  | 'stuff'      // Resources (Sand, Castles, etc.)
  | 'land'       // Land
  | 'prize'      // Prizes
  | 'discov'     // Discoveries
  | 'monums'     // Sand Monuments
  | 'monumg'     // Glass Monuments
  | 'diamm'      // Masterpieces
  | 'faves'      // Favourites
  | 'magic'      // Magic
  | 'dimen'      // Dimension Tech
  | 'varie';     // Variegation

/** Boost display class for styling */
export type BoostClassName = 'toggle' | 'alert' | 'action' | undefined;

/**
 * Static boost definition extracted from boosts.js
 * This represents the immutable configuration of a boost.
 */
export interface BoostDefinition {
  /** Unique identifier (order in definition) */
  id: number;

  /** Display name */
  name: string;

  /** Short alias for save files and lookups */
  alias: string;

  /** Icon filename (without extension) */
  icon: string;

  /** Category group */
  group: BoostGroup;

  /** Description text (static only - dynamic descriptions not extracted) */
  description: string;

  /** Static stats text if available */
  stats?: string;

  /** Base price before discounts */
  price: Price;

  /** Display class for styling */
  className?: BoostClassName;

  /** Initial power value */
  startPower?: number;

  /** Initial countdown value */
  startCountdown?: number;

  /** Whether this can be unlocked by Department of Redundancy */
  department?: boolean;

  /** Whether this can be unlocked by Logicat */
  logic?: boolean;

  /** Prize tier for Molpy Down rewards */
  tier?: number;

  /** Number of prizes awarded on lock */
  prizes?: number;

  /** Whether countdown doesn't end in Coma Molpy Style */
  countdownCMS?: boolean;

  /** Whether this boost is a toggle (has IsEnabled) */
  isToggle: boolean;

  /** Whether this is a "stuff" type with Level property */
  isStuff: boolean;

  /**
   * Properties that are dynamically calculated (functions in original code).
   * These need special handling in the modern engine.
   */
  hasDynamicDescription: boolean;
  hasDynamicStats: boolean;
  hasDynamicPrice: boolean;
  hasBuyFunction: boolean;
  hasLockFunction: boolean;
  hasUnlockFunction: boolean;
  hasCountdownFunction: boolean;
  hasLoadFunction: boolean;
}

/**
 * Runtime boost state (saved/loaded)
 */
export interface BoostState {
  /** Whether the boost is visible in shop */
  unlocked: number;

  /** Number of times purchased (usually 0 or 1, sometimes more) */
  bought: number;

  /** Power level / stored value */
  power: number;

  /** Countdown timer in mNP */
  countdown: number;

  /** Additional save data fields (boost-specific) */
  extra?: Record<string, number | string | number[]>;
}

// =============================================================================
// Badge Types
// =============================================================================

/** Badge visibility levels */
export type BadgeVisibility = 0 | 1 | 2; // 0=normal, 1=semi-hidden, 2=hidden

/**
 * Static badge definition
 */
export interface BadgeDefinition {
  /** Unique identifier */
  id: number;

  /** Display name */
  name: string;

  /** Group (badges, discov, monums, monumg, diamm) */
  group: string;

  /** Description text */
  description: string;

  /** Optional stats/flavor text */
  stats?: string;

  /** Visibility level */
  visibility: BadgeVisibility;

  /** Whether description is dynamic */
  hasDynamicDescription: boolean;
}

/**
 * Runtime badge state
 */
export interface BadgeState {
  /** Whether the badge has been earned */
  earned: boolean;
}

// =============================================================================
// Tool Types
// =============================================================================

/** Tool type (sand-producing or castle-producing) */
export type ToolType = 'sand' | 'castle';

/**
 * Static tool definition
 */
export interface ToolDefinition {
  /** Unique identifier */
  id: number;

  /** Display name */
  name: string;

  /** Common names for matching (e.g., "bucket|buckets|poured") */
  commonName: string;

  /** Icon filename */
  icon: string;

  /** Description */
  description: string;

  /** Tool type */
  type: ToolType;

  /** Base price for first purchase */
  basePrice: number;

  /** Threshold for unlocking next tool type */
  nextThreshold: number;

  /**
   * Whether sand/castle rate calculation requires boost lookups.
   * If true, rate must be computed dynamically.
   */
  hasDynamicRate: boolean;
}

/**
 * Runtime tool state
 */
export interface ToolState {
  /** Current amount owned */
  amount: number;

  /** Total ever bought */
  bought: number;

  /** Temporary tools (from boosts) */
  temp: number;

  /** Total sand produced (sand tools) */
  totalSand?: number;

  /** Total glass produced (sand tools) */
  totalGlass?: number;

  /** Total castles built (castle tools) */
  totalCastlesBuilt?: number;

  /** Total castles destroyed (castle tools) */
  totalCastlesDestroyed?: number;

  /** Total castles wasted (castle tools) */
  totalCastlesWasted?: number;

  /** Currently active (castle tools) */
  currentActive?: number;

  /** Total glass built (castle tools) */
  totalGlassBuilt?: number;

  /** Total glass destroyed (castle tools) */
  totalGlassDestroyed?: number;
}

// =============================================================================
// Game Constants
// =============================================================================

/**
 * Group display names and icons
 */
export interface GroupInfo {
  /** Lowercase singular name */
  singular: string;

  /** Title case plural name */
  plural: string;

  /** Icon name */
  icon: string;

  /** Optional: title for discoveries/monuments */
  title?: string;

  /** Optional: prefix for discoveries/monuments */
  prefix?: string;

  /** Optional: suffix for discoveries/monuments */
  suffix?: string;
}

/**
 * Complete static game data
 */
export interface GameData {
  /** Version of the data extraction */
  version: string;

  /** Source game version */
  sourceVersion: number;

  /** Extraction timestamp */
  extractedAt: string;

  /** All boost definitions indexed by alias */
  boosts: Record<string, BoostDefinition>;

  /** Boost definitions indexed by ID for save/load */
  boostsById: BoostDefinition[];

  /** All badge definitions indexed by name */
  badges: Record<string, BadgeDefinition>;

  /** Badge definitions indexed by ID */
  badgesById: BadgeDefinition[];

  /** Sand tool definitions */
  sandTools: ToolDefinition[];

  /** Castle tool definitions */
  castleTools: ToolDefinition[];

  /** Group information */
  groups: Record<BoostGroup, GroupInfo>;
}

// =============================================================================
// Save/Load Types
// =============================================================================

/**
 * Complete game state for save/load
 */
export interface GameState {
  /** Save format version */
  version: number;

  /** Game start timestamp */
  startDate: number;

  /** Current newpix number */
  newpixNumber: number;

  /** Total beach clicks */
  beachClicks: number;

  /** Ninja-free ONG count */
  ninjaFreeCount: number;

  /** Current ninja stealth streak */
  ninjaStealth: number;

  /** Whether currently ninjad */
  ninjad: boolean;

  /** Save count */
  saveCount: number;

  /** Load count */
  loadCount: number;

  /** Notifications received */
  notifsReceived: number;

  /** NPB ONG state */
  npbONG: number;

  /** Loot items per page */
  lootPerPage: number;

  /** Largest NP visited per story */
  largestNPvisited: Record<number, number>;

  /** Redacted minigame state */
  redacted: {
    countup: number;
    toggle: number;
    location: number;
    totalClicks: number;
    chainCurrent: number;
    chainMax: number;
  };

  /** All boost states */
  boosts: Record<string, BoostState>;

  /** All badge states */
  badges: Record<string, BadgeState>;

  /** Sand tool states */
  sandTools: Record<string, ToolState>;

  /** Castle tool states */
  castleTools: Record<string, ToolState>;

  /** Per-newpix dragon data */
  npData: Record<number, NPData>;
}

/**
 * Per-newpix data (dragons)
 */
export interface NPData {
  dragonType: number;
  amount: number;
  defence: number;
  attack: number;
  dig: number;
  breath?: number;
  magic1?: number;
  magic2?: number;
  magic3?: number;
}

// =============================================================================
// Dragon Types
// =============================================================================

/**
 * Dragon breath types available to different dragon species.
 * Reference: dragons.js:108-183 (breath arrays on dragon definitions)
 */
export type DragonBreathType = 'fire' | 'ice' | 'poison' | 'special1' | 'special2';

/**
 * Dragon stat property names used for lining bonuses and combat.
 * Reference: boosts.js:8094-8095 (DragonStats array)
 */
export type DragonStatName = 'offence' | 'defence' | 'digging' | 'breath' | 'magic1' | 'magic2' | 'magic3';

/**
 * Resources that can be used for dragon nest lining.
 * Reference: boosts.js:8095-8098 (DragonProperties mapping)
 */
export type DragonLiningResource =
  | 'Sand'
  | 'Castles'
  | 'GlassChips'
  | 'GlassBlocks'
  | 'Blackprints'
  | 'FluxCrystals'
  | 'Goats'
  | 'Bonemeal'
  | 'Mustard'
  | 'Vacuum';

/**
 * Mapping of dragon stats to the resources that boost them via nest lining.
 * Reference: boosts.js:8095-8098
 */
export interface DragonStatResources {
  stat: DragonStatName;
  resources: DragonLiningResource[];
}

/**
 * Static dragon species definition.
 * Reference: dragons.js:30-194 (Molpy.Dragon constructor and DefineDragons)
 */
export interface DragonDefinition {
  /** Unique identifier (0-7) */
  id: number;

  /** Species name */
  name: string;

  /** Number of legs */
  legs: number;

  /** Number of wings (0 = cannot fly) */
  wings: number;

  /** Can fly? (1 = yes, 0 = no) */
  fly: 0 | 1;

  /** Number of heads */
  heads: number;

  /** Number of arms */
  arms: number;

  /** Number of tails */
  tails: number;

  /** Available breath types (undefined for early dragons) */
  breath?: DragonBreathType[];

  /** Magic level (0-3) */
  magic?: number;

  /** Upgrade cost to next level (resource amounts) */
  upgrade: Record<string, number | string>;

  /** Experience required for this dragon level */
  exp: string;

  /** Base digging rate */
  digbase: number;

  /** Base defense value */
  defbase: number;

  /** Base breath damage (only for dragons with breath) */
  breathbase?: number;

  /** Display color */
  colour: string;

  /** Flavor text description */
  desc: string;
}

/**
 * Dragon overall state (used by Dragon Queen).
 * Reference: boosts.js:8234, dragons.js:1114-1117
 */
export type DragonOverallState = 0 | 1 | 2 | 3;
// 0 = Digging (normal)
// 1 = Recovering (after combat)
// 2 = Hiding (defensive)
// 3 = Celebrating (after victory)

/**
 * Dragon Queen state tracking.
 * Reference: boosts.js:8212-8299
 */
export interface DragonQueenState {
  /** Current dragon level (species index) */
  Level: number;

  /** Overall dragon behavior state */
  overallState: DragonOverallState;

  /** Countdown for state changes (mNP) */
  countdown: number;

  /** Total fights participated in */
  totalfights: number;

  /** Fights that used breath attacks */
  breathfights: number;

  /** Number of times digging found something */
  finds: number;

  /** Total dragons lost in combat */
  totalloses: number;
}

/**
 * Hatchling state for dragon breeding.
 * Reference: boosts.js:8328-8459
 */
export interface DragonHatchlingsState {
  /** Array of clutch sizes (dragons per clutch) */
  clutches: number[];

  /** Flat array of properties for all clutches (7 stats per clutch) */
  properties: number[];

  /** Diet type for each clutch: 1=Goats, 2=Hatchlings, 3=Princesses */
  diet: number[];

  /** Maturity countdown for each clutch (mNP remaining) */
  maturity: number[];
}

/**
 * Dragon nest lining percentages.
 * Reference: boosts.js:8100-8212
 */
export interface DragonNestState {
  /** Lining percentages for each resource (0-100, must sum to 100) */
  lining: Record<DragonLiningResource, number>;
}

// =============================================================================
// Opponent Types
// =============================================================================

/**
 * Combat opponent definition.
 * Reference: dragons.js:200-402 (Molpy.Opponent and DefineOpponents)
 */
export interface OpponentDefinition {
  /** Unique identifier (0-14) */
  id: number;

  /** Opponent name */
  name: string;

  /**
   * Armed weapons list. First char has special meaning:
   * '-' = no article, '!' = "an", '+' = "the", '|' = "his/her", else "a"
   */
  armed: string[];

  /** Reward drop table: resource -> amount range or chance */
  reward: Record<string, string | number>;

  /** Base experience value (can be number or string like "1K") */
  exp: number | string;

  /** Defense modifier (higher = more defensive) */
  modifier?: number;
}

/**
 * Runtime opponent instance for combat.
 * Reference: dragons.js:816-824 (FindOpponents)
 */
export interface OpponentInstance {
  /** Source NP (where they came from) */
  from: number;

  /** Opponent type index */
  type: number;

  /** Number of opponents in group */
  numb: number;

  /** Gender for flavor text: 0 = male, 1 = female */
  gender: 0 | 1;

  /** Combat modifier */
  modifier: number;

  /** Target NP being attacked */
  target?: number;

  /** Knowledge flags for Dragonfly scouting */
  knowledge?: boolean[];
}

/**
 * Combat result outcomes.
 * Reference: dragons.js:965-1062 (switch on result)
 */
export type CombatResult =
  | -2    // Wipeout (total defeat)
  | -1    // Lost with dignity
  | -0.5  // Exhausted, ceded territory
  | 0     // Tie
  | 0.5   // Exhausted victory, lost 1 dragon
  | 1     // Pyrrhic victory (lost dragon, need recovery)
  | 2     // Hard victory (need recovery)
  | 3;    // Easy victory (no losses)

/**
 * Combat statistics for a single fight.
 */
export interface CombatStats {
  /** Combat result */
  result: CombatResult;

  /** Number of combat loops */
  loops: number;

  /** Dragon health remaining (negative = defeated) */
  dragonHealth: number;

  /** Opponent health remaining (negative = defeated) */
  opponentHealth: number;

  /** Recovery time required (mNP) */
  recoveryTime: number;

  /** Dragons lost */
  dragonsLost: number;

  /** Blitz value affecting outcome */
  blitzVal: number;
}

// =============================================================================
// Dragon System Aggregate State
// =============================================================================

/**
 * Complete dragon system state for tracking.
 * Reference: dragons.js:451-466 (global dragon variables)
 */
export interface DragonSystemState {
  /** Per-NP dragon data */
  npData: Map<number, NPData>;

  /** Dragon Queen state */
  queen: DragonQueenState;

  /** Hatchling breeding state */
  hatchlings: DragonHatchlingsState;

  /** Nest configuration */
  nest: DragonNestState;

  // Aggregate statistics (recalculated)
  /** Total dragons across all NPs */
  totalDragons: number;

  /** Number of NPs with dragons */
  totalNPsWithDragons: number;

  /** Highest NP number with dragons */
  highestNPwithDragons: number;

  /** Longest consecutive run of NPs with dragons */
  consecutiveNPsWithDragons: number;

  // Multipliers (recalculated from boosts)
  /** Digging rate multiplier */
  digMultiplier: number;

  /** Attack power multiplier */
  attackMultiplier: number;

  /** Defense power multiplier */
  defenceMultiplier: number;

  /** Breath attack multiplier */
  breathMultiplier: number;

  /** Luck bonus for drops and crits */
  luck: number;

  /** Hide duration modifier */
  hideMod: number;

  // Digging state
  /** Accumulated dig progress toward find */
  digValue: number;

  /** Combined dig rate from all dragons */
  digRate: number;

  /** Dig notification batching counter */
  digTime: number;

  /** Finds pending notification */
  diggingFinds: Record<string, number>;

  /** Whether recalculation is needed */
  recalcNeeded: boolean;
}
