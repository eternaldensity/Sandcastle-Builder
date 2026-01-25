/**
 * Tests for price calculation formulas
 *
 * These tests verify that our TypeScript implementations match the legacy
 * JavaScript behavior exactly. Key formulas tested:
 * - DeMolpify (number parsing)
 * - Sand tool prices (exponential growth)
 * - Castle tool prices (Fibonacci sequence)
 * - Boost prices with priceFactor
 * - Price factor calculation (ASHF, Family Discount)
 */

import { describe, it, expect } from 'vitest';
import {
  parsePriceValue,
  SAND_TOOL_PRICE_FACTOR,
  calculateSandToolPrice,
  calculateSandToolPurchasePrice,
  calculateCastleToolPrice,
  calculateCastleToolPurchasePrice,
  calculateBoostPrice,
  isPriceFree,
  calculatePriceFactor,
  ASHF_POWER,
  calculateSandToCastles,
  SAND_TOOL_BASE_PRICES,
  CASTLE_TOOL_SEEDS,
  CASTLE_TOOL_RATES,
  calculateActivatableTools,
  calculateCastleProduction,
  calculateToolCycleResult,
  calculateSandPerClick,
  calculateGlassChipProduction,
  calculateGlassBlockProduction,
  calculateChipsPerBlock,
  calculateSandRefineryIncrement,
  calculateGlassChillerIncrement,
  calculateGlassFurnaceSandUse,
  calculateGlassBlowerSandUse,
  calculateTotalGlassUse,
  type ClickMultiplierState,
  type GlassChipProductionState,
  type GlassBlockProductionState,
  type GlassSandUsageState,
} from './price-calculator.js';

// =============================================================================
// parsePriceValue (DeMolpify equivalent) tests
// =============================================================================

describe('parsePriceValue', () => {
  it('should parse plain numbers', () => {
    expect(parsePriceValue(100)).toBe(100);
    expect(parsePriceValue(0)).toBe(0);
    expect(parsePriceValue(1.5)).toBe(1.5);
  });

  it('should parse numeric strings', () => {
    expect(parsePriceValue('100')).toBe(100);
    expect(parsePriceValue('1.5')).toBe(1.5);
    expect(parsePriceValue('0')).toBe(0);
  });

  it('should parse K (Kilo) suffix', () => {
    expect(parsePriceValue('1K')).toBe(1000);
    expect(parsePriceValue('1.5K')).toBe(1500);
    expect(parsePriceValue('10K')).toBe(10000);
  });

  it('should parse M (Mega) suffix', () => {
    expect(parsePriceValue('1M')).toBe(1e6);
    expect(parsePriceValue('1.5M')).toBe(1.5e6);
    expect(parsePriceValue('100M')).toBe(1e8);
  });

  it('should parse G (Giga) suffix', () => {
    expect(parsePriceValue('1G')).toBe(1e9);
    expect(parsePriceValue('24G')).toBe(24e9);
  });

  it('should parse T (Tera) suffix', () => {
    expect(parsePriceValue('1T')).toBe(1e12);
    expect(parsePriceValue('2.5T')).toBe(2.5e12);
  });

  it('should parse P (Peta) suffix', () => {
    expect(parsePriceValue('1P')).toBe(1e15);
  });

  it('should parse E (Exa) suffix', () => {
    expect(parsePriceValue('1E')).toBe(1e18);
  });

  it('should parse Y (Yotta) suffix', () => {
    expect(parsePriceValue('1Y')).toBe(1e24);
  });

  it('should parse W (Wololo) suffix', () => {
    expect(parsePriceValue('1W')).toBe(1e42);
    expect(parsePriceValue('2W')).toBe(2e42);
  });

  it('should parse Q (Quita) suffix', () => {
    expect(parsePriceValue('1Q')).toBe(1e210);
  });

  it('should parse compound suffixes like WQ', () => {
    // "2WQ" = 2 * W * Q = 2 * 1e42 * 1e210 = 2e252
    // Use toBeCloseTo for floating-point precision
    expect(parsePriceValue('2WQ')).toBeCloseTo(2e252, -245);
  });

  it('should be case insensitive', () => {
    expect(parsePriceValue('1m')).toBe(1e6);
    expect(parsePriceValue('1g')).toBe(1e9);
    expect(parsePriceValue('1w')).toBe(1e42);
  });

  it('should handle empty/null values', () => {
    expect(parsePriceValue('')).toBe(0);
  });

  it('should strip unknown characters', () => {
    expect(parsePriceValue('100x')).toBe(100);
  });
});

// =============================================================================
// Sand Tool Price tests
// =============================================================================

