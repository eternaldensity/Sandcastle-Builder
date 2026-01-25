/**
 * ModernEngine - Modern TypeScript implementation of Sandcastle Builder
 *
 * This engine implements the GameEngine interface to enable parity testing
 * against the legacy implementation. It uses extracted game data and
 * implements core mechanics in a clean, testable way.
 *
 * INCREMENTAL IMPLEMENTATION STRATEGY:
 * This engine is built incrementally using parity tests. Features are
 * deferred until parity tests require them (tracked in chainlink issues).
 * Each feature is verified against the legacy engine before proceeding.
 * See docs/architecture/parity-testing.md for the approach.
 */

import type { BoostState, ToolState, GameData } from '../types/game-data.js';
import type { GameEngine, GameStateSnapshot, TestAction } from '../parity/game-engine.js';
import { SaveParser, createSaveParser } from './save-parser.js';
import { UnlockChecker, type UnlockCheckState } from './unlock-checker.js';
import {
  calculateSandToolPurchasePrice,
  calculateCastleToolPrice,
  calculateBoostPrice,
  calculatePriceFactor,
  parsePriceValue,
  isPriceFree,
  type PriceFactorState,
  type CastleToolPriceState,
  CASTLE_TOOL_SEEDS,
} from './price-calculator.js';
import { allUnlockRules } from './unlock-conditions.js';

/**
 * Internal state for a sand tool
 */
interface SandToolState {
  amount: number;
  bought: number;
  temp: number;
  totalSand: number;
  totalGlass: number;
}

/**
 * Internal state for a castle tool
 */
interface CastleToolState {
  amount: number;
  bought: number;
  temp: number;
  totalCastlesBuilt: number;
  totalCastlesDestroyed: number;
  totalCastlesWasted: number;
  currentActive: number;
  totalGlassBuilt: number;
  totalGlassDestroyed: number;
}

/**
 * Internal boost state with all fields
 */
interface InternalBoostState extends BoostState {
  // Additional runtime fields can be added here
}

/**
 * Core game state
 */
interface CoreState {
  version: number;
  startDate: number;
  newpixNumber: number;
  beachClicks: number;
  ninjaFreeCount: number;
  ninjaStealth: number;
  ninjad: boolean;
  saveCount: number;
  loadCount: number;
}

/**
 * Resource amounts (stored in special boosts in legacy)
 */
interface Resources {
  sand: number;
  castles: number;
  glassChips: number;
  glassBlocks: number;
}

/**
 * Castle building state - tracks Fibonacci cost sequence
 */
interface CastleBuildState {
  prevCastleSand: number;
  nextCastleSand: number;
  totalBuilt: number;
}

/**
 * Castle tool price cache - stores Fibonacci state per tool
 */
interface CastleToolPriceCache {
  [toolName: string]: CastleToolPriceState;
}

/**
 * ModernEngine implements the game logic in TypeScript.
 */
export class ModernEngine implements GameEngine {
  private gameData: GameData;
  private saveParser: SaveParser;
  private initialized = false;

  // Core state
  private core: CoreState = {
    version: 4.12,
    startDate: 0,
    newpixNumber: 1,
    beachClicks: 0,
    ninjaFreeCount: 0,
    ninjaStealth: 0,
    ninjad: false,
    saveCount: 0,
    loadCount: 0,
  };

  // Resources
  private resources: Resources = {
    sand: 0,
    castles: 0,
    glassChips: 0,
    glassBlocks: 0,
  };

  // Castle building state (Fibonacci sequence for sand cost)
  private castleBuild: CastleBuildState = {
    prevCastleSand: 0,
    nextCastleSand: 1,
    totalBuilt: 0,
  };

  // Current price factor (1 = normal, <1 = discounted)
  private priceFactor = 1;

  // Castle tool price cache
  private castleToolPrices: CastleToolPriceCache = {};

  // Tool states
  private sandTools: Map<string, SandToolState> = new Map();
  private castleTools: Map<string, CastleToolState> = new Map();

  // Boost states
  private boosts: Map<string, InternalBoostState> = new Map();

  // Badge states
  private badges: Map<string, boolean> = new Map();

  // Badge group counts (for unlock conditions)
  private badgeGroupCounts: Record<string, number> = {};

