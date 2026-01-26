/**
 * Glass Ceiling System
 *
 * Glass Ceilings provide powerful exponential multipliers to tool production rates.
 * Reference: boosts.js:3366-3490
 */

/**
 * State required for glass ceiling calculations
 */
export interface GlassCeilingState {
  /** Number of glass ceiling boosts owned (0-11) */
  ceilingsOwned: number[];

  /** Whether "WWB" (Wacky Waving Beanies) boost is owned */
  hasWWB: boolean;

  /** WWB boost bought level */
  wwbBought: number;

  /** Number of scaffolds owned */
  scaffoldAmount: number;

  /** Which glass ceilings are locked (for Tool Factory control) */
  lockedCeilings: Set<number>;
}

/**
 * Calculate total number of glass ceilings owned.
 * Reference: boosts.js:3413-3422
 */
export function calculateGlassCeilingCount(state: GlassCeilingState): number {
  let count = 0;
  for (let i = 0; i < 12; i++) {
    if (state.ceilingsOwned.includes(i)) {
      count++;
    }
  }
  return count;
}

/**
 * Calculate the glass ceiling multiplier.
 *
 * Base multiplier is 33 per ceiling, raised to the power of ceiling count.
 * With WWB (Wacky Waving Beanies), the base is multiplied by
 * 2^(WWB.bought-5) * Scaffolds.amount
 *
 * Formula: multiplier = base^count
 * Where base = 33 (or 33 * WWB_factor if WWB owned)
 *
 * Reference: boosts.js:3424-3430
 */
export function calculateGlassCeilingMultiplier(state: GlassCeilingState): number {
  let base = 33;

  if (state.hasWWB && state.wwbBought > 0) {
    const wwbFactor = Math.pow(2, state.wwbBought - 5) * state.scaffoldAmount;
    base *= wwbFactor;
  }

  const count = calculateGlassCeilingCount(state);
  return Math.pow(base, count);
}

/**
 * Check if a specific glass ceiling index is owned.
 */
export function hasGlassCeiling(state: GlassCeilingState, index: number): boolean {
  return state.ceilingsOwned.includes(index);
}

/**
 * Check if a glass ceiling is locked (for Tool Factory).
 */
export function isGlassCeilingLocked(state: GlassCeilingState, index: number): boolean {
  return state.lockedCeilings.has(index);
}

/**
 * Check if a glass ceiling can be toggled (locked/unlocked).
 *
 * Rules (before "Ceiling Broken" badge):
 * - Must own Glass Ceiling N
 * - Must own Glass Ceiling (N-1) OR N-1 must not exist
 * - All Glass Ceilings < (N-1) must NOT be owned
 *
 * After "Ceiling Broken" badge, all rules are lifted.
 *
 * Reference: boosts.js:3476-3490
 */
export function canToggleGlassCeiling(
  state: GlassCeilingState,
  index: number,
  ceilingBroken: boolean
): boolean {
  if (ceilingBroken) {
    return true; // All restrictions lifted
  }

  // Must own this ceiling
  if (!hasGlassCeiling(state, index)) {
    return false;
  }

  const prevIndex = index - 1;

  // If there's a previous ceiling
  if (prevIndex >= 0) {
    // Must own the previous ceiling
    if (!hasGlassCeiling(state, prevIndex)) {
      return false;
    }

    // All ceilings before prevIndex must NOT be owned
    for (let i = 0; i < prevIndex; i++) {
      if (hasGlassCeiling(state, i)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Glass ceiling mappings to tool types.
 * Reference: boosts.js:3363-3365, tools.js
 */
export const GLASS_CEILING_TOOL_MAP: Record<number, string> = {
  0: 'Bucket',      // Sand rate of buckets
  1: 'NewPixBot',   // Castles produced by NewPixBots
  2: 'Cuegan',      // Sand rate of Cuegans
  3: 'Trebuchet',   // Castles produced by Trebuchets
  4: 'Flag',        // Sand rate of Flags
  5: 'Scaffold',    // Castles produced by Scaffolds
  6: 'Ladder',      // Sand rate of Ladders
  7: 'Wave',        // Castles produced by Waves
  8: 'Bag',         // Sand rate of Bags
  9: 'River',       // Castles produced by Rivers
  10: 'LaPetite',   // Sand rate of LaPetite
  11: 'BeanieBuilder', // Castles produced by Beanie Builders
};

/**
 * Get the multiplier for a specific tool type based on glass ceilings.
 * Returns the glass ceiling multiplier if the corresponding ceiling is owned,
 * otherwise returns 1 (no effect).
 */
export function getGlassCeilingMultiplierForTool(
  state: GlassCeilingState,
  toolName: string
): number {
  // Find the ceiling index for this tool
  const ceilingIndex = Object.entries(GLASS_CEILING_TOOL_MAP).find(
    ([, name]) => name === toolName
  )?.[0];

  if (ceilingIndex === undefined) {
    return 1; // Tool not affected by glass ceilings
  }

  const index = parseInt(ceilingIndex);

  // Check if this ceiling is owned
  if (!hasGlassCeiling(state, index)) {
    return 1; // No multiplier
  }

  // Return the full glass ceiling multiplier
  return calculateGlassCeilingMultiplier(state);
}

/**
 * Badge thresholds for glass ceiling system.
 */
export const GLASS_CEILING_BADGES = {
  CEILING_BROKEN: 10,      // Requires 10+ glass ceilings
  CEILING_DISINTEGRATED: 12, // Requires all 12 glass ceilings
};
