/**
 * LegacyEngine - Wrapper around the original Sandcastle Builder
 *
 * Runs the legacy game in a headless browser via Playwright and exposes
 * the Molpy object for testing and comparison.
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import { fileURLToPath } from 'url';
import type { BoostState, ToolState } from '../types/game-data.js';
import type { GameEngine, GameStateSnapshot, TestAction } from './game-engine.js';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Simple static file server for serving game files
 */
function createStaticServer(root: string): Promise<{ server: http.Server; port: number }> {
  return new Promise((resolve, reject) => {
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.mp3': 'audio/mpeg',
    };

    const server = http.createServer((req, res) => {
      // Parse URL and remove query string
      const urlPath = (req.url || '/').split('?')[0];

      // Decode URI and normalize path
      let requestPath = decodeURIComponent(urlPath);
      if (requestPath.endsWith('/')) {
        requestPath += 'index.html';
      }

      // Remove leading slash and join with root
      const relativePath = requestPath.startsWith('/') ? requestPath.slice(1) : requestPath;
      const filePath = path.join(root, relativePath);

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end(`Not found: ${requestPath}`);
          } else {
            res.writeHead(500);
            res.end('Server error');
          }
          return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        resolve({ server, port: addr.port });
      } else {
        reject(new Error('Failed to get server address'));
      }
    });

    server.on('error', reject);
  });
}

/**
 * LegacyEngine wraps the original Sandcastle Builder running in a headless browser.
 * It implements the GameEngine interface to enable parity testing.
 */
export class LegacyEngine implements GameEngine {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private server: http.Server | null = null;
  private serverPort: number = 0;
  private initialized = false;

