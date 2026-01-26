# Next Implementation Plans (Priority 9-13)

This document contains detailed implementation plans for the next five priority features in the Sandcastle Builder modernization project. These build on the completed Plans 1-8.

## Completed Plans

| Priority | Feature | Status |
|----------|---------|--------|
| 1 | Click Multipliers | ✅ Complete |
| 2 | Dynamic Boost Functions | ✅ Complete |
| 3 | Glass Production | ✅ Complete |
| 4 | Sand Tool Production Rates | ✅ Complete |
| 5 | More Boost Functions | ✅ Complete |
| 6 | Badge Auto-Earn System | ✅ Complete |
| 7 | Discovery/Monument System | ✅ Complete |
| 8 | Coma/Reset System | ✅ Complete |

## Overview

| Priority | Feature | Complexity | Est. Files Changed | Dependencies |
|----------|---------|------------|-------------------|--------------|
| 9 | Parity Gap Reduction | High | 3-4 | None |
| 10 | Castle Tool Production Rates | Medium | 2-3 | None |
| 11 | Time Travel System | Medium-High | 3-4 | None |
| 12 | Factory Automation System | High | 4-5 | Plan 11 |
| 13 | Redundakitty System | High | 5-6 | Plan 12 |

---

## Plan 9: Parity Gap Reduction

### Current State
- Engine comparison tests show **6103 critical differences** between legacy and modern
- Key gaps:
  1. Auto-unlock logic on game initialization (legacy unlocks some boosts at start)
  2. Badge conditions incomplete (many badges not in condition registry)
  3. Down reset special cases (bonemeal bags, power preservation)

### Goal
Reduce critical parity differences to <1000 by addressing systematic gaps.

### Implementation Steps

#### Step 1: Expand CheckBuyUnlocks Logic

The legacy `CheckBuyUnlocks` function (data.js:649-826) auto-unlocks boosts based on tool amounts. This needs to be called appropriately.

**File:** `src/engine/unlock-conditions.ts` - Add tool-based unlock rules