describe('calculateSandToolPrice', () => {
  it('should use 1.1 as the price factor', () => {
    expect(SAND_TOOL_PRICE_FACTOR).toBe(1.1);
  });

  it('should return base price when amount is 0', () => {
    expect(calculateSandToolPrice(8, 0)).toBe(8);
    expect(calculateSandToolPrice(50, 0)).toBe(50);
  });

  it('should apply 1.1^amount multiplier', () => {
    // Bucket: base 8
    expect(calculateSandToolPrice(8, 1)).toBe(Math.floor(8 * 1.1));
    expect(calculateSandToolPrice(8, 2)).toBe(Math.floor(8 * 1.1 * 1.1));
    expect(calculateSandToolPrice(8, 10)).toBe(Math.floor(8 * Math.pow(1.1, 10)));
  });

  it('should floor the result', () => {
    // 8 * 1.1 = 8.8, should floor to 8
    expect(calculateSandToolPrice(8, 1)).toBe(8);
    // 8 * 1.1^2 = 9.68, should floor to 9
    expect(calculateSandToolPrice(8, 2)).toBe(9);
  });

  it('should return Infinity for amount > 9000', () => {
    expect(calculateSandToolPrice(8, 9001)).toBe(Infinity);
    expect(calculateSandToolPrice(8, 10000)).toBe(Infinity);
  });

  it('should calculate correct prices for all sand tools at various amounts', () => {
    // Bucket (base 8) at amount 0, 5, 10, 50
    expect(calculateSandToolPrice(8, 0)).toBe(8);
    expect(calculateSandToolPrice(8, 5)).toBe(Math.floor(8 * Math.pow(1.1, 5)));
    expect(calculateSandToolPrice(8, 10)).toBe(Math.floor(8 * Math.pow(1.1, 10)));
    expect(calculateSandToolPrice(8, 50)).toBe(Math.floor(8 * Math.pow(1.1, 50)));

    // Cuegan (base 50)
    expect(calculateSandToolPrice(50, 10)).toBe(Math.floor(50 * Math.pow(1.1, 10)));

    // Flag (base 420)
    expect(calculateSandToolPrice(420, 10)).toBe(Math.floor(420 * Math.pow(1.1, 10)));
  });
});

describe('calculateSandToolPurchasePrice', () => {
  it('should apply priceFactor to base price', () => {
    // With priceFactor 1.0 (no discount)
    expect(calculateSandToolPurchasePrice(8, 0, 1.0)).toBe(8);

    // With priceFactor 0.5 (50% discount)
    expect(calculateSandToolPurchasePrice(8, 0, 0.5)).toBe(4);
  });

  it('should apply priceFactor after exponential calculation', () => {
    // 8 * 1.1^10 * 0.5 = floor(20.75 * 0.5) = floor(10.37) = 10
    const basePrice = calculateSandToolPrice(8, 10);
    expect(calculateSandToolPurchasePrice(8, 10, 0.5)).toBe(Math.floor(basePrice * 0.5));
  });

  it('should floor the final result', () => {
    // 8 * 0.6 = 4.8, should floor to 4
    expect(calculateSandToolPurchasePrice(8, 0, 0.6)).toBe(4);
  });
});

// =============================================================================
// Castle Tool Price (Fibonacci) tests
// =============================================================================

describe('calculateCastleToolPrice', () => {
  it('should return correct Fibonacci sequence for NewPixBot seeds (1, 0)', () => {
    // Seeds: price0=1, price1=0
    // Initial: prevPrice=1, nextPrice=0, p=1
    // At amount 0: no iterations, price=1
    const result0 = calculateCastleToolPrice(1, 0, 0);
    expect(result0.price).toBe(1);

    // At amount 1: 1 iteration
    // iter1: prevPrice=0, nextPrice=1, p=1
    // price = 1
    const result1 = calculateCastleToolPrice(1, 0, 1);
    expect(result1.price).toBe(1);

    // At amount 2: 2 iterations
    // iter1: prevPrice=0, nextPrice=1, p=1
    // iter2: prevPrice=1, nextPrice=1, p=2
    // price = 2
    const result2 = calculateCastleToolPrice(1, 0, 2);
    expect(result2.price).toBe(2);

    // At amount 3: 3 iterations
    // iter3: prevPrice=1, nextPrice=2, p=3
    // price = 3
    const result3 = calculateCastleToolPrice(1, 0, 3);
    expect(result3.price).toBe(3);
  });

  it('should return correct Fibonacci sequence for Trebuchet seeds (13, 1)', () => {
    // Seeds: price0=13, price1=1
    // Initial: prev=13, next=1, p=14
    // After 0 iterations: price=14
    const result0 = calculateCastleToolPrice(13, 1, 0);
    expect(result0.price).toBe(14);

    // After 1 iteration: prev=1, next=14, price=15
    const result1 = calculateCastleToolPrice(13, 1, 1);
    expect(result1.price).toBe(15);

    // After 2 iterations: prev=14, next=15, price=29
    const result2 = calculateCastleToolPrice(13, 1, 2);
    expect(result2.price).toBe(29);
  });

  it('should return correct Fibonacci sequence for Scaffold seeds (60, 100)', () => {
    // Seeds: price0=60, price1=100
    // Initial: prev=60, next=100, p=160
    const result0 = calculateCastleToolPrice(60, 100, 0);
    expect(result0.price).toBe(160);

    // After 1: prev=100, next=160, price=260
    const result1 = calculateCastleToolPrice(60, 100, 1);
    expect(result1.price).toBe(260);
  });

  it('should return correct Fibonacci sequence for Wave seeds (300, 80)', () => {
    // Seeds: price0=300, price1=80
    // Initial: prev=300, next=80, p=380
    const result0 = calculateCastleToolPrice(300, 80, 0);
    expect(result0.price).toBe(380);
  });

  it('should return Infinity for amount > 1500', () => {
    const result = calculateCastleToolPrice(13, 1, 1501);
    expect(result.price).toBe(Infinity);
    expect(result.prevPrice).toBe(Infinity);
    expect(result.nextPrice).toBe(Infinity);
  });

  it('should track prevPrice and nextPrice correctly', () => {
    const result = calculateCastleToolPrice(13, 1, 2);
    // After 2 iterations: prev=14, next=15, price=29
    expect(result.prevPrice).toBe(14);
    expect(result.nextPrice).toBe(15);
    expect(result.price).toBe(29);
  });
});

