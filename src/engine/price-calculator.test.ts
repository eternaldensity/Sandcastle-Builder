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