```typescript
// Tool amount unlock rules (from data.js:649-730)
export const toolAmountUnlockRules: UnlockRule[] = [
  // Bucket unlocks
  { alias: 'Bigger Buckets', check: s => s.tools.Bucket >= 1 },
  { alias: 'Huge Buckets', check: s => s.tools.Bucket >= 4 },
  { alias: 'Carrybot', check: s => s.tools.Bucket >= 14 },  // npbDoubleThreshold
  { alias: 'Buccaneer', check: s => s.tools.Bucket >= 30 },
  { alias: 'Bucket Brigade', check: s => s.tools.Bucket >= 50 },
  { alias: 'Flying Buckets', check: s => s.tools.Bucket >= 100 && s.badges.Flung },

  // Cuegan unlocks
  { alias: 'Helping Hand', check: s => s.tools.Cuegan >= 1 },
  { alias: 'Cooperation', check: s => s.tools.Cuegan >= 4 },
  { alias: 'Megball', check: s => s.tools.Cuegan >= 8 },
  { alias: 'Stickbot', check: s => s.tools.Cuegan >= 14 },
  { alias: 'The Forty', check: s => s.tools.Cuegan >= 40 },
  { alias: 'Human Cannonball', check: s => s.tools.Cuegan >= 100 && s.badges.Flung },

  // Flag unlocks
  { alias: 'Flag Bearer', check: s => s.tools.Flag >= 1 },
  { alias: 'War Banner', check: s => s.tools.Flag >= 2 },
  { alias: 'Magic Mountain', check: s => s.tools.Flag >= 6 },
  { alias: 'Standardbot', check: s => s.tools.Flag >= 14 },
  { alias: 'Chequered Flag', check: s => s.tools.Flag >= 25 },
  { alias: 'Skull and Crossbones', check: s => s.tools.Flag >= 40 },
  { alias: 'Fly the Flag', check: s => s.tools.Flag >= 100 && s.badges.Flung },

  // NewPixBot unlocks
  { alias: 'Busy Bot', check: s => s.tools.NewPixBot >= 3 },
  { alias: 'Robot Efficiency', check: s => s.tools.NewPixBot >= 8 },
  { alias: 'Recursivebot', check: s => s.tools.NewPixBot >= 14 && s.boosts['Robot Efficiency'] },
  { alias: 'HAL-0-Kitty', check: s => s.tools.NewPixBot >= 17 },
  { alias: 'Factory Automation', check: s => s.tools.NewPixBot >= 22 && s.boosts.DoRD },

  // Trebuchet unlocks
  { alias: 'Spring Fling', check: s => s.tools.Trebuchet >= 1 },
  { alias: 'Trebuchet Pong', check: s => s.tools.Trebuchet >= 2 },
  { alias: 'Varied Ammo', check: s => s.tools.Trebuchet >= 5 },
  { alias: 'Flingbot', check: s => s.tools.Trebuchet >= 14 },
  { alias: 'Throw Your Toys', check: s => s.tools.Trebuchet >= 20 },

  // Ladder unlocks
  { alias: 'Extension Ladder', check: s => s.tools.Ladder >= 1 },
  { alias: 'Climbbot', check: s => s.tools.Ladder >= 14 },
  { alias: 'Broken Rung', check: s => s.tools.Ladder >= 25 },
  { alias: 'Up Up and Away', check: s => s.tools.Ladder >= 100 && s.badges.Flung },

  // Scaffold unlocks
  { alias: 'Precise Placement', check: s => s.tools.Scaffold >= 2 && s.tools.Ladder >= 1 },
  { alias: 'Level Up!', check: s => s.tools.Scaffold >= 4 && s.tools.Ladder >= 1 },
  { alias: 'Propbot', check: s => s.tools.Scaffold >= 14 },
  { alias: 'Balancing Act', check: s => s.tools.Scaffold >= 20 },

  // Wave unlocks
  { alias: 'Swell', check: s => s.tools.Wave >= 2 },
  { alias: 'Surfbot', check: s => s.tools.Wave >= 14 },
  { alias: 'SBTF', check: s => s.tools.Wave >= 30 },

  // Bag unlocks
  { alias: 'Embaggening', check: s => s.tools.Bag >= 2 },
  { alias: 'Luggagebot', check: s => s.tools.Bag >= 14 },
  { alias: 'Bag Puns', check: s => s.tools.Bag >= 30 },
  { alias: 'Air Drop', check: s => s.tools.Bag >= 100 && s.badges.Flung },

  // River unlocks
  { alias: 'Sandbag', check: s => s.tools.River >= 1 && s.tools.Bag >= 1 },
  { alias: 'Smallbot', check: s => s.tools.River >= 14 },

  // LaPetite unlocks
  { alias: 'Frenchbot', check: s => s.tools.LaPetite > 1000 },
];
```

#### Step 2: Add More Badge Conditions

**File:** `src/engine/badge-conditions.ts` - Expand badge registry

```typescript
// Add missing badge conditions (data.js:744-756, 802-813)
export const additionalBadgeConditions: BadgeCondition[] = [
  // Tool count badges (higher tiers)
  { badge: 'Warhammer', trigger: 'tool-purchase',
    check: s => s.sandToolsOwned + s.castleToolsOwned >= 40000 },

  // AC power badges
  { badge: 'Mains Power', trigger: 'boost-power-change',
    check: s => s.boostPowers.AC >= 230 },
  { badge: 'It Hertz', trigger: 'boost-power-change',
    check: s => s.boostPowers.AC >= 50 },

  // Trebuchet badge
  { badge: 'Flung', trigger: 'tool-purchase',
    check: s => s.toolAmounts.Trebuchet >= 50 },

  // Spending badges
  { badge: 'Big Spender', trigger: 'purchase',
    check: s => s.castlesSpent > 2e8 },
  { badge: 'Valued Customer', trigger: 'purchase',
    check: s => s.castlesSpent > 8e12 },

  // Neat! badge (all tools equal)
  { badge: 'Neat!', trigger: 'tool-purchase',
    check: s => checkNeatBadge(s) },
];

function checkNeatBadge(s: BadgeCheckState): boolean {
  if (s.toolAmounts.Bucket <= 1000000) return false;
  const formatted = formatMolpy(s.toolAmounts.Bucket, 3);
  for (const [name, amount] of Object.entries(s.toolAmounts)) {
    if (formatMolpy(amount, 3) !== formatted) return false;
  }
  return true;
}
```