describe('calculateCastleToolPurchasePrice', () => {
  it('should apply priceFactor to Fibonacci price', () => {
    // Trebuchet at amount 0: price = 14
    expect(calculateCastleToolPurchasePrice(13, 1, 0, 1.0)).toBe(14);
    expect(calculateCastleToolPurchasePrice(13, 1, 0, 0.5)).toBe(7);
  });

  it('should floor the final result', () => {
    // 14 * 0.6 = 8.4, should floor to 8
    expect(calculateCastleToolPurchasePrice(13, 1, 0, 0.6)).toBe(8);
  });
});

// =============================================================================
// Boost Price tests
// =============================================================================

describe('calculateBoostPrice', () => {
  it('should apply priceFactor to all resources', () => {
    const basePrice = { Sand: 500, Castles: 10 };
    const result = calculateBoostPrice(basePrice, 1.0);
    expect(result.Sand).toBe(500);
    expect(result.Castles).toBe(10);
  });

  it('should parse string prices (like "1.5M")', () => {
    const basePrice = { Sand: '1.5M' };
    const result = calculateBoostPrice(basePrice, 1.0);
    expect(result.Sand).toBe(1.5e6);
  });

  it('should apply discount correctly', () => {
    const basePrice = { Sand: 1000 };
    const result = calculateBoostPrice(basePrice, 0.5);
    expect(result.Sand).toBe(500);
  });

  it('should floor all values', () => {
    const basePrice = { Sand: 100 };
    // 100 * 0.6 = 60
    expect(calculateBoostPrice(basePrice, 0.6).Sand).toBe(60);
    // 100 * 0.33 = 33
    expect(calculateBoostPrice(basePrice, 0.33).Sand).toBe(33);
  });

  it('should omit zero-value resources', () => {
    const basePrice = { Sand: 100, Castles: 0 };
    const result = calculateBoostPrice(basePrice, 1.0);
    expect(result.Sand).toBe(100);
    expect('Castles' in result).toBe(false);
  });

  it('should handle complex prices with multiple resources', () => {
    const basePrice = { Sand: '24G', Castles: '720G' };
    const result = calculateBoostPrice(basePrice, 0.2);
    expect(result.Sand).toBe(Math.floor(24e9 * 0.2));
    expect(result.Castles).toBe(Math.floor(720e9 * 0.2));
  });
});

describe('isPriceFree', () => {
  it('should return true for empty price', () => {
    expect(isPriceFree({})).toBe(true);
  });

  it('should return true for all-zero price', () => {
    expect(isPriceFree({ Sand: 0, Castles: 0 })).toBe(true);
  });

  it('should return false for any non-zero price', () => {
    expect(isPriceFree({ Sand: 1 })).toBe(false);
    expect(isPriceFree({ Sand: 0, Castles: 1 })).toBe(false);
  });
});

// =============================================================================
// Price Factor tests
// =============================================================================

describe('calculatePriceFactor', () => {
  it('should return 1 with no discounts', () => {
    const result = calculatePriceFactor({
      hasASHF: false,
      ashfPower: 0,
      hasFamilyDiscount: false,
    });
    expect(result).toBe(1);
  });

  it('should apply ASHF discount correctly', () => {
    // ASHF with 40% discount: 1 * (1 - 0.4) = 0.6
    const result = calculatePriceFactor({
      hasASHF: true,
      ashfPower: ASHF_POWER.base,
      hasFamilyDiscount: false,
    });
    expect(result).toBe(0.6);
  });

  it('should apply ASHF Gold Card discount', () => {
    // Gold Card: 1 * (1 - 0.6) = 0.4
    const result = calculatePriceFactor({
      hasASHF: true,
      ashfPower: ASHF_POWER.goldCard,
      hasFamilyDiscount: false,
    });
    expect(result).toBe(0.4);
  });

  it('should apply Family Discount correctly', () => {
    // Family Discount: 1 * 0.2 = 0.2
    const result = calculatePriceFactor({
      hasASHF: false,
      ashfPower: 0,
      hasFamilyDiscount: true,
    });
    expect(result).toBe(0.2);
  });

  it('should stack ASHF and Family Discount', () => {
    // Both: 1 * (1 - 0.4) * 0.2 = 0.6 * 0.2 = 0.12
    const result = calculatePriceFactor({
      hasASHF: true,
      ashfPower: ASHF_POWER.base,
      hasFamilyDiscount: true,
    });
    expect(result).toBe(0.12);
  });

  it('should never return negative', () => {
    // Even with >100% discount, should return 0
    const result = calculatePriceFactor({
      hasASHF: true,
      ashfPower: 1.5, // 150% discount
      hasFamilyDiscount: false,
    });
    expect(result).toBe(0);
  });
});

// =============================================================================
// Sand to Castle Conversion tests
// =============================================================================

