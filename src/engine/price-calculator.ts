/**
 * Price Calculator - Extracts and implements price calculation formulas
 *
 * This module contains pure functions for calculating prices of tools and boosts
 * in Sandcastle Builder. All formulas are derived from the legacy code and tested
 * for parity.
 *
 * Key formulas:
 * - Sand tools: basePrice * (1.1 ^ amount) * priceFactor
 * - Castle tools: Fibonacci sequence with price0/price1 seeds
 * - Boosts: floor(priceFactor * price) for each resource
 */

import type { Price, PriceValue, ResourceId } from '../types/game-data.js';

// =============================================================================
// Number Parsing (DeMolpify equivalent)
// =============================================================================

/**
 * Postfix multipliers for parsing abbreviated numbers like "1.5M" or "2WQ"
 * Matches legacy postfixes array in redundancy.js
 */
const POSTFIXES: Record<string, number> = {
  'Q': 1e210,  // Quita
  'W': 1e42,   // Wololo
  'L': 1e39,   // Lotta
  'F': 1e36,   // Ferro
  'H': 1e33,   // Helo
  'S': 1e30,   // Squilli
  'U': 1e27,   // Umpty
  'Y': 1e24,   // Yotta
  'Z': 1e21,   // Zeta
  'E': 1e18,   // Exa
  'P': 1e15,   // Peta
  'T': 1e12,   // Tera
  'G': 1e9,    // Giga
  'M': 1e6,    // Mega
  'K': 1e3,    // Kilo
};

/**
 * Parse a potentially abbreviated number string (like "1.5M" or "2WQ")
 * Equivalent to legacy DeMolpify function.
 *
 * @param value - Number string to parse
 * @returns Parsed numeric value
 */
export function parsePriceValue(value: PriceValue): number {
  if (typeof value === 'number') {
    return value;
  }

  if (!value || value.length === 0) {
    return 0;
  }

  const lastChar = value.slice(-1).toUpperCase();

  // Check if last character is a postfix
  if (lastChar in POSTFIXES) {
    const baseValue = parsePriceValue(value.slice(0, -1));
    return baseValue * POSTFIXES[lastChar];
  }

  // Check if last character is non-numeric but not a known postfix
  if (isNaN(parseFloat(lastChar))) {
    // Unknown character, strip it and continue
    return parsePriceValue(value.slice(0, -1));
  }

  // Parse as regular number
  return parseFloat(value) || 0;
}

// =============================================================================
// Sand Tool Price Calculation
// =============================================================================

/**
 * The sand tool price factor (1.1) - exponential growth rate per tool owned
 * From castle.js:530 - Molpy.sandToolPriceFactor = 1.1
 */
export const SAND_TOOL_PRICE_FACTOR = 1.1;

/**
 * Calculate the price of a sand tool.
 *
 * Formula: basePrice * (1.1 ^ amount)
 * Reference: castle.js:698-702
 *
 * Note: This is the base price before priceFactor is applied.
 * The actual purchase price is: floor(this * priceFactor)
 *
 * @param basePrice - Base price of the tool (from tool definition)
 * @param amount - Current number of tools owned
 * @returns Price in castles (not sand - sand tools cost castles!)
 */
export function calculateSandToolPrice(basePrice: number, amount: number): number {
  // From castle.js:699-702
  // Infinity check at >9000 tools
  if (amount > 9000) {
    return Infinity;
  }

  return Math.floor(basePrice * Math.pow(SAND_TOOL_PRICE_FACTOR, amount));
}

/**
 * Calculate sand tool price with priceFactor applied.
 * This is the actual cost to purchase.
 *
 * Formula: floor(priceFactor * basePrice * (1.1 ^ amount))
 * Reference: castle.js:687
 *
 * @param basePrice - Base price of the tool
 * @param amount - Current number owned
 * @param priceFactor - Current price factor (1 = normal, <1 = discount)
 * @returns Actual purchase price in castles
 */
export function calculateSandToolPurchasePrice(
  basePrice: number,
  amount: number,
  priceFactor: number
): number {
  const baseCalculatedPrice = calculateSandToolPrice(basePrice, amount);
  return Math.floor(priceFactor * baseCalculatedPrice);
}

// =============================================================================
// Castle Tool Price Calculation (Fibonacci Sequence)
// =============================================================================

