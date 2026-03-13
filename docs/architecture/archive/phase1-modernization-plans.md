# Modernization Implementation Plans

This document contains detailed implementation plans for the next three priority features in the Sandcastle Builder modernization project.

## Overview

| Priority | Feature | Complexity | Est. Files Changed |
|----------|---------|------------|-------------------|
| 1 | Click Multipliers | Medium | 2-3 |
| 2 | Dynamic Boost Functions | High | 3-4 |
| 3 | Glass Production | Medium | 2-3 |

---

## Plan 1: Click Multipliers

### Current State
- `processBeachClick()` in [modern-engine.ts:1293](../src/engine/modern-engine.ts#L1293) hardcodes `sandGained = 1`
- Line 1299 has comment: "Click multipliers from boosts deferred (issue #21)"
- No boost multiplier system exists

### Legacy Formula (from boosts.js:7357-7392)

```
sandPerClick = calculateSandPerClick(globalMultiplier)

where calculateSandPerClick(multiplier):
  // Step 1: Base with Bigger Buckets
  baseRate = 1 + (Bigger Buckets.power * 0.1)

  // Step 2: Multiplicative tier 1
  mult = 1
  if (Huge Buckets bought) mult *= 2
  if (Buccaneer bought) mult *= 2
  baseRate *= mult

  // Step 3: Additive pair bonuses
  if (Helpful Hands bought)
    baseRate += 0.5 * min(Buckets, Cuegans)
  if (True Colours bought)
    baseRate += 5 * min(Flags, Cuegans)
  if (Raise the Flag bought)
    baseRate += 50 * min(Flags, Ladders)
  if (Hand it Up bought)
    baseRate += 500 * min(Bags, Ladders)

  // Step 4: Additive percentage bonuses
  if (Bucket Brigade bought)
    baseRate += sandPermNP * 0.01 * floor(Buckets / 50)
  if (Bag Puns bought)
    baseRate += baseRate * 0.4 * max(-2, floor((Bags - 25) / 5))

  // Step 5: Final multiplicative
  if (Bone Clicker bought AND Bonemeal >= 1)
    baseRate *= Bonemeal * 5

  return baseRate * multiplier
```

### Implementation Steps

#### Step 1: Add Click Rate Calculation Function

**File:** `src/engine/price-calculator.ts` (add to existing file)

```typescript
// =============================================================================
// Click Multiplier Calculation
// =============================================================================

/**
 * State needed to calculate sand per click.
 */
export interface ClickMultiplierState {
  // Boost ownership (power levels)
  biggerBuckets: number;    // Power level (0 if not owned)
  hugeBuckets: boolean;     // Bought flag
  buccaneer: boolean;       // Bought flag
  helpfulHands: boolean;    // Bought flag
  trueColours: boolean;     // Bought flag
  raiseTheFlag: boolean;    // Bought flag
  handItUp: boolean;        // Bought flag
  bucketBrigade: boolean;   // Bought flag
  bagPuns: boolean;         // Bought flag
  boneClicker: boolean;     // Bought flag
  bonemeal: number;         // Resource amount

  // Tool counts
  buckets: number;
  cuegans: number;
  flags: number;
  ladders: number;
  bags: number;

  // Rate for Bucket Brigade
  sandPermNP: number;       // Sand production rate per NP
}

/**
 * Calculate sand gained per beach click.
 *
 * Reference: boosts.js:7357-7392 (calculateSandPerClick)
 *
 * @param state - Current boost and tool state
 * @param globalMultiplier - External multiplier (badges, etc.), default 1
 * @returns Sand per click value
 */
export function calculateSandPerClick(
  state: ClickMultiplierState,
  globalMultiplier = 1
): number {
  // Step 1: Base with Bigger Buckets
  let baseRate = 1 + (state.biggerBuckets * 0.1);

  // Step 2: Multiplicative tier 1
  let mult = 1;
  if (state.hugeBuckets) mult *= 2;
  if (state.buccaneer) mult *= 2;
  baseRate *= mult;

  // Step 3: Additive pair bonuses
  if (state.helpfulHands) {
    baseRate += 0.5 * Math.min(state.buckets, state.cuegans);
  }
  if (state.trueColours) {
    baseRate += 5 * Math.min(state.flags, state.cuegans);
  }
  if (state.raiseTheFlag) {
    baseRate += 50 * Math.min(state.flags, state.ladders);
  }
  if (state.handItUp) {
    baseRate += 500 * Math.min(state.bags, state.ladders);
  }

  // Step 4: Additive percentage bonuses
  if (state.bucketBrigade) {
    baseRate += state.sandPermNP * 0.01 * Math.floor(state.buckets / 50);
  }
  if (state.bagPuns) {
    const bagBonus = Math.max(-2, Math.floor((state.bags - 25) / 5));
    baseRate += baseRate * 0.4 * bagBonus;
  }

  // Step 5: Final multiplicative (Bone Clicker)
  if (state.boneClicker && state.bonemeal >= 1) {
    baseRate *= state.bonemeal * 5;
  }

  return baseRate * globalMultiplier;
}
```

#### Step 2: Add Rate Calculation to ModernEngine

**File:** `src/engine/modern-engine.ts`

Add new private method and cached rate:

```typescript
// Add to class fields
private cachedSandPerClick = 1;

// Add method to calculate click multiplier state
private buildClickMultiplierState(): ClickMultiplierState {
  const getToolAmount = (name: string): number => {
    const tool = this.sandTools.get(name);
    return tool?.amount ?? 0;
  };

  const isBoostBought = (name: string): boolean => {
    const boost = this.boosts.get(name);
    return (boost?.bought ?? 0) > 0;
  };

  const getBoostPower = (name: string): number => {
    const boost = this.boosts.get(name);
    return boost?.power ?? 0;
  };

  return {
    biggerBuckets: getBoostPower('BiggerBuckets'),
    hugeBuckets: isBoostBought('HugeBuckets'),
    buccaneer: isBoostBought('Buccaneer'),
    helpfulHands: isBoostBought('HelpfulHands'),
    trueColours: isBoostBought('TrueColours'),
    raiseTheFlag: isBoostBought('RaiseTheFlag'),
    handItUp: isBoostBought('HandItUp'),
    bucketBrigade: isBoostBought('BucketBrigade'),
    bagPuns: isBoostBought('BagPuns'),
    boneClicker: isBoostBought('BoneClicker'),
    bonemeal: getBoostPower('Bonemeal'),

    buckets: getToolAmount('Bucket'),
    cuegans: getToolAmount('Cuegan'),
    flags: getToolAmount('Flag'),
    ladders: getToolAmount('Ladder'),
    bags: getToolAmount('Bag'),

    sandPermNP: this.calculateSandRate(), // Existing method
  };
}

// Add method to recalculate cached rate
private recalculateSandPerClick(): void {
  const state = this.buildClickMultiplierState();
  this.cachedSandPerClick = calculateSandPerClick(state);
}
```

#### Step 3: Update processBeachClick()

**File:** `src/engine/modern-engine.ts`

Replace the hardcoded `sandGained = 1`:

```typescript
private processBeachClick(): void {
  this.core.beachClicks++;

  // Use calculated sand per click
  const sandGained = this.cachedSandPerClick;

  this.resources.sand += sandGained;
  // ... rest of method unchanged
}
```

#### Step 4: Trigger Rate Recalculation

Add calls to `recalculateSandPerClick()` when:
- Boosts are bought that affect clicks
- Tools are bought
- Game state is loaded

```typescript
// In buyBoost() method, after successful purchase:
this.recalculateSandPerClick();

// In buyTool() method, after successful purchase:
this.recalculateSandPerClick();

// In loadState() method, after state restoration:
this.recalculateSandPerClick();
```

#### Step 5: Add Tests

**File:** `src/engine/price-calculator.test.ts`

```typescript
describe('calculateSandPerClick', () => {
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

  it('returns 1 for base state', () => {
    expect(calculateSandPerClick(baseState)).toBe(1);
  });

  it('adds 0.1 per Bigger Buckets power', () => {
    expect(calculateSandPerClick({ ...baseState, biggerBuckets: 1 })).toBe(1.1);
    expect(calculateSandPerClick({ ...baseState, biggerBuckets: 10 })).toBe(2);
  });

  it('multiplies by 2 for Huge Buckets', () => {
    expect(calculateSandPerClick({ ...baseState, hugeBuckets: true })).toBe(2);
  });

  it('stacks multiplicative boosts', () => {
    expect(calculateSandPerClick({
      ...baseState,
      hugeBuckets: true,
      buccaneer: true,
    })).toBe(4);
  });

  it('adds pair bonuses from Helpful Hands', () => {
    expect(calculateSandPerClick({
      ...baseState,
      helpfulHands: true,
      buckets: 10,
      cuegans: 5,
    })).toBe(1 + 0.5 * 5); // min(10, 5) = 5
  });

  it('applies global multiplier', () => {
    expect(calculateSandPerClick(baseState, 2)).toBe(2);
  });
});
```

**File:** `src/engine/modern-engine.test.ts`

```typescript
describe('click multipliers', () => {
  it('gains 1 sand per click with no boosts', async () => {
    const engine = new ModernEngine();
    await engine.initialize();
    await engine.clickBeach(1);
    const state = await engine.getStateSnapshot();
    expect(state.sand).toBe(1);
  });

  it('gains more sand with Bigger Buckets', async () => {
    const engine = new ModernEngine();
    await engine.initialize();
    // Buy Bigger Buckets boost
    await engine.forceBoostState('BiggerBuckets', { bought: 1, power: 1 });
    await engine.clickBeach(1);
    const state = await engine.getStateSnapshot();
    expect(state.sand).toBe(1.1);
  });
});
```

### Parity Test Cases

```typescript
// In engine-comparison.test.ts
describe('click multiplier parity', () => {
  it('matches legacy sand per click with Bigger Buckets', async () => {
    const fixture = {
      name: 'bigger-buckets-click',
      setup: async (engine) => {
        await engine.forceBoostState('BiggerBuckets', { bought: 1, power: 5 });
      },
      actions: [
        { type: 'click', target: 'beach', count: 10 },
      ],
    };

    const result = await runner.compareFixture(fixture);
    expect(result.passed).toBe(true);
  });
});
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/price-calculator.ts` | Add `ClickMultiplierState` interface, `calculateSandPerClick()` function |
| `src/engine/modern-engine.ts` | Add `cachedSandPerClick`, `buildClickMultiplierState()`, `recalculateSandPerClick()`, update `processBeachClick()` |
| `src/engine/price-calculator.test.ts` | Add click multiplier unit tests |
| `src/engine/modern-engine.test.ts` | Add click multiplier integration tests |
| `src/parity/engine-comparison.test.ts` | Add click multiplier parity tests |

---

## Plan 2: Dynamic Boost Functions

### Current State
- Boosts are defined in `game-data.json` with flags like `hasBuyFunction`, `hasUnlockFunction`, etc.
- 76 boosts have `buyFunction`, 11 have `countdownFunction`, 27 have `lockFunction`
- Modern engine doesn't execute these functions

### Legacy Pattern (from castle.js)

```javascript
// Storage: Functions are properties on boost objects
new Molpy.Boost({
  name: 'ASHF',
  buyFunction: function() {
    Molpy.CalcPriceFactor();
  },
  countdownFunction: function() {
    if (this.countdown == 2) Molpy.Notify('...');
  },
});

// Invocation: Conditional calls in engine methods
this.buy = function() {
  // ... purchase logic ...
  if (this.buyFunction) this.buyFunction();
};
```

### Implementation Strategy

Since the legacy functions are JavaScript with `this` context and `Molpy` globals, we need a **registry pattern** where we manually implement critical boost functions in TypeScript.

#### Step 1: Create Boost Function Registry

**File:** `src/engine/boost-functions.ts` (new file)

```typescript
/**
 * Boost Function Registry
 *
 * This module contains TypeScript implementations of dynamic boost functions
 * from the legacy game. Only boosts that require custom logic are implemented;
 * simple boosts work via the default behavior.
 */

import type { ModernEngine } from './modern-engine.js';

/**
 * Context passed to boost functions
 */
export interface BoostFunctionContext {
  engine: ModernEngine;
  boostName: string;
  boostPower: number;
  boostCountdown: number;
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
 * Registry of boost functions by boost alias
 */
export interface BoostFunctions {
  buyFunction?: BuyFunction;
  unlockFunction?: UnlockFunction;
  lockFunction?: LockFunction;
  countdownFunction?: CountdownFunction;
  loadFunction?: LoadFunction;
}

/**
 * Master registry of all boost functions
 */
export const boostFunctionRegistry: Record<string, BoostFunctions> = {};

// =============================================================================
// Buy Functions
// =============================================================================

/**
 * ASHF (Affordable Swedish Home Furniture)
 * Reference: boosts.js:530-534
 */
boostFunctionRegistry['ASHF'] = {
  buyFunction: (ctx) => {
    ctx.engine.recalculatePriceFactor();
    ctx.engine.markShopDirty();
  },
};

/**
 * Riverish - Sets power to beach click count
 * Reference: castle.js:1769
 */
boostFunctionRegistry['Riverish'] = {
  buyFunction: (ctx) => {
    ctx.engine.setBoostPower(ctx.boostName, ctx.engine.getBeachClicks());
  },
};

/**
 * Way of the Panther - Locks opposing boost permanently
 * Reference: boosts.js:12286-12289
 */
boostFunctionRegistry['WotP'] = {
  buyFunction: (ctx) => {
    ctx.engine.permalockBoost('WotP');
    ctx.engine.lockBoost('WotT');
    ctx.engine.permalockBoost('WotT');
  },
};

boostFunctionRegistry['WotT'] = {
  buyFunction: (ctx) => {
    ctx.engine.permalockBoost('WotT');
    ctx.engine.lockBoost('WotP');
    ctx.engine.permalockBoost('WotP');
  },
};

// =============================================================================
// Countdown Functions
// =============================================================================

/**
 * ASHF countdown warning
 * Reference: boosts.js:536-540
 */
boostFunctionRegistry['ASHF'].countdownFunction = (ctx) => {
  if (ctx.boostCountdown === 2) {
    ctx.engine.notify('Only 2mNP of discounts remain!');
  }
};

/**
 * Temporal Rift warning
 * Reference: boosts.js:1750-1754
 */
boostFunctionRegistry['TemporalRift'] = {
  countdownFunction: (ctx) => {
    if (ctx.boostCountdown === 2) {
      ctx.engine.notify('The rift closes in 2mNP!');
    }
  },
};

// =============================================================================
// Unlock Functions
// =============================================================================

/**
 * Locked Crate - Set power based on resources
 * Reference: boosts.js:3776-3778
 */
boostFunctionRegistry['LockedCrate'] = {
  unlockFunction: (ctx) => {
    const castles = ctx.engine.getResource('castles');
    const sand = ctx.engine.getResource('sand');
    ctx.engine.setBoostPower(ctx.boostName, castles * 6 + sand);
  },
};

/**
 * Monty Haul Problem - Generate prize door
 * Reference: boosts.js:429-431
 */
boostFunctionRegistry['MHP'] = {
  unlockFunction: (ctx) => {
    const prize = Math.floor(Math.random() * 3) + 1; // 1-3
    ctx.engine.setBoostPower(ctx.boostName, prize);
  },
};

// =============================================================================
// Lock Functions
// =============================================================================

// Lock functions typically reset state - implement as needed

// =============================================================================
// Load Functions
// =============================================================================

// Load functions restore calculated state from save data
```

#### Step 2: Add Engine API Methods

**File:** `src/engine/modern-engine.ts`

Add public API methods that boost functions can call:

```typescript
// Public API for boost functions
recalculatePriceFactor(): void {
  // Existing implementation
}

markShopDirty(): void {
  // Flag for UI refresh (no-op in headless mode)
}

setBoostPower(boostName: string, power: number): void {
  const boost = this.boosts.get(boostName);
  if (boost) {
    boost.power = power;
    this.syncResourceBoosts();
  }
}

getBeachClicks(): number {
  return this.core.beachClicks;
}

getResource(name: 'sand' | 'castles' | 'glassChips' | 'glassBlocks'): number {
  return this.resources[name];
}

permalockBoost(boostName: string): void {
  const boost = this.boosts.get(boostName);
  if (boost) {
    boost.permalock = true;
  }
}

lockBoost(boostName: string): void {
  const boost = this.boosts.get(boostName);
  if (boost) {
    boost.bought = 0;
    boost.unlocked = 0;
  }
}

notify(message: string): void {
  // In headless mode, this is a no-op or logs to console
  // Could be extended to emit events for UI layer
}
```

#### Step 3: Integrate Registry into Boost Operations

**File:** `src/engine/modern-engine.ts`

Update boost purchasing to call registered functions:

```typescript
import { boostFunctionRegistry, type BoostFunctionContext } from './boost-functions.js';

private createBoostContext(boostName: string): BoostFunctionContext {
  const boost = this.boosts.get(boostName);
  return {
    engine: this,
    boostName,
    boostPower: boost?.power ?? 0,
    boostCountdown: boost?.countdown ?? 0,
  };
}

// In buyBoost() method, after purchase:
const functions = boostFunctionRegistry[boostAlias];
if (functions?.buyFunction) {
  functions.buyFunction(this.createBoostContext(boostAlias));
}

// In unlockBoost() method, after unlock:
const functions = boostFunctionRegistry[boostAlias];
if (functions?.unlockFunction) {
  functions.unlockFunction(this.createBoostContext(boostAlias));
}

// In lockBoost() method:
const functions = boostFunctionRegistry[boostAlias];
if (functions?.lockFunction) {
  functions.lockFunction(this.createBoostContext(boostAlias));
}

// In countdown processing (during tick/ONG):
if (boost.countdown > 0) {
  boost.countdown--;
  const functions = boostFunctionRegistry[boostAlias];
  if (functions?.countdownFunction) {
    functions.countdownFunction(this.createBoostContext(boostAlias));
  }
}
```

#### Step 4: Add Tests

**File:** `src/engine/boost-functions.test.ts` (new file)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';

describe('boost functions', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine();
    await engine.initialize();
  });

  describe('ASHF', () => {
    it('recalculates price factor on buy', async () => {
      // Setup: Give enough resources to buy ASHF
      await engine.forceResources({ castles: 10000 });
      await engine.forceBoostState('ASHF', { unlocked: 1 });

      const priceBefore = engine.getPriceFactor();
      await engine.buyBoost('ASHF');
      const priceAfter = engine.getPriceFactor();

      expect(priceAfter).toBeLessThan(priceBefore);
    });
  });

  describe('Riverish', () => {
    it('sets power to beach click count on buy', async () => {
      await engine.clickBeach(50);
      await engine.forceBoostState('Riverish', { unlocked: 1 });
      await engine.buyBoost('Riverish');

      const boost = engine.getBoostState('Riverish');
      expect(boost.power).toBe(50);
    });
  });

  describe('MHP', () => {
    it('sets random prize on unlock', async () => {
      await engine.unlockBoost('MHP');

      const boost = engine.getBoostState('MHP');
      expect(boost.power).toBeGreaterThanOrEqual(1);
      expect(boost.power).toBeLessThanOrEqual(3);
    });
  });
});
```

### Priority Functions to Implement

Based on gameplay impact, implement these first:

| Priority | Boost | Function Type | Effect |
|----------|-------|---------------|--------|
| 1 | ASHF | buyFunction, countdownFunction | Price discounts |
| 2 | Riverish | buyFunction | Power tracking |
| 3 | WotP/WotT | buyFunction | Mutually exclusive |
| 4 | MHP | unlockFunction | Random prize |
| 5 | LockedCrate | unlockFunction | Resource-based power |
| 6 | FamilyDiscount | buyFunction | Price discounts |
| 7 | TemporalRift | countdownFunction | Rift mechanics |

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/boost-functions.ts` | New file with registry and implementations |
| `src/engine/modern-engine.ts` | Add public API methods, integrate registry calls |
| `src/engine/boost-functions.test.ts` | New test file |
| `src/engine/index.ts` | Export new module |