describe('calculateSandToCastles', () => {
  it('should build no castles if sand is insufficient', () => {
    const state = { prevCastleSand: 0, nextCastleSand: 1, totalBuilt: 0 };
    const result = calculateSandToCastles(0, state);
    expect(result.castlesBuilt).toBe(0);
    expect(result.sandSpent).toBe(0);
  });

  it('should build one castle for exactly enough sand', () => {
    const state = { prevCastleSand: 0, nextCastleSand: 1, totalBuilt: 0 };
    const result = calculateSandToCastles(1, state);
    expect(result.castlesBuilt).toBe(1);
    expect(result.sandSpent).toBe(1);
  });

  it('should follow Fibonacci sequence for costs', () => {
    const state = { prevCastleSand: 0, nextCastleSand: 1, totalBuilt: 0 };
    // With 10 sand: costs are 1, 1, 2, 3 = 7 sand for 4 castles
    const result = calculateSandToCastles(10, state);
    expect(result.castlesBuilt).toBe(4);
    expect(result.sandSpent).toBe(7); // 1 + 1 + 2 + 3
    expect(result.newState.nextCastleSand).toBe(5); // next cost would be 5
  });

  it('should update state correctly', () => {
    const state = { prevCastleSand: 0, nextCastleSand: 1, totalBuilt: 0 };
    const result = calculateSandToCastles(3, state);
    // Costs: 1, 1, 2 = 4 sand needed, but we only have 3
    // So we can only build 2 castles (cost 1 + 1 = 2)
    expect(result.castlesBuilt).toBe(2);
    expect(result.sandSpent).toBe(2);
    expect(result.newState.prevCastleSand).toBe(1);
    expect(result.newState.nextCastleSand).toBe(2);
    expect(result.newState.totalBuilt).toBe(2);
  });

  it('should track total built across multiple calls', () => {
    let state = { prevCastleSand: 0, nextCastleSand: 1, totalBuilt: 5 };
    const result = calculateSandToCastles(1, state);
    expect(result.newState.totalBuilt).toBe(6);
  });
});

// =============================================================================
// Constants tests
// =============================================================================

describe('SAND_TOOL_BASE_PRICES', () => {
  it('should have correct base prices from tools.js', () => {
    expect(SAND_TOOL_BASE_PRICES['Bucket']).toBe(8);
    expect(SAND_TOOL_BASE_PRICES['Cuegan']).toBe(50);
    expect(SAND_TOOL_BASE_PRICES['Flag']).toBe(420);
    expect(SAND_TOOL_BASE_PRICES['Ladder']).toBe(1700);
    expect(SAND_TOOL_BASE_PRICES['Bag']).toBe(12000);
    // LaPetite price is DeMolpify('2WQ') = 2 * 1e42 * 1e210 = 2e252
    expect(SAND_TOOL_BASE_PRICES['LaPetite']).toBeCloseTo(2e252, -245);
  });
});

describe('CASTLE_TOOL_SEEDS', () => {
  it('should have correct Fibonacci seeds from tools.js', () => {
    expect(CASTLE_TOOL_SEEDS['NewPixBot']).toEqual({ price0: 1, price1: 0 });
    expect(CASTLE_TOOL_SEEDS['Trebuchet']).toEqual({ price0: 13, price1: 1 });
    expect(CASTLE_TOOL_SEEDS['Scaffold']).toEqual({ price0: 60, price1: 100 });
    expect(CASTLE_TOOL_SEEDS['Wave']).toEqual({ price0: 300, price1: 80 });
    expect(CASTLE_TOOL_SEEDS['River']).toEqual({ price0: 700, price1: 200 });
    expect(CASTLE_TOOL_SEEDS['Beanie Builder']).toEqual({ price0: 1e10, price1: 1e9 });
  });
});

// =============================================================================
// Castle Tool Production tests
// =============================================================================

describe('CASTLE_TOOL_RATES', () => {
  it('should have correct base rates from tools.js', () => {
    expect(CASTLE_TOOL_RATES['NewPixBot']).toEqual({ baseDestroyC: 0, baseBuildC: 1 });
    expect(CASTLE_TOOL_RATES['Trebuchet']).toEqual({ baseDestroyC: 2, baseBuildC: 4 });
    expect(CASTLE_TOOL_RATES['Scaffold']).toEqual({ baseDestroyC: 6, baseBuildC: 22 });
    expect(CASTLE_TOOL_RATES['Wave']).toEqual({ baseDestroyC: 24, baseBuildC: 111 });
    expect(CASTLE_TOOL_RATES['River']).toEqual({ baseDestroyC: 160, baseBuildC: 690 });
    expect(CASTLE_TOOL_RATES['Beanie Builder']).toEqual({ baseDestroyC: 1e210, baseBuildC: 10e210 });
  });
});

describe('calculateActivatableTools', () => {
  it('should activate all tools when cost is zero', () => {
    expect(calculateActivatableTools(10, 0, 100)).toBe(10);
    expect(calculateActivatableTools(5, 0, 0)).toBe(5);
  });

  it('should activate tools up to affordable amount', () => {
    // 10 castles, 2 cost per tool = 5 tools
    expect(calculateActivatableTools(10, 2, 10)).toBe(5);
    // 100 castles, 24 cost per tool = 4 tools
    expect(calculateActivatableTools(10, 24, 100)).toBe(4);
  });

  it('should not exceed tool amount', () => {
    // 5 tools, 2 cost, 100 castles = min(5, 50) = 5
    expect(calculateActivatableTools(5, 2, 100)).toBe(5);
  });

  it('should return 0 when no castles available', () => {
    expect(calculateActivatableTools(10, 2, 0)).toBe(0);
    expect(calculateActivatableTools(10, 2, 1)).toBe(0);
  });

  it('should floor the affordable calculation', () => {
    // 7 castles, 2 cost = floor(3.5) = 3 tools
    expect(calculateActivatableTools(10, 2, 7)).toBe(3);
  });
});

