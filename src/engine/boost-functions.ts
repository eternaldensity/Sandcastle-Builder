/**
 * Boost Function Registry
 *
 * This module contains TypeScript implementations of dynamic boost functions
 * from the legacy game. Only boosts that require custom logic are implemented;
 * simple boosts work via the default behavior.
 *
 * Legacy functions are JavaScript with `this` context and `Molpy` globals.
 * This registry pattern allows us to manually implement critical boost functions
 * in TypeScript with proper type safety.
 *
 * Reference counts from game data:
 * - buyFunction: 76 boosts
 * - countdownFunction: 11 boosts
 * - unlockFunction: 8 boosts
 * - lockFunction: 27 boosts
 * - loadFunction: 15 boosts
 * - priceFunction: 1 boost
 */

/**
 * Context passed to boost functions.
 * Provides access to engine state and methods without exposing internals.
 */
export interface BoostFunctionContext {
  /** The boost alias being processed */
  boostAlias: string;
  /** Current boost power value */
  boostPower: number;
  /** Current boost countdown value */
  boostCountdown: number;
  /** Current boost bought count */
  boostBought: number;

  // Engine queries
  getBeachClicks(): number;
  getResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks'): number;
  getBoostPower(alias: string): number;
  getBoostBought(alias: string): number;
  isBoostEnabled(alias: string): boolean;

  // Engine mutations
  setBoostPower(alias: string, power: number): void;
  setBoostCountdown(alias: string, countdown: number): void;
  addResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks', amount: number): void;
  subtractResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks', amount: number): void;
  lockBoost(alias: string): void;
  unlockBoost(alias: string): void;
  permalockBoost(alias: string): void;
  recalculatePriceFactor(): void;
  earnBadge(name: string): void;
  notify(message: string): void;
}

/**
 * Boost function type signatures
 */
export type BuyFunction = (ctx: BoostFunctionContext) => void;
export type UnlockFunction = (ctx: BoostFunctionContext) => void;
export type LockFunction = (ctx: BoostFunctionContext) => void;
export type CountdownFunction = (ctx: BoostFunctionContext) => void;
export type LoadFunction = (ctx: BoostFunctionContext) => void;

/**
 * Collection of function handlers for a single boost
 */
export interface BoostFunctions {
  buyFunction?: BuyFunction;
  unlockFunction?: UnlockFunction;
  lockFunction?: LockFunction;
  countdownFunction?: CountdownFunction;
  loadFunction?: LoadFunction;
}

/**
 * Master registry of all boost functions indexed by alias.
 * Only boosts with custom logic need to be registered.
 */
export const boostFunctionRegistry: Record<string, BoostFunctions> = {};

// =============================================================================
// Priority 1: ASHF (Affordable Swedish Home Furniture)
// Reference: boosts.js:518-565
// =============================================================================

boostFunctionRegistry['ASHF'] = {
  /**
   * buyFunction: Recalculates price factor when ASHF is purchased.
   * Reference: boosts.js:530-534
   */
  buyFunction: (ctx) => {
    ctx.recalculatePriceFactor();
    // Molpy.shopNeedUpdate and Molpy.Donkey() are UI concerns, not needed here
  },

  /**
   * countdownFunction: Warns when only 2mNP of discount remain.
   * Reference: boosts.js:536-540
   */
  countdownFunction: (ctx) => {
    if (ctx.boostCountdown === 2) {
      ctx.notify('Only 2mNP of discounts remain!');
    }
  },

  /**
   * lockFunction: Handles Price Protection interaction when ASHF expires.
   * Reference: boosts.js:542-548
   */
  lockFunction: (ctx) => {
    const ppBought = ctx.getBoostBought('PriceProtection');
    const ppEnabled = ctx.isBoostEnabled('PriceProtection');

    if (ppEnabled) {
      // Price Protection active: increment power
      ctx.setBoostPower('PriceProtection', ppBought + 1);
    } else {
      // Price Protection not enabled: unlock it
      ctx.unlockBoost('PriceProtection');
    }
  },
};

// =============================================================================
// Priority 2: Riverish
// Reference: boosts.js:369-381
// =============================================================================

boostFunctionRegistry['Riverish'] = {
  /**
   * buyFunction: Sets power to current beach click count.
   * This makes Rivers destroy fewer castles based on clicks.
   * Reference: boosts.js:378-380
   */
  buyFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, ctx.getBeachClicks());
  },
};

