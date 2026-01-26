# Next Implementation Plans (Priority 14+)

This document contains detailed implementation plans for future priority features in the Sandcastle Builder modernization project.

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
| 9 | Parity Gap Reduction | ✅ Complete |
| 10 | Castle Tool Production Rates | ✅ Complete |
| 11 | Time Travel System | ✅ Complete |
| 12 | Factory Automation System | ✅ Complete |
| 13 | Redundakitty System | ✅ Complete |

## Overview - Next Priorities

Based on comprehensive test sweep (2026-01-26):
- **841/841 tests passing** across 25 test files
- **49/49 parity tests passing** across 4 test suites
- **Save/load parity: COMPLETE** (17/17 tests passing)
- **Known parity gaps: 6,103 critical differences** (primarily boost auto-unlock and badge auto-earn)

| Priority | Feature | Complexity | Est. Files Changed | Status |
|----------|---------|------------|-------------------|--------|
| 14 | Boost Auto-Unlock System | High | 4-5 | **HIGH PRIORITY** |
| 15 | Badge Auto-Earn Enhancement | Medium | 3-4 | **HIGH PRIORITY** |
| 16 | Dragon System | Very High | 6-8 | Blocked by 14-15 |
| 17 | Logicat Puzzles | High | 4-5 | Complete (tests passing) |
| 18 | Infinite Resources | Medium | 3-4 | Partially Complete |
| 19 | Glass Ceiling Enhancement | High | 4-5 | Basic Complete |

---

## Plan 14: Boost Auto-Unlock System (NEW TOP PRIORITY)

### Current State (2026-01-26 Test Results)
- Engine comparison tests show **6,103 critical differences** between legacy and modern
- **Primary gap**: Legacy auto-unlocks boosts on game start and during gameplay
- **Impact**: Modern engine requires manual unlock checks, missing automatic progression
- Test evidence: Initial state shows legacy with unlocked boosts, modern with all locked

### Key Gaps Identified
1. **Game initialization unlocks**: Legacy runs CheckBuyUnlocks() at start (data.js:649-826)
2. **Continuous unlock checking**: Legacy checks after every tool purchase
3. **Tool-amount triggers**: 50+ unlock rules based on tool counts (e.g., "Bucket >= 1 unlocks Bigger Buckets")
4. **Badge-dependent unlocks**: Some unlocks require specific badges (e.g., "Flying Buckets requires Flung badge")

### Goal
Implement automatic boost unlocking system to reduce critical parity differences from 6,103 to <2,000.

### Parity Gap Evidence

From `engine-comparison.test.ts` output:
```
=== Legacy Initial State ===
Unlocked boosts: 1
Bought boosts: 0

=== Modern Initial State ===
Total boosts in state: 341
```

Legacy immediately processes unlock conditions, modern waits for explicit calls.

### Implementation Steps

#### Step 1: Add Auto-Unlock Trigger System

**File:** `src/engine/modern-engine.ts` - Add automatic unlock checking

```typescript
/**
 * Check and unlock boosts automatically based on game state.
 * Should be called after tool purchases, badge earnings, and initialization.
 * Reference: data.js:649-826 CheckBuyUnlocks()
 */
private checkAutoUnlocks(): void {
  for (const rule of toolAmountUnlockRules) {
    const boost = this.boosts.get(rule.alias);
    if (boost && boost.unlocked === 0 && rule.check(this.buildUnlockState())) {
      boost.unlocked = 1;
      this.markDirty('boosts');
    }
  }
}

// Call in appropriate places:
// - initialize() - check unlocks after game loads
// - buyTool() - check unlocks after tool purchase
// - checkBadges() - check unlocks after badge earned
```

#### Step 2: Expand Tool-Based Unlock Rules

**File:** `src/engine/unlock-conditions.ts` - Add complete tool unlock registry

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

#### Step 3: Initialize Unlocks on Game Start

**File:** `src/engine/modern-engine.ts` - Run unlock check at initialization

```typescript
async initialize(): Promise<void> {
  await this.loadGameData();
  this.initializeBoosts();
  this.initializeTools();
  this.initializeBadges();

  // NEW: Check initial unlocks (matches legacy behavior)
  this.checkAutoUnlocks();
}
```

### Files Changed Summary

| File | Changes | Tests |
|------|---------|-------|
| `src/engine/unlock-conditions.ts` | Add 50+ tool-amount unlock rules | Unit tests for each rule |
| `src/engine/modern-engine.ts` | Add checkAutoUnlocks() and call sites | Integration tests |
| `src/engine/unlock-checker.test.ts` | Expand test coverage | Add auto-unlock scenarios |

### Success Criteria
- Critical parity differences reduced from 6,103 to <2,000
- All tool-based unlocks have rules and tests
- Auto-unlock runs at initialization, after tool purchases, after badge earnings
- Parity tests show initial state unlock counts match legacy

---

## Plan 15: Badge Auto-Earn Enhancement (NEW HIGH PRIORITY)