describe('calculateCastleProduction', () => {
  it('should multiply active tools by build rate', () => {
    expect(calculateCastleProduction(5, 4)).toBe(20);
    expect(calculateCastleProduction(3, 22)).toBe(66);
    expect(calculateCastleProduction(2, 111)).toBe(222);
  });

  it('should return 0 for no active tools', () => {
    expect(calculateCastleProduction(0, 100)).toBe(0);
  });

  it('should floor the result', () => {
    // This is already floored in the function
    expect(calculateCastleProduction(3, 10)).toBe(30);
  });
});

describe('calculateToolCycleResult', () => {
  it('should calculate full cycle for Trebuchet', () => {
    // 5 Trebuchets, destroyC=2, buildC=4, 100 castles
    const result = calculateToolCycleResult(5, 2, 4, 100);
    expect(result.activated).toBe(5);
    expect(result.destroyed).toBe(10); // 5 * 2
    expect(result.built).toBe(20); // 5 * 4
    expect(result.netChange).toBe(10); // 20 - 10
  });

  it('should handle partial activation when low on castles', () => {
    // 10 Trebuchets, destroyC=2, buildC=4, only 5 castles
    const result = calculateToolCycleResult(10, 2, 4, 5);
    expect(result.activated).toBe(2); // floor(5/2) = 2
    expect(result.destroyed).toBe(4); // 2 * 2
    expect(result.built).toBe(8); // 2 * 4
    expect(result.netChange).toBe(4); // 8 - 4
  });

  it('should return zeros when no tools can be activated', () => {
    const result = calculateToolCycleResult(10, 100, 200, 50);
    expect(result.activated).toBe(0);
    expect(result.destroyed).toBe(0);
    expect(result.built).toBe(0);
    expect(result.netChange).toBe(0);
  });

  it('should handle zero destroy cost (like NewPixBot)', () => {
    const result = calculateToolCycleResult(10, 0, 1, 0);
    expect(result.activated).toBe(10);
    expect(result.destroyed).toBe(0);
    expect(result.built).toBe(10);
    expect(result.netChange).toBe(10);
  });
});

// =============================================================================
// Click Multiplier tests
// =============================================================================