/**
 * Castle tool price state for Fibonacci sequence tracking.
 * Each castle tool has price0 and price1 seeds that determine the sequence.
 */
export interface CastleToolPriceState {
  /** Previous price in sequence */
  prevPrice: number;
  /** Next price in sequence */
  nextPrice: number;
  /** Current price (sum of prev + next) */
  price: number;
}

/**
 * Calculate castle tool price using Fibonacci-like sequence.
 *
 * The sequence is: p[n] = p[n-1] + p[n-2]
 * Starting from price0 and price1 seeds.
 *
 * Reference: castle.js:1076-1097 (CastleTool.findPrice)
 *
 * @param price0 - First seed value (from tool definition)
 * @param price1 - Second seed value (from tool definition)
 * @param amount - Current number of tools owned
 * @returns Price state with prevPrice, nextPrice, and current price
 */
export function calculateCastleToolPrice(
  price0: number,
  price1: number,
  amount: number
): CastleToolPriceState {
  // From castle.js:1082-1086 - don't bother calculating if >1500 tools
  if (amount > 1500) {
    return {
      prevPrice: Infinity,
      nextPrice: Infinity,
      price: Infinity,
    };
  }

  // Initialize sequence from seeds
  let prevPrice = price0;
  let nextPrice = price1;
  let p = prevPrice + nextPrice;

  // Advance sequence 'amount' times
  // From castle.js:1091-1095
  let i = amount;
  while (i-- > 0) {
    prevPrice = nextPrice;
    nextPrice = p;
    p = prevPrice + nextPrice;
  }

  return {
    prevPrice,
    nextPrice,
    price: p,
  };
}

/**
 * Calculate castle tool purchase price with priceFactor applied.
 *
 * Formula: floor(priceFactor * fibonacciPrice)
 * Reference: castle.js:909
 *
 * @param price0 - First seed value
 * @param price1 - Second seed value
 * @param amount - Current number owned
 * @param priceFactor - Current price factor
 * @returns Actual purchase price in castles
 */
export function calculateCastleToolPurchasePrice(
  price0: number,
  price1: number,
  amount: number,
  priceFactor: number
): number {
  const { price } = calculateCastleToolPrice(price0, price1, amount);
  return Math.floor(priceFactor * price);
}

// =============================================================================
// Boost Price Calculation
// =============================================================================

/**
 * Calculate the actual price of a boost after applying priceFactor.
 *
 * Formula: For each resource, floor(priceFactor * basePrice)
 * Reference: castle.js:1531-1542 (Boost.CalcPrice)
 *
 * @param basePrice - Base price object (resource -> amount mapping)
 * @param priceFactor - Current price factor (1 = normal, <1 = discount)
 * @returns Calculated price object with all values floored
 */
export function calculateBoostPrice(
  basePrice: Price,
  priceFactor: number
): Record<ResourceId, number> {
  const result: Partial<Record<ResourceId, number>> = {};

  for (const [resource, amount] of Object.entries(basePrice)) {
    if (amount === undefined) continue;

    // Parse the amount (could be string like "1.5M")
    const numericAmount = parsePriceValue(amount);

    // Apply priceFactor and floor
    // From castle.js:1534
    const finalPrice = Math.floor(priceFactor * numericAmount);

    // Only include non-zero prices (castle.js:1539)
    if (finalPrice > 0 && !isNaN(finalPrice)) {
      result[resource as ResourceId] = finalPrice;
    }
  }

  return result as Record<ResourceId, number>;
}

/**
 * Check if a price is effectively free (all costs are 0 or missing).
 * Equivalent to legacy Molpy.IsFree()
 *
 * @param price - Price object to check
 * @returns True if the price is free
 */
export function isPriceFree(price: Record<string, number>): boolean {
  for (const amount of Object.values(price)) {
    if (amount > 0) {
      return false;
    }
  }
  return true;
}

// =============================================================================
// Price Factor Calculation
// =============================================================================

/**
 * State needed to calculate priceFactor.
 */
export interface PriceFactorState {
  /** Whether ASHF boost is active (bought and not expired) */
  hasASHF: boolean;
  /** ASHF power value (discount percentage, e.g., 0.4 = 40% off) */
  ashfPower: number;
  /** Whether Family Discount boost is owned */
  hasFamilyDiscount: boolean;
}

