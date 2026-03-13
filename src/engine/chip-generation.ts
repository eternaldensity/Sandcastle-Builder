/**
 * TF Chip Generation & Production Control.
 * Handles how Glass Chips flow into Tool Factory and PC upgrades.
 * Reference: boosts.js:5057-5131, 5153-5163, 5937-5949
 */

/** State for calculating chip generation rate per mNP */
export interface ChipRateState {
  sandToGlassBought: boolean;
  sandIsInfinite: boolean;
  sandToolChipRates: {
    amount: number;
    gpmNP: number;
    hasInfinitePrice: boolean;
  }[];
  glBought: boolean;
  glPower: number;
  cftBought: boolean;
  castlesGlobalMult: number;
}

/** State for calculating chips per beach click */
export interface ChipClickState {
  sandIsInfinite: boolean;
  bgBought: boolean;
  gmBought: boolean;
  boneClickerBought: boolean;
  bonemealLevel: number;
  boostsOwned: number;
  loadedPermNP: number;
}

/** State for manual chip loading */
export interface ManualLoadState {
  amount: number;
  glassChipsAvailable: number;
  tfBought: boolean;
  bucketAmount: number;
  newPixBotAmount: number;
  sandRateIsInfinite: boolean;
  castlesPowerIsInfinite: boolean;
}

/** State for PC control */
export interface PCControlState {
  currentPower: number;
  increment: number;
  glassBlocksAvailable: number;
  noSellPower: number;
  nopeBadgeEarned: boolean;
}

/** Result from chip rate calculation */
export interface ChipRateResult {
  rate: number;
  perToolRates: number[];
  globalMultiplier: number;
  badges: string[];
}

/** Badge thresholds for chip generation rate */
const CHIP_RATE_BADGES: [number, string][] = [
  [5000, 'Plain Potato Chips'],
  [20000, 'Crinkle Cut Chips'],
  [800000, 'BBQ Chips'],
  [4e6, 'Corn Chips'],
  [2e7, 'Sour Cream and Onion Chips'],
  [1e8, 'Cinnamon Apple Chips'],
  [3e9, 'Sweet Chili Chips'],
  [1e11, 'Banana Chips'],
  [5e12, 'Nuclear Fission Chips'],
  [6e14, 'Silicon Chips'],
  [1e19, 'Blue Poker Chips'],
];

/** Maximum PC power level */
export const PC_MAX_POWER = 6e51;

/** PC power threshold for "Nope!" badge */
export const PC_NOPE_THRESHOLD = 5e51;

/**
 * Calculate chip generation rate per mNP from sand tools.
 *
 * Only produces chips if "Sand to Glass" boost is owned AND Sand is infinite.
 * Each sand tool only produces chips if its price is infinite.
 *
 * Reference: boosts.js:5074-5114
 */
export function calculateChipRatePermNP(
  state: ChipRateState,
  previousRate: number = 0
): ChipRateResult {
  const result: ChipRateResult = {
    rate: 0,
    perToolRates: [],
    globalMultiplier: 1,
    badges: [],
  };

  // Must have Sand to Glass AND infinite sand
  if (!state.sandToGlassBought || !state.sandIsInfinite) {
    result.perToolRates = state.sandToolChipRates.map(() => 0);
    return result;
  }

  // Calculate per-tool rates
  let rawRate = 0;
  for (const tool of state.sandToolChipRates) {
    // Tool only contributes if its price is infinite
    const toolRate = tool.hasInfinitePrice
      ? (isFinite(tool.amount) ? tool.amount * tool.gpmNP : Infinity)
      : 0;
    result.perToolRates.push(toolRate);
    // Match legacy: += storedTotalGpmNP || 0
    rawRate += toolRate || 0;
  }

  // Calculate global multiplier
  let multiplier = 1;
  if (state.glBought) {
    multiplier *= state.glPower / 100;
  }
  if (state.cftBought) {
    multiplier *= state.castlesGlobalMult;
  }
  result.globalMultiplier = multiplier;

  result.rate = rawRate * multiplier;

  // Badge checks: only when rate increased
  if (result.rate > previousRate) {
    for (const [threshold, badge] of CHIP_RATE_BADGES) {
      if (result.rate >= threshold) {
        result.badges.push(badge);
      }
    }
  }

  return result;
}

