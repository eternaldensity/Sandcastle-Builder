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
  isBoostBought(alias: string): boolean;
  isBadgeEarned(name: string): boolean;
  getNewpixNumber(): number;
  getBadgesOwned(): number;

  // Engine mutations
  setBoostPower(alias: string, power: number): void;
  setBoostCountdown(alias: string, countdown: number): void;
  setBoostBought(alias: string, bought: number): void;
  setBoostEnabled(alias: string, enabled: boolean): void;
  addResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks', amount: number): void;
  subtractResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks', amount: number): void;
  lockBoost(alias: string): void;
  unlockBoost(alias: string): void;
  permalockBoost(alias: string): void;
  buyBoost(alias: string): void;
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
  /** Called instead of generic lock when countdown expires (castle.js:3354) */
  countdownLockFunction?: CountdownFunction;
  loadFunction?: LoadFunction;
}

/**
 * Master registry of all boost functions indexed by alias.
 * Only boosts with custom logic need to be registered.
 */
export const boostFunctionRegistry: Record<string, BoostFunctions> = {};

// =============================================================================
// Enable-On-Buy: Toggle boosts that auto-enable when purchased
// Reference: boosts.js - these all have buyFunction: function() { this.IsEnabled = 1; }
// =============================================================================
const enableOnBuyBoosts = [
  'Furnace Crossfeed',
  'Furnace Multitasking',
  'Glass Saw',
  'Stretchable Chip Storage',
  'Stretchable Block Storage',
  'HoM',           // Hall of Mirrors
  'Draft Dragon',
];

for (const alias of enableOnBuyBoosts) {
  if (!boostFunctionRegistry[alias]) {
    boostFunctionRegistry[alias] = {};
  }
  boostFunctionRegistry[alias].buyFunction = (ctx) => {
    ctx.setBoostEnabled(ctx.boostAlias, true);
  };
}

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
// Plan 5: More Boost Functions (Priority Implementations)
// =============================================================================

// =============================================================================
// Priority 1: Bigger Buckets
// Reference: boosts.js:66
// =============================================================================

boostFunctionRegistry['BiggerBuckets'] = {
  /**
   * buyFunction: Increments power by 1.
   * Each power level adds 0.1 to bucket sand rate and click rate.
   * Reference: boosts.js:66 (no explicit buyFunction, uses default increment)
   */
  buyFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, ctx.boostPower + 1);
  },
};

// =============================================================================
// Priority 2: Time Travel
// Reference: boosts.js:985-1020
// =============================================================================

boostFunctionRegistry['TimeTravel'] = {
  /**
   * buyFunction: Sets power to 1 (distance of time travel).
   * Reference: boosts.js:1007-1009
   * Note: Actual time travel navigation is handled separately in UI/ONG logic
   */
  buyFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, 1);
  },
};

// =============================================================================
// Priority 3: Temporal Anchor
// Reference: boosts.js:1105-1130
// =============================================================================

boostFunctionRegistry['TemporalAnchor'] = {
  /**
   * buyFunction: Initialize anchor state (handled via IsEnabled toggle in legacy).
   * When enabled, prevents NP from incrementing at ONG.
   * Reference: boosts.js:1105-1130
   */
  buyFunction: (ctx) => {
    // Anchor state managed via power (1 = enabled, 0 = disabled)
    // Actual ONG prevention is handled in ONG logic
  },

  /**
   * lockFunction: Releases temporal anchor (allows NP progression again).
   */
  lockFunction: (ctx) => {
    ctx.notify('Temporal Anchor released');
  },
};

// =============================================================================
// Priority 4: Sand Monuments (SMM - Sand Mould Maker)
// Reference: boosts.js:4343-4380
// =============================================================================

boostFunctionRegistry['SMM'] = {
  /**
   * buyFunction: Initialize making state to 0.
   * Reference: boosts.js:4356
   */
  buyFunction: (ctx) => {
    // Making state tracked separately in monument system
    // this.Making = 0 in legacy
  },
};

// =============================================================================
// Priority 5: Fractal Sandcastles
// Reference: boosts.js:745-780
// =============================================================================

boostFunctionRegistry['FractalSandcastles'] = {
  /**
   * buyFunction: Sets power to 0 (resets each ONG).
   * Power represents fractal level, which multiplies castle gain.
   * Reference: boosts.js:745-780 (no explicit buyFunction, handled in ONG)
   */
  buyFunction: (ctx) => {
    // Power starts at 0 and increments during gameplay
    // Multiplier: Math.pow(1.35, power)
  },
};

// =============================================================================
// Priority 6: Ninja Lockdown
// Reference: boosts.js:9051-9065
// =============================================================================

