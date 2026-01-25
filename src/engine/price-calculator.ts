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
