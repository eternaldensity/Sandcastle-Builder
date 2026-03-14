/**
 * Monument System - Pure functions for monument creation through moulds.
 *
 * Monuments are created from discoveries through a multi-step process:
 * 1. Discovery -> Sand Monument (via Sand Mould Maker + Sand Mould Filler)
 * 2. Sand Monument -> Glass Monument (via Glass Mould Maker + Glass Mould Filler)
 * 3. Glass Monument -> Diamond Masterpiece (via Diamond Mould Maker + Filler)
 *
 * Each step requires:
 * - A "maker" boost that creates a mould (progress tracked in boost.power)
 * - A "filler" boost that fills the mould with resources
 * - Multiple Factory Automation (FA) runs to complete
 *
 * State is stored in boost.extra: { Making: number (NP being made) }
 * Progress is stored in boost.power: 0 = idle, 1-threshold = in progress, >threshold = complete
 */

import type { BoostState } from '../types/game-data.js';

/**
 * Resources that monument operations can consume.
 */
export interface MonumentResources {
  sand: number;
  glassChips: number;
  glassBlocks: number;
}

/**
 * State needed for monument operations.
 */
export interface MonumentState {
  /** Badge lookup: has badge key, is it earned */
  badges: Map<string, boolean>;
  /** Boost lookup by alias */
  boosts: Map<string, BoostState>;
  /** Mutable resources */
  resources: MonumentResources;
  /** Callback to earn a badge */
  earnBadge: (alias: string) => void;
  /** Check if a boost is bought */
  hasBoost: (alias: string) => boolean;
}

// =============================================================================
// Sand Mould Operations
// =============================================================================

/**
 * Start making a sand mould from a discovery.
 * Reference: boosts.js:4538-4568
 */