  /**
   * Initialize the legacy engine by launching a headless browser
   * and loading castle.html via a local HTTP server.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Start a local HTTP server to serve game files
    const { server, port } = await createStaticServer(PROJECT_ROOT);
    this.server = server;
    this.serverPort = port;

    // Launch headless Chromium
    this.browser = await chromium.launch({
      headless: true,
    });

    // Create a new browser context
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    // Capture console output for debugging (only if DEBUG env is set)
    if (process.env.DEBUG) {
      this.page.on('console', msg => {
        console.log(`Browser [${msg.type()}]:`, msg.text());
      });

      this.page.on('pageerror', error => {
        console.error('Browser page error:', error.message);
      });

      this.page.on('requestfailed', request => {
        console.error('Request failed:', request.url(), request.failure()?.errorText);
      });
    }

    // Load the game via HTTP
    const castleUrl = `http://127.0.0.1:${port}/castle.html`;
    await this.page.goto(castleUrl, { waitUntil: 'load' });

    // Wait for Molpy to be defined first
    await this.page.waitForFunction(() => {
      return typeof (window as any).Molpy !== 'undefined';
    }, { timeout: 10000 });

    // Then wait for initialization to complete
    await this.page.waitForFunction(() => {
      return (window as any).Molpy?.molpish === 1;
    }, { timeout: 30000 });

    // Disable autosave to prevent interference with tests
    await this.page.evaluate(() => {
      const Molpy = (window as any).Molpy;
      if (Molpy.options) {
        Molpy.options.autosave = 0;
      }
    });

    this.initialized = true;
  }

  /**
   * Clean up resources.
   */
  async dispose(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
      this.server = null;
    }
    this.initialized = false;
  }

  /**
   * Ensure the engine is initialized before operations.
   */
  private ensureInitialized(): Page {
    if (!this.initialized || !this.page) {
      throw new Error('LegacyEngine not initialized. Call initialize() first.');
    }
    return this.page;
  }

  /**
   * Load game state from a serialized save string.
   */
  async loadState(serialized: string): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((save: string) => {
      const Molpy = (window as any).Molpy;
      // Decode the save string and load it
      const decoded = Molpy.BeanishToCuegish(save);
      Molpy.FromNeedlePulledThing(decoded);
    }, serialized);
  }

  /**
   * Export current game state to a serialized save string.
   */
  async exportState(): Promise<string> {
    const page = this.ensureInitialized();

    return await page.evaluate(() => {
      const Molpy = (window as any).Molpy;
      const threads = Molpy.ToNeedlePulledThing();
      // Join all threads with 'P' separator and encode
      const joined = threads.join('P');
      return Molpy.CuegishToBeanish(joined);
    });
  }

  /**
   * Get a snapshot of current game state for comparison.
   */
  async getStateSnapshot(): Promise<GameStateSnapshot> {
    const page = this.ensureInitialized();

    return await page.evaluate(() => {
      const Molpy = (window as any).Molpy;

      // Extract sand tools state
      const sandTools: Record<string, any> = {};
      for (const tool of Molpy.SandTools) {
        sandTools[tool.name] = {
          amount: tool.amount || 0,
          bought: tool.bought || 0,
          temp: tool.temp || 0,
          totalSand: tool.totalSand || 0,
          totalGlass: tool.totalGlass || 0,
        };
      }

      // Extract castle tools state
      const castleTools: Record<string, any> = {};
      for (const tool of Molpy.CastleTools) {
        castleTools[tool.name] = {
          amount: tool.amount || 0,
          bought: tool.bought || 0,
          temp: tool.temp || 0,
          totalCastlesBuilt: tool.totalCastlesBuilt || 0,
          totalCastlesDestroyed: tool.totalCastlesDestroyed || 0,
          totalCastlesWasted: tool.totalCastlesWasted || 0,
          currentActive: tool.currentActive || 0,
          totalGlassBuilt: tool.totalGlassBuilt || 0,
          totalGlassDestroyed: tool.totalGlassDestroyed || 0,
        };
      }

      // Extract boost states
      const boosts: Record<string, any> = {};
      for (const alias in Molpy.Boosts) {
        const boost = Molpy.Boosts[alias];
        boosts[alias] = {
          unlocked: boost.unlocked || 0,
          bought: boost.bought || 0,
          power: boost.power || 0,
          countdown: boost.countdown || 0,
        };
      }

      // Extract badge states
      const badges: Record<string, boolean> = {};
      for (const name in Molpy.Badges) {
        badges[name] = !!Molpy.Badges[name].earned;
      }
      // Also include other badge groups
      for (const name in Molpy.SandBadges) {
        badges[name] = !!Molpy.SandBadges[name].earned;
      }
      for (const name in Molpy.GlassBadges) {
        badges[name] = !!Molpy.GlassBadges[name].earned;
      }

      return {
        version: Molpy.version || 0,
        newpixNumber: Molpy.newpixNumber || 1,
        sand: Molpy.Boosts['Sand']?.power || 0,
        castles: Molpy.Boosts['Castles']?.power || 0,
        glassChips: Molpy.Boosts['GlassChips']?.power || 0,
        glassBlocks: Molpy.Boosts['GlassBlocks']?.power || 0,
        beachClicks: Molpy.beachClicks || 0,
        ninjaFreeCount: Molpy.ninjaFreeCount || 0,
        ninjaStealth: Molpy.ninjaStealth || 0,
        ninjad: !!Molpy.ninjad,
        sandTools,
        castleTools,
        boosts,
        badges,
      };
    });
  }

  /**
   * Advance the game by a number of ticks (Loopist calls).
   */
  async tick(count = 1): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((n: number) => {
      const Molpy = (window as any).Molpy;
      for (let i = 0; i < n; i++) {
        // Manually call game update logic without setTimeout
        // This simulates what Loopist does but synchronously
        Molpy.Life++;

        // Core game update happens in Loopist
        // We need to call the update portion without the setTimeout recursion
        if (typeof Molpy.Loopist === 'function') {
          // Store original setTimeout
          const originalSetTimeout = window.setTimeout;
          // Temporarily disable setTimeout to prevent recursion
          (window as any).setTimeout = () => 0;
          try {
            Molpy.Loopist();
          } finally {
            // Restore setTimeout
            window.setTimeout = originalSetTimeout;
          }
        }
      }
    }, count);
  }

  /**
   * Advance time to trigger an ONG (newpix transition).
   */
  async advanceToONG(): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate(() => {
      const Molpy = (window as any).Molpy;
      // Force ONG by manipulating time
      if (typeof Molpy.ONG === 'function') {
        Molpy.ONG();
      }
    });
  }

  /**
   * Set the current newpix number directly.
   */
  async setNewpix(np: number): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((newpix: number) => {
      const Molpy = (window as any).Molpy;
      Molpy.newpixNumber = newpix;
      if (typeof Molpy.UpdateBeach === 'function') {
        Molpy.UpdateBeach();
      }
    }, np);
  }

  /**
   * Simulate beach clicks.
   */
  async clickBeach(count = 1): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((n: number) => {
      const Molpy = (window as any).Molpy;
      for (let i = 0; i < n; i++) {
        if (typeof Molpy.ClickBeach === 'function') {
          Molpy.ClickBeach();
        }
      }
    }, count);
  }

  /**
   * Buy a sand or castle tool.
   */
  async buyTool(type: 'sand' | 'castle', name: string, count = 1): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((args: { type: string; name: string; count: number }) => {
      const Molpy = (window as any).Molpy;
      const tools = args.type === 'sand' ? Molpy.SandTools : Molpy.CastleTools;
      const tool = tools[args.name] || tools.find((t: any) => t.name === args.name);
      if (tool && typeof tool.buy === 'function') {
        for (let i = 0; i < args.count; i++) {
          tool.buy();
        }
      }
    }, { type, name, count });
  }

  /**
   * Buy/unlock a boost.
   */
  async buyBoost(alias: string): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((boostAlias: string) => {
      const Molpy = (window as any).Molpy;
      const boost = Molpy.Boosts[boostAlias];
      if (boost && typeof boost.buy === 'function') {
        boost.buy();
      }
    }, alias);
  }

  /**
   * Toggle a boost on/off.
   */
  async toggleBoost(alias: string): Promise<void> {
    const page = this.ensureInitialized();

    await page.evaluate((boostAlias: string) => {
      const Molpy = (window as any).Molpy;
      if (typeof Molpy.GenericToggle === 'function') {
        const boost = Molpy.Boosts[boostAlias];
        if (boost) {
          Molpy.GenericToggle(boost.id);
        }
      }
    }, alias);
  }

  /**
   * Get the current sand production rate per tick.
   */
  async getSandRate(): Promise<number> {
    const page = this.ensureInitialized();

    return await page.evaluate(() => {
      const Molpy = (window as any).Molpy;
      // Calculate sand rate from all sand tools
      let rate = 0;
      for (const tool of Molpy.SandTools || []) {
        if (tool.amount && typeof tool.storedSpmNP === 'function') {
          rate += tool.storedSpmNP();
        }
      }
      return rate;
    });
  }

  /**
   * Get the current castle production rate per tick.
   */
  async getCastleRate(): Promise<number> {
    const page = this.ensureInitialized();

    return await page.evaluate(() => {
      const Molpy = (window as any).Molpy;
      // Calculate castle rate from all castle tools
      let rate = 0;
      for (const tool of Molpy.CastleTools || []) {
        if (tool.amount && typeof tool.storedCpS === 'function') {
          rate += tool.storedCpS();
        }
      }
      return rate;
    });
  }

  /**
   * Get boost state by alias.
   */
  async getBoostState(alias: string): Promise<BoostState> {
    const page = this.ensureInitialized();

    return await page.evaluate((boostAlias: string) => {
      const Molpy = (window as any).Molpy;
      const boost = Molpy.Boosts[boostAlias];
      if (!boost) {
        return {
          unlocked: 0,
          bought: 0,
          power: 0,
          countdown: 0,
        };
      }
      return {
        unlocked: boost.unlocked || 0,
        bought: boost.bought || 0,
        power: boost.power || 0,
        countdown: boost.countdown || 0,
      };
    }, alias);
  }

  /**
   * Check if a badge has been earned.
   */
  async getBadgeState(name: string): Promise<boolean> {
    const page = this.ensureInitialized();

    return await page.evaluate((badgeName: string) => {
      const Molpy = (window as any).Molpy;
      const badge = Molpy.Badges[badgeName] ||
                   Molpy.SandBadges?.[badgeName] ||
                   Molpy.GlassBadges?.[badgeName];
      return !!badge?.earned;
    }, name);
  }

  /**
   * Execute a test action.
   */
  async executeAction(action: TestAction): Promise<void> {
    switch (action.type) {
      case 'click':
        if (action.target === 'beach') {
          await this.clickBeach(action.count ?? 1);
        }
        break;

      case 'tick':
        await this.tick(action.count ?? 1);
        break;

      case 'wait':
        await this.tick(action.ticks);
        break;

      case 'ong':
        await this.advanceToONG();
        break;

      case 'buy-tool':
        await this.buyTool(action.toolType, action.toolName, action.count ?? 1);
        break;

      case 'buy-boost':
        await this.buyBoost(action.boostAlias);
        break;

      case 'toggle-boost':
        await this.toggleBoost(action.boostAlias);
        break;

      case 'set-newpix':
        await this.setNewpix(action.np);
        break;

      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  /**
   * Get raw access to the Molpy object for advanced testing.
   * Returns a handle that can be used to evaluate expressions.
   */
  async getMolpyHandle(): Promise<Page> {
    return this.ensureInitialized();
  }

  /**
   * Evaluate an arbitrary expression in the game context.
   * Useful for testing specific game mechanics.
   */
  async evaluate<T>(fn: (Molpy: any) => T): Promise<T> {
    const page = this.ensureInitialized();
    return await page.evaluate((fnStr: string) => {
      const Molpy = (window as any).Molpy;
      const fn = new Function('Molpy', `return (${fnStr})(Molpy)`);
      return fn(Molpy);
    }, fn.toString());
  }
}