---

## Plan 3: Glass Production

### Current State
- `glassChips` and `glassBlocks` exist in `Resources` interface
- No production logic implemented
- Boosts like Sand Refinery and Glass Chiller are not functional

### Legacy System Overview

```
Production Chain:
  Sand Refinery → Glass Chips (at ONG)
  Glass Chiller → Glass Chips → Glass Blocks (at ONG)

Key Boosts:
  - Glass Furnace (toggle) → enables Sand Refinery
  - Glass Blower (toggle) → enables Glass Chiller
  - Sand Purifier → reduces Furnace sand usage
  - Glass Extruder → reduces Blower sand usage
  - Glass Goat → multiplies both productions
  - Ruthless Efficiency → reduces chips per block
```

### Production Formulas

#### Glass Chips (from boosts.js:2140-2148)

```
if (Glass Furnace enabled):
  furnaceLevel = (Sand Refinery.power + 1)
  if (Glass Goat bought && Goats >= 1):
    furnaceLevel *= Goats * 5
  chipsProduced = floor(furnaceLevel * Papal('Chips'))
```

#### Glass Blocks (from boosts.js:2465-2498)

```
if (Glass Blower enabled):
  chillerLevel = (Glass Chiller.power + 1)
  chipsPerBlock = ChipsPerBlock()  // 20, 5, 4, or 1

  // Calculate how many blocks we can make
  maxBlocks = floor(GlassChips / chipsPerBlock)
  blocksToMake = min(chillerLevel, maxBlocks)

  if (blocksToMake > 0):
    // Consume chips
    GlassChips -= blocksToMake * chipsPerBlock

    // Apply multipliers
    if (Glass Goat bought && Goats >= 1):
      blocksToMake *= Goats * 5

    blocksProduced = floor(blocksToMake * Papal('Blocks'))
```