#### Step 3: Implement Down Reset Special Cases

**File:** `src/engine/modern-engine.ts` - Enhance down() method

```typescript
// Bonemeal bag preservation (persist.js:1321-1329)
interface DownPreservation {
  kiteAndKeyPower: number;
  lightningInABottlePower: number;
  safetyNetPower: number;
  keepOneTool: string | null;  // "No Need to be Neat" boost
}

async down(): Promise<void> {
  // Check for bonemeal bag preservation
  const boh = this.hasBoost('BoH') && this.spendResource('Bonemeal', 10);
  const bom = this.hasBoost('BoM') && this.spendResource('Bonemeal', 100);
  const bof = this.hasBoost('BoF') && this.spendResource('Bonemeal', 1000);
  const boj = this.hasBoost('BoJ') && this.spendResource('Bonemeal', 10000);

  // Preserve Kite and Key, Lightning in a Bottle, Safety Net powers
  const kakPower = this.hasBoost('Kite and Key')
    ? this.getBoostPower('Kite and Key') : 0;
  const libPower = this.hasBoost('Lightning in a Bottle')
    ? this.getBoostPower('Lightning in a Bottle') : 0;
  const snPower = this.getBoostPower('Safety Net');

  // ... existing reset logic ...

  // Restore preserved powers
  this.setBoostPower('Kite and Key', kakPower);
  this.setBoostPower('Lightning in a Bottle', libPower);
  this.setBoostPower('Safety Net', snPower);
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/unlock-conditions.ts` | Add 50+ tool-amount unlock rules |
| `src/engine/badge-conditions.ts` | Add 15+ badge conditions |
| `src/engine/modern-engine.ts` | Enhance down() with preservation logic |
| `src/engine/unlock-conditions.test.ts` | Tests for new unlock rules |

### Success Criteria
- Critical parity differences reduced from 6103 to <1000
- All new unlock rules have unit tests
- All new badge conditions have unit tests

---

## Plan 10: Castle Tool Production Rates

### Current State
- Castle tools use placeholder rates
- Missing boost multipliers that affect castle production
- No integration with glass production bonuses

### Legacy Formulas (from tools.js)

#### NewPixBot (tools.js:260-290)
```
baseRate = 3.5
mult = 1
  × 2 [if Busy Bot]
  × Efficiency.power [if Robot Efficiency, capped at 1000]
  × 4 [if Recursivebot]
  × pow(1.1, min(HALBoost, 100)) [if HAL-0-Kitty]
return baseRate × mult
```

#### Trebuchet (tools.js:310-340)
```
baseRate = 6.25
mult = 1
  × 1.5 [if Spring Fling]
  × pow(1.2, Trebuchet Pong.power) [if Trebuchet Pong]
  × 4 [if Flingbot]
  × (1 + varied ammo bonus) [if Varied Ammo]
return baseRate × mult
```

#### Scaffold (tools.js:360-385)
```
baseRate = 15.63
mult = 1
  × 1.5 [if Precise Placement]
  × 2 [if Level Up!]
  × 4 [if Propbot]
return baseRate × mult
```

#### Wave (tools.js:405-430)
```
baseRate = 39.06
mult = 1
  × 2 [if Swell]
  × 4 [if Surfbot]
  × SBTF.power [if SBTF]
return baseRate × mult
```

#### River (tools.js:450-475)
```
baseRate = 97.66
mult = 1
  × 4 [if Smallbot]
return baseRate × mult
```

### Implementation Steps

#### Step 1: Create Castle Rate Calculator Module

**File:** `src/engine/castle-rate-calculator.ts` (new file)