// =============================================================================
// Priority 3: Way of the Panther / Way of the Tortoise (mutually exclusive)
// Reference: boosts.js:12262-12299
// =============================================================================

boostFunctionRegistry['WotP'] = {
  /**
   * buyFunction: Permalocks both WotP and WotT, locks WotT.
   * These are mutually exclusive dragon combat styles.
   * Reference: boosts.js:12286-12289
   */
  buyFunction: (ctx) => {
    ctx.permalockBoost(ctx.boostAlias);
    ctx.lockBoost('WotT');
    ctx.permalockBoost('WotT');
  },
};

boostFunctionRegistry['WotT'] = {
  /**
   * buyFunction: Permalocks both WotT and WotP, locks WotP.
   * Reference: boosts.js:12266-12269
   */
  buyFunction: (ctx) => {
    ctx.permalockBoost(ctx.boostAlias);
    ctx.lockBoost('WotP');
    ctx.permalockBoost('WotP');
  },
};

// =============================================================================
// Priority 4: Monty Haul Problem (MHP)
// Reference: boosts.js:382-435
// =============================================================================

boostFunctionRegistry['MHP'] = {
  /**
   * unlockFunction: Generates a random prize door (1-3).
   * Reference: boosts.js:429-431
   * Legacy: this.prize = Molpy.GetDoor() which returns random door
   */
  unlockFunction: (ctx) => {
    // Generate random prize door 1-3 (stored as power for simplicity)
    // In legacy, this uses Molpy.GetDoor() which picks a random door
    const prize = Math.floor(Math.random() * 3) + 1;
    ctx.setBoostPower(ctx.boostAlias, prize);
  },

  /**
   * lockFunction: Increments power (tracks unlocks), resets goat/prize state.
   * Reference: boosts.js:423-427
   */
  lockFunction: (ctx) => {
    // In legacy: this.power++; this.goat = 0; this.prize = 0;
    // We track unlock count in power, reset happens on unlock
    ctx.setBoostPower(ctx.boostAlias, ctx.boostPower + 1);
  },

  /**
   * loadFunction: Locks MHP on load (forces fresh game state).
   * Reference: boosts.js:433
   */
  loadFunction: (ctx) => {
    ctx.lockBoost(ctx.boostAlias);
  },
};

// =============================================================================
// Priority 5: Locked Crate
// Reference: boosts.js:3745-3795
// =============================================================================

boostFunctionRegistry['LockedCrate'] = {
  /**
   * unlockFunction: Sets power based on current resources.
   * Formula: castles * 6 + sand
   * Reference: boosts.js:3776-3778
   */
  unlockFunction: (ctx) => {
    const castles = ctx.getResource('castles');
    const sand = ctx.getResource('sand');
    ctx.setBoostPower(ctx.boostAlias, castles * 6 + sand);
  },

  /**
   * lockFunction: Awards glass blocks based on various factors.
   * Reference: boosts.js:3783-3794
   * Note: Simplified - full implementation needs Logicat multiplier
   */
  lockFunction: (ctx) => {
    // Calculate win amount (simplified - would use LogiMult in full impl)
    const basePrize = 2000; // Base value, LogiMult('2K') in legacy
    let win = Math.ceil(basePrize);
    win = Math.floor(win / (6 - ctx.boostBought));

    // Award glass blocks
    ctx.addResource('glassBlocks', win);
    ctx.notify(`+${win} Glass Blocks!`);
  },
};

// =============================================================================
// Priority 6: Family Discount
// Reference: boosts.js (various references to price factor)
// =============================================================================

boostFunctionRegistry['FamilyDiscount'] = {
  /**
   * buyFunction: Recalculates price factor for 80% discount.
   * Family Discount provides permanent 80% off (multiply by 0.2).
   */
  buyFunction: (ctx) => {
    ctx.recalculatePriceFactor();
  },
};

// =============================================================================
// Priority 7: Temporal Rift
// Reference: boosts.js:1750-1772
// =============================================================================

boostFunctionRegistry['TemporalRift'] = {
  /**
   * countdownFunction: Warns when rift is about to close.
   * Reference: boosts.js:1750-1754
   */
  countdownFunction: (ctx) => {
    if (ctx.boostCountdown === 2) {
      ctx.notify('The rift closes in 2mNP!');
    }
  },

  /**
   * lockFunction: Resets countdown and changes state to expired.
   * Reference: boosts.js:1756-1759
   */
  lockFunction: (ctx) => {
    ctx.setBoostCountdown(ctx.boostAlias, 0);
    // changeState('expired') is UI concern
  },

  /**
   * buyFunction: Creates the rift visual (UI concern in modern engine).
   * Reference: boosts.js:1769-1771
   */
  buyFunction: (ctx) => {
    // createRift() is UI concern, no action needed in headless engine
  },
};