### Current State (2026-01-26 Test Results)
- Badge system exists but has gaps in automatic earning
- **Primary gap**: Some badges earned by legacy but not modern in identical scenarios
- **Impact**: ~500-1,000 of the 6,103 critical differences are badge-related

### Key Gaps Identified
1. **AC power badges**: "Mains Power", "It Hertz" not auto-checking
2. **Tool count badges**: High-tier badges (40,000+ tools) not registered
3. **Spending badges**: "Big Spender", "Valued Customer" missing triggers
4. **Special badges**: "Neat!" (all tools equal) needs complex check

### Parity Gap Evidence

From test output: Legacy earns 4 badges at start, modern earns 4 badges but different set on progression.

### Implementation Steps

#### Step 1: Add Missing Badge Conditions

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

#### Step 2: Add More Badge Check Triggers

**File:** `src/engine/badge-checker.ts` - Add trigger points

```typescript
// Add boost-power-change trigger
export function checkBadgesOnBoostPowerChange(
  state: BadgeCheckState,
  earnedBadges: Set<string>
): string[] {
  return checkBadges(state, earnedBadges, 'boost-power-change');
}
```

#### Step 3: Integrate Badge Checks into Engine

**File:** `src/engine/modern-engine.ts` - Call badge checks at appropriate times

```typescript
// After boost power changes
private updateBoostPower(alias: string, power: number): void {
  const boost = this.boosts.get(alias);
  if (boost) {
    boost.power = power;
    this.markDirty('boosts');

    // NEW: Check AC power badges
    const newBadges = checkBadgesOnBoostPowerChange(
      this.buildBadgeCheckState(),
      this.earnedBadges
    );
    this.awardBadges(newBadges);
  }
}
```

### Files Changed Summary

| File | Changes | Tests |
|------|---------|-------|
| `src/engine/badge-conditions.ts` | Add 15+ missing badge conditions | Unit tests for each condition |
| `src/engine/badge-checker.ts` | Add new trigger functions | Integration tests |
| `src/engine/modern-engine.ts` | Add badge check call sites | Verify triggers fire |

### Success Criteria
- Badge-related parity differences reduced by 500-1,000
- All spending, power, and special badges have conditions
- Badge earning triggers at correct times (power changes, purchases)
- Tests verify badge earning matches legacy timing

---

## Plan 16: Dragon System

### Current State
- No dragon breeding, fighting, or dragon-related boosts implemented
- Dragon system is a complex endgame feature
- **Blocked by Plans 14-15** (needs stable boost unlock and badge systems)

### Status
**DEFER until boost auto-unlock and badge auto-earn are complete.**

---

## Plan 17: Logicat Puzzles

### Current State (2026-01-26)
- ✅ **COMPLETE** - Logicat tests passing (28 tests in logicat.test.ts)
- Puzzle generation, validation, and rewards implemented
- Integration with redundakitty system complete

### Files Implemented
- [src/engine/logicat.ts](../../src/engine/logicat.ts) - Puzzle logic
- [src/engine/logicat.test.ts](../../src/engine/logicat.test.ts) - 28 passing tests
- Integration with redundakitty system

No further work needed.

---

## Plan 18: Infinite Resources

### Current State (2026-01-26)
- ✅ **PARTIALLY COMPLETE** - Infinity handling in redundakitty system
- Number formatting supports infinity display
- Reward type determination handles infinite sand

### Remaining Work
- Price calculations with infinite resources
- Rate calculations for infinite edge cases
- State snapshot infinity handling

### Status
**LOW PRIORITY** - Core functionality works, edge cases can be addressed as encountered.

---

## Plan 19: Glass Ceiling Enhancement

### Current State (2026-01-26)
- ✅ **BASIC COMPLETE** - Glass chip/block production working (35 tests passing)
- Glass production at ONG implemented
- Basic glass mechanics functional

### Files Implemented
- [src/engine/glass-ceiling.test.ts](../../src/engine/glass-ceiling.test.ts) - 35 passing tests
- Glass production integrated into modern engine

### Remaining Work
- Glass ceiling multiplier system (complex endgame feature)
- Glass-based boost unlock conditions
- Glass ceiling badges

### Status
**DEFER** - Basic functionality complete, advanced features are low priority endgame content.

---

## LEGACY PLANS (Completed)

## Plan 10: Castle Tool Production Rates

### Status: ✅ COMPLETE

### Current State
- Castle tools fully implemented with correct rates
- All boost multipliers affecting castle production working
- Integration with glass production bonuses complete

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

## Implementation Order (Updated 2026-01-26)

### IMMEDIATE PRIORITIES (Address Parity Gaps)

```
Plan 14: Boost Auto-Unlock ──┐
                              ├──→ Reduce 6,103 critical differences
Plan 15: Badge Auto-Earn ────┘    to <2,000

Then:
Plan 16: Dragon System (deferred until above complete)
```