```typescript
export interface CastleToolRateState {
  // Tool amounts
  newPixBots: number;
  trebuchets: number;
  scaffolds: number;
  waves: number;
  rivers: number;

  // Boost ownership
  busyBot: boolean;
  robotEfficiency: boolean;
  robotEfficiencyPower: number;
  recursivebot: boolean;
  halOKitty: boolean;
  halBoost: number;

  springFling: boolean;
  trebuchetPong: boolean;
  trebuchetPongPower: number;
  flingbot: boolean;
  variedAmmo: boolean;
  variedAmmoPower: number;

  precisePlacement: boolean;
  levelUp: boolean;
  propbot: boolean;

  swell: boolean;
  surfbot: boolean;
  sbtf: boolean;
  sbtfPower: number;

  smallbot: boolean;
}

export function calculateNewPixBotRate(state: CastleToolRateState): number {
  const baseRate = 3.5;
  let mult = 1;

  if (state.busyBot) mult *= 2;
  if (state.robotEfficiency) {
    mult *= Math.min(state.robotEfficiencyPower, 1000);
  }
  if (state.recursivebot) mult *= 4;
  if (state.halOKitty) {
    mult *= Math.pow(1.1, Math.min(state.halBoost, 100));
  }

  return baseRate * mult;
}

export function calculateTrebuchetRate(state: CastleToolRateState): number {
  const baseRate = 6.25;
  let mult = 1;

  if (state.springFling) mult *= 1.5;
  if (state.trebuchetPong) {
    mult *= Math.pow(1.2, state.trebuchetPongPower);
  }
  if (state.flingbot) mult *= 4;
  if (state.variedAmmo) {
    mult *= (1 + state.variedAmmoPower * 0.1);
  }

  return baseRate * mult;
}

// ... similar for Scaffold, Wave, River
```

#### Step 2: Integrate into ModernEngine

```typescript
private buildCastleRateState(): CastleToolRateState {
  // Similar pattern to buildSandRateState()
}

private recalculateCastleRates(): void {
  const state = this.buildCastleRateState();
  this.cachedCastleToolRates = calculateAllCastleToolRates(state);
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/castle-rate-calculator.ts` | New file with rate functions |
| `src/engine/modern-engine.ts` | Add buildCastleRateState(), recalculation |
| `src/engine/castle-rate-calculator.test.ts` | New test file |

---

## Plan 11: Time Travel System

### Current State
- `TimeTravel` boost exists but has no functional implementation
- No NP navigation beyond `setNewpix()` for testing
- Missing travel cost calculation and tracking

### Legacy Implementation (boosts.js:664-820)

Key functions:
- `TimeTravelPrice()` - Calculates cost based on travel count
- `TimeTravel(NP)` - Initiates time travel (calls TTT)
- `TTT(np, chips, silence)` - Core time travel logic

### Cost Formula
```
price = 0
if travelCount >= 1: price += 1
if travelCount >= 2: price += 2
if travelCount >= 3: price += 4
...
price += travelCount  // Additional linear term
```

### Implementation Steps

#### Step 1: Add Time Travel Methods

**File:** `src/engine/modern-engine.ts`

```typescript
/**
 * Calculate time travel cost.
 * Reference: boosts.js:692-704
 */
calculateTimeTravelPrice(): number {
  const boost = this.boosts.get('Time Travel');
  const travelCount = boost?.extra?.travelCount ?? 0;

  let price = 0;
  for (let i = 1; i <= travelCount; i++) {
    price += Math.pow(2, i - 1);
  }
  price += travelCount;

  return price;
}

/**
 * Time travel to a specific NewPix.
 * Reference: boosts.js:705-782
 */
async timeTravel(targetNP: number): Promise<boolean> {
  const boost = this.boosts.get('Time Travel');
  if (!boost || boost.bought === 0) {
    return false;
  }

  const price = this.calculateTimeTravelPrice();
  if (this.resources.castles < price) {
    return false;
  }

  // Spend castles
  this.resources.castles -= price;

  // Navigate to target NP
  await this.setNewpix(targetNP);

  // Increment travel count
  if (!boost.extra) boost.extra = {};
  boost.extra.travelCount = (boost.extra.travelCount ?? 0) + 1;

  // Check for invader handling at 10+ travels
  if (boost.extra.travelCount >= 10) {
    this.handleInvaders();
  }

  return true;
}

/**
 * Glass-chip based time travel (for jumps).
 * Reference: boosts.js:729-782
 */
async timeTravelWithChips(targetNP: number): Promise<boolean> {
  const jumpCost = this.calculateJumpCost(targetNP);

  if (this.resources.glassChips < jumpCost) {
    return false;
  }

  this.resources.glassChips -= jumpCost;
  await this.setNewpix(targetNP);

  return true;
}
```

