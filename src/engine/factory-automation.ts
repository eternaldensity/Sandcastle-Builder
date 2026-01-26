/**
 * Factory Automation System
 *
 * Factory Automation (FA) is a complex endgame system that automatically processes boost effects.
 * It runs department boosts, mould creation/filling, blackprint construction, and more.
 *
 * This module exports pure calculation functions. The ModernEngine class integrates these
 * functions and provides the necessary state access.
 *
 * Reference: castle.js:3117-3185 (ActivateFactoryAutomation, FactoryAutomationRun, DoMouldWork)
 */

import type { BoostDefinition } from '../types/game-data.js';

/**
 * Factory Automation state for tracking runs and levels.
 */
export interface FactoryAutomationState {
  /** FA power level (0-10+) - determines how many runs can be activated */
  level: number;

  /** Number of FA runs activated this NP */
  runsThisNP: number;

  /** Whether Automation Optimiser (AO) is owned - allows mould work + standard tasks */
  hasAutomationOptimiser: boolean;

  /** Whether Mould Press is owned - allows mould looping with AO */
  hasMouldPress: boolean;

  /** Whether Cold Mould is enabled - prevents mould work */
  coldMouldEnabled: boolean;

  /** Whether Construction from Blackprints (CfB) is owned */
  hasBlackprintConstruction: boolean;

  /** Whether Double Department (DD) is owned - runs DoRD twice */
  hasDoubleDepartment: boolean;
}

/**
 * Result from calculating FA runs.
 */
export interface FactoryAutomationRunResult {
  /** Number of FA runs successfully activated */
  runs: number;

  /** Amount of sand spent on FA activation */
  sandSpent: number;

  /** Whether an industrial accident occurred */
  hadAccident: boolean;
}

/**
 * Calculate how many FA runs can be activated.
 *
 * Reference: castle.js:3117-3140
 *
 * The calculation is:
 * 1. Check for industrial accidents (random chance based on FA level and safety boosts)
 * 2. Cap runs to min(level, npbots / 20)
 * 3. Try to spend sand for each run (2M × 10000^i sand per run at level i)
 * 4. Return actual number of runs activated
 */
export function calculateFactoryAutomationRuns(
  faLevel: number,
  newPixBots: number,
  sandAvailable: number,
  hasSafetyPumpkin: boolean,
  hasSafetyGoggles: boolean,
  hasCracks: boolean,
  hasAlephOne: boolean
): FactoryAutomationRunResult {
  let level = faLevel + 1;

  // Industrial accident check (20% base, +10% per safety boost, -1% per FA level)
  // flandom(x) returns 0 with probability 1/x
  const safetyBonus = (hasSafetyPumpkin ? 10 : 0) + (hasSafetyGoggles ? 10 : 0);
  const accidentChance = 20 + safetyBonus - level;
  const hadAccident = accidentChance > 0 && Math.random() < 1 / accidentChance;

  // Cap level to 61 unless Cracks or Aleph One is enabled
  if (!hasCracks && !hasAlephOne) {
    level = Math.min(level, 61);
  }

  // Cap to available NewPixBots (need 20 bots per run)
  level = Math.max(0, Math.min(level, Math.floor(newPixBots / 20)));

  // Try to spend sand for each run (most expensive first)
  let runs = 0;
  let sandSpent = 0;

  for (let i = level - 1; i >= 0; i--) {
    const sandToSpend = 2000000 * Math.pow(10000, i);
    if (sandAvailable >= sandToSpend) {
      sandAvailable -= sandToSpend;
      sandSpent += sandToSpend;
      runs++;
    }
  }

  return { runs, sandSpent, hadAccident };
}

/**
 * Get list of boosts that can be unlocked by DoRD.
 *
 * Department boosts have department=1 flag in boost definitions.
 */
export function getDepartmentBoosts(
  boostDefs: Map<string, BoostDefinition>,
  unlockedBoosts: Set<string>
): string[] {
  const departmentBoosts: string[] = [];

  for (const [alias, def] of boostDefs) {
    if (def.department && !unlockedBoosts.has(alias)) {
      departmentBoosts.push(alias);
    }
  }

  return departmentBoosts;
}