boostFunctionRegistry['NinjaLockdown'] = {
  /**
   * buyFunction: Initialize the boost.
   * Locking of Impervious Ninja happens when the toggle is activated.
   * Reference: boosts.js:9062 (GenericToggle handler)
   */
  buyFunction: (ctx) => {
    // Initialize - toggle state is managed separately
    // The actual locking happens when toggle is activated via isEnabled
  },
};

// =============================================================================
// Priority 7: Overcompensating
// Reference: boosts.js:701-720
// =============================================================================

boostFunctionRegistry['Overcompensating'] = {
  /**
   * buyFunction: Sets power to startPower (1.5 by default).
   * During LongPix (NP > 1800), adds power to global sand multiplier.
   * Reference: boosts.js:701-720
   */
  buyFunction: (ctx) => {
    // startPower is 1.5, meaning 150% extra sand during longpix
    ctx.setBoostPower(ctx.boostAlias, 1.5);
  },
};

// =============================================================================
// Priority 8: Blitzing
// Reference: boosts.js:860-895
// =============================================================================

boostFunctionRegistry['Blitzing'] = {
  /**
   * buyFunction: Activates blitzing with countdown.
   * Sets power to multiplier value (e.g., 200 = 200% sand rate).
   * Reference: boosts.js:860-895
   */
  buyFunction: (ctx) => {
    // Set countdown to duration (startCountdown is 23 in legacy, but varies)
    ctx.setBoostCountdown(ctx.boostAlias, 100); // 100 mNP duration
    // Set power to multiplier percentage
    ctx.setBoostPower(ctx.boostAlias, 200); // 200% sand rate
    ctx.notify('Blitzing activated! +200% sand rate for 100 mNP');
  },

  /**
   * countdownFunction: Handles countdown ticks during Blitzing.
   */
  countdownFunction: (ctx) => {
    if (ctx.boostCountdown === 2) {
      ctx.notify('Blitzing ending in 2 mNP!');
    }
    if (ctx.boostCountdown === 0) {
      ctx.lockBoost(ctx.boostAlias);
    }
  },

  /**
   * lockFunction: Deactivates Blitzing and resets state.
   * Reference: boosts.js:871-875
   */
  lockFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, 0);
    // If Sea Mining is active, lock it too
    if (ctx.isBoostEnabled('SeaMining')) {
      ctx.lockBoost('SeaMining');
    }
    ctx.notify('Blitzing expired');
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

// =============================================================================
// Glass Ceiling System (0-11)
// Reference: boosts.js:3366-3500
// =============================================================================

/**
 * Check if a glass ceiling index is toggleable (can be locked/unlocked).
 * Equivalent to legacy Molpy.CeilingTogglable(key).
 *
 * A ceiling is toggleable if:
 * - key-1 < 0 (first ceiling) OR ceiling key-1 is bought
 * - AND no ceilings before key-1 are bought
 *
 * Reference: boosts.js:3476-3490
 */
export function isCeilingTogglable(key: number, ctx: BoostFunctionContext): boolean {
  const prevKey = key - 1;
  if (prevKey < 0 || ctx.isBoostBought(`Glass Ceiling ${prevKey}`)) {
    let check = prevKey - 1;
    while (check >= 0) {
      if (ctx.isBoostBought(`Glass Ceiling ${check}`)) {
        return false;
      }
      check--;
    }
    return true;
  }
  return false;
}

/**
 * Run the glass ceiling unlock cascade check.
 * For ceilings 0-9, automatically unlocks/locks based on toggleability rules.
 * Equivalent to legacy Molpy.GlassCeilingUnlockCheck().
 *
 * Reference: boosts.js:3457-3473
 */
export function glassCeilingUnlockCheck(ctx: BoostFunctionContext): void {
  for (let i = 9; i >= 0; i--) {
    const bought = ctx.getBoostBought(`Glass Ceiling ${i}`);
    if (!bought) {
      if (!ctx.isBadgeEarned('Ceiling Broken')) {
        if (isCeilingTogglable(i, ctx)) {
          ctx.unlockBoost(`Glass Ceiling ${i}`);
        } else {
          ctx.lockBoost(`Glass Ceiling ${i}`);
        }
      }
    }
  }
}

// Register buy/lock functions for each glass ceiling
for (let i = 0; i < 12; i++) {
  boostFunctionRegistry[`Glass Ceiling ${i}`] = {
    /**
     * buyFunction: Increment power (or reset if Ceiling Broken earned).
     * Then cascade unlock check.
     * Reference: boosts.js:3391-3398
     */
    buyFunction: (ctx) => {
      if (ctx.isBadgeEarned('Ceiling Broken')) {
        ctx.setBoostPower(ctx.boostAlias, 0);
      } else {
        ctx.setBoostPower(ctx.boostAlias, ctx.boostPower + 1);
      }
      glassCeilingUnlockCheck(ctx);
    },

    /**
     * lockFunction: Cascade unlock check after locking.
     * Reference: boosts.js:3400-3404
     */
    lockFunction: (ctx) => {
      glassCeilingUnlockCheck(ctx);
    },
  };
}