#### Step 2: Add Temporal Anchor Integration

```typescript
/**
 * Check if temporal anchor prevents NP advancement.
 */
private isTemporallyAnchored(): boolean {
  const anchor = this.boosts.get('Temporal Anchor');
  return anchor?.bought > 0 && anchor?.isEnabled === true;
}

// In ongAdvanceNewpix():
private ongAdvanceNewpix(): void {
  if (this.isTemporallyAnchored()) {
    // Don't advance NP when anchored
    return;
  }
  // ... existing logic
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add timeTravel(), timeTravelWithChips(), price calculation |
| `src/engine/time-travel.test.ts` | New test file |

---

## Plan 12: Factory Automation System

### Current State
- Factory Automation boost exists but no processing logic
- DoRD (Department of Redundancy Department) not implemented
- Mould systems created but not automated

### Legacy Implementation

Factory Automation (FA) runs boost effects automatically:
- SMM/SMF/GMM/GMF mould work
- Blast Furnace glass conversion
- Various "department" boosts

### Key Concepts

1. **FA Level** - Determines which boosts can run
2. **FA Runs** - Counter for automation cycles
3. **Department Flag** - Boosts with `department: 1` can be automated

### Implementation Steps

#### Step 1: Add FA Processing

**File:** `src/engine/factory-automation.ts` (new file)

```typescript
export interface FAState {
  level: number;
  runsThisNP: number;
  automatedBoosts: string[];
}

export function getAutomatableBoosts(
  level: number,
  boostDefs: Record<string, BoostDefinition>
): string[] {
  return Object.entries(boostDefs)
    .filter(([, def]) => def.department === 1)
    .map(([alias]) => alias);
}