**Rationale:**
1. **Plan 14 (Auto-Unlock)** addresses ~5,000 of the critical parity differences
2. **Plan 15 (Badge Auto-Earn)** addresses ~500-1,000 critical differences
3. Both are foundational for accurate game progression matching legacy
4. Plans 17-19 are either complete or low priority

### Completed Plans (2026-01-26)

✅ Plans 1-13: All complete with passing tests
✅ Plan 17 (Logicat): 28 tests passing
✅ Plan 18 (Infinite): Core functionality working
✅ Plan 19 (Glass): Basic functionality complete (35 tests passing)
✅ Save/Load Parity: COMPLETE (17/17 tests passing)

### Success Criteria

Each plan is complete when:
- [x] All unit tests pass (841/841 currently passing)
- [x] Integration tests with ModernEngine pass
- [ ] Parity tests show improvement (target: <2,000 critical differences)
- [x] No TypeScript errors or warnings
- [x] Code reviewed for security (no eval, proper input handling)

---

---

## ARCHIVED DETAILED PLANS

<details>
<summary>Plan 10: Castle Tool Production Rates (COMPLETE)</summary>

### Status: ✅ COMPLETE

Castle tool production rates fully implemented with all boost multipliers.

</details>

<details>
<summary>Plan 11: Time Travel System (COMPLETE)</summary>

### Status: ✅ COMPLETE

Time travel system fully implemented with cost calculations and NP navigation.

</details>

<details>
<summary>Plan 12: Factory Automation System (COMPLETE)</summary>

### Status: ✅ COMPLETE

Factory automation system fully implemented with 30 passing tests.

</details>

<details>
<summary>Plan 13: Redundakitty System (COMPLETE)</summary>

### Status: ✅ COMPLETE

Redundakitty system fully implemented with 68 passing tests across 2 test files.

</details>

---

## Current Test Status (2026-01-26)

### Test Suite Health
- **TypeScript**: ✅ 0 errors
- **Full Test Suite**: ✅ 841/841 tests passing
- **Duration**: 11.24s
- **Test Files**: 25 files

### Parity Test Status
- **Parity Suite**: ✅ 49/49 tests passing
- **Duration**: 6.87s
- **Test Files**: 4 files
- **Save/Load Parity**: ✅ 17/17 tests passing (COMPLETE)

### Known Parity Gaps
- **Critical differences**: 6,103 (target: <2,000)
  - ~5,000 from boost auto-unlock gaps
  - ~500-1,000 from badge auto-earn gaps
  - ~600 from other sources
- **Important differences**: 3 (power values, countdowns, rates)
- **Cosmetic differences**: 156 (UI/display-related)

### Verified Working Systems
✅ Beach clicking with Fibonacci castle conversion
✅ ONG transitions with proper resets
✅ Ninja mechanics (stealth tracking, streak breaking)
✅ Tick processing with tool production
✅ Tool and boost purchases
✅ Badge state preservation
✅ Save/load round-trip compatibility
✅ Factory automation (30 tests)
✅ Redundakitty system (68 tests)
✅ Logicat puzzles (28 tests)
✅ Glass ceiling basics (35 tests)
✅ Time travel system (34 tests)

---

## References

### Legacy Code
- `castle.js` - Main game loop, ONG, beach clicks
- `boosts.js` - Boost definitions and functions
- `tools.js` - Tool definitions and rates
- `badges.js` - Badge definitions
- `data.js` - Unlock conditions, CheckBuyUnlocks
- `persist.js` - Save/load, reset functions

### Modern Engine Files
- [src/engine/modern-engine.ts](../../src/engine/modern-engine.ts) - Core engine
- [src/engine/price-calculator.ts](../../src/engine/price-calculator.ts) - Price formulas
- [src/engine/boost-functions.ts](../../src/engine/boost-functions.ts) - Boost buy/unlock/lock functions
- [src/engine/sand-rate-calculator.ts](../../src/engine/sand-rate-calculator.ts) - Sand tool rates
- [src/engine/castle-rate-calculator.ts](../../src/engine/castle-rate-calculator.ts) - Castle tool rates
- [src/engine/badge-conditions.ts](../../src/engine/badge-conditions.ts) - Badge trigger conditions
- [src/engine/badge-checker.ts](../../src/engine/badge-checker.ts) - Badge earning logic
- [src/engine/unlock-conditions.ts](../../src/engine/unlock-conditions.ts) - Boost unlock rules
- [src/engine/factory-automation.ts](../../src/engine/factory-automation.ts) - FA system
- [src/engine/redundakitty.ts](../../src/engine/redundakitty.ts) - Redundakitty system
- [src/engine/time-travel.ts](../../src/engine/time-travel.ts) - Time travel mechanics
- [src/types/game-data.ts](../../src/types/game-data.ts) - Type definitions

### Documentation
- [docs/wiki/](../wiki/) - Scraped game wiki
- [docs/wiki/systems/dragons.md](../wiki/systems/dragons.md) - Dragon system reference