describe('calculateSandPerClick', () => {
  /**
   * Base state with no boosts or tools - should return 1 sand per click
   */
  const baseState: ClickMultiplierState = {
    biggerBuckets: 0,
    hugeBuckets: false,
    buccaneer: false,
    helpfulHands: false,
    trueColours: false,
    raiseTheFlag: false,
    handItUp: false,
    bucketBrigade: false,
    bagPuns: false,
    boneClicker: false,
    bonemeal: 0,
    buckets: 0,
    cuegans: 0,
    flags: 0,
    ladders: 0,
    bags: 0,
    sandPermNP: 0,
  };

  describe('base calculation', () => {
    it('should return 1 for base state with no boosts', () => {
      expect(calculateSandPerClick(baseState)).toBe(1);
    });

    it('should apply global multiplier', () => {
      expect(calculateSandPerClick(baseState, 2)).toBe(2);
      expect(calculateSandPerClick(baseState, 0.5)).toBe(0.5);
    });
  });

  describe('Bigger Buckets (additive to base)', () => {
    it('should add 0.1 per power level', () => {
      expect(calculateSandPerClick({ ...baseState, biggerBuckets: 1 })).toBe(1.1);
      expect(calculateSandPerClick({ ...baseState, biggerBuckets: 5 })).toBe(1.5);
      expect(calculateSandPerClick({ ...baseState, biggerBuckets: 10 })).toBe(2);
    });
  });

  describe('multiplicative tier 1 (Huge Buckets, Buccaneer)', () => {
    it('should double with Huge Buckets', () => {
      expect(calculateSandPerClick({ ...baseState, hugeBuckets: true })).toBe(2);
    });

    it('should double with Buccaneer', () => {
      expect(calculateSandPerClick({ ...baseState, buccaneer: true })).toBe(2);
    });

    it('should stack multiplicatively (x4 with both)', () => {
      expect(calculateSandPerClick({
        ...baseState,
        hugeBuckets: true,
        buccaneer: true,
      })).toBe(4);
    });

    it('should apply after Bigger Buckets', () => {
      // (1 + 0.1*5) * 2 = 1.5 * 2 = 3
      expect(calculateSandPerClick({
        ...baseState,
        biggerBuckets: 5,
        hugeBuckets: true,
      })).toBe(3);
    });
  });

  describe('pair bonuses (additive)', () => {
    it('should add 0.5 per Bucket+Cuegan pair with Helpful Hands', () => {
      expect(calculateSandPerClick({
        ...baseState,
        helpfulHands: true,
        buckets: 10,
        cuegans: 5,
      })).toBe(1 + 0.5 * 5); // min(10, 5) = 5 pairs
    });

    it('should add 5 per Flag+Cuegan pair with True Colours', () => {
      expect(calculateSandPerClick({
        ...baseState,
        trueColours: true,
        flags: 8,
        cuegans: 10,
      })).toBe(1 + 5 * 8); // min(8, 10) = 8 pairs
    });

    it('should add 50 per Flag+Ladder pair with Raise the Flag', () => {
      expect(calculateSandPerClick({
        ...baseState,
        raiseTheFlag: true,
        flags: 3,
        ladders: 5,
      })).toBe(1 + 50 * 3); // min(3, 5) = 3 pairs
    });

    it('should add 500 per Bag+Ladder pair with Hand it Up', () => {
      expect(calculateSandPerClick({
        ...baseState,
        handItUp: true,
        bags: 2,
        ladders: 4,
      })).toBe(1 + 500 * 2); // min(2, 4) = 2 pairs
    });

    it('should stack multiple pair bonuses', () => {
      // 1 + 0.5*2 + 5*3 = 1 + 1 + 15 = 17
      expect(calculateSandPerClick({
        ...baseState,
        helpfulHands: true,
        trueColours: true,
        buckets: 5,
        cuegans: 2,
        flags: 3,
      })).toBe(1 + 0.5 * 2 + 5 * 2); // cuegans=2 limits both
    });
  });

  describe('percentage bonuses (additive)', () => {
    it('should add 1% of sandPermNP per 50 buckets with Bucket Brigade', () => {
      expect(calculateSandPerClick({
        ...baseState,
        bucketBrigade: true,
        buckets: 100,
        sandPermNP: 1000,
      })).toBe(1 + 1000 * 0.01 * 2); // floor(100/50) = 2
    });

    it('should apply Bag Puns based on bags above 25', () => {
      // At 30 bags: floor((30-25)/5) = 1, so +40% of baseRate
      expect(calculateSandPerClick({
        ...baseState,
        bagPuns: true,
        bags: 30,
      })).toBe(1 + 1 * 0.4 * 1); // 1.4

      // At 40 bags: floor((40-25)/5) = 3, so +120% of baseRate
      expect(calculateSandPerClick({
        ...baseState,
        bagPuns: true,
        bags: 40,
      })).toBe(1 + 1 * 0.4 * 3); // 2.2
    });

    it('should apply negative Bag Puns below 25 bags (capped at -2)', () => {
      // At 20 bags: floor((20-25)/5) = -1, so -40% of baseRate
      expect(calculateSandPerClick({
        ...baseState,
        bagPuns: true,
        bags: 20,
      })).toBe(1 + 1 * 0.4 * -1); // 0.6

      // At 0 bags: floor((0-25)/5) = -5, but capped at -2, so -80% of baseRate
      expect(calculateSandPerClick({
        ...baseState,
        bagPuns: true,
        bags: 0,
      })).toBe(1 + 1 * 0.4 * -2); // 0.2
    });
  });

  describe('Bone Clicker (final multiplicative)', () => {
    it('should multiply by bonemeal*5 when Bone Clicker owned and bonemeal >= 1', () => {
      expect(calculateSandPerClick({
        ...baseState,
        boneClicker: true,
        bonemeal: 2,
      })).toBe(1 * 2 * 5); // 10
    });

    it('should not apply when bonemeal < 1', () => {
      expect(calculateSandPerClick({
        ...baseState,
        boneClicker: true,
        bonemeal: 0,
      })).toBe(1);
    });

    it('should not apply when Bone Clicker not owned', () => {
      expect(calculateSandPerClick({
        ...baseState,
        boneClicker: false,
        bonemeal: 10,
      })).toBe(1);
    });

    it('should apply after all other bonuses', () => {
      // (1 + 0.5) * 2 * (2*5) = 1.5 * 2 * 10 = 30
      expect(calculateSandPerClick({
        ...baseState,
        biggerBuckets: 5, // +0.5
        hugeBuckets: true, // x2
        boneClicker: true,
        bonemeal: 2, // x10
      })).toBe((1 + 0.5) * 2 * 10);
    });
  });

  describe('complex stacking scenarios', () => {
    it('should correctly stack all multiplicative and additive bonuses', () => {
      // Base: 1 + 0.1*10 = 2
      // Mult tier 1: 2 * 2 * 2 = 8
      // Pair: +0.5*5 = 10.5
      // Bucket Brigade: +100*0.01*1 = 11.5
      // Bone Clicker: 11.5 * 1*5 = 57.5
      const result = calculateSandPerClick({
        biggerBuckets: 10,
        hugeBuckets: true,
        buccaneer: true,
        helpfulHands: true,
        trueColours: false,
        raiseTheFlag: false,
        handItUp: false,
        bucketBrigade: true,
        bagPuns: false,
        boneClicker: true,
        bonemeal: 1,
        buckets: 50,
        cuegans: 5,
        flags: 0,
        ladders: 0,
        bags: 0,
        sandPermNP: 100,
      });

      // Step by step:
      // 1. Base: 1 + 10*0.1 = 2
      // 2. Mult: 2 * 2 * 2 = 8
      // 3. Helpful Hands: 8 + 0.5*min(50,5) = 8 + 2.5 = 10.5
      // 4. Bucket Brigade: 10.5 + 100*0.01*floor(50/50) = 10.5 + 1 = 11.5
      // 5. Bone Clicker: 11.5 * 1*5 = 57.5
      expect(result).toBe(57.5);
    });

    it('should apply global multiplier last', () => {
      const result = calculateSandPerClick({
        ...baseState,
        biggerBuckets: 10, // 1 + 1 = 2
        hugeBuckets: true, // 2 * 2 = 4
      }, 3); // 4 * 3 = 12

      expect(result).toBe(12);
    });
  });
});

// =============================================================================
// Glass Production tests
// =============================================================================

describe('calculateChipsPerBlock', () => {
  it('should return 20 chips per block by default', () => {
    expect(calculateChipsPerBlock(false, false)).toBe(20);
  });

  it('should return 5 chips per block with Ruthless Efficiency', () => {
    expect(calculateChipsPerBlock(true, false)).toBe(5);
  });

  it('should divide by 5 with Glass Trolling enabled', () => {
    expect(calculateChipsPerBlock(false, true)).toBe(4); // 20 / 5
    expect(calculateChipsPerBlock(true, true)).toBe(1);  // 5 / 5
  });
});