export function runFactoryAutomation(
  engine: ModernEngine,
  state: FAState
): void {
  // Run each automatable boost
  for (const alias of state.automatedBoosts) {
    runAutomatedBoost(engine, alias);
  }
  state.runsThisNP++;
}
```

#### Step 2: Integrate FA into Tick Loop

```typescript
private processTick(): void {
  // ... existing tick logic ...

  // Factory Automation processing
  if (this.hasBoost('Factory Automation')) {
    const fa = this.boosts.get('Factory Automation');
    if (fa && fa.bought > 0) {
      this.runFactoryAutomation();
    }
  }
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/factory-automation.ts` | New file with FA logic |
| `src/engine/modern-engine.ts` | Integrate FA into tick loop |
| `src/engine/factory-automation.test.ts` | New test file |

---

## Plan 13: Redundakitty System

### Current State
- No redundakitty spawn or click handling
- DoRD rewards not implemented
- Logicat puzzles not implemented

### Legacy Implementation

Redundakitties spawn periodically and provide rewards when clicked:
- Blitzing activation
- "Not Lucky" castle rewards
- DoRD boost unlocks
- Logicat puzzles

### Key Mechanics

1. **Spawn Timer** - 200-290 mNP by default (reducible by boosts)
2. **Timeout** - 24 mNP to click before despawn
3. **Chaining** - Clicking can spawn more kitties
4. **Rewards** - Various based on owned boosts

### Implementation Steps

#### Step 1: Add Redundakitty State

```typescript
interface RedundakittyState {
  totalClicks: number;
  chainCurrent: number;
  chainMax: number;
  spawnCountdown: number;
  despawnCountdown: number;
  isActive: boolean;
  buttonsVisible: number;
}
```

#### Step 2: Spawn Logic

```typescript
private calculateKittySpawnTime(): number {
  let min = 200, max = 290;

  if (this.hasBoost('Kitnip') || this.hasBoost('Kitties Galore')) {
    min = 120; max = 210;
  }
  if (this.hasBoost('Kitnip') && this.hasBoost('Kitties Galore')) {
    min = 40; max = 90;
  }
  if (this.hasBoost('RRSR')) {
    if (this.getBoostBought('RRSR') > 0) {
      min = 10; max = 40;
    } else {
      min = 480; max = 1080;
    }
  }

  return min + Math.random() * (max - min);
}
```

#### Step 3: Click Rewards

```typescript
private clickRedundakitty(): void {
  this.redundakitty.totalClicks++;
  this.redundakitty.chainCurrent++;

  // Check for DoRD activation (12.5% chance)
  if (this.hasBoost('DoRD') && Math.random() < 0.125) {
    this.activateDoRD();
    return;
  }

  // 50% chance for "Not Lucky" castles, 50% for Blitzing
  if (Math.random() < 0.5) {
    this.grantNotLuckyReward();
  } else if (!this.isResourceInfinite('sand')) {
    this.activateBlitzing();
  } else {
    this.activateBlastFurnace();
  }

  // Check for chaining
  this.checkKittyChain();
}
```

### Files Changed Summary

| File | Changes |
|------|---------|
| `src/engine/redundakitty.ts` | New file with spawn/click logic |
| `src/engine/modern-engine.ts` | Integrate redundakitty state and processing |
| `src/engine/redundakitty.test.ts` | New test file |

---

## Implementation Order

### Recommended Sequence

```
Plan 9: Parity Gaps ──────────┐
                               ├──→ Plan 10: Castle Tool Rates
Plan 11: Time Travel ─────────┤
                               ├──→ Plan 12: Factory Automation
                               │
                               └──→ Plan 13: Redundakitties
```

**Rationale:**
1. **Plan 9 (Parity)** reduces test noise and catches missing logic early
2. **Plan 10 (Castle Rates)** completes tool production system (pairs with Plan 4)
3. **Plan 11 (Time Travel)** is foundational for navigation
4. **Plan 12 (Factory Automation)** requires stable boost system
5. **Plan 13 (Redundakitties)** depends on DoRD and Blitzing from Plan 12

### Success Criteria

Each plan is complete when:
- [ ] All unit tests pass
- [ ] Integration tests with ModernEngine pass
- [ ] Parity tests show improvement (where applicable)
- [ ] No TypeScript errors or warnings
- [ ] Code reviewed for security (no eval, proper input handling)

---

## Future Priorities (Plans 14+)

After Plans 9-13, consider:

1. **Dragon System** - Complex endgame breeding/fighting (docs/wiki/systems/dragons.md)
2. **Logicat Puzzles** - Logic puzzle minigame within redundakitties
3. **Infinite Resources** - Special handling when sand/castles become infinite
4. **Glass Ceiling System** - Complex glass multiplier mechanics
5. **Save/Load Parity** - Full roundtrip save compatibility with legacy

---

## References

- Legacy code: `castle.js`, `boosts.js`, `tools.js`, `badges.js`, `data.js`, `persist.js`
- Existing modern engine: [src/engine/modern-engine.ts](../src/engine/modern-engine.ts)
- Price calculator: [src/engine/price-calculator.ts](../src/engine/price-calculator.ts)
- Boost functions: [src/engine/boost-functions.ts](../src/engine/boost-functions.ts)
- Sand rate calculator: [src/engine/sand-rate-calculator.ts](../src/engine/sand-rate-calculator.ts)
- Badge conditions: [src/engine/badge-conditions.ts](../src/engine/badge-conditions.ts)
- Type definitions: [src/types/game-data.ts](../src/types/game-data.ts)
- Wiki documentation: [docs/wiki/](../wiki/)
