/**
 * GameEngine Interface
 *
 * Common interface that both the Legacy and Modern engines must implement
 * to enable automated parity testing.
 */

import type { BoostState, ToolState } from '../types/game-data.js';

/**
 * Snapshot of game state for comparison
 */
export interface GameStateSnapshot {
  /** Save format version */
  version: number;

  /** Current newpix number (game time) */
  newpixNumber: number;

  /** Current sand amount */
  sand: number;

  /** Current castles amount */
  castles: number;

  /** Glass chips */
  glassChips: number;

  /** Glass blocks */
  glassBlocks: number;

  /** Total beach clicks */
  beachClicks: number;

  /** Ninja-free ONG count */
  ninjaFreeCount: number;

  /** Current ninja stealth */
  ninjaStealth: number;

  /** Whether currently ninjad */
  ninjad: boolean;

  /** Sand tool states by name */
  sandTools: Record<string, ToolState>;

  /** Castle tool states by name */
  castleTools: Record<string, ToolState>;

  /** Boost states by alias */
  boosts: Record<string, BoostState>;

  /** Badge earned states by name */
  badges: Record<string, boolean>;
}

/**
 * Action types for test sequences
 */
export type TestAction =
  | { type: 'click'; target: 'beach'; count?: number }
  | { type: 'tick'; count?: number }
  | { type: 'wait'; ticks: number }
  | { type: 'ong' }
  | { type: 'buy-tool'; toolType: 'sand' | 'castle'; toolName: string; count?: number }
  | { type: 'buy-boost'; boostAlias: string }
  | { type: 'toggle-boost'; boostAlias: string }
  | { type: 'set-newpix'; np: number };

/**
 * Common interface for both legacy and modern game engines.
 * Enables running the same tests against both implementations.
 */
export interface GameEngine {
  /**
   * Initialize the engine. Must be called before any other methods.
   */
  initialize(): Promise<void>;

  /**
   * Clean up resources. Call when done with the engine.
   */
  dispose(): Promise<void>;

  /**
   * Load game state from a serialized save string.
   * @param serialized - The save string (legacy format)
   */
  loadState(serialized: string): Promise<void>;

  /**
   * Export current game state to a serialized save string.
   * @returns The save string (legacy format)
   */
  exportState(): Promise<string>;

  /**
   * Get a snapshot of current game state for comparison.
   */
  getStateSnapshot(): Promise<GameStateSnapshot>;

  /**
   * Advance the game by a number of ticks (Loopist calls).
   * @param count - Number of ticks to advance (default: 1)
   */
  tick(count?: number): Promise<void>;

  /**
   * Advance time to trigger an ONG (newpix transition).
   */
  advanceToONG(): Promise<void>;

  /**
   * Set the current newpix number directly.
   * @param np - The newpix number to set
   */
  setNewpix(np: number): Promise<void>;

  /**
   * Simulate beach clicks.
   * @param count - Number of clicks (default: 1)
   */
  clickBeach(count?: number): Promise<void>;

  /**
   * Buy a sand or castle tool.
   * @param type - Tool type
   * @param name - Tool name (e.g., "Bucket", "Flag")
   * @param count - Number to buy (default: 1)
   */
  buyTool(type: 'sand' | 'castle', name: string, count?: number): Promise<void>;

  /**
   * Buy/unlock a boost.
   * @param alias - Boost alias
   */
  buyBoost(alias: string): Promise<void>;

  /**
   * Toggle a boost on/off.
   * @param alias - Boost alias
   */
  toggleBoost(alias: string): Promise<void>;

  /**
   * Get the current sand production rate per tick.
   */
  getSandRate(): Promise<number>;

  /**
   * Get the current castle production rate per tick.
   */
  getCastleRate(): Promise<number>;

  /**
   * Get boost state by alias.
   */
  getBoostState(alias: string): Promise<BoostState>;

  /**
   * Check if a badge has been earned.
   */
  getBadgeState(name: string): Promise<boolean>;

  /**
   * Execute a test action.
   */
  executeAction(action: TestAction): Promise<void>;
}

/**
 * Result of comparing two game states
 */
export interface StateDifference {
  /** Path to the differing value (e.g., "boosts.Sand.power") */
  path: string;

  /** Value in the legacy engine */
  legacy: unknown;

  /** Value in the modern engine */
  modern: unknown;

  /** Severity of the difference */
  severity: 'critical' | 'important' | 'cosmetic';
}

/**
 * Result of a parity test
 */
export interface ParityResult {
  /** Whether all critical comparisons passed */
  passed: boolean;

  /** List of all differences found */
  differences: StateDifference[];

  /** Counts by severity */
  counts: {
    critical: number;
    important: number;
    cosmetic: number;
  };
}
