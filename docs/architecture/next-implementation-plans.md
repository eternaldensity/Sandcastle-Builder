# Next Implementation Plans (Priority 4-8)

This document contains detailed implementation plans for the next five priority features in the Sandcastle Builder modernization project. These build on the completed Plans 1-3 (Click Multipliers, Dynamic Boost Functions, Glass Production).

## Overview

| Priority | Feature | Complexity | Est. Files Changed | Dependencies |
|----------|---------|------------|-------------------|--------------|
| 4 | Sand Tool Production Rates | Medium | 3-4 | None |
| 5 | More Boost Functions | Medium-High | 2-3 | Plan 2 complete |
| 6 | Badge Auto-Earn System | Medium | 4-5 | None |
| 7 | Discovery/Monument System | High | 5-6 | Plan 6 complete |
| 8 | Coma/Reset System | High | 4-5 | Plans 6-7 complete |

---

## Plan 4: Sand Tool Production Rates

### Current State
- `calculateSandToolRate()` in [modern-engine.ts:627](../src/engine/modern-engine.ts#L627) uses placeholder rates
- Current rates: Bucket=0.1, Cuegan=0.5, Flag=1, LaPetite=2, Ladder=5, Bag=10
- Missing all boost multipliers that affect sand production

### Legacy Formulas (from tools.js)

Each sand tool has a `spmNP()` function that calculates sand per milliNewPix:

#### Bucket (tools.js:9-21)
```
baseRate = 0.1 + (Bigger Buckets.power * 0.1)
mult = 1
  × GlassCeilingMult() [if Glass Ceiling 0]
  × 2 [if Huge Buckets]
  × pow(1.5, min(floor(Trebuchet.amount/2), 2000)) [if Trebuchet Pong]
  × 4 [if Carrybot]
  × 2 [if Buccaneer]
  × Trebuchet.amount [if Flying Buckets]
return mult * baseRate
```

#### Cuegan (tools.js:42-56)
```
baseRate = 0.6 + (Helping Hand.power * 0.2)
mult = 1
  × GlassCeilingMult() [if Glass Ceiling 2]
  × 2 [if Megball]
  × pow(1.05, floor(Bucket.amount/2)) [if Cooperation, capped at 8000]
  × 4 [if Stickbot]
  × 40 [if The Forty]
  × 2 * Trebuchet.amount [if Human Cannonball]
return baseRate * mult
```

#### Flag (tools.js:77-98)
```
baseRate = 8 + (Flag Bearer.power * 2)
mult = 1
  × GlassCeilingMult() [if Glass Ceiling 4]
  × 2.5 [if Magic Mountain]
  × 4 [if Standardbot]
  × pow(1.05, min(Scaffold.amount, 2000)) [if Balancing Act]
  × (waves / max(1, waves)) [if SBTF, parity-based]
  × 10 * Trebuchet.amount [if Fly the Flag]
return baseRate * mult
```

#### Ladder (tools.js:118-147)
```
baseRate = 54 + (Extension Ladder.power * 18)
mult = 1
  × ninjaStealth [if Ninja Climber]
  × GlassCeilingMult() [if Glass Ceiling 6]
  × 2 [if Level Up!]
  × 4 [if Climbbot]
  × min(all tool amounts) [if Broken Rung]
  × 10 * Trebuchet.amount [if Up Up and Away]
return baseRate * mult
```

#### Bag (tools.js:166-180)
```
baseRate = 600
mult = 1
  × GlassCeilingMult() [if Glass Ceiling 8]
  × pow(1.02, min(Cuegan.amount - 14, 8000)) [if Embaggening AND Cuegan > 14]
  × pow(1.05, min(River.amount, 2000)) [if Sandbag]
  × 4 [if Luggagebot]
  × 2 [if Bag Puns]
  × 5 [if Air Drop]
return baseRate * mult
```

#### LaPetite (tools.js:199-211)
```
baseRate = 2e137
mult = 1
  × GlassCeilingMult() [if Glass Ceiling 10]
  × 1e42 [if Frenchbot]
  × pow(1.03, NewPixBot.amount) [if Bacon]
return mult * baseRate
```

### Global Sand Rate Multipliers (boosts.js:7394-7451)

After individual tool rates are calculated:
```
sandPermNP = sum of (tool.amount × tool.spmNP) for all sand tools

multiplier = 1
  + 0.01 * BadgesOwned [if Molpies]
  + 0.02 * BadgesOwned [if Grapevine]
  + 0.05 * BadgesOwned [if Ch*rpies]
  + Overcompensating.power [if Overcompensating AND npLength > 1800]
  + 0.1 * BadgesOwned [if Facebugs]
  × Blitzing.power / 100 [if Blitzing]
  × BBC() [BBC multiplier]
  × max(0, (100 - glassUse) / 100) [Glass usage penalty]
  × 1.1 [if Hugo]

finalSandRate = sandPermNP × multiplier
```

### Implementation Steps

#### Step 1: Create Sand Rate Calculator Module

**File:** `src/engine/sand-rate-calculator.ts` (new file)

```typescript
/**
 * Sand Rate Calculator
 *
 * Calculates per-tool sand production rates and global multipliers.
 * Reference: tools.js spmNP functions, boosts.js calculateSandRates
 */

export interface SandToolRateState {
  // Tool amounts
  buckets: number;
  cuegans: number;
  flags: number;
  ladders: number;
  bags: number;
  laPetite: number;
  trebuchets: number;
  scaffolds: number;
  waves: number;
  rivers: number;
  newPixBots: number;

  // Boost powers
  biggerBucketsPower: number;
  helpingHandPower: number;
  flagBearerPower: number;
  extensionLadderPower: number;

  // Boost ownership flags
  glassCeiling: number[];  // Array of owned glass ceilings (0-11)
  hugeBuckets: boolean;
  trebuchetPong: boolean;
  carrybot: boolean;
  buccaneer: boolean;
  flyingBuckets: boolean;
  megball: boolean;
  cooperation: boolean;
  stickbot: boolean;
  theForty: boolean;
  humanCannonball: boolean;
  magicMountain: boolean;
  standardbot: boolean;
  balancingAct: boolean;
  sbtf: boolean;
  flyTheFlag: boolean;
  ninjaClimber: boolean;
  levelUp: boolean;
  climbbot: boolean;
  brokenRung: boolean;
  upUpAndAway: boolean;
  embaggening: boolean;
  sandbag: boolean;
  luggagebot: boolean;
  bagPuns: boolean;
  airDrop: boolean;
  frenchbot: boolean;
  bacon: boolean;

  // For global multipliers
  ninjaStealth: number;
  badgesOwned: number;
  glassUse: number;  // Percentage of sand rate used by glass production

  // Global multiplier boosts
  molpies: boolean;
  grapevine: boolean;
  chirpies: boolean;
  facebugs: boolean;
  overcompensating: boolean;
  overcompensatingPower: number;
  blitzing: boolean;
  blitzingPower: number;
  bbc: boolean;
  bbcPower: number;
  rbBought: number;  // Redundant Boosts bought count for BBC
  hugo: boolean;
  npLength: number;  // For Overcompensating check
  wwbBought: number;  // WWB bought count for Glass Ceiling
  scaffoldAmount: number;  // For WWB Glass Ceiling calculation
}

/**
 * Calculate Glass Ceiling multiplier.
 * Reference: boosts.js:3424-3430
 */
export function calculateGlassCeilingMult(
  glassCeilings: number[],
  wwbBought: number,
  scaffoldAmount: number
): number {
  const ceilingCount = glassCeilings.length;
  if (ceilingCount === 0) return 1;

  let acPower = 33;
  if (wwbBought > 0) {
    acPower *= Math.pow(2, wwbBought - 5) * scaffoldAmount;
  }

  return Math.pow(acPower, ceilingCount);
}

/**
 * Calculate BBC (Big Bonus Counter?) multiplier.
 * Reference: boosts.js:3352-3359
 */
export function calculateBBCMult(bbcPower: number, rbBought: number): number {
  if (bbcPower <= 0) return 1;
  return 20 * Math.pow(200, rbBought);
}

/**
 * Calculate Bucket sand production rate.
 */
export function calculateBucketRate(state: SandToolRateState): number {
  let baseRate = 0.1 + state.biggerBucketsPower * 0.1;
  let mult = 1;

  if (state.glassCeiling.includes(0)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.hugeBuckets) mult *= 2;
  if (state.trebuchetPong && state.trebuchets > 0) {
    mult *= Math.pow(1.5, Math.min(Math.floor(state.trebuchets / 2), 2000));
  }
  if (state.carrybot) mult *= 4;
  if (state.buccaneer) mult *= 2;
  if (state.flyingBuckets && state.trebuchets > 0) {
    mult *= state.trebuchets;
  }

  return mult * baseRate;
}

/**
 * Calculate Cuegan sand production rate.
 */
export function calculateCueganRate(state: SandToolRateState): number {
  let baseRate = 0.6 + state.helpingHandPower * 0.2;
  let mult = 1;

  if (state.glassCeiling.includes(2)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.megball) mult *= 2;
  if (state.cooperation && state.buckets > 0) {
    mult *= Math.pow(1.05, Math.min(Math.floor(state.buckets / 2), 8000));
  }
  if (state.stickbot) mult *= 4;
  if (state.theForty) mult *= 40;
  if (state.humanCannonball && state.trebuchets > 0) {
    mult *= 2 * state.trebuchets;
  }

  return baseRate * mult;
}

/**
 * Calculate Flag sand production rate.
 */
export function calculateFlagRate(state: SandToolRateState): number {
  let baseRate = 8 + state.flagBearerPower * 2;
  let mult = 1;

  if (state.glassCeiling.includes(4)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.magicMountain) mult *= 2.5;
  if (state.standardbot) mult *= 4;
  if (state.balancingAct && state.scaffolds > 0) {
    mult *= Math.pow(1.05, Math.min(state.scaffolds, 2000));
  }
  if (state.flyTheFlag && state.trebuchets > 0) {
    mult *= 10 * state.trebuchets;
  }
  // SBTF wave parity logic is complex, defer for now

  return baseRate * mult;
}

/**
 * Calculate Ladder sand production rate.
 */
export function calculateLadderRate(state: SandToolRateState): number {
  let baseRate = 54 + state.extensionLadderPower * 18;
  let mult = 1;

  if (state.ninjaClimber && state.ninjaStealth > 0) {
    mult *= state.ninjaStealth;
  }
  if (state.glassCeiling.includes(6)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.levelUp) mult *= 2;
  if (state.climbbot) mult *= 4;
  if (state.brokenRung) {
    const minTools = Math.min(
      state.buckets, state.cuegans, state.flags,
      state.ladders, state.bags, state.laPetite
    );
    if (minTools > 0) mult *= minTools;
  }
  if (state.upUpAndAway && state.trebuchets > 0) {
    mult *= 10 * state.trebuchets;
  }

  return baseRate * mult;
}

/**
 * Calculate Bag sand production rate.
 */
export function calculateBagRate(state: SandToolRateState): number {
  const baseRate = 600;
  let mult = 1;

  if (state.glassCeiling.includes(8)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.embaggening && state.cuegans > 14) {
    mult *= Math.pow(1.02, Math.min(state.cuegans - 14, 8000));
  }
  if (state.sandbag && state.rivers > 0) {
    mult *= Math.pow(1.05, Math.min(state.rivers, 2000));
  }
  if (state.luggagebot) mult *= 4;
  if (state.bagPuns) mult *= 2;
  if (state.airDrop) mult *= 5;

  return baseRate * mult;
}

/**
 * Calculate LaPetite sand production rate.
 */
export function calculateLaPetiteRate(state: SandToolRateState): number {
  const baseRate = 2e137;
  let mult = 1;

  if (state.glassCeiling.includes(10)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.frenchbot) mult *= 1e42;
  if (state.bacon && state.newPixBots > 0) {
    mult *= Math.pow(1.03, state.newPixBots);
  }

  return mult * baseRate;
}

/**
 * Calculate per-tool rates for all sand tools.
 */
export function calculateAllSandToolRates(state: SandToolRateState): Record<string, number> {
  return {
    Bucket: calculateBucketRate(state),
    Cuegan: calculateCueganRate(state),
    Flag: calculateFlagRate(state),
    Ladder: calculateLadderRate(state),
    Bag: calculateBagRate(state),
    LaPetite: calculateLaPetiteRate(state),
  };
}

/**
 * Calculate global sand rate multiplier.
 * Reference: boosts.js:7394-7451
 */
export function calculateGlobalSandMultiplier(state: SandToolRateState): number {
  let multiplier = 1;

  // Badge-based multipliers
  if (state.molpies) multiplier += 0.01 * state.badgesOwned;
  if (state.grapevine) multiplier += 0.02 * state.badgesOwned;
  if (state.chirpies) multiplier += 0.05 * state.badgesOwned;
  if (state.facebugs) multiplier += 0.1 * state.badgesOwned;

  // Overcompensating (only in longpix)
  if (state.overcompensating && state.npLength > 1800) {
    multiplier += state.overcompensatingPower;
  }

  // Blitzing
  if (state.blitzing && state.blitzingPower > 0) {
    multiplier *= state.blitzingPower / 100;
  }

  // BBC
  if (state.bbc && state.bbcPower > 0) {
    multiplier *= calculateBBCMult(state.bbcPower, state.rbBought);
  }

  // Glass usage penalty
  if (state.glassUse > 0) {
    multiplier *= Math.max(0, (100 - state.glassUse) / 100);
  }

  // Hugo
  if (state.hugo) multiplier *= 1.1;

  return multiplier;
}

/**
 * Calculate total sand production rate.
 */
export function calculateTotalSandRate(state: SandToolRateState): number {
  const rates = calculateAllSandToolRates(state);

  let sandPermNP = 0;
  sandPermNP += state.buckets * rates.Bucket;
  sandPermNP += state.cuegans * rates.Cuegan;
  sandPermNP += state.flags * rates.Flag;
  sandPermNP += state.ladders * rates.Ladder;
  sandPermNP += state.bags * rates.Bag;
  sandPermNP += state.laPetite * rates.LaPetite;

  const globalMult = calculateGlobalSandMultiplier(state);

  return sandPermNP * globalMult;
}
```

#### Step 2: Integrate into ModernEngine

**File:** `src/engine/modern-engine.ts`

Add new method to build sand rate state:

```typescript
import {
  calculateAllSandToolRates,
  calculateTotalSandRate,
  type SandToolRateState,
} from './sand-rate-calculator.js';

// Add cached rates
private cachedSandToolRates: Record<string, number> = {};
private cachedTotalSandRate = 0;

/**
 * Build state for sand rate calculation.
 */
private buildSandRateState(): SandToolRateState {
  const getToolAmount = (name: string): number => {
    const tool = this.sandTools.get(name) ?? this.castleTools.get(name);
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

  // Collect owned glass ceilings
  const glassCeilings: number[] = [];
  for (let i = 0; i <= 11; i++) {
    if (isBoostBought(`GlassCeiling${i}`)) {
      glassCeilings.push(i);
    }
  }

  return {
    buckets: getToolAmount('Bucket'),
    cuegans: getToolAmount('Cuegan'),
    flags: getToolAmount('Flag'),
    ladders: getToolAmount('Ladder'),
    bags: getToolAmount('Bag'),
    laPetite: getToolAmount('LaPetite'),
    trebuchets: getToolAmount('Trebuchet'),
    scaffolds: getToolAmount('Scaffold'),
    waves: getToolAmount('Wave'),
    rivers: getToolAmount('River'),
    newPixBots: getToolAmount('NewPixBot'),

    biggerBucketsPower: getBoostPower('BiggerBuckets'),
    helpingHandPower: getBoostPower('HelpingHand'),
    flagBearerPower: getBoostPower('FlagBearer'),
    extensionLadderPower: getBoostPower('ExtensionLadder'),

    glassCeiling: glassCeilings,
    hugeBuckets: isBoostBought('HugeBuckets'),
    trebuchetPong: isBoostBought('TrebuchetPong'),
    carrybot: isBoostBought('Carrybot'),
    buccaneer: isBoostBought('Buccaneer'),
    flyingBuckets: isBoostBought('FlyingBuckets'),
    // ... all other boost flags

    ninjaStealth: this.core.ninjaStealth,
    badgesOwned: this.countBadgesOwned(),
    glassUse: this.calculateGlassUse(),

    molpies: isBoostBought('Molpies'),
    grapevine: isBoostBought('Grapevine'),
    chirpies: isBoostBought('Chirpies'),
    facebugs: isBoostBought('Facebugs'),
    overcompensating: isBoostBought('Overcompensating'),
    overcompensatingPower: getBoostPower('Overcompensating'),
    blitzing: isBoostBought('Blitzing'),
    blitzingPower: getBoostPower('Blitzing'),
    bbc: isBoostBought('BBC'),
    bbcPower: getBoostPower('BBC'),
    rbBought: this.boosts.get('RB')?.bought ?? 0,
    hugo: isBoostBought('Hugo'),
    npLength: this.ong.npLength,
    wwbBought: this.boosts.get('WWB')?.bought ?? 0,
    scaffoldAmount: getToolAmount('Scaffold'),
  };
}

/**
 * Recalculate cached sand rates.
 */
private recalculateSandRates(): void {
  const state = this.buildSandRateState();
  this.cachedSandToolRates = calculateAllSandToolRates(state);
  this.cachedTotalSandRate = calculateTotalSandRate(state);
}

/**
 * Calculate sand production rate for a specific tool.
 * Now uses proper formula instead of placeholder.
 */
private calculateSandToolRate(toolName: string, amount: number): number {
  const rate = this.cachedSandToolRates[toolName] ?? 0;
  return rate * amount;
}
```

#### Step 3: Update processTick to use cached rates

```typescript
private processTick(): void {
  // ... existing code ...

  // Calculate sand production using cached per-tool rates
  let sandProduced = 0;
  for (const [name, state] of this.sandTools) {
    if (state.amount > 0) {
      const rate = this.cachedSandToolRates[name] ?? 0;
      const produced = rate * state.amount;
      sandProduced += produced;
      state.totalSand += produced;
    }
  }

  // ... rest unchanged ...
}
```

#### Step 4: Add Tests

**File:** `src/engine/sand-rate-calculator.test.ts` (new file)

```typescript
import { describe, it, expect } from 'vitest';
import {
  calculateBucketRate,
  calculateCueganRate,
  calculateGlobalSandMultiplier,
  calculateGlassCeilingMult,
  calculateBBCMult,
  type SandToolRateState,
} from './sand-rate-calculator.js';

const baseState: SandToolRateState = {
  buckets: 0, cuegans: 0, flags: 0, ladders: 0, bags: 0, laPetite: 0,
  trebuchets: 0, scaffolds: 0, waves: 0, rivers: 0, newPixBots: 0,
  biggerBucketsPower: 0, helpingHandPower: 0, flagBearerPower: 0, extensionLadderPower: 0,
  glassCeiling: [], hugeBuckets: false, trebuchetPong: false, carrybot: false,
  buccaneer: false, flyingBuckets: false, megball: false, cooperation: false,
  stickbot: false, theForty: false, humanCannonball: false, magicMountain: false,
  standardbot: false, balancingAct: false, sbtf: false, flyTheFlag: false,
  ninjaClimber: false, levelUp: false, climbbot: false, brokenRung: false,
  upUpAndAway: false, embaggening: false, sandbag: false, luggagebot: false,
  bagPuns: false, airDrop: false, frenchbot: false, bacon: false,
  ninjaStealth: 0, badgesOwned: 0, glassUse: 0,
  molpies: false, grapevine: false, chirpies: false, facebugs: false,
  overcompensating: false, overcompensatingPower: 0, blitzing: false, blitzingPower: 0,
  bbc: false, bbcPower: 0, rbBought: 0, hugo: false, npLength: 1800,
  wwbBought: 0, scaffoldAmount: 0,
};

describe('calculateBucketRate', () => {
  it('returns 0.1 base rate', () => {
    expect(calculateBucketRate(baseState)).toBe(0.1);
  });

  it('adds 0.1 per Bigger Buckets power', () => {
    expect(calculateBucketRate({ ...baseState, biggerBucketsPower: 5 })).toBe(0.6);
  });

  it('doubles with Huge Buckets', () => {
    expect(calculateBucketRate({ ...baseState, hugeBuckets: true })).toBe(0.2);
  });

  it('stacks multiplicative boosts', () => {
    const rate = calculateBucketRate({
      ...baseState,
      hugeBuckets: true,  // 2x
      carrybot: true,     // 4x
      buccaneer: true,    // 2x
    });
    expect(rate).toBe(0.1 * 2 * 4 * 2);
  });
});

describe('calculateGlobalSandMultiplier', () => {
  it('returns 1 with no boosts', () => {
    expect(calculateGlobalSandMultiplier(baseState)).toBe(1);
  });

  it('adds 1% per badge with Molpies', () => {
    expect(calculateGlobalSandMultiplier({
      ...baseState,
      molpies: true,
      badgesOwned: 100,
    })).toBe(2); // 1 + 0.01 * 100
  });

  it('applies glass usage penalty', () => {
    expect(calculateGlobalSandMultiplier({
      ...baseState,
      glassUse: 50,
    })).toBe(0.5);
  });

  it('multiplies 1.1x with Hugo', () => {
    expect(calculateGlobalSandMultiplier({
      ...baseState,
      hugo: true,
    })).toBe(1.1);
  });
});

describe('calculateGlassCeilingMult', () => {
  it('returns 1 with no ceilings', () => {
    expect(calculateGlassCeilingMult([], 0, 0)).toBe(1);
  });

  it('returns 33^n for n ceilings', () => {
    expect(calculateGlassCeilingMult([0], 0, 0)).toBe(33);
    expect(calculateGlassCeilingMult([0, 2], 0, 0)).toBe(33 * 33);
  });
});
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/sand-rate-calculator.ts` | New file with all rate calculation functions |
| `src/engine/modern-engine.ts` | Add `buildSandRateState()`, `recalculateSandRates()`, update `processTick()` |
| `src/engine/sand-rate-calculator.test.ts` | New test file |
| `src/engine/index.ts` | Export new module |

### Parity Test Cases

```typescript
describe('sand rate parity', () => {
  it('matches legacy bucket rate with Bigger Buckets', async () => {
    // Compare calculated rate vs legacy Molpy.SandTools['Bucket'].spmNP()
  });

  it('matches legacy total sand rate with multiple boosts', async () => {
    // Compare calculated sandPermNP vs legacy
  });
});
```

---

## Plan 5: More Boost Function Implementations

### Current State
- Registry exists in [boost-functions.ts](../src/engine/boost-functions.ts) with 15 boosts
- 76 boosts have `buyFunction`, only ~15 implemented
- Missing high-impact boosts that affect core gameplay

### Priority Boost Functions to Implement

Based on gameplay impact and frequency of use:

| Priority | Boost | Function Type | Effect |
|----------|-------|---------------|--------|
| 1 | Bigger Buckets | buyFunction | Increments power (+0.1 per click rate) |
| 2 | Time Travel | buyFunction | Handles NP navigation |
| 3 | Temporal Anchor | buyFunction, lockFunction | Freezes NP progression |
| 4 | Sand Monuments | buyFunction | Creates monument badges |
| 5 | Fractal Sandcastles | buyFunction | Castle multiplier |
| 6 | Ninja Lockdown | buyFunction | Disables ninja multipliers |
| 7 | Overcompensating | buyFunction | Sets power to NP number |
| 8 | Blitzing | buyFunction, countdownFunction | Temporary rate multiplier |

### Implementation Steps

#### Step 1: Add Bigger Buckets Function

```typescript
boostFunctionRegistry['BiggerBuckets'] = {
  /**
   * buyFunction: Increments power by 1.
   * Each power level adds 0.1 to click rate.
   * Reference: boosts.js:66
   */
  buyFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, ctx.boostPower + 1);
  },
};
```

#### Step 2: Add Time Travel Function

```typescript
boostFunctionRegistry['TimeTravel'] = {
  /**
   * buyFunction: Sets up time travel state.
   * Reference: boosts.js:985-1020
   */
  buyFunction: (ctx) => {
    // Store current NP for return
    // This is simplified - full impl needs destination selection
    ctx.notify('Time Travel activated!');
  },
};
```

#### Step 3: Add Temporal Anchor Function

```typescript
boostFunctionRegistry['TemporalAnchor'] = {
  /**
   * buyFunction: Freezes NP progression.
   * Reference: boosts.js:1105-1130
   */
  buyFunction: (ctx) => {
    // When enabled, prevents NP from incrementing at ONG
    ctx.notify('Anchored in time at NP ' + /* currentNP */);
  },

  /**
   * lockFunction: Allows NP progression again.
   */
  lockFunction: (ctx) => {
    ctx.notify('Temporal Anchor released');
  },
};
```

#### Step 4: Add Fractal Sandcastles Function

```typescript
boostFunctionRegistry['FractalSandcastles'] = {
  /**
   * buyFunction: Sets power to 0 (resets each ONG).
   * Reference: boosts.js:745-780
   */
  buyFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, 0);
  },
};
```

#### Step 5: Add Blitzing Functions

```typescript
boostFunctionRegistry['Blitzing'] = {
  /**
   * buyFunction: Activates blitzing with countdown.
   * Reference: boosts.js:860-895
   */
  buyFunction: (ctx) => {
    ctx.setBoostCountdown(ctx.boostAlias, 100); // 100 mNP duration
    ctx.notify('Blitzing activated! +100% sand rate for 100 mNP');
  },

  /**
   * countdownFunction: Deactivates when countdown reaches 0.
   */
  countdownFunction: (ctx) => {
    if (ctx.boostCountdown === 1) {
      ctx.notify('Blitzing ending...');
    }
    if (ctx.boostCountdown === 0) {
      ctx.lockBoost(ctx.boostAlias);
    }
  },

  /**
   * lockFunction: Resets power.
   */
  lockFunction: (ctx) => {
    ctx.setBoostPower(ctx.boostAlias, 0);
    ctx.notify('Blitzing expired');
  },
};
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/boost-functions.ts` | Add ~15 more boost function implementations |
| `src/engine/boost-functions.test.ts` | Add tests for new implementations |

---

## Plan 6: Badge Auto-Earn System

### Current State
- Badges exist in `game-data.json` with 219 defined
- `earnBadge()` method exists but is only called explicitly
- No automatic condition checking

### Legacy Badge Trigger Points

Badges are earned at these trigger points:

1. **CheckBuyUnlocks** (data.js:649) - After tool purchases
2. **CalcReportJudgeLevel** (castle.js:489) - Every mNP rate calculation
3. **StealthClick** (castle.js:341) - Ninja stealth milestones
4. **Click handlers** (data.js:1240) - Click count milestones
5. **Rate thresholds** (boosts.js:5100) - Sand rate milestones

### Badge Condition Categories

| Category | Trigger | Examples |
|----------|---------|----------|
| Tool count | After tool buy | ≥200 SandTools → "Beachscaper" |
| Resource amount | CheckBuyUnlocks | ≥7016280 GlassBlocks → "Pyramid of Giza" |
| Spending total | CheckBuyUnlocks | >2e8 castles spent → "Big Spender" |
| Click count | Click handler | ≥1 click → "Amazon Patent" |
| Ninja stealth | StealthClick | ≥6 streak → "Ninja Stealth" |
| Sand rate | Rate update | ≥5000 SpmNP → "Plain Potato Chips" |

### Implementation Steps

#### Step 1: Create Badge Condition Registry

**File:** `src/engine/badge-conditions.ts` (new file)

```typescript
/**
 * Badge Condition System
 *
 * Defines conditions for automatic badge earning.
 * Each condition is checked at appropriate trigger points.
 */

export type BadgeTrigger =
  | 'tool-purchase'
  | 'resource-change'
  | 'click'
  | 'stealth-click'
  | 'rate-update'
  | 'ong'
  | 'tick';

export interface BadgeCondition {
  badge: string;
  trigger: BadgeTrigger;
  check: (state: BadgeCheckState) => boolean;
}

export interface BadgeCheckState {
  // Resources
  sand: number;
  castles: number;
  glassChips: number;
  glassBlocks: number;

  // Tool counts
  sandToolsOwned: number;
  castleToolsOwned: number;
  totalToolsOwned: number;

  // Specific tool amounts
  toolAmounts: Record<string, number>;

  // Progress
  beachClicks: number;
  castlesSpent: number;
  ninjaStealth: number;
  ninjaFreeCount: number;

  // Rates
  sandPermNP: number;

  // Meta
  badgesOwned: number;
  boostsOwned: number;
  discoveryCount: number;
  monumentCount: number;
}

/**
 * All badge conditions.
 */
export const badgeConditions: BadgeCondition[] = [
  // Click badges
  { badge: 'Amazon Patent', trigger: 'click', check: s => s.beachClicks >= 1 },
  { badge: 'Not So Redundant', trigger: 'click', check: s => s.beachClicks >= 2 },
  { badge: "Don't Litter!", trigger: 'click', check: s => s.beachClicks >= 14 },
  { badge: 'Y U NO BELIEVE ME?', trigger: 'click', check: s => s.beachClicks >= 128 },

  // Tool count badges
  { badge: 'Beachscaper', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 200 },
  { badge: 'Beachmover', trigger: 'tool-purchase', check: s => s.castleToolsOwned >= 100 },
  { badge: 'Beachomancer', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 1000 },
  { badge: 'Beachineer', trigger: 'tool-purchase', check: s => s.castleToolsOwned >= 500 },
  { badge: 'All Your Base', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 2101 },
  { badge: 'Look Before You Leap', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 3000 },
  { badge: 'Fully Armed and Operational Battlestation', trigger: 'tool-purchase',
    check: s => s.castleToolsOwned >= 4000 },
  { badge: 'WHAT', trigger: 'tool-purchase', check: s => s.sandToolsOwned > 9000 },

  // Resource badges
  { badge: 'Pyramid of Giza', trigger: 'resource-change', check: s => s.glassBlocks >= 7016280 },
  { badge: 'Personal Computer', trigger: 'resource-change', check: s => s.glassChips >= 640000 },

  // Spending badges
  { badge: 'Big Spender', trigger: 'tool-purchase', check: s => s.castlesSpent > 2e8 },
  { badge: 'Valued Customer', trigger: 'tool-purchase', check: s => s.castlesSpent > 8e12 },

  // Ninja badges
  { badge: 'Ninja Stealth', trigger: 'stealth-click', check: s => s.ninjaStealth >= 6 },
  { badge: 'Ninja Dedication', trigger: 'stealth-click', check: s => s.ninjaStealth >= 16 },
  { badge: 'Ninja Madness', trigger: 'stealth-click', check: s => s.ninjaStealth >= 26 },
  { badge: 'Ninja Omnipresence', trigger: 'stealth-click', check: s => s.ninjaStealth >= 36 },

  // Sand rate badges
  { badge: 'Plain Potato Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 5000 },
  { badge: 'Crinkle Cut Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 20000 },
  { badge: 'BBQ Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 800000 },

  // Boost count badges
  { badge: 'Better This Way', trigger: 'tool-purchase', check: s => s.boostsOwned >= 50 },
];

/**
 * Get conditions for a specific trigger.
 */
export function getConditionsForTrigger(trigger: BadgeTrigger): BadgeCondition[] {
  return badgeConditions.filter(c => c.trigger === trigger);
}
```

#### Step 2: Create Badge Checker

**File:** `src/engine/badge-checker.ts` (new file)

```typescript
/**
 * Badge Checker
 *
 * Checks badge conditions and triggers earning.
 */

import {
  BadgeTrigger,
  BadgeCheckState,
  getConditionsForTrigger
} from './badge-conditions.js';

export class BadgeChecker {
  private earnedBadges: Set<string>;
  private onBadgeEarned: (badge: string) => void;

  constructor(onBadgeEarned: (badge: string) => void) {
    this.earnedBadges = new Set();
    this.onBadgeEarned = onBadgeEarned;
  }

  /**
   * Mark badges as already earned (e.g., when loading state).
   */
  setEarnedBadges(badges: string[]): void {
    this.earnedBadges = new Set(badges);
  }

  /**
   * Check conditions for a trigger and earn new badges.
   */
  check(trigger: BadgeTrigger, state: BadgeCheckState): string[] {
    const conditions = getConditionsForTrigger(trigger);
    const newBadges: string[] = [];

    for (const condition of conditions) {
      // Skip if already earned
      if (this.earnedBadges.has(condition.badge)) continue;

      // Check condition
      if (condition.check(state)) {
        this.earnedBadges.add(condition.badge);
        this.onBadgeEarned(condition.badge);
        newBadges.push(condition.badge);
      }
    }

    return newBadges;
  }

  /**
   * Check if a badge is earned.
   */
  isEarned(badge: string): boolean {
    return this.earnedBadges.has(badge);
  }
}
```

#### Step 3: Integrate into ModernEngine

```typescript
import { BadgeChecker } from './badge-checker.js';
import type { BadgeCheckState } from './badge-conditions.js';

// In constructor:
this.badgeChecker = new BadgeChecker((badge) => this.earnBadge(badge));

// Add method to build badge check state:
private buildBadgeCheckState(): BadgeCheckState {
  return {
    sand: this.resources.sand,
    castles: this.resources.castles,
    glassChips: this.resources.glassChips,
    glassBlocks: this.resources.glassBlocks,
    sandToolsOwned: this.countSandToolsOwned(),
    castleToolsOwned: this.countCastleToolsOwned(),
    totalToolsOwned: this.countSandToolsOwned() + this.countCastleToolsOwned(),
    toolAmounts: this.getToolAmounts(),
    beachClicks: this.core.beachClicks,
    castlesSpent: this.getCastlesSpent(),
    ninjaStealth: this.core.ninjaStealth,
    ninjaFreeCount: this.core.ninjaFreeCount,
    sandPermNP: this.cachedTotalSandRate,
    badgesOwned: this.countBadgesOwned(),
    boostsOwned: this.countBoostsOwned(),
    discoveryCount: this.badgeGroupCounts['discov'] ?? 0,
    monumentCount: (this.badgeGroupCounts['monums'] ?? 0) + (this.badgeGroupCounts['monumg'] ?? 0),
  };
}

// Call in appropriate places:
private processBeachClick(): void {
  // ... existing code ...
  this.badgeChecker.check('click', this.buildBadgeCheckState());
}

private buySandTool(name: string): void {
  // ... existing code ...
  this.badgeChecker.check('tool-purchase', this.buildBadgeCheckState());
}

private stealthClick(): void {
  // ... existing code ...
  this.badgeChecker.check('stealth-click', this.buildBadgeCheckState());
}

private recalculateSandRates(): void {
  // ... existing code ...
  this.badgeChecker.check('rate-update', this.buildBadgeCheckState());
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/badge-conditions.ts` | New file with all badge conditions |
| `src/engine/badge-checker.ts` | New file with checker class |
| `src/engine/modern-engine.ts` | Integrate badge checker calls |
| `src/engine/badge-conditions.test.ts` | New test file |
| `src/engine/badge-checker.test.ts` | New test file |

---

## Plan 7: Discovery/Monument System

### Current State
- Badge groups include `discov`, `monums`, `monumg`, `diamm` in game-data.json
- No discovery earning logic implemented
- No monument creation system

### Discovery System Architecture

```
Discovery (discov) → Sand Monument (monums) → Glass Monument (monumg) → Masterpiece (diamm)
     ↓                      ↓                        ↓                       ↓
  Earned at NP         100 runs SMM+SMF          400 runs GMM+GMF        Diamond cost
```

### Discovery Badge Aliases

Pattern: `'discov' + newpixNumber` (e.g., `'discov1'`, `'discov2440'`, `'discov-42'`)

Each NP with a discovery creates 8 badges:
- `discov{np}`, `monums{np}`, `monumg{np}`, `diamm{np}`
- `discov-{np}`, `monums-{np}`, `monumg-{np}`, `diamm-{np}`

### Implementation Steps

#### Step 1: Add Discovery Data

**File:** `src/data/discoveries.ts` (new file)

```typescript
/**
 * Discovery definitions for each NewPix.
 * Only NPs with discoveries are listed.
 */

export interface DiscoveryDef {
  np: number;
  name: string;
  desc: string;
}

export const discoveries: DiscoveryDef[] = [
  { np: 1, name: 'In the Beginning', desc: 'the first time we saw Megan and Cueball sitting by the sea' },
  { np: 2, name: 'The Second Frame', desc: 'Megan and Cueball still sitting' },
  // ... hundreds more from badges.js:1288+
];

/**
 * Get discovery for a newpix number.
 */
export function getDiscovery(np: number): DiscoveryDef | undefined {
  return discoveries.find(d => d.np === Math.abs(np));
}
```

#### Step 2: Add Discovery Earning Logic

```typescript
/**
 * Earn discovery badge for current NP.
 * Reference: castle.js:3218-3235
 */
private earnDiscovery(): boolean {
  const np = this.core.newpixNumber;
  const alias = `discov${np}`;

  // Check if discovery exists for this NP
  const discovery = getDiscovery(np);
  if (!discovery) {
    return false;
  }

  // Check if already earned
  if (this.badges.get(alias)) {
    return false;
  }

  // Special case: NP 2440 requires specific timing
  if (Math.abs(np) === 2440) {
    // Would need sub-frame timing check
  }

  // Earn the discovery badge
  this.earnBadge(alias);
  return true;
}
```

#### Step 3: Add Monument Creation System

```typescript
interface MouldState {
  making: string | null;  // Alias of badge being made
  progress: number;       // 0-100 (Sand) or 0-400 (Glass)
}

private sandMould: MouldState = { making: null, progress: 0 };
private glassMould: MouldState = { making: null, progress: 0 };

/**
 * Start making a sand monument.
 * Reference: boosts.js:4343-4380
 */
startSandMonument(discoveryNP: number): boolean {
  const discovAlias = `discov${discoveryNP}`;
  const monumsAlias = `monums${discoveryNP}`;

  // Must have earned discovery first
  if (!this.badges.get(discovAlias)) return false;

  // Must not already have monument
  if (this.badges.get(monumsAlias)) return false;

  this.sandMould.making = monumsAlias;
  this.sandMould.progress = 0;
  return true;
}

/**
 * Process mould work (called from tick/ONG).
 * Reference: castle.js:3166-3185
 */
private processMouldWork(): void {
  // Sand Mould Maker phase (0-100)
  if (this.sandMould.making && this.sandMould.progress < 100) {
    const np = parseInt(this.sandMould.making.replace('monums', ''));
    const cost = Math.abs(np) * 100;  // Glass chips per run

    if (this.resources.glassChips >= cost) {
      this.resources.glassChips -= cost;
      this.sandMould.progress++;
    }
  }

  // Sand Mould Filler phase (100-300, additional 200 runs)
  if (this.sandMould.making && this.sandMould.progress >= 100 && this.sandMould.progress < 300) {
    const np = parseInt(this.sandMould.making.replace('monums', ''));
    const baseCost = 100;  // Sand per run
    const scaledCost = Math.pow(1.2, Math.abs(np)) * 100 * (this.sandMould.progress - 100);

    if (this.resources.sand >= baseCost + scaledCost) {
      this.resources.sand -= baseCost + scaledCost;
      this.sandMould.progress++;

      if (this.sandMould.progress >= 300) {
        // Monument complete!
        this.earnBadge(this.sandMould.making);
        this.sandMould.making = null;
        this.sandMould.progress = 0;
      }
    }
  }

  // Glass monument logic similar but with different costs
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/data/discoveries.ts` | New file with discovery definitions |
| `src/engine/modern-engine.ts` | Add mould state, `earnDiscovery()`, `processMouldWork()` |
| `src/engine/discovery-system.ts` | New file with monument creation logic |
| `src/engine/discovery-system.test.ts` | New test file |

---

## Plan 8: Coma/Reset System

### Current State
- No reset functionality implemented
- State management doesn't support selective preservation

### Reset Scopes

| Mechanic | Scope | Badges | Tools | Boosts |
|----------|-------|--------|-------|--------|
| ONG | Resources only | Preserved | Preserved | Preserved |
| Down | Game state | Preserved | Reset | Reset |
| Coma | Everything | **Wiped** | Reset | Reset |

### Implementation Steps

#### Step 1: Add Reset Methods

```typescript
/**
 * ONG Reset - Soft reset at end of NewPix.
 * Resets: Fractal Sandcastles, some boost powers
 * Preserves: Tools, boosts, badges
 */
private ongReset(): void {
  // Already implemented in ongBase()
}

/**
 * Down Reset - Medium reset.
 * Reference: persist.js:1320-1380
 */
async down(): Promise<void> {
  // Reset resources
  this.resources.sand = 0;
  this.resources.castles = 0;
  this.resources.glassChips = 0;
  this.resources.glassBlocks = 0;

  // Reset tools
  for (const [, state] of this.sandTools) {
    state.amount = 0;
    state.bought = 0;
    state.temp = 0;
  }
  for (const [, state] of this.castleTools) {
    state.amount = 0;
    state.bought = 0;
    state.temp = 0;
  }

  // Reset boosts (but keep unlocked/bought status for most)
  for (const [alias, state] of this.boosts) {
    const def = this.gameData.boosts[alias];
    state.power = def?.startPower ?? 0;
    state.countdown = def?.startCountdown ?? 0;
  }

  // Preserve badges
  // (no change to this.badges)

  // Reset core state
  this.core.beachClicks = 0;
  this.core.ninjaFreeCount = 0;
  this.core.ninjaStealth = 0;
  this.core.ninjad = false;

  this.syncResourceBoosts();
  this.recalculateSandRates();
  this.recalculateSandPerClick();
}

/**
 * Coma Reset - Hard reset (wipes everything).
 * Reference: persist.js:1382-1427
 */
async coma(): Promise<void> {
  // Wipe badges
  for (const [name] of this.badges) {
    this.badges.set(name, false);
  }
  this.badgeGroupCounts = {};

  // Reset boosts completely
  for (const [alias, state] of this.boosts) {
    state.unlocked = 0;
    state.bought = 0;
    state.power = 0;
    state.countdown = 0;
    state.isEnabled = undefined;
    state.permalock = undefined;
  }

  // Perform down reset for resources/tools
  await this.down();

  // Reset additional tracking
  this.core.newpixNumber = 1;
  this.core.highestNPvisited = 1;
  this.core.saveCount = 0;
  this.core.loadCount = 0;

  // Reset castle build state
  this.castleBuild.prevCastleSand = 0;
  this.castleBuild.nextCastleSand = 1;
  this.castleBuild.totalBuilt = 0;
}
```

#### Step 2: Add Preserved State for Special Cases

```typescript
/**
 * State that persists across coma (special exceptions).
 */
interface ComaPreservedState {
  npbTotalCastlesBuilt: number;  // NewPixBot's total is preserved
}

private getComaPreservedState(): ComaPreservedState {
  const npb = this.castleTools.get('NewPixBot');
  return {
    npbTotalCastlesBuilt: npb?.totalCastlesBuilt ?? 0,
  };
}

private applyComaPreservedState(preserved: ComaPreservedState): void {
  const npb = this.castleTools.get('NewPixBot');
  if (npb) {
    npb.totalCastlesBuilt = preserved.npbTotalCastlesBuilt;
  }
}

async coma(): Promise<void> {
  const preserved = this.getComaPreservedState();

  // ... existing coma logic ...

  this.applyComaPreservedState(preserved);
}
```

#### Step 3: Add Dragon Queen Reset Tracking

```typescript
interface DragonQueenState {
  level: number;
  finds: number;
  totalLoses: number;
  totalFights: number;
  totalStarves: number;
}

// Reset DQ state during coma
private resetDragonQueen(): void {
  const dq = this.boosts.get('DragonQueen');
  if (dq) {
    dq.power = 0;
    // Additional DQ-specific state would be tracked separately
  }
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add `down()`, `coma()`, preserved state handling |
| `src/engine/reset-system.ts` | New file with reset logic |
| `src/engine/reset-system.test.ts` | New test file |

---

## Implementation Order

### Recommended Sequence

```
Plan 4: Sand Tool Rates ─────┐
                              ├──→ Plan 5: More Boost Functions
Plan 6: Badge Auto-Earn ─────┤
                              ├──→ Plan 7: Discovery/Monument
                              │
                              └──→ Plan 8: Coma/Reset
```

**Rationale:**
1. **Plan 4 (Sand Rates)** is standalone and affects core gameplay accuracy
2. **Plan 5 (Boost Functions)** can proceed in parallel, builds on existing registry
3. **Plan 6 (Badges)** is needed before Plan 7 (discoveries are badges)
4. **Plan 7 (Discovery)** depends on badge system
5. **Plan 8 (Coma)** is last as it needs all other systems stable

### Success Criteria

Each plan is complete when:
- [ ] All unit tests pass
- [ ] Integration tests with ModernEngine pass
- [ ] Parity tests against legacy engine pass (where applicable)
- [ ] No TypeScript errors or warnings
- [ ] Code reviewed for security (no eval, proper input handling)

---

## References

- Legacy code: `castle.js`, `boosts.js`, `tools.js`, `badges.js`, `data.js`, `persist.js`
- Existing modern engine: [src/engine/modern-engine.ts](../src/engine/modern-engine.ts)
- Price calculator: [src/engine/price-calculator.ts](../src/engine/price-calculator.ts)
- Boost functions: [src/engine/boost-functions.ts](../src/engine/boost-functions.ts)
- Type definitions: [src/types/game-data.ts](../src/types/game-data.ts)