/**
 * Calculate the current price factor based on active discounts.
 *
 * Formula:
 * - Start with baseval = 1
 * - If ASHF active: baseval *= (1 - ashfPower)
 * - If Family Discount: baseval *= 0.2
 * - Return max(0, baseval)
 *
 * Reference: castle.js:3063-3072 (Molpy.CalcPriceFactor)
 *
 * @param state - Current discount state
 * @returns Price factor (1 = normal, <1 = discounted)
 */
export function calculatePriceFactor(state: PriceFactorState): number {
  let baseval = 1;

  // ASHF discount (castle.js:3065-3067)
  if (state.hasASHF) {
    baseval *= (1 - state.ashfPower);
  }

  // Family Discount: 80% off = multiply by 0.2 (castle.js:3068-3070)
  if (state.hasFamilyDiscount) {
    baseval *= 0.2;
  }

  return Math.max(0, baseval);
}

/**
 * Default ASHF power values based on card type.
 * Reference: boosts.js:519-565
 */
export const ASHF_POWER = {
  /** Base ASHF power (40% discount) */
  base: 0.4,
  /** With Gold Card (60% discount) */
  goldCard: 0.6,
  /** With Silver Card (50% discount) */
  silverCard: 0.5,
};

// =============================================================================
// Sand to Castle Conversion (Fibonacci cost)
// =============================================================================

/**
 * State for sand-to-castle conversion tracking.
 */
export interface SandToCastleState {
  /** Previous castle cost */
  prevCastleSand: number;
  /** Next castle cost (current) */
  nextCastleSand: number;
  /** Total castles built */
  totalBuilt: number;
}

/**
 * Calculate how many castles can be built from available sand.
 * Uses Fibonacci sequence for castle costs.
 *
 * Reference: castle.js Sand.toCastles() behavior
 *
 * @param sand - Available sand
 * @param state - Current castle building state
 * @returns Object with castles built, sand spent, and new state
 */
export function calculateSandToCastles(
  sand: number,
  state: SandToCastleState
): {
  castlesBuilt: number;
  sandSpent: number;
  newState: SandToCastleState;
} {
  let remaining = sand;
  let castlesBuilt = 0;
  let sandSpent = 0;
  let { prevCastleSand, nextCastleSand, totalBuilt } = state;

  while (remaining >= nextCastleSand && nextCastleSand > 0) {
    // Build one castle
    castlesBuilt++;
    totalBuilt++;
    sandSpent += nextCastleSand;
    remaining -= nextCastleSand;

    // Advance Fibonacci sequence
    const currentCost = nextCastleSand;
    nextCastleSand = prevCastleSand + currentCost;
    prevCastleSand = currentCost;

    // Safety check for invalid state
    if (!isFinite(nextCastleSand) || nextCastleSand <= 0) {
      break;
    }
  }

  return {
    castlesBuilt,
    sandSpent,
    newState: {
      prevCastleSand,
      nextCastleSand,
      totalBuilt,
    },
  };
}

// =============================================================================
// Tool Base Prices (from tools.js)
// =============================================================================

/**
 * Sand tool base prices.
 * Reference: tools.js DefineSandTools()
 */
export const SAND_TOOL_BASE_PRICES: Record<string, number> = {
  'Bucket': 8,
  'Cuegan': 50,
  'Flag': 420,
  'Ladder': 1700,
  'Bag': 12000,
  'LaPetite': parsePriceValue('2WQ'), // 2e42
};

/**
 * Castle tool Fibonacci seeds.
 * Reference: tools.js DefineCastleTools()
 */
export const CASTLE_TOOL_SEEDS: Record<string, { price0: number; price1: number }> = {
  'NewPixBot': { price0: 1, price1: 0 },
  'Trebuchet': { price0: 13, price1: 1 },
  'Scaffold': { price0: 60, price1: 100 },
  'Wave': { price0: 300, price1: 80 },
  'River': { price0: 700, price1: 200 },
  'Beanie Builder': { price0: 1e10, price1: 1e9 },
};

// =============================================================================
// Castle Tool Production Rates
// =============================================================================

/**
 * Castle tool production data.
 * Each tool has destroyC (cost to activate) and buildC (output when active).
 * Reference: tools.js DefineCastleTools()
 *
 * Note: In legacy code, these are functions with boost modifiers.
 * These are the BASE values before any boosts are applied.
 */
export interface CastleToolRates {
  /** Base castles destroyed to activate one tool */
  baseDestroyC: number;
  /** Base castles built per active tool */
  baseBuildC: number;
}

