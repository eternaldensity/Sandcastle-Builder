/**
 * Blackprints Construction System
 *
 * Blackprints are a mid-to-late game currency earned through Factory Automation (Milo/Locked Crate/Locked Vault).
 * They're spent to construct powerful boosts in a deterministic order via FA runs.
 *
 * Reference: boosts.js:4127-4340, 4252-4276, 2962-2996
 * Reference: castle.js:3149-3164 (FactoryAutomationRun orchestration)
 */

/**
 * Blackprint page costs for each constructible boost.
 * Reference: boosts.js:4314-4338
 */
export const BLACKPRINT_COSTS: Record<string, number> = {
  SMM: 10,
  SMF: 15,
  GMM: 25,
  GMF: 30,
  TFLL: 80,
  AO: 150,
  AA: 200,
  AE: 60,
  BG: 120,
  Bacon: 40,
  SG: 5,
  Milo: 120,
  ZK: 220,
  VS: 5000,
  CFT: 40000,
  BoH: 90000,
  VV: 750000,
  Nest: 5e12,
  DMM: Infinity,
  DMF: Infinity,
  DMC: Infinity,
  DMB: Infinity,
  DMP: Infinity,
};

/**
 * Deterministic construction order for blackprint boosts.
 * Reference: boosts.js:4340
 */
export const BLACKPRINT_ORDER: string[] = [
  'SMM', 'SMF', 'GMM', 'GMF', 'TFLL', 'AO', 'AA', 'AE',
  'BG', 'Bacon', 'SG', 'Milo', 'ZK', 'VS', 'CFT', 'BoH',
  'VV', 'Nest', 'DMM', 'DMF', 'DMC', 'DMB', 'DMP',
];

/**
 * State needed to check blackprint construction prerequisites.
 */
export interface BlackprintPrereqState {
  hasBadge: (badge: string) => boolean;
  hasBoost: (alias: string) => boolean;
  getBoostPower: (alias: string) => number;
  getBoostBought: (alias: string) => number;
  aaRuns: number;
  redactedClicks: number;
}

/**
 * Check if a blackprint subject's prerequisites are met.
 * Some boosts have special conditions beyond just having enough pages.
 *
 * Reference: boosts.js:4217-4238
 */
export function checkBlackprintPrereqs(subject: string, state: BlackprintPrereqState): boolean {
  switch (subject) {
    case 'CFT':
      return state.hasBadge('Minus Worlds');
    case 'VS':
      return state.getBoostPower('Vacuum') >= 2;
    case 'VV':
      return state.hasBoost('VS');
    case 'BoH':
      return state.getBoostPower('Goats') >= 400;
    case 'Nest':
      return state.hasBoost('DNS') && state.hasBadge('Domain Name Server');
    case 'ZK':
      return state.aaRuns >= 21 && state.redactedClicks >= 2500;
    case 'DMM':
    case 'DMF':
    case 'DMC':
    case 'DMB':
    case 'DMP':
      return state.hasBoost('Nest');
    default:
      return true;
  }
}

/**
 * Get the next boost that can be constructed from blackprints.
 * Returns the first boost in BLACKPRINT_ORDER that:
 * 1. Is not yet bought
 * 2. Has enough blackprint pages available
 * 3. Meets any special prerequisites
 *
 * Reference: boosts.js:4217-4238 (GetBlackprintSubject)
 */
export function getBlackprintSubject(
  blackprintPages: number,
  boughtBoosts: Set<string>,
  prereqState: BlackprintPrereqState
): string | null {
  for (const subject of BLACKPRINT_ORDER) {
    if (boughtBoosts.has(subject)) continue;

    const cost = BLACKPRINT_COSTS[subject];
    if (blackprintPages < cost) continue;

    if (!checkBlackprintPrereqs(subject, prereqState)) continue;

    return subject;
  }
  return null;
}

/**
 * State for tracking blackprint construction progress.
 */
export interface BlackprintConstructionState {
  /** Whether "Constructing from Blackprints" (CfB) boost is active */
  isConstructing: boolean;
  /** Current construction subject boost alias */
  constructionSubject: string | null;
  /** FA runs accumulated toward current construction */
  constructionProgress: number;
  /** Total FA runs needed for current construction */
  constructionTarget: number;
}

/**
 * Calculate the number of FA runs required to complete construction.
 * Base is blackprintCosts[subject], but capped at 40 if AE+AA not both owned AND cost < 1000.
 * Multiply by 10 for total runs needed.
 *
 * Reference: boosts.js:2992-2996 (LimitConstructionRuns)
 */