/**
 * Calculate chips loaded per beach click.
 *
 * Requires Sand to be infinite AND BG (Booster Glass) boost.
 * Base = boostsOwned * 4
 * GM adds loadedPermNP / 20
 * Bone Clicker multiplies by bonemealLevel * 5
 *
 * Reference: boosts.js:5060-5072
 */
export function calculateChipsPerClick(state: ChipClickState): number {
  if (!state.sandIsInfinite || !state.bgBought) {
    return 0;
  }

  let chips = state.boostsOwned * 4;

  if (state.gmBought) {
    chips += state.loadedPermNP / 20;
  }

  if (state.boneClickerBought && state.bonemealLevel >= 1) {
    chips *= state.bonemealLevel * 5;
  }

  return chips;
}

/**
 * Calculate manual chip loading from GlassChips to TF.
 *
 * Reference: boosts.js:5153-5163
 */
export function calculateManualLoad(state: ManualLoadState): {
  chipsLoaded: number;
  unlocks: string[];
} {
  if (state.glassChipsAvailable < state.amount) {
    return { chipsLoaded: 0, unlocks: [] };
  }

  const unlocks: string[] = [];

  // Check Sand to Glass unlock: Bucket >= 7470 AND TF bought AND Sand rate infinite
  if (
    state.bucketAmount >= 7470 &&
    state.tfBought &&
    state.sandRateIsInfinite
  ) {
    unlocks.push('Sand to Glass');
  }

  // Check Castles to Glass unlock: NPB >= 1515 AND TF bought AND Castles power infinite
  if (
    state.newPixBotAmount >= 1515 &&
    state.tfBought &&
    state.castlesPowerIsInfinite
  ) {
    unlocks.push('Castles to Glass');
  }

  return { chipsLoaded: state.amount, unlocks };
}

/**
 * Calculate cost of PC (Production Control) adjustment.
 *
 * Increase cost = 1e6 * increment * currentPower
 * Decrease cost = 1e5 * abs(increment) * currentPower
 *
 * Reference: boosts.js:5937-5949
 */
export function calculatePCControlCost(state: PCControlState): number {
  const n = state.increment;
  let cost: number;
  if (n >= 0) {
    cost = 1e6 * n;
  } else {
    cost = -1e5 * n; // n is negative, so -1e5 * n is positive
  }
  cost *= state.currentPower;
  return cost;
}

/**
 * Check if PC can be controlled (increased or decreased).
 *
 * Cannot increase if Nope! badge earned (power > 5e51).
 * Cannot decrease if No Sell power is set.
 */
export function canControlPC(state: PCControlState): boolean {
  const cost = calculatePCControlCost(state);

  if (state.glassBlocksAvailable < cost) {
    return false;
  }

  if (state.increment > 0 && state.nopeBadgeEarned) {
    return false;
  }

  if (state.increment < 0 && state.noSellPower > 0) {
    return false;
  }

  return true;
}

/**
 * Calculate Papal boost factor.
 *
 * Returns 1 if decree name does not match the target.
 * If matching and decree value > 1: returns decreeValue * papalBoostFactor
 * If matching and decree value <= 1: returns decreeValue / papalBoostFactor
 *
 * Reference: boosts.js:10006-10008
 */
export function calculatePapal(
  decreeName: string,
  targetName: string,
  decreeValue: number,
  papalBoostFactor: number
): number {
  if (decreeName !== targetName) {
    return 1;
  }
  if (decreeValue > 1) {
    return decreeValue * papalBoostFactor;
  }
  return decreeValue / papalBoostFactor;
}