/**
 * Base castle tool rates (before boost modifiers).
 * Reference: tools.js DefineCastleTools()
 */
export const CASTLE_TOOL_RATES: Record<string, CastleToolRates> = {
  // NewPixBot: special - only builds at ONG, destroyC=0
  'NewPixBot': { baseDestroyC: 0, baseBuildC: 1 },
  // Trebuchet: destroyC=2 (1 with War Banner), buildC=4
  'Trebuchet': { baseDestroyC: 2, baseBuildC: 4 },
  // Scaffold: destroyC=6, buildC=22
  'Scaffold': { baseDestroyC: 6, baseBuildC: 22 },
  // Wave: destroyC=24, buildC=111
  'Wave': { baseDestroyC: 24, baseBuildC: 111 },
  // River: destroyC=160, buildC=690
  'River': { baseDestroyC: 160, baseBuildC: 690 },
  // Beanie Builder: destroyC=1Q, buildC=10Q
  'Beanie Builder': { baseDestroyC: 1e210, baseBuildC: 10e210 },
};

/**
 * Calculate how many castle tools can be activated given available castles.
 *
 * Formula: min(toolAmount, floor(castles / destroyCost))
 * Reference: castle.js:1036-1037
 *
 * @param toolAmount - Number of tools owned
 * @param destroyCost - Castles destroyed per tool activation
 * @param availableCastles - Current castle count
 * @returns Number of tools that can be activated
 */
export function calculateActivatableTools(
  toolAmount: number,
  destroyCost: number,
  availableCastles: number
): number {
  if (destroyCost <= 0) {
    // Zero cost means all tools can be activated
    return toolAmount;
  }

  const affordable = Math.floor(availableCastles / destroyCost);
  return Math.min(toolAmount, affordable);
}

/**
 * Calculate castle production from active tools.
 *
 * Formula: activeTools * buildRate
 * Reference: castle.js:1055-1056
 *
 * @param activeTools - Number of activated tools
 * @param buildRate - Castles built per active tool
 * @returns Total castles produced
 */
export function calculateCastleProduction(
  activeTools: number,
  buildRate: number
): number {
  return Math.floor(activeTools * buildRate);
}

/**
 * Calculate net castle change from a tool's destroy and build phases.
 *
 * This is the net effect of:
 * 1. Destroying castles to activate tools
 * 2. Building castles from active tools
 *
 * @param toolAmount - Number of tools owned
 * @param destroyCost - Castles destroyed per tool
 * @param buildRate - Castles built per active tool
 * @param availableCastles - Current castle count
 * @returns Object with activated tools, destroyed, built, and net change
 */
export function calculateToolCycleResult(
  toolAmount: number,
  destroyCost: number,
  buildRate: number,
  availableCastles: number
): {
  activated: number;
  destroyed: number;
  built: number;
  netChange: number;
} {
  const activated = calculateActivatableTools(toolAmount, destroyCost, availableCastles);
  const destroyed = activated * destroyCost;
  const built = calculateCastleProduction(activated, buildRate);

  return {
    activated,
    destroyed,
    built,
    netChange: built - destroyed,
  };
}

// =============================================================================
// Glass Production Calculation
// =============================================================================

/**
 * State needed to calculate glass chip production.
 * Reference: boosts.js:2140-2148 (Sand Refinery.makeChips)
 */
export interface GlassChipProductionState {
  /** Sand Refinery power level */
  sandRefineryPower: number;
  /** Number of goats owned (for Glass Goat multiplier) */
  goats: number;
  /** Whether Glass Goat boost is owned */
  hasGlassGoat: boolean;
  /** Papal multiplier for Chips (from Pope boost decree) */
  papalChipsMult: number;
}

/**
 * Calculate glass chips produced per ONG.
 *
 * Formula: floor((refineryLevel + 1) * goatMult * papalMult)
 * - refineryLevel = Sand Refinery power
 * - goatMult = goats * 5 (if Glass Goat owned and goats >= 1), else 1
 * - papalMult = Papal('Chips') - usually 1 unless pope decree is active
 *
 * Reference: boosts.js:2140-2148
 *
 * @param state - Current glass production state
 * @param times - Multiplier for number of production cycles (default 1)
 * @returns Glass chips produced
 */