#### ChipsPerBlock (from boosts.js:2346-2351)

```
chipsPerBlock = 20
if (Ruthless Efficiency bought):
  chipsPerBlock = 5
if (Glass Trolling enabled):
  chipsPerBlock /= 5
```

### Implementation Steps

#### Step 1: Add Glass Production Functions

**File:** `src/engine/price-calculator.ts`

```typescript
// =============================================================================
// Glass Production Calculation
// =============================================================================

/**
 * State needed to calculate glass production.
 */
export interface GlassProductionState {
  // Toggle states
  glassFurnaceEnabled: boolean;
  glassBlowerEnabled: boolean;

  // Production levels
  sandRefineryPower: number;  // +1 chips per NP
  glassChillerPower: number;  // +1 blocks per NP

  // Efficiency modifiers
  ruthlessEfficiency: boolean;  // 5 chips per block instead of 20
  glassTrolling: boolean;       // Divide chip cost by 5

  // Multipliers
  glassGoatOwned: boolean;
  goatCount: number;            // Multiplier: goats * 5

  // Papal multipliers (default 1.0)
  papalChips: number;
  papalBlocks: number;

  // Current resources
  currentGlassChips: number;
}

/**
 * Calculate chips per block ratio.
 * Reference: boosts.js:2346-2351
 */
export function calculateChipsPerBlock(
  ruthlessEfficiency: boolean,
  glassTrolling: boolean
): number {
  let base = ruthlessEfficiency ? 5 : 20;
  if (glassTrolling) {
    base = Math.floor(base / 5);
  }
  return Math.max(1, base); // Minimum 1
}

/**
 * Calculate glass chip production at ONG.
 * Reference: boosts.js:2140-2148
 *
 * @param state - Current glass production state
 * @returns Chips produced (0 if furnace disabled)
 */
export function calculateGlassChipProduction(
  state: GlassProductionState
): number {
  if (!state.glassFurnaceEnabled) {
    return 0;
  }

  let furnaceLevel = state.sandRefineryPower + 1;

  // Glass Goat multiplier
  if (state.glassGoatOwned && state.goatCount >= 1) {
    furnaceLevel *= state.goatCount * 5;
  }

  // Papal decree multiplier (default 1.0)
  return Math.floor(furnaceLevel * state.papalChips);
}

/**
 * Calculate glass block production at ONG.
 * Reference: boosts.js:2465-2498
 *
 * @param state - Current glass production state
 * @returns Object with blocks produced and chips consumed
 */
export function calculateGlassBlockProduction(
  state: GlassProductionState
): { blocksProduced: number; chipsConsumed: number } {
  if (!state.glassBlowerEnabled) {
    return { blocksProduced: 0, chipsConsumed: 0 };
  }

  const chipsPerBlock = calculateChipsPerBlock(
    state.ruthlessEfficiency,
    state.glassTrolling
  );

  let chillerLevel = state.glassChillerPower + 1;

  // Calculate maximum blocks we can make
  const maxBlocks = Math.floor(state.currentGlassChips / chipsPerBlock);
  let blocksToMake = Math.min(chillerLevel, maxBlocks);

  if (blocksToMake <= 0) {
    return { blocksProduced: 0, chipsConsumed: 0 };
  }

  const chipsConsumed = blocksToMake * chipsPerBlock;

  // Apply multipliers after calculating chip cost
  if (state.glassGoatOwned && state.goatCount >= 1) {
    blocksToMake *= state.goatCount * 5;
  }

  // Papal decree multiplier
  const blocksProduced = Math.floor(blocksToMake * state.papalBlocks);

  return { blocksProduced, chipsConsumed };
}
```