export function startSandMould(state: MonumentState, np: number): void {
  const mname = `monums${np}`;

  if (!state.badges.has(mname)) {
    return; // No such mould exists
  }

  if (state.badges.get(mname)) {
    return; // Don't need to make this mould
  }

  const smm = state.boosts.get('SMM');
  const smf = state.boosts.get('SMF');

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
 * @returns Remaining FA runs
 */
export function processSandMouldMaking(state: MonumentState, runs: number): number {
  const smm = state.boosts.get('SMM');
  if (!smm || smm.power === 0 || smm.power > 100) {
    return runs; // Not making, or already complete
  }

  const np = (smm.extra?.Making as number) ?? 0;
  let chipsPerRun = np * 100;
  if (chipsPerRun < 0) chipsPerRun *= chipsPerRun; // Square if negative

  while (runs > 0) {
    if (state.resources.glassChips < chipsPerRun) {
      return runs; // Not enough glass chips
    }

    state.resources.glassChips -= chipsPerRun;
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
export function startSandMouldFill(state: MonumentState, np: number): void {
  const mname = `monums${np}`;
  const smm = state.boosts.get('SMM');
  const smf = state.boosts.get('SMF');

  if (!state.badges.has(mname)) {
    // Reset SMM if it was making this invalid mould
    if (smm && smm.extra?.Making === np) {
      smm.power = 0;
      if (smm.extra) smm.extra.Making = 0;
    }
    return;
  }

  if (state.badges.get(mname)) {
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
 * @returns Remaining FA runs
 */
export function processSandMouldFilling(state: MonumentState, runs: number): number {
  const smf = state.boosts.get('SMF');
  if (!smf || smf.power === 0) {
    return runs; // Not filling
  }

  const np = (smf.extra?.Making as number) ?? 0;
  const sandPerRun = Math.pow(1.2, Math.abs(np)) * 100;
  const sandToSpend = np < 0 ? sandPerRun * sandPerRun : sandPerRun;

  while (runs > 0) {
    if (state.resources.sand < sandToSpend) {
      return runs; // Not enough sand
    }

    state.resources.sand -= sandToSpend;
    runs--;
    smf.power++;

    if (smf.power > 200) {
      // Sand mould filling complete - earn the badge
      const alias = `monums${np}`;
      state.earnBadge(alias);

      // Clear filler state
      if (smf.extra) smf.extra.Making = 0;
      smf.power = 0;
      return runs;
    }
  }

  return runs;
}

// =============================================================================
// Glass Mould Operations
// =============================================================================

/**
 * Start making a glass mould from a sand monument.
 * Reference: boosts.js:4670-4700
 */
export function startGlassMould(state: MonumentState, np: number): void {
  const mname = `monumg${np}`;
  const gmm = state.boosts.get('GMM');
  const gmf = state.boosts.get('GMF');

  if (!state.badges.has(mname)) {
    return; // No such mould exists
  }

  if (state.badges.get(mname)) {
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
 * @returns Remaining FA runs
 */
export function processGlassMouldMaking(state: MonumentState, runs: number): number {
  const gmm = state.boosts.get('GMM');
  if (!gmm || gmm.power === 0 || gmm.power > 400) {
    return runs; // Not making, or already complete
  }

  const np = (gmm.extra?.Making as number) ?? 0;
  const baseChips = Math.pow(1.01, Math.abs(np)) * 1000;
  const chipsPerRun = np < 0 ? baseChips * baseChips : baseChips;

  while (runs > 0) {
    if (state.resources.glassChips < chipsPerRun) {
      return runs; // Not enough glass chips
    }

    state.resources.glassChips -= chipsPerRun;
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
export function startGlassMouldFill(state: MonumentState, np: number): void {
  const mname = `monumg${np}`;
  const gmm = state.boosts.get('GMM');
  const gmf = state.boosts.get('GMF');

  if (!state.badges.has(mname)) {
    // Reset GMM if it was making this invalid mould
    if (gmm && gmm.extra?.Making === np) {
      gmm.power = 0;
      if (gmm.extra) gmm.extra.Making = 0;
    }
    return;
  }

  if (state.badges.get(mname)) {
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
 * @returns Remaining FA runs
 */
export function processGlassMouldFilling(state: MonumentState, runs: number): number {
  const gmf = state.boosts.get('GMF');
  if (!gmf || gmf.power === 0) {
    return runs; // Not filling
  }

  const np = (gmf.extra?.Making as number) ?? 0;
  const baseGlass = Math.pow(1.02, Math.abs(np)) * 1000000;
  const glassToSpend = np < 0 ? baseGlass * baseGlass : baseGlass;

  while (runs > 0) {
    if (state.resources.glassBlocks < glassToSpend) {
      return runs; // Not enough glass blocks
    }

    state.resources.glassBlocks -= glassToSpend;
    runs--;
    gmf.power++;

    if (gmf.power > 800) {
      // Glass mould filling complete - earn the badge
      const alias = `monumg${np}`;
      state.earnBadge(alias);

      // Clear filler state
      if (gmf.extra) gmf.extra.Making = 0;
      gmf.power = 0;
      return runs;
    }
  }

  return runs;
}

// =============================================================================
// Combined Mould Processing
// =============================================================================

/**
 * Process all mould work during Factory Automation.
 * Called during tick processing when Factory Automation is active.
 * Reference: castle.js:3166-3185
 * @returns Remaining FA runs after all mould work
 */
export function processAllMouldWork(state: MonumentState, runs: number): number {
  // Check if Cold Mould is enabled (disables mould work)
  const coldMould = state.boosts.get('Cold Mould');
  if (coldMould && coldMould.power > 0) {
    return runs; // Cold Mould disables mould work
  }

  // Process in order: Fill Glass -> Make Glass -> Fill Sand -> Make Sand
  // This order ensures moulds can be filled before new ones start
  if (runs > 0) runs = processGlassMouldFilling(state, runs);
  if (runs > 0) runs = processGlassMouldMaking(state, runs);
  if (runs > 0) runs = processSandMouldFilling(state, runs);
  if (runs > 0) runs = processSandMouldMaking(state, runs);

  // Mould Press: If AO + Mould Press, repeat mould work until no progress
  // Reference: castle.js:3173-3182
  if (state.hasBoost('AO') && state.hasBoost('MouldPress')) {
    while (runs > 0) {
      const start = runs;
      if (runs > 0) runs = processGlassMouldFilling(state, runs);
      if (runs > 0) runs = processGlassMouldMaking(state, runs);
      if (runs > 0) runs = processSandMouldFilling(state, runs);
      if (runs > 0) runs = processSandMouldMaking(state, runs);
      if (start === runs) break; // No progress made, exit loop
    }
  }

  return runs;
}
