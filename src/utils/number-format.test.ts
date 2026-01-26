/**
 * Unit tests for number formatting utilities.
 *
 * Tests cover:
 * - molpify: Number to abbreviated string conversion
 * - deMolpify: Abbreviated string to number parsing
 * - Round-trip consistency
 * - Edge cases and special values
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  molpify,
  deMolpify,
  clearParseCache,
  capitalise,
  plural,
  flandom,
  randbool,
  randomChoice,
  isResourceInfinite,
  formatInfinity,
  POSTFIXES,
  type MolpifyOptions,
} from './number-format.js';

describe('molpify', () => {
  describe('basic formatting', () => {
    it('formats small numbers without postfix', () => {
      expect(molpify(0)).toBe('0');
      expect(molpify(1)).toBe('1');
      expect(molpify(42)).toBe('42');
      expect(molpify(999)).toBe('999');
    });

    it('adds comma separators for thousands below K threshold', () => {
      expect(molpify(1000)).toBe('1,000');
      expect(molpify(1234)).toBe('1,234');
      expect(molpify(8999)).toBe('8,999'); // Just below 9K threshold
    });

    it('uses K postfix for numbers >= 9000', () => {
      expect(molpify(9000)).toBe('9K');
      expect(molpify(10000)).toBe('10K');
      expect(molpify(50000)).toBe('50K');
    });

    it('uses M postfix for millions', () => {
      expect(molpify(1000000)).toBe('1M');
      expect(molpify(2500000)).toBe('2M'); // Uses M since >= 1M limit
      expect(molpify(10000000)).toBe('10M');
    });

    it('uses G postfix for billions', () => {
      expect(molpify(1e9)).toBe('1G');
      expect(molpify(5e9)).toBe('5G');
    });

    it('uses T postfix for trillions', () => {
      expect(molpify(1e12)).toBe('1T');
      expect(molpify(1.5e12)).toBe('1T'); // Uses T since >= 1T limit
    });

    it('handles very large numbers', () => {
      expect(molpify(1e15)).toBe('1P');
      expect(molpify(1e18)).toBe('1E');
      expect(molpify(1e21)).toBe('1Z');
      expect(molpify(1e24)).toBe('1Y');
    });

    it('handles game-specific large units', () => {
      expect(molpify(1e27)).toBe('1U');
      expect(molpify(1e30)).toBe('1S');
      expect(molpify(1e33)).toBe('1H');
      expect(molpify(1e36)).toBe('1F');
      expect(molpify(1e39)).toBe('1L');
      expect(molpify(1e42)).toBe('1W');
      expect(molpify(1e210)).toBe('1Q');
    });
  });

  describe('decimal places', () => {
    it('shows specified decimal places', () => {
      expect(molpify(1.5, 1)).toBe('1.5');
      expect(molpify(1.23, 2)).toBe('1.23');
      expect(molpify(1.234, 3)).toBe('1.234');
    });

    it('pads with zeros when needed', () => {
      expect(molpify(1.1, 2)).toBe('1.10');
      expect(molpify(1.01, 2)).toBe('1.01');
      expect(molpify(1, 2)).toBe('1');
    });

    it('truncates decimals to specified precision', () => {
      // Legacy behavior truncates, doesn't round
      expect(molpify(1.999, 2)).toBe('1.99');
      expect(molpify(1.996, 2)).toBe('1.99');
      expect(molpify(1.234, 2)).toBe('1.23');
    });
  });

  describe('special values', () => {
    it('handles NaN', () => {
      expect(molpify(NaN)).toBe('Mustard');
    });

    it('handles Infinity', () => {
      expect(molpify(Infinity)).toBe('Infinite');
      expect(molpify(-Infinity)).toBe('-Infinite');
    });

    it('handles negative numbers', () => {
      expect(molpify(-1)).toBe('-1');
      expect(molpify(-1000)).toBe('-1,000');
      expect(molpify(-1e6)).toBe('-1M');
    });

    it('handles zero', () => {
      expect(molpify(0)).toBe('0');
      expect(molpify(0, 2)).toBe('0');
    });
  });

  describe('science mode', () => {
    const scienceOptions: MolpifyOptions = { science: true };

    it('shows Easter egg for Pi values', () => {
      expect(molpify(3, 0, scienceOptions)).toBe('Math.floor(Math.PI)');
      expect(molpify(4, 0, scienceOptions)).toBe('Math.ceil(Math.PI)');
    });

    it('does not use postfixes in science mode', () => {
      expect(molpify(9000, 0, scienceOptions)).toBe('9,000');
      expect(molpify(1e6, 0, scienceOptions)).toBe('1,000,000');
    });
  });

  describe('long postfix mode', () => {
    const longOptions: MolpifyOptions = { longPostfix: true };

    it('uses long postfix names', () => {
      expect(molpify(9000, 0, longOptions)).toBe('9 Kilo');
      expect(molpify(1e6, 0, longOptions)).toBe('1 Mega');
      expect(molpify(1e9, 0, longOptions)).toBe('1 Giga');
    });
  });

  describe('european format', () => {
    const euroOptions: MolpifyOptions = { european: true };

    it('swaps comma and period', () => {
      expect(molpify(1234, 0, euroOptions)).toBe('1.234');
      expect(molpify(1.5, 1, euroOptions)).toBe('1,5');
      expect(molpify(1234.56, 2, euroOptions)).toBe('1.234,56');
    });
  });
});

describe('deMolpify', () => {
  beforeEach(() => {
    clearParseCache();
  });

  describe('basic parsing', () => {
    it('parses plain numbers', () => {
      expect(deMolpify('0')).toBe(0);
      expect(deMolpify('1')).toBe(1);
      expect(deMolpify('42')).toBe(42);
      expect(deMolpify('1000')).toBe(1000);
    });

    it('parses decimal numbers', () => {
      expect(deMolpify('1.5')).toBe(1.5);
      expect(deMolpify('3.14159')).toBe(3.14159);
    });

    it('parses K postfix', () => {
      expect(deMolpify('1K')).toBe(1000);
      expect(deMolpify('5K')).toBe(5000);
      expect(deMolpify('2.5K')).toBe(2500);
    });

    it('parses M postfix', () => {
      expect(deMolpify('1M')).toBe(1e6);
      expect(deMolpify('2.5M')).toBe(2.5e6);
    });

    it('parses G postfix', () => {
      expect(deMolpify('1G')).toBe(1e9);
      expect(deMolpify('3.5G')).toBe(3.5e9);
    });

    it('parses larger postfixes', () => {
      expect(deMolpify('1T')).toBe(1e12);
      expect(deMolpify('1P')).toBe(1e15);
      expect(deMolpify('1E')).toBe(1e18);
      expect(deMolpify('1Z')).toBe(1e21);
      expect(deMolpify('1Y')).toBe(1e24);
    });

    it('parses game-specific postfixes', () => {
      expect(deMolpify('1U')).toBe(1e27);
      expect(deMolpify('1S')).toBe(1e30);
      expect(deMolpify('1H')).toBe(1e33);
      expect(deMolpify('1F')).toBe(1e36);
      expect(deMolpify('1L')).toBe(1e39);
      expect(deMolpify('1W')).toBe(1e42);
      expect(deMolpify('1Q')).toBe(1e210);
    });

    it('handles lowercase postfixes', () => {
      expect(deMolpify('1k')).toBe(1000);
      expect(deMolpify('1m')).toBe(1e6);
      expect(deMolpify('1g')).toBe(1e9);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for null/undefined', () => {
      expect(deMolpify(null)).toBe(0);
      expect(deMolpify(undefined)).toBe(0);
    });

    it('returns 0 for empty string', () => {
      expect(deMolpify('')).toBe(0);
    });

    it('handles unknown postfix characters', () => {
      // Unknown characters are stripped
      expect(deMolpify('100x')).toBe(100);
    });

    it('caches parsed values', () => {
      // First parse
      const result1 = deMolpify('5M');
      // Should return cached value
      const result2 = deMolpify('5M');
      expect(result1).toBe(result2);
      expect(result1).toBe(5e6);
    });
  });

  describe('nested postfixes', () => {
    it('handles stacked postfixes', () => {
      // In legacy, stacked postfixes multiply
      expect(deMolpify('1KK')).toBe(1e6); // 1K * 1K = 1M
      expect(deMolpify('1MK')).toBe(1e9); // 1M * 1K = 1G
    });
  });
});

describe('round-trip consistency', () => {
  beforeEach(() => {
    clearParseCache();
  });

  it('molpify then deMolpify returns approximately original value', () => {
    // Test values that don't use postfixes (exact round-trip)
    const exactValues = [0, 1, 42, 1000, 5000];
    for (const value of exactValues) {
      const formatted = molpify(value);
      const parsed = deMolpify(formatted.replace(/,/g, '')); // Remove commas for parsing
      expect(parsed).toBe(value);
    }

    // Test values with postfixes (lose precision due to integer division)
    const postfixValues = [9000, 1e6, 1e9, 1e12];
    for (const value of postfixValues) {
      const formatted = molpify(value);
      const parsed = deMolpify(formatted);
      // Should be within same order of magnitude
      expect(parsed).toBeGreaterThanOrEqual(value * 0.9);
      expect(parsed).toBeLessThanOrEqual(value * 1.1);
    }
  });

  it('handles decimal round-trips', () => {
    const value = 1.5e6;
    const formatted = molpify(value, 1);
    const parsed = deMolpify(formatted);
    expect(parsed).toBeCloseTo(value, -3);
  });
});

describe('capitalise', () => {
  it('capitalizes first letter', () => {
    expect(capitalise('hello')).toBe('Hello');
    expect(capitalise('world')).toBe('World');
  });

  it('handles already capitalized', () => {
    expect(capitalise('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalise('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalise('a')).toBe('A');
    expect(capitalise('A')).toBe('A');
  });
});

describe('plural', () => {
  it('returns empty for singular', () => {
    expect(plural(1)).toBe('');
    expect(plural(1, 'es')).toBe('');
  });

  it('returns suffix for plural', () => {
    expect(plural(0)).toBe('s');
    expect(plural(2)).toBe('s');
    expect(plural(100)).toBe('s');
  });

  it('uses custom suffix', () => {
    expect(plural(0, 'es')).toBe('es');
    expect(plural(2, 'ies')).toBe('ies');
  });
});

describe('flandom', () => {
  it('returns values in range [0, n)', () => {
    for (let i = 0; i < 100; i++) {
      const result = flandom(10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('returns 0 for n=1', () => {
    for (let i = 0; i < 10; i++) {
      expect(flandom(1)).toBe(0);
    }
  });
});

describe('randbool', () => {
  it('returns boolean values', () => {
    for (let i = 0; i < 100; i++) {
      const result = randbool();
      expect(typeof result).toBe('boolean');
    }
  });
});

describe('randomChoice', () => {
  it('returns element from array', () => {
    const items = ['a', 'b', 'c'];
    for (let i = 0; i < 100; i++) {
      const result = randomChoice(items);
      expect(items).toContain(result);
    }
  });

  it('works with single element', () => {
    const items = ['only'];
    expect(randomChoice(items)).toBe('only');
  });
});

describe('POSTFIXES', () => {
  it('is sorted by limit descending', () => {
    for (let i = 1; i < POSTFIXES.length; i++) {
      expect(POSTFIXES[i - 1].limit).toBeGreaterThan(POSTFIXES[i].limit);
    }
  });

  it('has unique short postfixes', () => {
    const shorts = POSTFIXES.map((p) => p.postfix[0]);
    const unique = new Set(shorts);
    expect(unique.size).toBe(shorts.length);
  });
});

describe('isResourceInfinite', () => {
  it('returns true for positive infinity', () => {
    expect(isResourceInfinite(Infinity)).toBe(true);
  });

  it('returns true for negative infinity', () => {
    expect(isResourceInfinite(-Infinity)).toBe(true);
  });

  it('returns true for MAX_SAFE_INTEGER', () => {
    expect(isResourceInfinite(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it('returns true for values above MAX_SAFE_INTEGER', () => {
    expect(isResourceInfinite(Number.MAX_SAFE_INTEGER + 1)).toBe(true);
    expect(isResourceInfinite(Number.MAX_SAFE_INTEGER * 2)).toBe(true);
  });

  it('returns false for finite numbers below MAX_SAFE_INTEGER', () => {
    expect(isResourceInfinite(0)).toBe(false);
    expect(isResourceInfinite(1)).toBe(false);
    expect(isResourceInfinite(1e12)).toBe(false);
    expect(isResourceInfinite(1e15)).toBe(false);
    expect(isResourceInfinite(Number.MAX_SAFE_INTEGER - 1)).toBe(false);
  });

  it('returns false for negative finite numbers', () => {
    expect(isResourceInfinite(-1)).toBe(false);
    expect(isResourceInfinite(-1e12)).toBe(false);
  });

  it('returns true for NaN (not finite)', () => {
    expect(isResourceInfinite(NaN)).toBe(true);
  });
});

describe('formatInfinity', () => {
  describe('text mode (useSymbol=false)', () => {
    it('returns "Infinite" for positive infinity', () => {
      expect(formatInfinity(Infinity, false)).toBe('Infinite');
    });

    it('returns "-Infinite" for negative infinity', () => {
      expect(formatInfinity(-Infinity, false)).toBe('-Infinite');
    });

    it('returns "Mustard" for NaN', () => {
      expect(formatInfinity(NaN, false)).toBe('Mustard');
    });

    it('returns "Infinite" for MAX_SAFE_INTEGER', () => {
      expect(formatInfinity(Number.MAX_SAFE_INTEGER, false)).toBe('Infinite');
    });

    it('returns "-Infinite" for negative MAX_SAFE_INTEGER', () => {
      expect(formatInfinity(-Number.MAX_SAFE_INTEGER, false)).toBe('-Infinite');
    });

    it('returns null for finite numbers', () => {
      expect(formatInfinity(0, false)).toBe(null);
      expect(formatInfinity(1, false)).toBe(null);
      expect(formatInfinity(1e12, false)).toBe(null);
      expect(formatInfinity(-1e12, false)).toBe(null);
    });
  });

  describe('symbol mode (useSymbol=true)', () => {
    it('returns "∞" for positive infinity', () => {
      expect(formatInfinity(Infinity, true)).toBe('∞');
    });

    it('returns "-∞" for negative infinity', () => {
      expect(formatInfinity(-Infinity, true)).toBe('-∞');
    });

    it('returns "Mustard" for NaN', () => {
      expect(formatInfinity(NaN, true)).toBe('Mustard');
    });

    it('returns "∞" for MAX_SAFE_INTEGER', () => {
      expect(formatInfinity(Number.MAX_SAFE_INTEGER, true)).toBe('∞');
    });

    it('returns "-∞" for negative MAX_SAFE_INTEGER', () => {
      expect(formatInfinity(-Number.MAX_SAFE_INTEGER, true)).toBe('-∞');
    });

    it('returns null for finite numbers', () => {
      expect(formatInfinity(0, true)).toBe(null);
      expect(formatInfinity(1, true)).toBe(null);
      expect(formatInfinity(1e12, true)).toBe(null);
    });
  });

  describe('default mode (useSymbol omitted)', () => {
    it('defaults to text mode', () => {
      expect(formatInfinity(Infinity)).toBe('Infinite');
      expect(formatInfinity(-Infinity)).toBe('-Infinite');
    });
  });
});
