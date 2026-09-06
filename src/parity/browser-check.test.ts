/**
 * Tests for the browser availability check.
 *
 * Note: `isChromiumAvailable()` caches its result per process, so these
 * tests only assert the uncached shape. The `PARITY_NO_BROWSER=1` path is
 * exercised by running any browser suite with that variable set and
 * observing the suites skip.
 */

import { describe, it, expect } from 'vitest';
import { isChromiumAvailable, chromiumUnavailableReason } from './browser-check.js';

describe('browser-check', () => {
  it('should return a boolean for Chromium availability', () => {
    expect(typeof isChromiumAvailable()).toBe('boolean');
  });

  it('should return a stable (cached) result', () => {
    expect(isChromiumAvailable()).toBe(isChromiumAvailable());
  });

  it('should provide a non-empty install hint', () => {
    const reason = chromiumUnavailableReason();
    expect(reason).toContain('test:parity:install');
  });
});