#### Step 2: Add Glass Production to ONG Processing

**File:** `src/engine/modern-engine.ts`

```typescript
// Add to ongBase() method, after castle tool processing:

private processGlassProduction(): void {
  const state = this.buildGlassProductionState();

  // Produce glass chips
  const chipsProduced = calculateGlassChipProduction(state);
  if (chipsProduced > 0) {
    this.resources.glassChips += chipsProduced;
  }

  // Update state with new chip count for block calculation
  state.currentGlassChips = this.resources.glassChips;

  // Produce glass blocks (consumes chips)
  const { blocksProduced, chipsConsumed } = calculateGlassBlockProduction(state);
  if (blocksProduced > 0) {
    this.resources.glassChips -= chipsConsumed;
    this.resources.glassBlocks += blocksProduced;
  }

  this.syncResourceBoosts();
}

private buildGlassProductionState(): GlassProductionState {
  const isToggleEnabled = (name: string): boolean => {
    const boost = this.boosts.get(name);
    return boost?.isEnabled ?? false;
  };

  const isBoostBought = (name: string): boolean => {
    const boost = this.boosts.get(name);
    return (boost?.bought ?? 0) > 0;
  };

  const getBoostPower = (name: string): number => {
    const boost = this.boosts.get(name);
    return boost?.power ?? 0;
  };

  return {
    glassFurnaceEnabled: isToggleEnabled('GlassFurnace'),
    glassBlowerEnabled: isToggleEnabled('GlassBlower'),
    sandRefineryPower: getBoostPower('SandRefinery'),
    glassChillerPower: getBoostPower('GlassChiller'),
    ruthlessEfficiency: isBoostBought('RuthlessEfficiency'),
    glassTrolling: isToggleEnabled('GlassTrolling'),
    glassGoatOwned: isBoostBought('GlassGoat'),
    goatCount: getBoostPower('Goats'),
    papalChips: 1.0, // Papal decree not yet implemented
    papalBlocks: 1.0,
    currentGlassChips: this.resources.glassChips,
  };
}
```