export function calculateGlassChipProduction(
  state: GlassChipProductionState,
  times = 1
): number {
  let furnaceLevel = (state.sandRefineryPower + 1) * times;

  // Glass Goat multiplier
  if (state.hasGlassGoat && state.goats >= 1) {
    furnaceLevel *= state.goats * 5;
  }

  // Apply papal multiplier and floor
  return Math.floor(furnaceLevel * state.papalChipsMult);
}

/**
 * State needed to calculate glass block production.
 * Reference: boosts.js:2465-2498 (Glass Chiller.makeBlocks)
 */
export interface GlassBlockProductionState {
  /** Glass Chiller power level */
  glassChillerPower: number;
  /** Current glass chips available */
  glassChips: number;
  /** Number of goats owned (for Glass Goat multiplier) */
  goats: number;
  /** Whether Glass Goat boost is owned */
  hasGlassGoat: boolean;
  /** Papal multiplier for Blocks (from Pope boost decree) */
  papalBlocksMult: number;
  /** Whether Ruthless Efficiency boost is owned */
  hasRuthlessEfficiency: boolean;
  /** Whether Glass Trolling is enabled */
  glassTrollingEnabled: boolean;
}

/**
 * Calculate chips per block based on boosts.
 *
 * Base: 20 chips per block
 * Ruthless Efficiency: 5 chips per block
 * Glass Trolling: divides by 5
 *
 * Reference: boosts.js:2346-2351 (Molpy.ChipsPerBlock)
 *
 * @param hasRuthlessEfficiency - Whether Ruthless Efficiency is owned
 * @param glassTrollingEnabled - Whether Glass Trolling is active
 * @returns Chips required per glass block
 */
export function calculateChipsPerBlock(
  hasRuthlessEfficiency: boolean,
  glassTrollingEnabled: boolean
): number {
  const trollDivisor = glassTrollingEnabled ? 5 : 1;
  const baseChips = hasRuthlessEfficiency ? 5 : 20;
  return baseChips / trollDivisor;
}

/**
 * Calculate glass blocks produced per ONG.
 *
 * Formula:
 * 1. blocksFromChiller = min(chillerLevel + 1, chips / chipsPerBlock)
 * 2. Apply goat multiplier if Glass Goat owned
 * 3. Apply papal multiplier
 *
 * Reference: boosts.js:2465-2498
 *
 * @param state - Current glass block production state
 * @param times - Multiplier for number of production cycles (default 1)
 * @returns Object with blocks produced and chips consumed
 */
export function calculateGlassBlockProduction(
  state: GlassBlockProductionState,
  times = 1
): { blocksProduced: number; chipsConsumed: number } {
  const chipsPerBlock = calculateChipsPerBlock(
    state.hasRuthlessEfficiency,
    state.glassTrollingEnabled
  );

  const chillerLevel = (state.glassChillerPower + 1) * times;

  // Can only produce as many blocks as we have chips for
  const maxFromChips = Math.floor(state.glassChips / chipsPerBlock);
  const blocksFromChiller = Math.min(chillerLevel, maxFromChips);

  if (blocksFromChiller <= 0) {
    return { blocksProduced: 0, chipsConsumed: 0 };
  }

  // Calculate chip cost before goat multiplier
  const chipsConsumed = blocksFromChiller * chipsPerBlock;

  // Apply goat multiplier to blocks produced
  let finalBlocks = blocksFromChiller;
  if (state.hasGlassGoat && state.goats >= 1) {
    finalBlocks *= state.goats * 5;
  }

  // Apply papal multiplier and floor
  return {
    blocksProduced: Math.floor(finalBlocks * state.papalBlocksMult),
    chipsConsumed,
  };
}

/**
 * State needed to calculate sand usage for glass production.
 * Reference: boosts.js:1987-2003 (GlassFurnaceSandUse), 2005-2021 (GlassBlowerSandUse)
 */
export interface GlassSandUsageState {
  /** Sand Refinery power level */
  sandRefineryPower: number;
  /** Glass Chiller power level */
  glassChillerPower: number;
  /** Sand Purifier power level (0 if not owned) */
  sandPurifierPower: number;
  /** Glass Extruder power level (0 if not owned) */
  glassExtruderPower: number;
  /** Whether Glass Furnace is on */
  glassFurnaceEnabled: boolean;
  /** Whether Glass Blower is on */
  glassBlowerEnabled: boolean;
  /** Whether Badgers boost is owned */
  hasBadgers: boolean;
  /** Whether Mushrooms boost is owned */
  hasMushrooms: boolean;
  /** Total badges owned (for Badgers/Mushrooms efficiency) */
  badgesOwned: number;
}