  // Unlock checker for auto-unlock logic
  private unlockChecker: UnlockChecker;

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.saveParser = createSaveParser(gameData);
    this.unlockChecker = new UnlockChecker(allUnlockRules);
  }

  /**
   * Initialize the engine with default state.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Initialize sand tools
    for (const tool of this.gameData.sandTools) {
      this.sandTools.set(tool.name, {
        amount: 0,
        bought: 0,
        temp: 0,
        totalSand: 0,
        totalGlass: 0,
      });
    }

    // Initialize castle tools
    for (const tool of this.gameData.castleTools) {
      this.castleTools.set(tool.name, {
        amount: 0,
        bought: 0,
        temp: 0,
        totalCastlesBuilt: 0,
        totalCastlesDestroyed: 0,
        totalCastlesWasted: 0,
        currentActive: 0,
        totalGlassBuilt: 0,
        totalGlassDestroyed: 0,
      });
    }

    // Initialize boosts with default values
    for (const [alias, def] of Object.entries(this.gameData.boosts)) {
      this.boosts.set(alias, {
        unlocked: 0,
        bought: 0,
        power: def.startPower ?? 0,
        countdown: def.startCountdown ?? 0,
      });
    }

    // Initialize badges
    for (const [name] of Object.entries(this.gameData.badges)) {
      this.badges.set(name, false);
    }

    // Set start date
    this.core.startDate = Date.now();

    this.initialized = true;
  }

  /**
   * Clean up resources.
   */
  async dispose(): Promise<void> {
    this.initialized = false;
    this.sandTools.clear();
    this.castleTools.clear();
    this.boosts.clear();
    this.badges.clear();
  }

  /**
   * Ensure engine is initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('ModernEngine not initialized. Call initialize() first.');
    }
  }

  /**
   * Load game state from a serialized save string.
   */
  async loadState(serialized: string): Promise<void> {
    this.ensureInitialized();

    // Decode the save (remove base64 encoding if present)
    // For now, assume raw format for testing
    const state = this.saveParser.parse(serialized);

    // Load core state
    this.core.version = state.version;
    this.core.startDate = state.startDate;
    this.core.newpixNumber = state.newpixNumber;
    this.core.beachClicks = state.beachClicks;
    this.core.ninjaFreeCount = state.ninjaFreeCount;
    this.core.ninjaStealth = state.ninjaStealth;
    this.core.ninjad = state.ninjad;
    this.core.saveCount = state.saveCount;
    this.core.loadCount = state.loadCount;

    // Load sand tools
    for (const [name, toolState] of Object.entries(state.sandTools)) {
      if (this.sandTools.has(name)) {
        this.sandTools.set(name, {
          amount: toolState.amount ?? 0,
          bought: toolState.bought ?? 0,
          temp: toolState.temp ?? 0,
          totalSand: toolState.totalSand ?? 0,
          totalGlass: toolState.totalGlass ?? 0,
        });
      }
    }

    // Load castle tools
    for (const [name, toolState] of Object.entries(state.castleTools)) {
      if (this.castleTools.has(name)) {
        this.castleTools.set(name, {
          amount: toolState.amount ?? 0,
          bought: toolState.bought ?? 0,
          temp: toolState.temp ?? 0,
          totalCastlesBuilt: toolState.totalCastlesBuilt ?? 0,
          totalCastlesDestroyed: toolState.totalCastlesDestroyed ?? 0,
          totalCastlesWasted: toolState.totalCastlesWasted ?? 0,
          currentActive: toolState.currentActive ?? 0,
          totalGlassBuilt: toolState.totalGlassBuilt ?? 0,
          totalGlassDestroyed: toolState.totalGlassDestroyed ?? 0,
        });
      }
    }

    // Load boosts
    for (const [alias, boostState] of Object.entries(state.boosts)) {
      if (this.boosts.has(alias)) {
        this.boosts.set(alias, {
          unlocked: boostState.unlocked,
          bought: boostState.bought,
          power: boostState.power,
          countdown: boostState.countdown,
        });
      }
    }

    // Load resources from special boosts
    const sandBoost = this.boosts.get('Sand');
    const castlesBoost = this.boosts.get('Castles');
    const glassChipsBoost = this.boosts.get('GlassChips');
    const glassBlocksBoost = this.boosts.get('GlassBlocks');

    this.resources.sand = sandBoost?.power ?? 0;
    this.resources.castles = castlesBoost?.power ?? 0;
    this.resources.glassChips = glassChipsBoost?.power ?? 0;
    this.resources.glassBlocks = glassBlocksBoost?.power ?? 0;

    // Load badges
    for (const [name, badgeState] of Object.entries(state.badges)) {
      this.badges.set(name, badgeState.earned);
    }
  }

  /**
   * Export current game state to a serialized save string.
   * Note: This produces raw format, not base64 encoded.
   */
  async exportState(): Promise<string> {
    this.ensureInitialized();

    // Full serialization deferred (issue #18) - basic format for testing
    const sections: string[] = [];

    // Section 0: version
    sections.push(String(this.core.version));

    // Section 1: empty
    sections.push('');

    // Section 2: startDate
    sections.push(String(this.core.startDate));

    // Section 3: options (empty for now)
    sections.push('');

    // Section 4: gamenums
    const gamenums = [
      this.core.newpixNumber,
      this.core.beachClicks,
      this.core.ninjaFreeCount,
      this.core.ninjaStealth,
      this.core.ninjad ? 1 : 0,
      this.core.saveCount,
      this.core.loadCount,
    ].join('S');
    sections.push(gamenums);

    // Sections 5-11: tools, boosts, badges, etc. (simplified)
    sections.push(''); // sandTools
    sections.push(''); // castleTools
    sections.push(''); // boosts
    sections.push(''); // badges
    sections.push(''); // unused
    sections.push(''); // otherBadges
    sections.push(''); // npdata

    return sections.join('P');
  }

  /**
   * Get a snapshot of current game state for comparison.
   */
  async getStateSnapshot(): Promise<GameStateSnapshot> {
    this.ensureInitialized();

    // Convert sand tools map to record
    const sandToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.sandTools) {
      sandToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalSand: state.totalSand,
        totalGlass: state.totalGlass,
      };
    }

    // Convert castle tools map to record
    const castleToolsRecord: Record<string, ToolState> = {};
    for (const [name, state] of this.castleTools) {
      castleToolsRecord[name] = {
        amount: state.amount,
        bought: state.bought,
        temp: state.temp,
        totalCastlesBuilt: state.totalCastlesBuilt,
        totalCastlesDestroyed: state.totalCastlesDestroyed,
        totalCastlesWasted: state.totalCastlesWasted,
        currentActive: state.currentActive,
        totalGlassBuilt: state.totalGlassBuilt,
        totalGlassDestroyed: state.totalGlassDestroyed,
      };
    }

    // Convert boosts map to record
    const boostsRecord: Record<string, BoostState> = {};
    for (const [alias, state] of this.boosts) {
      boostsRecord[alias] = {
        unlocked: state.unlocked,
        bought: state.bought,
        power: state.power,
        countdown: state.countdown,
      };
    }

    // Convert badges map to record
    const badgesRecord: Record<string, boolean> = {};
    for (const [name, earned] of this.badges) {
      badgesRecord[name] = earned;
    }

    return {
      version: this.core.version,
      newpixNumber: this.core.newpixNumber,
      sand: this.resources.sand,
      castles: this.resources.castles,
      glassChips: this.resources.glassChips,
      glassBlocks: this.resources.glassBlocks,
      beachClicks: this.core.beachClicks,
      ninjaFreeCount: this.core.ninjaFreeCount,
      ninjaStealth: this.core.ninjaStealth,
      ninjad: this.core.ninjad,
      sandTools: sandToolsRecord,
      castleTools: castleToolsRecord,
      boosts: boostsRecord,
      badges: badgesRecord,
    };
  }

  /**
   * Advance the game by a number of ticks.
   */
  async tick(count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      this.processTick();
    }
  }

  /**
   * Process a single game tick.
   */
  private processTick(): void {
    // Calculate sand production from tools
    let sandProduced = 0;
    for (const [name, state] of this.sandTools) {
      if (state.amount > 0) {
        const rate = this.calculateSandToolRate(name, state.amount);
        sandProduced += rate;
        state.totalSand += rate;
      }
    }

    // Add sand to resources
    this.resources.sand += sandProduced;
    this.syncResourceBoosts();

    // Castle tools and boost countdowns deferred (issue #19)
  }

  /**
   * Calculate sand production rate for a tool.
   * This is a simplified version - full implementation needs boost effects.
   */
  private calculateSandToolRate(toolName: string, amount: number): number {
    // Base rates per tool (approximate, from game data)
    const baseRates: Record<string, number> = {
      'Bucket': 0.1,
      'Cuegan': 0.5,
      'Flag': 1,
      'LaPetite': 2,
      'Ladder': 5,
      'Bag': 10,
    };

    const baseRate = baseRates[toolName] ?? 0;
    return baseRate * amount;
  }

  /**
   * Sync resource values to their boost power fields.
   */
  private syncResourceBoosts(): void {
    const sandBoost = this.boosts.get('Sand');
    if (sandBoost) {
      sandBoost.power = this.resources.sand;
    }

    const castlesBoost = this.boosts.get('Castles');
    if (castlesBoost) {
      castlesBoost.power = this.resources.castles;
    }

    const glassChipsBoost = this.boosts.get('GlassChips');
    if (glassChipsBoost) {
      glassChipsBoost.power = this.resources.glassChips;
    }

    const glassBlocksBoost = this.boosts.get('GlassBlocks');
    if (glassBlocksBoost) {
      glassBlocksBoost.power = this.resources.glassBlocks;
    }
  }

  /**
   * Build the state object for unlock condition checking.
   */
  private buildUnlockCheckState(): UnlockCheckState {
    return {
      sandTools: this.sandTools,
      castleTools: this.castleTools,
      boosts: this.boosts,
      badges: this.badges,
      resources: this.resources,
      badgeGroupCounts: this.badgeGroupCounts,
    };
  }

  /**
   * Check and process auto-unlocks based on current state.
   * This is called after state changes that might trigger unlocks.
   */
  private checkAutoUnlocks(): void {
    const state = this.buildUnlockCheckState();
    const toUnlock = this.unlockChecker.check(state);

    for (const alias of toUnlock) {
      this.doUnlockBoost(alias);
    }
  }

  /**
   * Internal unlock boost implementation.
   * Sets the unlocked flag and calls any unlock function.
   */
  private doUnlockBoost(alias: string): void {
    const state = this.boosts.get(alias);
    if (!state) return;

    // Only unlock if not already unlocked (or if it's a limited boost that can unlock multiple times)
    const def = this.gameData.boosts[alias];
    if (state.unlocked > 0 && !def?.department) return;

    state.unlocked++;

    // Unlock functions would be called here if implemented
    // For now, just the state change is sufficient
  }

  /**
   * Advance time to trigger an ONG (newpix transition).
   */
  async advanceToONG(): Promise<void> {
    this.ensureInitialized();
    this.core.newpixNumber++;
    // Full ONG logic deferred (issue #20)
  }

  /**
   * Set the current newpix number directly.
   */
  async setNewpix(np: number): Promise<void> {
    this.ensureInitialized();
    this.core.newpixNumber = np;
  }

  /**
   * Simulate beach clicks.
   */
  async clickBeach(count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      this.processBeachClick();
    }
  }

  /**
   * Process a single beach click.
   */
  private processBeachClick(): void {
    this.core.beachClicks++;

    // Base sand per click (simplified)
    const sandGained = 1;

    // Click multipliers from boosts deferred (issue #21)

    this.resources.sand += sandGained;
    this.syncResourceBoosts();

    // Check for badge unlocks
    this.checkClickBadges();

    // Auto-convert sand to castles (like legacy toCastles)
    this.toCastles();
  }

  /**
   * Auto-convert sand to castles using Fibonacci cost sequence.
   * Matches legacy Molpy.Boosts['Sand'].toCastles() behavior.
   */
  private toCastles(): void {
    // Convert sand to castles while we have enough
    while (this.resources.sand >= this.castleBuild.nextCastleSand &&
           isFinite(this.resources.castles)) {
      // Build one castle (Fractal Sandcastles boost not implemented yet)
      this.resources.castles++;
      this.castleBuild.totalBuilt++;

      // Spend sand
      this.resources.sand -= this.castleBuild.nextCastleSand;

      // Advance Fibonacci sequence for castle cost
      const currentCost = this.castleBuild.nextCastleSand;
      this.castleBuild.nextCastleSand = this.castleBuild.prevCastleSand + currentCost;
      this.castleBuild.prevCastleSand = currentCost;

      // Safety check for infinite/invalid state
      if (!isFinite(this.resources.sand) || this.castleBuild.nextCastleSand <= 0) {
        this.castleBuild.nextCastleSand = 1;
        this.resources.castles = Infinity;
        break;
      }
    }

    this.syncResourceBoosts();
  }

  /**
   * Check for badges earned from clicking.
   */
  private checkClickBadges(): void {
    // Badge thresholds (simplified)
    const clickBadges: Record<string, number> = {
      'Click Ninja': 1,
      'Click Ninja Ninja': 10,
      // More badges would be added here
    };

    for (const [badge, threshold] of Object.entries(clickBadges)) {
      if (this.core.beachClicks >= threshold && !this.badges.get(badge)) {
        this.badges.set(badge, true);
      }
    }
  }

  /**
   * Buy a sand or castle tool.
   */
  async buyTool(type: 'sand' | 'castle', name: string, count = 1): Promise<void> {
    this.ensureInitialized();

    for (let i = 0; i < count; i++) {
      if (type === 'sand') {
        this.buySandTool(name);
      } else {
        this.buyCastleTool(name);
      }
    }
  }

  /**
   * Buy a sand tool.
   * Note: Sand tools cost CASTLES, not sand!
   * Formula: floor(priceFactor * basePrice * (1.1 ^ amount))
   */
  private buySandTool(name: string): void {
    const state = this.sandTools.get(name);
    if (!state) return;

    const toolDef = this.gameData.sandTools.find(t => t.name === name);
    if (!toolDef) return;

    // Calculate price using proper formula
    const price = calculateSandToolPurchasePrice(
      toolDef.basePrice,
      state.amount,
      this.priceFactor
    );

    // Sand tools cost castles
    if (isFinite(price) && this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;
      this.syncResourceBoosts();
      this.checkAutoUnlocks();
    }
  }

  /**
   * Buy a castle tool.
   * Uses Fibonacci sequence pricing with price0/price1 seeds.
   * Formula: floor(priceFactor * fibonacciPrice)
   */
  private buyCastleTool(name: string): void {
    const state = this.castleTools.get(name);
    if (!state) return;

    // Get Fibonacci seeds for this tool
    const seeds = CASTLE_TOOL_SEEDS[name];
    if (!seeds) return;

    // Calculate Fibonacci price
    const priceState = calculateCastleToolPrice(
      seeds.price0,
      seeds.price1,
      state.amount
    );

    // Apply priceFactor
    const price = Math.floor(this.priceFactor * priceState.price);

    if (isFinite(price) && this.resources.castles >= price) {
      this.resources.castles -= price;
      state.amount++;
      state.bought++;

      // Cache the updated price state for next purchase
      this.castleToolPrices[name] = priceState;

      this.syncResourceBoosts();
      this.checkAutoUnlocks();
    }
  }

  /**
   * Buy/unlock a boost.
   * Applies priceFactor to boost price and checks affordability.
   */
  async buyBoost(alias: string): Promise<void> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (!state) return;

    const def = this.gameData.boosts[alias];
    if (!def) return;

    // Check if unlocked but not bought
    if (state.unlocked > state.bought) {
      // Calculate price with priceFactor applied
      const realPrice = calculateBoostPrice(def.price, this.priceFactor);
      const isFree = isPriceFree(realPrice);

      // Check if we can afford it
      if (!isFree && !this.canAffordPrice(realPrice)) {
        return; // Can't afford
      }

      // Spend the resources
      if (!isFree) {
        this.spendPrice(realPrice);
      }

      state.bought++;
      this.checkAutoUnlocks();
    }
  }

  /**
   * Check if player can afford a price.
   */
  private canAffordPrice(price: Record<string, number>): boolean {
    for (const [resource, amount] of Object.entries(price)) {
      const current = this.getResourceAmount(resource);
      if (current < amount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Spend resources for a price.
   */
  private spendPrice(price: Record<string, number>): void {
    for (const [resource, amount] of Object.entries(price)) {
      this.subtractResource(resource, amount);
    }
    this.syncResourceBoosts();
  }

  /**
   * Get current amount of a resource.
   */
  private getResourceAmount(resource: string): number {
    switch (resource) {
      case 'Sand': return this.resources.sand;
      case 'Castles': return this.resources.castles;
      case 'GlassChips': return this.resources.glassChips;
      case 'GlassBlocks': return this.resources.glassBlocks;
      default: return 0;
    }
  }

  /**
   * Subtract from a resource.
   */
  private subtractResource(resource: string, amount: number): void {
    switch (resource) {
      case 'Sand':
        this.resources.sand -= amount;
        break;
      case 'Castles':
        this.resources.castles -= amount;
        break;
      case 'GlassChips':
        this.resources.glassChips -= amount;
        break;
      case 'GlassBlocks':
        this.resources.glassBlocks -= amount;
        break;
    }
  }

  /**
   * Toggle a boost on/off.
   */
  async toggleBoost(alias: string): Promise<void> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    const def = this.gameData.boosts[alias];

    if (!state || !def || !def.isToggle) return;

    // Toggle IsEnabled would be tracked in extra state
    // For now, this is a placeholder
  }

  /**
   * Recalculate priceFactor based on active discount boosts.
   * Called after boost purchases or countdown changes.
   */
  private recalculatePriceFactor(): void {
    const ashfState = this.boosts.get('ASHF');
    const familyDiscountState = this.boosts.get('FamilyDiscount');

    // ASHF is active if bought and has remaining countdown
    const hasASHF = !!ashfState && ashfState.bought > 0 && ashfState.countdown > 0;
    const ashfPower = hasASHF ? (ashfState?.power ?? 0.4) : 0;

    // Family Discount is a permanent boost
    const hasFamilyDiscount = !!familyDiscountState && familyDiscountState.bought > 0;

    const state: PriceFactorState = {
      hasASHF,
      ashfPower,
      hasFamilyDiscount,
    };

    this.priceFactor = calculatePriceFactor(state);
  }

  /**
   * Get current price factor (for testing/debugging).
   */
  getPriceFactor(): number {
    return this.priceFactor;
  }

  /**
   * Get the current sand production rate per tick.
   */
  async getSandRate(): Promise<number> {
    this.ensureInitialized();

    let rate = 0;
    for (const [name, state] of this.sandTools) {
      if (state.amount > 0) {
        rate += this.calculateSandToolRate(name, state.amount);
      }
    }
    return rate;
  }

  /**
   * Get the current castle production rate per tick.
   */
  async getCastleRate(): Promise<number> {
    this.ensureInitialized();

    // Castle rate calculation deferred (issue #23)
    return 0;
  }

  /**
   * Get boost state by alias.
   */
  async getBoostState(alias: string): Promise<BoostState> {
    this.ensureInitialized();

    const state = this.boosts.get(alias);
    if (!state) {
      return {
        unlocked: 0,
        bought: 0,
        power: 0,
        countdown: 0,
      };
    }

    return {
      unlocked: state.unlocked,
      bought: state.bought,
      power: state.power,
      countdown: state.countdown,
    };
  }

  /**
   * Check if a badge has been earned.
   */
  async getBadgeState(name: string): Promise<boolean> {
    this.ensureInitialized();
    return this.badges.get(name) ?? false;
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

  // --- Direct state manipulation for testing ---

  /**
   * Set sand amount directly (for testing).
   */
  setSand(amount: number): void {
    this.resources.sand = amount;
    this.syncResourceBoosts();
  }

  /**
   * Set castles amount directly (for testing).
   */
  setCastles(amount: number): void {
    this.resources.castles = amount;
    this.syncResourceBoosts();
  }

  /**
   * Set a sand tool amount directly (for testing).
   */
  setSandToolAmount(name: string, amount: number): void {
    const state = this.sandTools.get(name);
    if (state) {
      state.amount = amount;
      state.bought = Math.max(state.bought, amount);
    }
  }

  /**
   * Unlock a boost (for testing).
   */
  unlockBoost(alias: string): void {
    const state = this.boosts.get(alias);
    if (state) {
      state.unlocked = 1;
    }
  }
}

/**
 * Create a ModernEngine from game data JSON.
 */
export function createModernEngine(gameData: GameData): ModernEngine {
  return new ModernEngine(gameData);
}