Update `ongBase()` to call glass production:

```typescript
private ongBase(): void {
  // ... existing ONG logic ...

  // Castle tool processing
  this.processCastleTools();

  // Glass production (after castle tools, at ONG)
  this.processGlassProduction();

  // ... rest of ONG logic ...
}
```

#### Step 3: Add Toggle State Support

**File:** `src/types/game-data.ts`

Ensure `BoostState` includes `isEnabled`:

```typescript
export interface BoostState {
  unlocked: number;
  bought: number;
  power: number;
  countdown?: number;
  isEnabled?: boolean;  // For toggle boosts
  permalock?: boolean;  // Cannot be unlocked again
}
```

**File:** `src/engine/modern-engine.ts`

Add toggle method:

```typescript
toggleBoost(boostName: string, enabled?: boolean): void {
  const boost = this.boosts.get(boostName);
  if (!boost || boost.bought === 0) return;

  if (enabled === undefined) {
    boost.isEnabled = !boost.isEnabled;
  } else {
    boost.isEnabled = enabled;
  }
}
```

#### Step 4: Add Tests

**File:** `src/engine/price-calculator.test.ts`

```typescript
describe('glass production', () => {
  describe('calculateChipsPerBlock', () => {
    it('returns 20 by default', () => {
      expect(calculateChipsPerBlock(false, false)).toBe(20);
    });

    it('returns 5 with Ruthless Efficiency', () => {
      expect(calculateChipsPerBlock(true, false)).toBe(5);
    });

    it('returns 4 with Glass Trolling', () => {
      expect(calculateChipsPerBlock(false, true)).toBe(4);
    });

    it('returns 1 with both', () => {
      expect(calculateChipsPerBlock(true, true)).toBe(1);
    });
  });

  describe('calculateGlassChipProduction', () => {
    const baseState: GlassProductionState = {
      glassFurnaceEnabled: true,
      glassBlowerEnabled: false,
      sandRefineryPower: 0,
      glassChillerPower: 0,
      ruthlessEfficiency: false,
      glassTrolling: false,
      glassGoatOwned: false,
      goatCount: 0,
      papalChips: 1.0,
      papalBlocks: 1.0,
      currentGlassChips: 0,
    };

    it('returns 0 when furnace disabled', () => {
      expect(calculateGlassChipProduction({
        ...baseState,
        glassFurnaceEnabled: false,
      })).toBe(0);
    });

    it('returns power + 1 chips', () => {
      expect(calculateGlassChipProduction({
        ...baseState,
        sandRefineryPower: 4,
      })).toBe(5);
    });

    it('applies Glass Goat multiplier', () => {
      expect(calculateGlassChipProduction({
        ...baseState,
        glassGoatOwned: true,
        goatCount: 2,
      })).toBe(1 * 2 * 5); // (0+1) * 2 goats * 5
    });
  });

  describe('calculateGlassBlockProduction', () => {
    const baseState: GlassProductionState = {
      glassFurnaceEnabled: false,
      glassBlowerEnabled: true,
      sandRefineryPower: 0,
      glassChillerPower: 0,
      ruthlessEfficiency: false,
      glassTrolling: false,
      glassGoatOwned: false,
      goatCount: 0,
      papalChips: 1.0,
      papalBlocks: 1.0,
      currentGlassChips: 100,
    };

    it('returns 0 when blower disabled', () => {
      const result = calculateGlassBlockProduction({
        ...baseState,
        glassBlowerEnabled: false,
      });
      expect(result.blocksProduced).toBe(0);
    });

    it('consumes 20 chips per block by default', () => {
      const result = calculateGlassBlockProduction(baseState);
      expect(result.blocksProduced).toBe(1);
      expect(result.chipsConsumed).toBe(20);
    });

    it('limited by available chips', () => {
      const result = calculateGlassBlockProduction({
        ...baseState,
        glassChillerPower: 10, // Would make 11 blocks
        currentGlassChips: 60, // Only enough for 3
      });
      expect(result.blocksProduced).toBe(3);
      expect(result.chipsConsumed).toBe(60);
    });
  });
});
```