describe('calculateGlassChipProduction', () => {
  const baseState: GlassChipProductionState = {
    sandRefineryPower: 0,
    goats: 0,
    hasGlassGoat: false,
    papalChipsMult: 1,
  };

  it('should produce (refineryPower + 1) chips at base', () => {
    expect(calculateGlassChipProduction({ ...baseState, sandRefineryPower: 0 })).toBe(1);
    expect(calculateGlassChipProduction({ ...baseState, sandRefineryPower: 9 })).toBe(10);
    expect(calculateGlassChipProduction({ ...baseState, sandRefineryPower: 99 })).toBe(100);
  });

  it('should multiply by times parameter', () => {
    expect(calculateGlassChipProduction({ ...baseState, sandRefineryPower: 9 }, 2)).toBe(20);
    expect(calculateGlassChipProduction({ ...baseState, sandRefineryPower: 4 }, 3)).toBe(15);
  });

  it('should apply Glass Goat multiplier (goats * 5)', () => {
    expect(calculateGlassChipProduction({
      ...baseState,
      sandRefineryPower: 9,
      hasGlassGoat: true,
      goats: 2,
    })).toBe(10 * 2 * 5); // 100
  });

  it('should not apply Glass Goat multiplier when goats < 1', () => {
    expect(calculateGlassChipProduction({
      ...baseState,
      sandRefineryPower: 9,
      hasGlassGoat: true,
      goats: 0,
    })).toBe(10);
  });

  it('should not apply Glass Goat multiplier when not owned', () => {
    expect(calculateGlassChipProduction({
      ...baseState,
      sandRefineryPower: 9,
      hasGlassGoat: false,
      goats: 10,
    })).toBe(10);
  });

  it('should apply papal multiplier', () => {
    expect(calculateGlassChipProduction({
      ...baseState,
      sandRefineryPower: 9,
      papalChipsMult: 2,
    })).toBe(20);
  });

  it('should floor the result', () => {
    expect(calculateGlassChipProduction({
      ...baseState,
      sandRefineryPower: 9,
      papalChipsMult: 1.5,
    })).toBe(15); // floor(10 * 1.5)
  });

  it('should combine all multipliers correctly', () => {
    // (power + 1) * times * goatMult * papalMult
    // (4 + 1) * 2 * (3 * 5) * 1.5 = 5 * 2 * 15 * 1.5 = 225
    expect(calculateGlassChipProduction({
      sandRefineryPower: 4,
      hasGlassGoat: true,
      goats: 3,
      papalChipsMult: 1.5,
    }, 2)).toBe(225);
  });
});

describe('calculateGlassBlockProduction', () => {
  const baseState: GlassBlockProductionState = {
    glassChillerPower: 0,
    glassChips: 100,
    goats: 0,
    hasGlassGoat: false,
    papalBlocksMult: 1,
    hasRuthlessEfficiency: false,
    glassTrollingEnabled: false,
  };

  it('should produce min(chillerLevel + 1, chips / chipsPerBlock) blocks', () => {
    // chipsPerBlock = 20 (default)
    // chillerLevel = 1, chips = 100, max from chips = 5
    // min(1, 5) = 1 block
    expect(calculateGlassBlockProduction({ ...baseState, glassChillerPower: 0 }).blocksProduced).toBe(1);

    // chillerLevel = 10, chips = 100, max from chips = 5
    // min(10, 5) = 5 blocks
    expect(calculateGlassBlockProduction({ ...baseState, glassChillerPower: 9 }).blocksProduced).toBe(5);
  });

  it('should consume chips correctly', () => {
    const result = calculateGlassBlockProduction({ ...baseState, glassChillerPower: 0 });
    expect(result.chipsConsumed).toBe(20); // 1 block * 20 chips
  });

  it('should be limited by available chips', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 99, // would produce 100 blocks
      glassChips: 40, // only enough for 2 blocks
    });
    expect(result.blocksProduced).toBe(2);
    expect(result.chipsConsumed).toBe(40);
  });

  it('should return 0 when not enough chips for any blocks', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChips: 10, // less than 20 chips per block
    });
    expect(result.blocksProduced).toBe(0);
    expect(result.chipsConsumed).toBe(0);
  });

  it('should use fewer chips with Ruthless Efficiency', () => {
    // chipsPerBlock = 5 with Ruthless Efficiency
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      hasRuthlessEfficiency: true,
    });
    expect(result.blocksProduced).toBe(1);
    expect(result.chipsConsumed).toBe(5);
  });

  it('should use fewer chips with Glass Trolling', () => {
    // chipsPerBlock = 20 / 5 = 4 with Glass Trolling
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      glassTrollingEnabled: true,
    });
    expect(result.blocksProduced).toBe(1);
    expect(result.chipsConsumed).toBe(4);
  });

  it('should apply Glass Goat multiplier to blocks produced', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      hasGlassGoat: true,
      goats: 2,
    });
    // 1 block base * (2 goats * 5) = 10 blocks
    expect(result.blocksProduced).toBe(10);
    // But only consumes chips for 1 base block
    expect(result.chipsConsumed).toBe(20);
  });

  it('should apply papal multiplier', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      papalBlocksMult: 3,
    });
    expect(result.blocksProduced).toBe(3);
  });

  it('should floor the result', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      papalBlocksMult: 1.7,
    });
    expect(result.blocksProduced).toBe(1); // floor(1 * 1.7)
  });

  it('should multiply by times parameter', () => {
    const result = calculateGlassBlockProduction({
      ...baseState,
      glassChillerPower: 0,
      glassChips: 200,
    }, 3);
    // chillerLevel = (0 + 1) * 3 = 3
    // max from chips = 200 / 20 = 10
    // min(3, 10) = 3 blocks
    expect(result.blocksProduced).toBe(3);
    expect(result.chipsConsumed).toBe(60); // 3 * 20
  });
});