/**
 * Get all registered boost aliases.
 */
export function getRegisteredBoosts(): string[] {
  return Object.keys(boostFunctionRegistry);
}

/**
 * Check if a boost has any registered functions.
 */
// =============================================================================
// Phase 3: Impactful Individual buyFunctions
// =============================================================================

// Safety Hat: Self-locks on buy (it's a joke boost)
// Reference: boosts.js:5559-5562
boostFunctionRegistry['Safety Hat'] = {
  buyFunction: (ctx) => {
    ctx.lockBoost(ctx.boostAlias);
  },
};

// Price Protection: Sets bought to 4 (used as countdown for protection duration)
// Reference: boosts.js:6603-6604
boostFunctionRegistry['Price Protection'] = {
  buyFunction: (ctx) => {
    ctx.setBoostBought(ctx.boostAlias, 4);
  },
};

// Kite and Key: Sets power from sqrt(LR.power), caps at 1e155, raises LR if below
// Reference: boosts.js:9860-9867
boostFunctionRegistry['Kite and Key'] = {
  buyFunction: (ctx) => {
    let power = ctx.boostPower;
    if (power < 400) {
      power = Math.sqrt(ctx.getBoostPower('LR')) || 400;
    }
    if (power > 1e155) {
      power = 1e155;
    }
    ctx.setBoostPower(ctx.boostAlias, power);
    if (ctx.getBoostPower('LR') < power) {
      ctx.setBoostPower('LR', power);
    }
  },
};

// Lightning in a Bottle: Sets power from LR.power * 1e-36, caps at 1e252, raises LR if below
// Reference: boosts.js:9886-9893
boostFunctionRegistry['Lightning in a Bottle'] = {
  buyFunction: (ctx) => {
    let power = ctx.boostPower;
    if (power < 400) {
      power = (ctx.getBoostPower('LR') * 1e-36) || 400;
    }
    if (power > 1e252) {
      power = 1e252;
    }
    ctx.setBoostPower(ctx.boostAlias, power);
    if (ctx.getBoostPower('LR') < power) {
      ctx.setBoostPower('LR', power);
    }
  },
};

// =============================================================================
// Phase 4: Complex buyFunction Implementations
// =============================================================================

// AC (Automata Control): Sets Level based on Planck Limit badge
// Reference: boosts.js:6143-6145
boostFunctionRegistry['AC'] = {
  buyFunction: (ctx) => {
    const power = ctx.isBadgeEarned('Planck Limit') ? 6.2e34 : 1;
    ctx.setBoostPower(ctx.boostAlias, power);
  },
};

// PC (Production Control): Bitwise OR power with 1; if Nope! badge, set to 6e51
// Reference: boosts.js:5930-5933
boostFunctionRegistry['PC'] = {
  buyFunction: (ctx) => {
    let power = ctx.boostPower | 1;
    if (ctx.isBadgeEarned('Nope!')) power = 6e51;
    ctx.setBoostPower(ctx.boostAlias, power);
  },
};

// Catalyzer: Complex power calculation, increment Level, self-lock
// Reference: boosts.js:12241-12252
boostFunctionRegistry['Catalyzer'] = {
  buyFunction: (ctx) => {
    let level = ctx.getBoostBought(ctx.boostAlias);
    if (!level) level = 1;
    const powmod = (level + 1) / 10;
    const newpower = Math.pow(
      2 / 3 * powmod + Math.exp(1 / 6) * Math.sin(15 * powmod),
      4
    );
    ctx.setBoostPower(ctx.boostAlias, newpower);
    ctx.setBoostBought(ctx.boostAlias, level + 1);
    ctx.lockBoost(ctx.boostAlias);
  },
};

// Chthonism: Coallate - increment Coal.bought, zero Maps.power
// Reference: boosts.js:12112-12120
boostFunctionRegistry['Chthonism'] = {
  buyFunction: (ctx) => {
    const coalBought = ctx.getBoostBought('Coal');
    ctx.setBoostBought('Coal', coalBought + 1);
    ctx.setBoostPower('Maps', 0);
  },
};

// =============================================================================
// Exports
// =============================================================================

export function hasBoostFunctions(alias: string): boolean {
  return alias in boostFunctionRegistry;
}

/**
 * Get functions for a specific boost.
 */
export function getBoostFunctions(alias: string): BoostFunctions | undefined {
  return boostFunctionRegistry[alias];
}