// =============================================================================
// Glass Production Toggle Functions
// Reference: boosts.js (Glass Furnace, Glass Blower)
// =============================================================================

boostFunctionRegistry['GlassFurnace'] = {
  /**
   * buyFunction: Initialize making state.
   * Reference: boosts.js:4368
   */
  buyFunction: (ctx) => {
    // this.Making = 0 in legacy - tracked separately
  },
};

boostFunctionRegistry['GlassBlower'] = {
  /**
   * buyFunction: Initialize making state.
   * Reference: boosts.js:4408
   */
  buyFunction: (ctx) => {
    // this.Making = 0 in legacy - tracked separately
  },
};

// =============================================================================
// Sand Monument Functions
// Reference: boosts.js (various monument boosts)
// =============================================================================

boostFunctionRegistry['SandRefinery'] = {
  /**
   * buyFunction: Initialize making state.
   * Reference: boosts.js:4449
   */
  buyFunction: (ctx) => {
    // this.Making = 0 in legacy - tracked separately
  },
};

boostFunctionRegistry['GlassChiller'] = {
  /**
   * buyFunction: Initialize making state.
   * Reference: boosts.js:4495
   */
  buyFunction: (ctx) => {
    // this.Making = 0 in legacy - tracked separately
  },
};

// =============================================================================
// Goat-related Functions
// Reference: boosts.js (Goat ONG, Ninja Ritual)
// =============================================================================

boostFunctionRegistry['Goats'] = {
  /**
   * lockFunction: Called during Goat ONG processing.
   * Reference: boosts.js:8781
   * Note: Actual GoatONG logic is complex, deferred to future implementation
   */
  lockFunction: (_ctx) => {
    // Molpy.GoatONG is complex, deferred
  },
};

// =============================================================================
// Ninja-related Functions
// Reference: boosts.js (various ninja boosts)
// =============================================================================

boostFunctionRegistry['NinjaRitual'] = {
  /**
   * buyFunction: Sets Level to very high if ritual is worn out.
   * Reference: boosts.js:9113
   */
  buyFunction: (ctx) => {
    // In legacy: if (Molpy.Earned('The Ritual is worn out')) this.Level = 1e298
    // We check for the badge and set power accordingly
    // Note: Would need badge check here in full implementation
  },
};

// =============================================================================
// Dragon-related Functions
// Reference: boosts.js (Dragon Forge, Maps, etc.)
// =============================================================================

boostFunctionRegistry['Maps'] = {
  /**
   * buyFunction: Refreshes the Maps display.
   * Reference: boosts.js:10157
   */
  buyFunction: (ctx) => {
    // Maps.Refresh() is UI concern
  },
};

boostFunctionRegistry['DragonForge'] = {
  /**
   * buyFunction: Refreshes Dragon Forge display.
   * Reference: boosts.js:10664
   */
  buyFunction: (ctx) => {
    // DragonForge.Refresh() is UI concern
  },
};

// =============================================================================
// Countdown-based Boosts
// Reference: boosts.js (various countdown mechanics)
// =============================================================================

boostFunctionRegistry['Fireproof'] = {
  /**
   * countdownFunction: Handles fireproof countdown effects.
   * Reference: boosts.js:10767-10780
   */
  countdownFunction: (ctx) => {
    // Complex dragon combat logic, deferred
  },
};

boostFunctionRegistry['Cryogenics'] = {
  /**
   * countdownFunction: Handles cryogenics countdown effects.
   * Reference: boosts.js:10856-10870
   */
  countdownFunction: (ctx) => {
    // Complex dragon combat logic, deferred
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get all registered boost aliases.
 */
export function getRegisteredBoosts(): string[] {
  return Object.keys(boostFunctionRegistry);
}

/**
 * Check if a boost has any registered functions.
 */
export function hasBoostFunctions(alias: string): boolean {
  return alias in boostFunctionRegistry;
}

/**
 * Get functions for a specific boost.
 */
export function getBoostFunctions(alias: string): BoostFunctions | undefined {
  return boostFunctionRegistry[alias];
}