describe('calculateSandRefineryIncrement', () => {
  it('should return 1 / (purifierPower + 2) with Sand Purifier', () => {
    // Power 0: 1 / 2 = 0.5
    expect(calculateSandRefineryIncrement(0, false, 0)).toBe(0.5);
    // Power 8: 1 / 10 = 0.1
    expect(calculateSandRefineryIncrement(8, false, 0)).toBe(0.1);
  });

  it('should apply Badgers badge efficiency', () => {
    // With 30 badges: 0.99^3 = ~0.970299
    const inc = calculateSandRefineryIncrement(0, true, 30);
    expect(inc).toBeCloseTo(0.5 * Math.pow(0.99, 3), 10);
  });

  it('should stack Sand Purifier and Badgers', () => {
    // Power 8, 50 badges: (1/10) * 0.99^5
    const inc = calculateSandRefineryIncrement(8, true, 50);
    expect(inc).toBeCloseTo(0.1 * Math.pow(0.99, 5), 10);
  });
});

describe('calculateGlassChillerIncrement', () => {
  it('should return 1 / (extruderPower + 2) with Glass Extruder', () => {
    expect(calculateGlassChillerIncrement(0, false, 0)).toBe(0.5);
    expect(calculateGlassChillerIncrement(8, false, 0)).toBe(0.1);
  });

  it('should apply Mushrooms badge efficiency', () => {
    const inc = calculateGlassChillerIncrement(0, true, 30);
    expect(inc).toBeCloseTo(0.5 * Math.pow(0.99, 3), 10);
  });
});

describe('calculateGlassFurnaceSandUse', () => {
  const baseState: GlassSandUsageState = {
    sandRefineryPower: 0,
    glassChillerPower: 0,
    sandPurifierPower: 0,
    glassExtruderPower: 0,
    glassFurnaceEnabled: true,
    glassBlowerEnabled: false,
    hasBadgers: false,
    hasMushrooms: false,
    badgesOwned: 0,
  };

  it('should return 0 when Glass Furnace is disabled', () => {
    expect(calculateGlassFurnaceSandUse({ ...baseState, glassFurnaceEnabled: false })).toBe(0);
  });

  it('should return (refineryPower + 1) * increment', () => {
    // Power 0, no purifier: (0 + 1) * 0.5 = 0.5
    expect(calculateGlassFurnaceSandUse({ ...baseState })).toBe(0.5);
    // Power 9, no purifier: (9 + 1) * 0.5 = 5
    expect(calculateGlassFurnaceSandUse({ ...baseState, sandRefineryPower: 9 })).toBe(5);
  });

  it('should reduce with higher Sand Purifier power', () => {
    // Power 9, purifier power 8: (9 + 1) * (1/10) = 1
    expect(calculateGlassFurnaceSandUse({
      ...baseState,
      sandRefineryPower: 9,
      sandPurifierPower: 8,
    })).toBe(1);
  });
});

describe('calculateGlassBlowerSandUse', () => {
  const baseState: GlassSandUsageState = {
    sandRefineryPower: 0,
    glassChillerPower: 0,
    sandPurifierPower: 0,
    glassExtruderPower: 0,
    glassFurnaceEnabled: false,
    glassBlowerEnabled: true,
    hasBadgers: false,
    hasMushrooms: false,
    badgesOwned: 0,
  };

  it('should return 0 when Glass Blower is disabled', () => {
    expect(calculateGlassBlowerSandUse({ ...baseState, glassBlowerEnabled: false })).toBe(0);
  });

  it('should return (chillerPower + 1) * increment', () => {
    expect(calculateGlassBlowerSandUse({ ...baseState })).toBe(0.5);
    expect(calculateGlassBlowerSandUse({ ...baseState, glassChillerPower: 9 })).toBe(5);
  });

  it('should reduce with higher Glass Extruder power', () => {
    expect(calculateGlassBlowerSandUse({
      ...baseState,
      glassChillerPower: 9,
      glassExtruderPower: 8,
    })).toBe(1);
  });
});

describe('calculateTotalGlassUse', () => {
  it('should sum furnace and blower sand usage', () => {
    const state: GlassSandUsageState = {
      sandRefineryPower: 9,
      glassChillerPower: 9,
      sandPurifierPower: 0,
      glassExtruderPower: 0,
      glassFurnaceEnabled: true,
      glassBlowerEnabled: true,
      hasBadgers: false,
      hasMushrooms: false,
      badgesOwned: 0,
    };
    // Furnace: 10 * 0.5 = 5
    // Blower: 10 * 0.5 = 5
    // Total: 10
    expect(calculateTotalGlassUse(state)).toBe(10);
  });

  it('should return 0 when both are disabled', () => {
    const state: GlassSandUsageState = {
      sandRefineryPower: 9,
      glassChillerPower: 9,
      sandPurifierPower: 0,
      glassExtruderPower: 0,
      glassFurnaceEnabled: false,
      glassBlowerEnabled: false,
      hasBadgers: false,
      hasMushrooms: false,
      badgesOwned: 0,
    };
    expect(calculateTotalGlassUse(state)).toBe(0);
  });
});