export function calculateConstructionRuns(
  subject: string,
  hasAE: boolean,
  hasAA: boolean
): number {
  const baseCost = BLACKPRINT_COSTS[subject];
  if (!isFinite(baseCost)) return Infinity;

  let runs = baseCost;

  // Cap at 40 if missing AE+AA and cost < 1000
  if (!(hasAE && hasAA) && baseCost < 1000) {
    runs = Math.min(runs, 40);
  }

  return runs * 10;
}

/**
 * Result from processing blackprint construction during an FA run.
 */
export interface BlackprintConstructionResult {
  /** Whether construction completed this run */
  completed: boolean;
  /** The boost that was constructed (if completed) */
  completedBoost: string | null;
  /** Remaining FA runs not consumed by construction */
  remainingRuns: number;
  /** Updated construction progress */
  progress: number;
}

/**
 * Process blackprint construction during Factory Automation runs.
 * Each FA run adds `times` to CfB progress. When progress reaches the target,
 * construction completes and the boost is unlocked.
 *
 * Reference: boosts.js:4258-4276 (DoBlackprintConstruction)
 *
 * @param faRuns - Number of FA runs available this tick
 * @param currentProgress - Current construction progress (CfB power)
 * @param target - Total runs needed (from calculateConstructionRuns)
 * @param subject - Boost alias being constructed
 * @param hasHubbleDouble - Whether Hubble Double boost is owned (1% chance to double progress)
 * @returns Construction result
 */
export function processBlackprintConstruction(
  faRuns: number,
  currentProgress: number,
  target: number,
  subject: string,
  hasHubbleDouble: boolean
): BlackprintConstructionResult {
  let progress = currentProgress;
  let runsUsed = faRuns;

  // Apply Hubble Double: 1% chance to double progress per run
  if (hasHubbleDouble && Math.random() < 0.01) {
    runsUsed *= 2;
  }

  progress += runsUsed;

  if (progress >= target) {
    // Construction complete
    const remaining = progress - target;
    return {
      completed: true,
      completedBoost: subject,
      remainingRuns: remaining,
      progress: 0,
    };
  }

  return {
    completed: false,
    completedBoost: null,
    remainingRuns: 0,
    progress,
  };
}

/**
 * Blackprint generation from Milo (Mysterious Representations) during FA.
 * Generates 1 blackprint page per 100 MR power accumulated.
 * Modified by Void Starer multiplier and Rush Job (5x).
 *
 * Reference: boosts.js:5345-5355
 */
export function calculateMiloBlackprints(
  mrPower: number,
  faRuns: number,
  hasRushJob: boolean,
  voidStareMultiplier: number,
  papalBlackP: number
): { pages: number; remainingPower: number } {
  const accumulated = mrPower + faRuns;
  let pages = Math.floor(accumulated / 100);
  const remainingPower = accumulated % 100;

  if (pages > 0) {
    // Apply Rush Job multiplier
    if (hasRushJob) {
      pages *= 5;
    }

    // Apply Void Starer multiplier
    pages = Math.floor(pages * voidStareMultiplier);

    // Apply Papal multiplier
    pages = Math.floor(pages * papalBlackP);
  }

  return { pages, remainingPower };
}

/**
 * Blackprint generation from Locked Crate.
 * Generates `bought` pages when crate is opened.
 *
 * Reference: boosts.js:3793
 */
export function calculateLockedCrateBlackprints(
  crateBought: number,
  papalBlackP: number
): number {
  return Math.floor(crateBought * papalBlackP);
}

/**
 * Blackprint generation from Locked Vault.
 * Uses sigma-stacking formula: pages = lv.power * times + times*(times+1)/2
 * Modified by Void Vault (VV) and Papal multiplier.
 *
 * Reference: boosts.js:7081-7094
 */
export function calculateLockedVaultBlackprints(
  vaultPower: number,
  openTimes: number,
  voidVaultMultiplier: number,
  papalBlackP: number
): number {
  // Sigma-stacking: base + triangular number
  let pages = vaultPower * openTimes + openTimes * (openTimes + 1) / 2;

  // Apply Void Vault multiplier (same as Void Starer formula)
  pages = Math.floor(pages * voidVaultMultiplier);

  // Apply Papal multiplier
  pages = Math.floor(pages * papalBlackP);

  return pages;
}

/**
 * Get the number of blackprint pages currently available for construction.
 * Accounts for pages "reserved" by active construction.
 *
 * Reference: boosts.js:4133-4143
 */
export function getAvailableBlackprints(
  totalPages: number,
  isConstructing: boolean,
  constructionSubject: string | null
): number {
  if (!isConstructing || !constructionSubject) return totalPages;

  const reservedCost = BLACKPRINT_COSTS[constructionSubject] ?? 0;
  return totalPages - reservedCost;
}