/**
 * Calculate sand rate efficiency divisor for Sand Refinery.
 *
 * Formula:
 * - Base increment = 1
 * - Sand Purifier: divide by (power + 2)
 * - Badgers: multiply by 0.99^(badgesOwned/10)
 *
 * Reference: boosts.js:1996-2003 (Molpy.SandRefineryIncrement)
 *
 * @param sandPurifierPower - Sand Purifier power level
 * @param hasBadgers - Whether Badgers boost is owned
 * @param badgesOwned - Total badges owned
 * @returns Sand rate increment multiplier
 */
export function calculateSandRefineryIncrement(
  sandPurifierPower: number,
  hasBadgers: boolean,
  badgesOwned: number
): number {
  let inc = 1;

  // Sand Purifier reduces sand usage
  if (sandPurifierPower > 0 || sandPurifierPower === 0) {
    // Power of 0 still gives divisor of 2
    inc /= (sandPurifierPower + 2);
  }

  // Badgers reduce sand usage based on badges owned
  if (hasBadgers) {
    inc *= Math.pow(0.99, Math.floor(badgesOwned / 10));
  }

  return inc || 0;
}

/**
 * Calculate sand rate efficiency divisor for Glass Chiller.
 *
 * Formula:
 * - Base increment = 1
 * - Glass Extruder: divide by (power + 2)
 * - Mushrooms: multiply by 0.99^(badgesOwned/10)
 *
 * Reference: boosts.js:2014-2021 (Molpy.GlassChillerIncrement)
 *
 * @param glassExtruderPower - Glass Extruder power level
 * @param hasMushrooms - Whether Mushrooms boost is owned
 * @param badgesOwned - Total badges owned
 * @returns Sand rate increment multiplier
 */
export function calculateGlassChillerIncrement(
  glassExtruderPower: number,
  hasMushrooms: boolean,
  badgesOwned: number
): number {
  let inc = 1;

  // Glass Extruder reduces sand usage
  if (glassExtruderPower > 0 || glassExtruderPower === 0) {
    inc /= (glassExtruderPower + 2);
  }

  // Mushrooms reduce sand usage based on badges owned
  if (hasMushrooms) {
    inc *= Math.pow(0.99, Math.floor(badgesOwned / 10));
  }

  return inc || 0;
}

/**
 * Calculate percentage of sand dig rate used by Glass Furnace.
 *
 * Formula: (refineryPower + 1) * refineryIncrement
 *
 * Reference: boosts.js:1987-1994 (Molpy.GlassFurnaceSandUse)
 *
 * @param state - Glass production state
 * @returns Percentage of sand dig rate used (0-100+)
 */
export function calculateGlassFurnaceSandUse(state: GlassSandUsageState): number {
  if (!state.glassFurnaceEnabled) {
    return 0;
  }

  const amount = state.sandRefineryPower + 1;
  const inc = calculateSandRefineryIncrement(
    state.sandPurifierPower,
    state.hasBadgers,
    state.badgesOwned
  );

  return amount * inc || 0;
}

/**
 * Calculate percentage of sand dig rate used by Glass Blower.
 *
 * Formula: (chillerPower + 1) * chillerIncrement
 *
 * Reference: boosts.js:2005-2012 (Molpy.GlassBlowerSandUse)
 *
 * @param state - Glass production state
 * @returns Percentage of sand dig rate used (0-100+)
 */
export function calculateGlassBlowerSandUse(state: GlassSandUsageState): number {
  if (!state.glassBlowerEnabled) {
    return 0;
  }

  const amount = state.glassChillerPower + 1;
  const inc = calculateGlassChillerIncrement(
    state.glassExtruderPower,
    state.hasMushrooms,
    state.badgesOwned
  );

  return amount * inc || 0;
}

/**
 * Calculate total percentage of sand dig rate used by glass production.
 *
 * Reference: boosts.js:2023-2028 (Molpy.CalcGlassUse)
 *
 * @param state - Glass production state
 * @returns Total percentage of sand dig rate used
 */
export function calculateTotalGlassUse(state: GlassSandUsageState): number {
  return calculateGlassFurnaceSandUse(state) + calculateGlassBlowerSandUse(state);
}

