/**
 * Browser availability check for parity tests.
 *
 * The browser-backed parity suites (LegacyEngine comparisons) need a
 * Playwright Chromium binary. That binary is platform-specific and is not
 * always present: fresh clones, minimal Linux containers, and WSL without
 * system libraries all lack it. Rather than failing `npm test` in those
 * environments, browser suites skip cleanly when no binary is available.
 *
 * To run the full parity suite on any platform:
 *   npm run test:parity:install   # downloads the Playwright Chromium build
 * On Linux the browser also needs system libraries:
 *   npx playwright install-deps chromium   # requires sudo
 */

import { chromium } from 'playwright';
import * as fs from 'fs';

let cached: boolean | null = null;

/**
 * Whether a Playwright Chromium executable exists on disk.
 * This is a filesystem check only (no browser launch), so it is cheap
 * enough to evaluate at test-file import time.
 *
 * Note: an existing executable can still fail to launch when system
 * libraries are missing (minimal containers). That case surfaces as a
 * launch error with an install hint from LegacyEngine, not a silent pass.
 */
export function isChromiumAvailable(): boolean {
  if (cached === null) {
    if (process.env.PARITY_NO_BROWSER) {
      cached = false;
    } else {
      try {
        cached = fs.existsSync(chromium.executablePath());
      } catch {
        cached = false;
      }
    }
  }
  return cached;
}

/**
 * Human-readable reason used in skip messages.
 */
export function chromiumUnavailableReason(): string {
  return (
    'Chromium not installed; run `npm run test:parity:install` ' +
    '(Linux may also need `npx playwright install-deps chromium`)'
  );
}
