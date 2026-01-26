/**
 * Number Formatting Utilities
 *
 * Pure functions extracted from legacy redundancy.js for:
 * - Molpify: Convert numbers to human-readable abbreviated format
 * - DeMolpify: Parse abbreviated numbers back to numeric values
 *
 * These are core functions used throughout the game for displaying
 * large numbers in a compact, readable format.
 */

/**
 * Postfix definitions for number abbreviation.
 * Each entry defines:
 * - limit: minimum value to use this postfix
 * - divisor: what to divide by when using this postfix
 * - postfix: [short, long] forms of the suffix
 */
export interface PostfixDef {
  limit: number;
  divisor: number;
  postfix: [string, string]; // [short, long]
}

/**
 * Standard postfixes from smallest to largest.
 * K=Kilo, M=Mega, G=Giga, etc. plus game-specific large units.
 */
export const POSTFIXES: readonly PostfixDef[] = [
  { limit: 1e210, divisor: 1e210, postfix: ['Q', ' Quita'] },
  { limit: 1e42, divisor: 1e42, postfix: ['W', ' Wololo'] },
  { limit: 1e39, divisor: 1e39, postfix: ['L', ' Lotta'] },
  { limit: 1e36, divisor: 1e36, postfix: ['F', ' Ferro'] },
  { limit: 1e33, divisor: 1e33, postfix: ['H', ' Helo'] },
  { limit: 1e30, divisor: 1e30, postfix: ['S', ' Squilli'] },
  { limit: 1e27, divisor: 1e27, postfix: ['U', ' Umpty'] },
  { limit: 1e24, divisor: 1e24, postfix: ['Y', ' Yotta'] },
  { limit: 1e21, divisor: 1e21, postfix: ['Z', ' Zeta'] },
  { limit: 1e18, divisor: 1e18, postfix: ['E', ' Exa'] },
  { limit: 1e15, divisor: 1e15, postfix: ['P', ' Peta'] },
  { limit: 1e12, divisor: 1e12, postfix: ['T', ' Tera'] },
  { limit: 1e9, divisor: 1e9, postfix: ['G', ' Giga'] },
  { limit: 1e6, divisor: 1e6, postfix: ['M', ' Mega'] },
  { limit: 9e3, divisor: 1e3, postfix: ['K', ' Kilo'] },
] as const;

/**
 * Options for number formatting.
 */
export interface MolpifyOptions {
  /** Use scientific notation instead of postfixes */
  science?: boolean;
  /** Use long postfix names (e.g., " Mega" instead of "M") */
  longPostfix?: boolean;
  /** Use European format (comma as decimal, period as thousands) */
  european?: boolean;
  /** Maximum digits before switching to exponential notation (0 = disabled) */
  maxDigits?: number;
  /** Minimum decimal places to show */
  minDecimal?: number;
}

/**
 * Default formatting options matching legacy behavior.
 */
export const DEFAULT_OPTIONS: MolpifyOptions = {
  science: false,
  longPostfix: false,
  european: false,
  maxDigits: 0,
  minDecimal: 0,
};

/**
 * Inner formatting function - handles the core number conversion.
 * This is a pure function that takes explicit options rather than globals.
 *
 * @param number - The number to format
 * @param decimalPlaces - Number of decimal places to show
 * @param options - Formatting options
 * @returns Formatted string representation
 */
export function innerMolpify(
  number: number,
  decimalPlaces: number,
  options: MolpifyOptions
): string {
  // Handle special cases
  if (isNaN(number)) return 'Mustard';
  if (!isFinite(number)) {
    if (number < 0) return '-Infinite';
    return 'Infinite';
  }
  if (number < 0) return '-' + innerMolpify(-number, decimalPlaces, options);

  const usePostfixes = !options.science;
  const postfixIndex = options.longPostfix ? 1 : 0;

  // Check for postfix abbreviation
  if (usePostfixes) {
    for (const p of POSTFIXES) {
      if (number >= p.limit) {
        return (
          innerMolpify(number / p.divisor, decimalPlaces, options) +
          p.postfix[postfixIndex]
        );
      }
    }
  } else {
    // Science mode Easter eggs (matching legacy behavior)
    if (number === 3) return 'Math.floor(Math.PI)';
    if (number === 4) return 'Math.ceil(Math.PI)';
  }

  let result = '';

  if (decimalPlaces > 0) {
    // Handle decimal places
    const numCopy = number;
    const multiplier = Math.pow(10, decimalPlaces);
    let raft = numCopy * multiplier - Math.floor(numCopy) * multiplier;
    let sraft = Math.floor(raft).toString();

    let integerPart = numCopy;
    if (sraft.length > decimalPlaces) {
      // Decimal part rounded up to 1, increment integer
      integerPart++;
      sraft = '';
    } else if (raft) {
      // Pad with leading zeros
      while (sraft.length < decimalPlaces) {
        sraft = '0' + sraft;
      }
    }

    result =
      innerMolpify(integerPart, 0, options) + (raft ? '.' + sraft : '');
  } else {
    // Integer formatting
    let num = Math.floor(number);

    // Check if already in exponential notation
    let isExponential = num.toString().indexOf('e') !== -1;

    // Convert to exponential if too many digits
    if (options.maxDigits && !isExponential) {
      const edigits = (options.maxDigits || 0) + 8;
      if (num.toString().length > edigits) {
        num = parseFloat(num.toExponential()) as unknown as number;
        isExponential = true;
      }
    }

    // Convert to string with comma separation
    const numStr = num.toString();
    const chars = numStr.split('').reverse();

    for (let i = 0; i < chars.length; i++) {
      if (!isExponential && i % 3 === 0 && i > 0) {
        result = ',' + result;
      }
      result = chars[i] + result;
    }

    // Truncate exponential decimals to 6 places
    if (isExponential) {
      const dotIdx = result.indexOf('.') + 1;
      const expIdx = result.indexOf('e');
      if (dotIdx > 0 && expIdx > dotIdx) {
        result =
          result.slice(0, dotIdx) +
          result.slice(dotIdx, expIdx).slice(0, 6) +
          result.slice(expIdx);
      }
    }
  }

  return result;
}