// =============================================================================
// Click Multiplier Calculation
// =============================================================================

/**
 * State needed to calculate sand per click.
 * Reference: boosts.js:7357-7392 (calculateSandPerClick)
 */
export interface ClickMultiplierState {
  // Boost power levels (0 if not owned)
  biggerBuckets: number;    // Power level, adds 0.1 per level to base

  // Boost ownership flags (bought > 0)
  hugeBuckets: boolean;     // x2 multiplier
  buccaneer: boolean;       // x2 multiplier
  helpfulHands: boolean;    // +0.5 per Bucket+Cuegan pair
  trueColours: boolean;     // +5 per Flag+Cuegan pair
  raiseTheFlag: boolean;    // +50 per Flag+Ladder pair
  handItUp: boolean;        // +500 per Bag+Ladder pair
  bucketBrigade: boolean;   // +1% of sandPermNP per 50 buckets
  bagPuns: boolean;         // +40% of base per 5 bags above 25
  boneClicker: boolean;     // x(bonemeal*5) final multiplier

  // Resource for Bone Clicker
  bonemeal: number;

  // Tool counts for pair bonuses
  buckets: number;
  cuegans: number;
  flags: number;
  ladders: number;
  bags: number;

  // Rate for Bucket Brigade calculation
  sandPermNP: number;       // Sand production rate per NP
}

/**
 * Calculate sand gained per beach click.
 *
 * The formula applies bonuses in this order:
 * 1. Base value: 1 + (biggerBuckets * 0.1)
 * 2. Multiplicative tier 1: x2 for Huge Buckets, x2 for Buccaneer
 * 3. Additive pair bonuses: Helpful Hands, True Colours, Raise the Flag, Hand it Up
 * 4. Additive percentage bonuses: Bucket Brigade, Bag Puns
 * 5. Final multiplicative: Bone Clicker (x bonemeal * 5)
 * 6. Global multiplier (badges, etc.)
 *
 * Reference: boosts.js:7357-7392 (calculateSandPerClick in Sand boost)
 *
 * @param state - Current boost and tool state
 * @param globalMultiplier - External multiplier (badges, etc.), default 1
 * @returns Sand per click value
 */
export function calculateSandPerClick(
  state: ClickMultiplierState,
  globalMultiplier = 1
): number {
  // Step 1: Base with Bigger Buckets
  // From boosts.js:7359 - baseRate = 1 + (Bigger Buckets power * 0.1)
  let baseRate = 1 + (state.biggerBuckets * 0.1);

  // Step 2: Multiplicative tier 1
  // From boosts.js:7361-7362
  let mult = 1;
  if (state.hugeBuckets) mult *= 2;
  if (state.buccaneer) mult *= 2;
  baseRate *= mult;

  // Step 3: Additive pair bonuses
  // From boosts.js:7364-7378
  if (state.helpfulHands) {
    // +0.5 per matched Bucket+Cuegan pair
    baseRate += 0.5 * Math.min(state.buckets, state.cuegans);
  }
  if (state.trueColours) {
    // +5 per matched Flag+Cuegan pair
    baseRate += 5 * Math.min(state.flags, state.cuegans);
  }
  if (state.raiseTheFlag) {
    // +50 per matched Flag+Ladder pair
    baseRate += 50 * Math.min(state.flags, state.ladders);
  }
  if (state.handItUp) {
    // +500 per matched Bag+Ladder pair
    baseRate += 500 * Math.min(state.bags, state.ladders);
  }

  // Step 4: Additive percentage bonuses
  // From boosts.js:7380-7385
  if (state.bucketBrigade) {
    // +1% of sand dig rate per 50 buckets
    baseRate += state.sandPermNP * 0.01 * Math.floor(state.buckets / 50);
  }
  if (state.bagPuns) {
    // +40% of current baseRate per 5 bags above 25 (can be negative below 25)
    const bagBonus = Math.max(-2, Math.floor((state.bags - 25) / 5));
    baseRate += baseRate * 0.4 * bagBonus;
  }

  // Step 5: Final multiplicative (Bone Clicker)
  // From boosts.js:7387-7388
  if (state.boneClicker && state.bonemeal >= 1) {
    baseRate *= state.bonemeal * 5;
  }

  // Step 6: Apply global multiplier
  return baseRate * globalMultiplier;
}