**File:** `src/engine/modern-engine.test.ts`

```typescript
describe('glass production', () => {
  it('produces glass chips at ONG when furnace enabled', async () => {
    const engine = new ModernEngine();
    await engine.initialize();

    // Enable glass furnace
    await engine.forceBoostState('GlassFurnace', { bought: 1, isEnabled: true });
    await engine.forceBoostState('SandRefinery', { bought: 1, power: 4 });

    // Trigger ONG
    await engine.advanceToONG();

    const state = await engine.getStateSnapshot();
    expect(state.glassChips).toBe(5); // power 4 + 1
  });

  it('produces glass blocks consuming chips', async () => {
    const engine = new ModernEngine();
    await engine.initialize();

    // Setup: have chips, enable blower
    await engine.forceResources({ glassChips: 100 });
    await engine.forceBoostState('GlassBlower', { bought: 1, isEnabled: true });
    await engine.forceBoostState('GlassChiller', { bought: 1, power: 2 });

    // Trigger ONG
    await engine.advanceToONG();

    const state = await engine.getStateSnapshot();
    expect(state.glassBlocks).toBe(3); // power 2 + 1
    expect(state.glassChips).toBe(40); // 100 - 3*20
  });
});
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/price-calculator.ts` | Add glass production interfaces and functions |
| `src/engine/modern-engine.ts` | Add `processGlassProduction()`, `buildGlassProductionState()`, `toggleBoost()` |
| `src/types/game-data.ts` | Add `isEnabled` to `BoostState` |
| `src/engine/price-calculator.test.ts` | Add glass production unit tests |
| `src/engine/modern-engine.test.ts` | Add glass production integration tests |

---

## Implementation Order

### Recommended Sequence

1. **Click Multipliers** (Plan 1)
   - Self-contained feature
   - Immediately testable
   - Low risk of breaking existing functionality

2. **Dynamic Boost Functions** (Plan 2)
   - Foundation for many game mechanics
   - Required for ASHF price discounts to work correctly
   - Registry pattern allows incremental addition

3. **Glass Production** (Plan 3)
   - Depends on toggle state (added in Plan 2)
   - Opens mid-game progression
   - More complex resource flow

### Success Criteria

Each plan is complete when:
- [ ] All unit tests pass
- [ ] Integration tests with ModernEngine pass
- [ ] Parity tests against legacy engine pass
- [ ] No TypeScript errors or warnings
- [ ] Code reviewed for security (no eval, proper input handling)

---

## References

- Legacy code: `castle.js`, `boosts.js`, `tools.js`
- Existing modern engine: `src/engine/modern-engine.ts`
- Price calculator: `src/engine/price-calculator.ts`
- Type definitions: `src/types/game-data.ts`