/**
 * Format a number for display using abbreviated notation.
 *
 * Examples:
 * - 1000 → "1K"
 * - 1000000 → "1M"
 * - 1234567 → "1,234K" or "1.234M" depending on options
 *
 * @param number - The number to format
 * @param decimalPlaces - Number of decimal places (default: 0)
 * @param options - Formatting options (default: DEFAULT_OPTIONS)
 * @returns Formatted string representation
 */
export function molpify(
  number: number,
  decimalPlaces = 0,
  options: MolpifyOptions = DEFAULT_OPTIONS
): string {
  const effectiveDecimals = Math.max(decimalPlaces, options.minDecimal || 0);
  let result = innerMolpify(number, effectiveDecimals, options);

  // Apply European formatting (swap . and ,)
  if (options.european && !result.includes('Math.PI')) {
    result = result.replace('.', '~');
    result = result.replace(/,/g, '.');
    result = result.replace('~', ',');
  }

  return result;
}

/**
 * Cache for parsed values to improve performance.
 */
const parseCache = new Map<string, number>();

/**
 * Parse an abbreviated number string back to a numeric value.
 *
 * Examples:
 * - "1K" → 1000
 * - "2.5M" → 2500000
 * - "1.5G" → 1500000000
 *
 * @param input - The abbreviated number string to parse
 * @returns The numeric value
 */
export function deMolpify(input: string | null | undefined): number {
  if (!input) return 0;
  if (typeof input !== 'string') return 0;

  // Check cache
  const cached = parseCache.get(input);
  if (cached !== undefined) return cached;

  const lastChar = input.slice(-1);

  // Check if last character is a postfix letter
  if (isNaN(parseFloat(lastChar))) {
    // Look for matching postfix
    for (const p of POSTFIXES) {
      if (p.postfix[0] === lastChar.toUpperCase()) {
        const value = deMolpify(input.slice(0, -1)) * p.divisor;
        parseCache.set(input, value);
        return value;
      }
    }
    // Unknown character, strip and continue
    const value = deMolpify(input.slice(0, -1));
    parseCache.set(input, value);
    return value;
  }

  // No postfix, parse as number
  const value = parseFloat(input) || 0;
  parseCache.set(input, value);
  return value;
}

/**
 * Clear the parse cache. Useful for testing.
 */
export function clearParseCache(): void {
  parseCache.clear();
}

/**
 * Capitalize the first letter of a string.
 *
 * @param str - Input string
 * @returns String with first letter capitalized
 */
export function capitalise(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get plural suffix based on count.
 *
 * @param n - The count
 * @param suffix - The plural suffix (default: 's')
 * @returns Empty string if n === 1, otherwise the suffix
 */
export function plural(n: number, suffix = 's'): string {
  return n === 1 ? '' : suffix;
}

/**
 * Random integer from 0 to n-1 (inclusive).
 *
 * @param n - Upper bound (exclusive)
 * @returns Random integer
 */
export function flandom(n: number): number {
  return Math.floor(Math.random() * n);
}

/**
 * Random boolean.
 *
 * @returns true or false with equal probability
 */
export function randbool(): boolean {
  return Math.floor(Math.random() * 2) === 0;
}

/**
 * Choose a random element from an array.
 *
 * @param items - Array to choose from
 * @returns Random element from the array
 */
export function randomChoice<T>(items: readonly T[]): T {
  return items[flandom(items.length)];
}

/**
 * Check if a resource value should be considered infinite.
 *
 * A resource is infinite if:
 * - It's not a finite number (!isFinite)
 * - It's at or above Number.MAX_SAFE_INTEGER (effectively infinite)
 *
 * @param value - The resource value to check
 * @returns true if the resource is infinite, false otherwise
 */
export function isResourceInfinite(value: number): boolean {
  return !isFinite(value) || value >= Number.MAX_SAFE_INTEGER;
}

/**
 * Format an infinite value for display.
 *
 * Returns appropriate strings for infinite values:
 * - Positive infinity: "Infinite" (default) or "∞" (if useSymbol is true)
 * - Negative infinity: "-Infinite" or "-∞"
 * - NaN: "Mustard" (legacy behavior)
 * - Finite values: returns null (caller should use regular formatting)
 *
 * @param value - The value to check and format
 * @param useSymbol - If true, use "∞" symbol instead of "Infinite" text
 * @returns Formatted string if infinite/NaN, null if finite
 */
export function formatInfinity(value: number, useSymbol = false): string | null {
  if (isNaN(value)) {
    return 'Mustard';
  }

  if (!isFinite(value)) {
    const symbol = useSymbol ? '∞' : 'Infinite';
    return value < 0 ? `-${symbol}` : symbol;
  }

  // Check for effectively infinite (MAX_SAFE_INTEGER)
  if (value >= Number.MAX_SAFE_INTEGER) {
    return useSymbol ? '∞' : 'Infinite';
  }

  if (value <= -Number.MAX_SAFE_INTEGER) {
    return useSymbol ? '-∞' : '-Infinite';
  }

  // Value is finite and should use normal formatting
  return null;
}