/**
 * Calculate blast furnace conversion rate.
 *
 * Reference: castle.js:2851-2871
 */
export function calculateBlastFurnaceRate(
  hasFractalSandcastles: boolean,
  fractalPower: number,
  hasBlitzing: boolean,
  blitzingPower: number,
  hasBKJ: boolean
): number {
  let blastFactor = 1000;

  if (hasFractalSandcastles) {
    blastFactor = 1000 * Math.pow(0.94, fractalPower);

    if (hasBlitzing && hasBKJ) {
      blastFactor /= Math.max(1, (blitzingPower - 800) / 600);
    }
    if (hasBlitzing) {
      blastFactor /= 2;
    }

    // Apply minimum AFTER all modifiers (reference: castle.js:2854)
    blastFactor = Math.max(5, blastFactor);
  }

  return blastFactor;
}

/**
 * Calculate sand cost for making a sand mould.
 *
 * Reference: boosts.js:4350
 */
export function calculateSandMouldCost(
  discoveryNP: number,
  hasMinusWorlds: boolean
): number {
  let cost = Math.abs(discoveryNP) * 100;
  if (discoveryNP < 0 && hasMinusWorlds) {
    cost = cost * cost;
  }
  return cost;
}

/**
 * Calculate glass chip cost for making a glass mould.
 *
 * Reference: boosts.js:4390
 */
export function calculateGlassMouldCost(
  monumentNP: number,
  hasMinusWorlds: boolean
): number {
  let cost = 1000 * Math.pow(1.01, Math.abs(monumentNP));
  if (monumentNP < 0 && hasMinusWorlds) {
    cost = cost * cost;
  }
  return cost;
}

/**
 * Calculate sand cost per run for filling a sand mould.
 *
 * Reference: boosts.js:4429
 */
export function calculateSandMouldFillCost(
  discoveryNP: number,
  hasMinusWorlds: boolean
): number {
  let cost = 100 * Math.pow(1.2, Math.abs(discoveryNP));
  if (discoveryNP < 0 && hasMinusWorlds) {
    cost = cost * cost;
  }
  return cost;
}

/**
 * Calculate glass block cost per run for filling a glass mould.
 *
 * Reference: boosts.js:4475
 */
export function calculateGlassMouldFillCost(
  monumentNP: number,
  hasMinusWorlds: boolean
): number {
  let cost = 1000000 * Math.pow(1.02, Math.abs(monumentNP));
  if (monumentNP < 0 && hasMinusWorlds) {
    cost = cost * cost;
  }
  return cost;
}

/**
 * FA upgrade costs (NewPixBots required per level).
 *
 * Reference: boosts.js:2933-2935
 */
export const FA_UPGRADE_COSTS = [
  100, // Level 1
  200, // Level 2
  400, // Level 3
  800, // Level 4
  1600, // Level 5
  3200, // Level 6
  6400, // Level 7
  12800, // Level 8
  25600, // Level 9
  51200, // Level 10
];

/**
 * Check if FA can be upgraded.
 */
export function canUpgradeFactoryAutomation(
  currentLevel: number,
  newPixBots: number,
  hasDoublepost: boolean,
  npLength: number
): boolean {
  if (!hasDoublepost || npLength <= 1800) return false;
  if (currentLevel >= FA_UPGRADE_COSTS.length) return false;

  return newPixBots >= FA_UPGRADE_COSTS[currentLevel];
}

/**
 * Mould work requires specific run counts:
 * - Make Sand Mould (SMM): 100 runs
 * - Fill Sand Mould (SMF): 200 runs
 * - Make Glass Mould (GMM): 400 runs
 * - Fill Glass Mould (GMF): 800 runs
 */
export const MOULD_RUN_REQUIREMENTS = {
  SMM: 100,
  SMF: 200,
  GMM: 400,
  GMF: 800,
} as const;
