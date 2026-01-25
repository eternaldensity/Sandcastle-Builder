/**
 * Sandcastle Builder Game Data Types
 *
 * These types define the static game data (boosts, badges, tools)
 * extracted from the legacy codebase for use in the modern implementation.
 */

// =============================================================================
// Resource Types
// =============================================================================

/** Currency/resource identifiers used in prices and costs */
export type ResourceId =
  | 'Sand'
  | 'Castles'
  | 'GlassChips'
  | 'GlassBlocks'
  | 'Goats'
  | 'Bonemeal'
  | 'Mustard'
  | 'FluxCrystals'
  | 'Logicat'
  | 'Blackprints'
  | 'Vacuum'
  | 'QQ'
  | 'Diamonds'
  | 'Maps';

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
