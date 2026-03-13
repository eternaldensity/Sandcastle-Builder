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
| 18 | Infinite Resources | Medium | 3-4 | Complete |
| 19 | Glass Ceiling Enhancement | High | 4-5 | Complete (excl. Tool Factory) |
| 20 | Tool Factory Core Production | High | 3 | **NEXT** |
| 21 | Auto-Assembly & Blast Furnace | High | 3-4 | Blocked by 20 |
| 22 | TF Chip Generation & PC Control | Medium | 2-3 | **NEXT** (parallel w/ 20) |

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

### Status: ✅ COMPLETE (2026-03-13)

### Implemented
- TF (Tool Factory) unlock and Shop Failed badge on infinite tool price (castle.js:598-600, 910-912)
- Glass chip pricing fallback when TF is bought: sand tools 1000*(id*2+1), castle tools 1000*(id*2+2)
- Infinite resource spending guard (Infinity - Infinity = NaN prevention)
- Infinity save/load round-trip (parseFloat("Infinity") works correctly)
- TF added as virtual boost with full serialization support
- 21 tests in infinite-resources.test.ts

---

## Plan 19: Glass Ceiling Enhancement

### Status: ✅ COMPLETE (2026-03-13, excluding Tool Factory production)

### Implemented
- Glass Ceiling 0-11 as virtual boosts (initialization, loadState, exportState, serialization)
- Glass ceiling buy/lock functions with cascade unlock check (boosts.js:3391-3500)
- `isCeilingTogglable()` and `glassCeilingUnlockCheck()` exported from boost-functions.ts
- Dynamic pricing: `calculateGlassCeilingPrice(index, power)` with GLASS_CEILING_PRICE_INCS
- `isBadgeEarned()` and `isBoostBought()` added to BoostFunctionContext
- `lockBoost()` recursion guard for cascade systems
- 57 tests in glass-ceiling.test.ts (22 new)

### Not Implemented (separate plans below)
- Tool Factory production logic (RunToolFactory) - see Plans 20-22

---

## Plan 20: Tool Factory Core Production (RunToolFactory)

### Overview
Implement the core `RunToolFactory` algorithm that converts Glass Chips (stored in TF.Level) into Glass Tools each mNP. This is the heart of the endgame production system.

**Reference:** `boosts.js:5175-5313` (RunToolFactory), `boosts.js:5165-5173` (MakeTFOrder)

### Prerequisites
- ✅ Plan 18 (Infinite Resources) - TF boost, infinite pricing
- ✅ Plan 19 (Glass Ceiling) - Glass Ceiling 0-11 boosts, ceiling count

### Key Concepts

#### Tool Factory Order (MakeTFOrder)
The factory processes tools in a fixed interleaved order: Sand tool 0, Castle tool 0, Sand tool 1, Castle tool 1, ...
```
Index 0: Bucket       Index 1: NewPixBot
Index 2: Cuegan       Index 3: Trebuchet
Index 4: Flag         Index 5: Scaffold
Index 6: Ladder       Index 7: Wave
Index 8: Bag          Index 9: River
Index 10: LaPetite    Index 11: Beanie Builder
```

#### Production Algorithm (two paths)

**Inputs:**
- `tfChipBuffer` = TF.Level (chips available)
- `toolBuildNum` = PC.power (copies per tool type per mNP, default 1)
- `acPower` = AA enabled ? (AC bought ? AC.power : 1) : 0
- `fVal` = Flipside.power (0 = build infinite-price tools, 1 = build finite-price tools)
- `gcCount` = number of Glass Ceilings owned (0-12)

**Fast Path** (all 12 ceilings, Flipside off, enough chips, toolBuildNum > acPower):
```
if gcCount == 12 && fVal == 0 && tfChipBuffer >= 78000 * toolBuildNum && toolBuildNum > acPower:
  for each tool in tfOrder:
    tool.create(toolBuildNum - acPower)
  tfChipBuffer -= ceil(Papal('ToolF') * 78000 * toolBuildNum)
  built = toolBuildNum * 12
```

**Regular Path:**
```
toolBuildNum = floor(toolBuildNum / gcCount * 12)  // redistribute budget
setPrice = 0
for each tool in tfOrder (reverse):
  if tool matches fVal filter AND Glass Ceiling owned:
    setPrice += 1000 * (toolIndex + 1)
setPrice = ceil(setPrice * Papal('ToolF'))
iAfford = min(toolBuildNum, floor(tfChipBuffer / setPrice))

// Build full sets
for each matching tool (reverse):
  tool.create(iAfford)
  built += iAfford
tfChipBuffer -= setPrice * iAfford

// Build singles with remaining chips
if iAfford < toolBuildNum:
  for each matching tool (reverse):
    cost = ceil(1000 * (toolIndex + 1) * Papal('ToolF'))
    if tfChipBuffer >= cost:
      tfChipBuffer -= cost; built++; tool.create(1)
```

**Post-production (if built > 0):**
```
Refresh all tools with finite prices
built = floor(built * TDFactor())
toolsBuilt += built; toolsBuiltTotal += built
RatesRecalculate(); CheckBuyUnlocks()
TF.Level = tfChipBuffer
Check badge thresholds (KiloTool through WololoWololoTool)
```

#### Helper Functions

**Papal('ToolF')** (`boosts.js:10006-10008`):
- Returns 1 if current Decree target != 'ToolF'
- Returns multiplied/divided Decree value otherwise
- Part of the Papal decree system (cost modifier)

**TDFactor()** (`boosts.js:6639-6647`):
- Returns 1 normally
- Returns 2 if TDE (Tool Duplication Engine) bought AND Crystal Dragon bought
- Returns 2 + GL.power/10000 if also Dragon Foundry + GL bought

#### Badge Thresholds (tools built per mNP)
| Badge | Threshold |
|-------|-----------|
| KiloTool | ≥ 1,000 |
| MegaTool | ≥ 1,000,000 |
| GigaTool | ≥ 1,000,000,000 |
| TeraTool | ≥ 1e12 |
| PetaTool | ≥ 1e15 |
| YottaTool | ≥ 1e24 |
| WololoTool | ≥ 1e42 |
| WololoWololoTool | ≥ 1e84 |

### Implementation Steps

#### Step 1: Create Tool Factory Calculator Module

**File:** `src/engine/tool-factory.ts` (new file)

```typescript
/**
 * Tool Factory production system.
 * Converts Glass Chips (TF.Level) into Glass Tools each mNP.
 * Reference: boosts.js:5175-5313
 */

/** Tool ordering: interleaved sand/castle tools */
export const TF_ORDER: readonly { toolType: 'sand' | 'castle'; toolIndex: number; name: string }[] = [
  { toolType: 'sand', toolIndex: 0, name: 'Bucket' },
  { toolType: 'castle', toolIndex: 0, name: 'NewPixBot' },
  { toolType: 'sand', toolIndex: 1, name: 'Cuegan' },
  { toolType: 'castle', toolIndex: 1, name: 'Trebuchet' },
  { toolType: 'sand', toolIndex: 2, name: 'Flag' },
  { toolType: 'castle', toolIndex: 2, name: 'Scaffold' },
  { toolType: 'sand', toolIndex: 3, name: 'Ladder' },
  { toolType: 'castle', toolIndex: 3, name: 'Wave' },
  { toolType: 'sand', toolIndex: 4, name: 'Bag' },
  { toolType: 'castle', toolIndex: 4, name: 'River' },
  { toolType: 'sand', toolIndex: 5, name: 'LaPetite' },
  { toolType: 'castle', toolIndex: 5, name: 'Beanie Builder' },
];

export interface ToolFactoryState {
  tfBought: boolean;
  tfChipBuffer: number;         // TF.Level - chips available
  pcPower: number;              // PC.power (toolBuildNum), default 1
  aaEnabled: boolean;           // Automata Assemble toggle
  acBought: boolean;            // Automata Control purchased
  acPower: number;              // AC.power
  flipsidePower: number;        // 0 = build infinite-price tools, 1 = finite
  glassCeilingCount: number;    // 0-12
  glassCeilings: boolean[];     // length 12, true if Glass Ceiling i is owned
  toolPrices: number[];         // length 12, tool prices in tfOrder
  priceFactor: number;          // Molpy.priceFactor
  papalToolF: number;           // Papal('ToolF') multiplier
  tdFactor: number;             // TDFactor() multiplier
}

export interface ToolFactoryResult {
  toolsCreated: Map<string, number>;  // toolName -> amount created
  chipsSpent: number;
  totalBuilt: number;                 // after TDFactor
  remainingChips: number;
  acPower: number;                    // for post-production AA processing
  usedFastPath: boolean;
  badges: string[];                   // badges earned
}

/**
 * Check if a tool should be produced based on Flipside filter and ceiling ownership.
 */
function shouldProduceTool(
  toolOrderIndex: number,
  toolPrice: number,
  priceFactor: number,
  flipsidePower: number,
  glassCeilings: boolean[]
): boolean {
  const hasInfinitePrice = !isFinite(priceFactor * toolPrice);
  // fVal == 0 means "build infinite-price tools" (Flipside disabled)
  // isFinite(price) == fVal: when fVal=0, we want !isFinite (infinite price)
  // when fVal=1, we want isFinite (finite price)
  const matchesFilter = isFinite(priceFactor * toolPrice) === (flipsidePower === 1);
  return matchesFilter && glassCeilings[toolOrderIndex];
}

export function runToolFactory(state: ToolFactoryState): ToolFactoryResult {
  const result: ToolFactoryResult = {
    toolsCreated: new Map(),
    chipsSpent: 0,
    totalBuilt: 0,
    remainingChips: state.tfChipBuffer,
    acPower: 0,
    usedFastPath: false,
    badges: [],
  };

  if (!state.tfBought) return result;

  let toolBuildNum = state.pcPower > 0 ? state.pcPower : 1;
  let tfChipBuffer = state.tfChipBuffer;

  // Calculate acPower
  let acPower = 0;
  if (state.aaEnabled) {
    acPower = state.acBought ? state.acPower : 1;
  }
  result.acPower = acPower;

  let built = 0;
  const fVal = state.flipsidePower;
  const gcCount = state.glassCeilingCount;

  if (gcCount === 0) return result;

  // Fast path: all 12 ceilings, Flipside off, enough chips, toolBuildNum > acPower
  if (gcCount === 12 && fVal === 0
    && tfChipBuffer >= 78000 * toolBuildNum
    && toolBuildNum > acPower) {

    result.usedFastPath = true;
    for (let t = TF_ORDER.length - 1; t >= 0; t--) {
      const createAmount = toolBuildNum - acPower;
      result.toolsCreated.set(TF_ORDER[t].name,
        (result.toolsCreated.get(TF_ORDER[t].name) || 0) + createAmount);
    }
    tfChipBuffer -= Math.ceil(state.papalToolF * 78000 * toolBuildNum);
    built = toolBuildNum * 12;

  } else {
    // Regular path
    toolBuildNum = Math.floor(toolBuildNum / gcCount * 12);

    // Calculate set price (cost for one of each selected tool)
    let setPrice = 0;
    for (let t = TF_ORDER.length - 1; t >= 0; t--) {
      if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
        setPrice += 1000 * (t + 1);
      }
    }
    setPrice = Math.ceil(setPrice * state.papalToolF);

    if (setPrice > 0) {
      // Build full sets
      const iAfford = Math.min(toolBuildNum, Math.floor(tfChipBuffer / setPrice));

      if (iAfford > 0) {
        for (let t = TF_ORDER.length - 1; t >= 0; t--) {
          if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
            result.toolsCreated.set(TF_ORDER[t].name,
              (result.toolsCreated.get(TF_ORDER[t].name) || 0) + iAfford);
            built += iAfford;
          }
        }
        tfChipBuffer -= setPrice * iAfford;
      }

      // Build singles with remaining chips
      if (iAfford < toolBuildNum) {
        for (let t = TF_ORDER.length - 1; t >= 0; t--) {
          if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
            const cost = Math.ceil(1000 * (t + 1) * state.papalToolF);
            if (tfChipBuffer >= cost) {
              tfChipBuffer -= cost;
              built++;
              result.toolsCreated.set(TF_ORDER[t].name,
                (result.toolsCreated.get(TF_ORDER[t].name) || 0) + 1);
            }
          }
        }
      }
    }
  }

  if (built > 0) {
    // Apply TDFactor
    built = Math.floor(built * state.tdFactor);
    result.totalBuilt = built;
    result.chipsSpent = state.tfChipBuffer - tfChipBuffer;
    result.remainingChips = tfChipBuffer;

    // Check badge thresholds
    if (built >= 1000) result.badges.push('KiloTool');
    if (built >= 1e6) result.badges.push('MegaTool');
    if (built >= 1e9) result.badges.push('GigaTool');
    if (built >= 1e12) result.badges.push('TeraTool');
    if (built >= 1e15) result.badges.push('PetaTool');
    if (built >= 1e24) result.badges.push('YottaTool');
    if (built >= 1e42) result.badges.push('WololoTool');
    if (built >= 1e84) result.badges.push('WololoWololoTool');
  }

  return result;
}
```

#### Step 2: Create Tool Factory Tests

**File:** `src/engine/tool-factory.test.ts`

Test cases:
1. **No production when TF not bought**
2. **No production when gcCount = 0** (no ceilings owned)
3. **Fast path activation** - all 12 ceilings, Flipside off, enough chips
4. **Regular path - full sets** - partial ceilings, enough chips for full sets
5. **Regular path - singles** - partial ceilings, chips only for partial production
6. **Flipside filter** - fVal=0 builds infinite-price tools, fVal=1 builds finite-price
7. **Glass Ceiling selection** - only produces tools with owned ceilings
8. **Papal modifier** - production cost scaled by Papal('ToolF')
9. **TDFactor multiplier** - built count multiplied by TDFactor
10. **Badge thresholds** - correct badges earned at each level
11. **Budget redistribution** - toolBuildNum redistributed when fewer ceilings selected
12. **acPower subtraction** - fast path subtracts acPower from each tool's create amount
13. **Edge cases** - zero chips, one ceiling, all expensive tools, chip buffer exactly matches cost

#### Step 3: Integrate into ModernEngine

**File:** `src/engine/modern-engine.ts`

```typescript
// In tick processing:
private processToolFactory(): void {
  const tfBoost = this.boosts.get('TF');
  if (!tfBoost || tfBoost.bought === 0) return;

  const state = this.buildToolFactoryState();
  const result = runToolFactory(state);

  if (result.totalBuilt > 0) {
    // Apply tool creation
    for (const [toolName, amount] of result.toolsCreated) {
      this.createTool(toolName, amount);
    }

    // Update TF chip buffer
    tfBoost.level = result.remainingChips;

    // Update tracking
    this.toolsBuilt += result.totalBuilt;
    this.toolsBuiltTotal += result.totalBuilt;

    // Recalculate rates and check unlocks
    this.recalculateRates();
    this.checkAutoUnlocks();

    // Award badges
    for (const badge of result.badges) {
      this.earnBadge(badge);
    }
  }

  // Store acPower for post-production AA processing (Plan 21)
  this.lastACPower = result.acPower;
}

private buildToolFactoryState(): ToolFactoryState {
  return {
    tfBought: this.isBoostBought('TF'),
    tfChipBuffer: this.getBoostLevel('TF'),
    pcPower: this.isBoostBought('PC') ? this.getBoostPower('PC') : 1,
    aaEnabled: this.isBoostEnabled('AA'),
    acBought: this.isBoostBought('AC'),
    acPower: this.getBoostPower('AC'),
    flipsidePower: this.getBoostPower('Flipside'),
    glassCeilingCount: this.getGlassCeilingCount(),
    glassCeilings: Array.from({ length: 12 }, (_, i) =>
      this.isBoostBought('Glass Ceiling ' + i)),
    toolPrices: TF_ORDER.map(t => this.getToolPrice(t.name)),
    priceFactor: this.priceFactor,
    papalToolF: this.calculatePapal('ToolF'),
    tdFactor: this.calculateTDFactor(),
  };
}
```

#### Step 4: Add TF Chip Loading (LoadToolFactory, auto-loading)

**File:** `src/engine/tool-factory.ts` (additions)

```typescript
export interface ChipLoadingState {
  tfBought: boolean;
  sandToGlass: boolean;          // Sand to Glass boost owned
  castlesToGlass: boolean;       // Castles to Glass boost owned
  sandIsInfinite: boolean;       // Sand rate is infinite
  castlesAreInfinite: boolean;   // Castles power is infinite
  bgBought: boolean;             // Booster Glass owned
  gmBought: boolean;             // Glass Multiplier owned
  boneClickerBought: boolean;
  bonemealAmount: number;
  boostsOwned: number;
  glassChipsAvailable: number;
  loadedPermNP: number;          // cached chips/mNP from tools
  // Tool production rates for chip generation
  sandToolGpmNP: number[];       // glass chips per mNP per sand tool type
  castleToolGpmNP: number[];
}

/** Calculate glass chips loaded per beach click */
export function calculateChipsPerClick(state: ChipLoadingState): number {
  if (!state.sandIsInfinite || !state.bgBought) return 0;
  let perClick = state.boostsOwned * 4;
  if (state.gmBought) {
    perClick += state.loadedPermNP / 20;
  }
  if (state.boneClickerBought && state.bonemealAmount >= 1) {
    perClick *= state.bonemealAmount * 5;
  }
  return perClick;
}

/** Manual chip loading from Glass Chips resource */
export function calculateManualLoad(
  amount: number,
  glassChipsAvailable: number
): { chipsLoaded: number; chipsSpent: number } {
  const actual = Math.min(amount, glassChipsAvailable);
  return { chipsLoaded: actual, chipsSpent: actual };
}
```

### Files Changed Summary

| File | Changes | Tests |
|------|---------|-------|
| `src/engine/tool-factory.ts` | New: core production algorithm + chip loading | ~30 tests |
| `src/engine/tool-factory.test.ts` | New: comprehensive test suite | Unit + integration |
| `src/engine/modern-engine.ts` | Integration: processToolFactory(), buildToolFactoryState() | Engine integration tests |

### Success Criteria
- `runToolFactory()` produces correct tool quantities for all input combinations
- Fast path and regular path produce equivalent results when conditions match
- Badge thresholds fire at correct built counts
- Glass Ceiling filtering works correctly with Flipside
- Papal and TDFactor modifiers applied correctly
- Chip loading from beach clicks and manual loading work
- All tests pass, zero TypeScript errors

---

## Plan 21: Auto-Assembly & Blast Furnace (RunFastFactory)

### Overview
After Tool Factory runs, if Automata Assemble (AA) is enabled, the system consumes tools to perform Blast Furnace runs and secondary automation tasks. This is the post-production pipeline.

**Reference:** `boosts.js:5266-5313` (AA tool consumption), `boosts.js:5315-5397` (RunFastFactory)

### Prerequisites
- Plan 20 (Tool Factory Core) - provides acPower and built count
- ✅ Plan 12 (Factory Automation) - base FA infrastructure
- ✅ Plan 17 (Logicat Puzzles) - for Mario/caged logicat integration

### Key Concepts

#### Tool Consumption for AA (boosts.js:5266-5313)

After production, if `acPower > 0`:

**Mustard path** (if mustardTools active):
```
if Mustard Automation bought AND can spend 20 Mustard:
  RunFastFactory(acPower)
return
```

**Fast path** (if fast flag was set during production):
```
RunFastFactory(acPower)
return
```

**Regular AA path:**
1. Find minimum tool amount across all 12 tools
2. If minimum is finite:
   - Cap iterations at min(acPower, 1000)
   - Each iteration: check all tools have amounts > 0 AND infinite prices (when Flipside off)
   - If valid: subtract 1 from each tool's amount, increment times
   - If any tool runs out or has finite price: break
3. Call RunFastFactory(times)
4. If minimum is infinite: RunFastFactory(acPower) directly

#### RunFastFactory(times) (boosts.js:5315-5397)

Distributes `times` across multiple systems:

1. **Mario** (Logicat automation): If Mario enabled, spend QQ to reward Logicats
2. **AE (Automation Engine)**:
   - CfB (Construction from Blackprints): DoBlackprintConstruction(times)
   - DoMouldWork(times)
3. **Blast Furnace**: `furn = floor((times + random*3) / 2)`, reward glass
4. **Milo** (Blackprint generation): If left > 7, generate Blackprint pages
5. **Zoo Keep** (Panther Poke): If left > 10 and conditions met, poke panthers
6. **Shadow Feeder / Coda**: Advanced dragon-related automation

### Implementation Steps

#### Step 1: Implement AA Tool Consumption

**File:** `src/engine/tool-factory.ts` (additions)

```typescript
export interface AAConsumptionState {
  acPower: number;
  usedFastPath: boolean;
  mustardTools: number;           // count of mustard tools
  mustardAutomation: boolean;
  mustardAmount: number;
  toolAmounts: number[];          // 12 tools in tfOrder
  toolPrices: number[];
  priceFactor: number;
  flipsidePower: number;
}

export interface AAConsumptionResult {
  fastFactoryRuns: number;
  toolsConsumed: number;          // per tool type
  mustardSpent: number;
}

export function calculateAAConsumption(state: AAConsumptionState): AAConsumptionResult;
```

#### Step 2: Implement RunFastFactory Distribution

**File:** `src/engine/fast-factory.ts` (new file)

```typescript
export interface FastFactoryState {
  marioEnabled: boolean;
  marioBought: number;
  qqLevel: number;
  aeBought: boolean;
  cfbBought: boolean;
  miloBought: boolean;
  rushJobBought: boolean;
  zkBought: boolean;
  // ... other boost states
}

export interface FastFactoryResult {
  blastFurnaceRuns: number;
  blackprintPages: number;
  pantherPokes: number;
  logicatRewards: number;
  // ... other outputs
}

export function runFastFactory(times: number, state: FastFactoryState): FastFactoryResult;
```

#### Step 3: Integrate into Engine Tick

**File:** `src/engine/modern-engine.ts`

After `processToolFactory()`, if acPower > 0, run AA consumption and fast factory.

### Files Changed Summary

| File | Changes | Tests |
|------|---------|-------|
| `src/engine/tool-factory.ts` | AA consumption logic | ~15 tests |
| `src/engine/fast-factory.ts` | New: RunFastFactory distribution | ~20 tests |
| `src/engine/fast-factory.test.ts` | New: test suite | Unit tests |
| `src/engine/modern-engine.ts` | Integration: AA pipeline after TF | Integration tests |

### Success Criteria
- AA correctly consumes tools when all have infinite prices
- Tool consumption capped at min(acPower, 1000)
- RunFastFactory distributes runs across subsystems correctly
- Blast Furnace rewards calculated with correct randomization formula
- Milo/Zoo Keep/Mario automation triggered at correct thresholds
- Tests cover all branches (mustard, fast, regular, infinite minimum)

---

## Plan 22: TF Chip Generation & Production Control

### Overview
Implement the chip generation pipeline (how Glass Chips flow into TF.Level) and the Production Control (PC) upgrade system.

**Reference:** `boosts.js:5057-5131` (TF chip calculations), `boosts.js:5937-5949` (ControlToolFactory), `boosts.js:5153-5163` (LoadToolFactory)

### Prerequisites
- Plan 20 (Tool Factory Core) - uses chips that this plan generates
- ✅ Plan 18 (Infinite Resources) - infinite sand/castle detection
- ✅ Plan 3 (Glass Production) - glass chip/block infrastructure

### Key Concepts

#### Chip Generation Sources

1. **Sand Tools → Chips** (requires "Sand to Glass" boost + infinite Sand):
   - Each sand tool with infinite price produces `gpmNP` Glass Chips per mNP
   - Total = Σ(tool.amount × tool.storedGpmNP) × globalGpmNPMult
   - globalGpmNPMult = GL.power/100 (if GL bought) × Castles.globalMult (if CFT bought)

2. **Castle Tools → Chips** (requires "Castles to Glass" boost + infinite Castles):
   - Similar to sand tools but for castle tool types

3. **Beach Clicks → Chips** (requires "BG" boost + infinite Sand):
   - perClick = boostsOwned × 4
   - If GM: += loadedPermNP / 20
   - If Bone Clicker + Bonemeal: × bonemealAmount × 5

4. **Manual Loading** (LoadToolFactory):
   - Convert GlassChips resource → TF.Level
   - Triggers unlock checks (Sand to Glass at Bucket≥7470, Castles to Glass at NPB≥1515)

#### Production Control (PC) Upgrade

- Increase: costs `1e6 × n × PC.power` Glass Blocks, adds `n` to PC.power
- Decrease: costs `1e5 × n × PC.power` Glass Blocks, subtracts `n`
- Max: 6e51 (earns "Nope!" badge)
- Smart increment: UI offers power-of-10 increases based on affordability

#### Chip Rate Badges (on rate increase)
| Badge | Rate Threshold |
|-------|----------------|
| Plain Potato Chips | ≥ 5,000 |
| Crinkle Cut Chips | ≥ 20,000 |
| BBQ Chips | ≥ 800,000 |
| Corn Chips | ≥ 4,000,000 |
| Sour Cream and Onion Chips | ≥ 20,000,000 |
| Cinnamon Apple Chips | ≥ 100,000,000 |
| Sweet Chili Chips | ≥ 3,000,000,000 |
| Banana Chips | ≥ 100,000,000,000 |
| Nuclear Fission Chips | ≥ 5,000,000,000,000 |
| Silicon Chips | ≥ 600,000,000,000,000 |
| Blue Poker Chips | ≥ 1e19 |

### Implementation Steps

#### Step 1: Implement Chip Rate Calculator

**File:** `src/engine/tool-factory.ts` (additions)

```typescript
export interface ChipRateState {
  sandToGlass: boolean;
  castlesToGlass: boolean;
  sandIsInfinite: boolean;
  castlesAreInfinite: boolean;
  glBought: boolean;
  glPower: number;
  cftBought: boolean;
  castlesGlobalMult: number;
  sandToolRates: { amount: number; gpmNP: number; hasInfinitePrice: boolean }[];
  castleToolRates: { amount: number; gpmNP: number; hasInfinitePrice: boolean }[];
}

export function calculateChipLoadedPermNP(state: ChipRateState): number;
```

#### Step 2: Implement PC Control

**File:** `src/engine/tool-factory.ts` (additions)

```typescript
export function calculatePCUpgradeCost(
  currentPower: number,
  increment: number
): number {
  if (increment > 0) return 1e6 * increment * currentPower;
  return 1e5 * Math.abs(increment) * currentPower;
}

export function calculateMaxPCIncrement(
  currentPower: number,
  glassBlocksAvailable: number
): number;
```

#### Step 3: Add Chip Generation to Engine Tick

**File:** `src/engine/modern-engine.ts`

```typescript
// In tick processing, before processToolFactory():
private generateToolFactoryChips(): void {
  const tf = this.boosts.get('TF');
  if (!tf || tf.bought === 0) return;

  const rate = this.calculateChipLoadedPermNP();
  if (rate > 0) {
    tf.level = (tf.level || 0) + rate;
    // Check chip rate badges on increase
  }
}
```

### Files Changed Summary

| File | Changes | Tests |
|------|---------|-------|
| `src/engine/tool-factory.ts` | Chip rate calculation, PC control | ~20 tests |
| `src/engine/tool-factory.test.ts` | Chip rate + PC tests | Unit tests |
| `src/engine/modern-engine.ts` | generateToolFactoryChips(), controlToolFactory() | Integration tests |

### Success Criteria
- Chip generation rate matches legacy for all Sand to Glass / Castles to Glass configurations
- Beach click chip loading includes BG, GM, Bone Clicker multipliers
- Manual loading deducts GlassChips and adds to TF.Level
- PC upgrade/downgrade costs calculated correctly
- PC max (6e51) triggers "Nope!" badge
- Chip rate badges earned at correct thresholds
- All tests pass, zero TypeScript errors

---

## Implementation Order (Updated 2026-03-13)

### NEXT PRIORITIES (Tool Factory System)

```
Plan 20: TF Core Production ─┐
                              ├──→ Complete Tool Factory system
Plan 22: Chip Generation ─────┤    (can be done in parallel)
                              │
Plan 21: Auto-Assembly ───────┘    (depends on Plan 20)
```

**Recommended order:**
1. **Plan 20 + 22 in parallel** - Core production and chip generation are independent
2. **Plan 21 after Plan 20** - AA/Blast Furnace consumes what TF produces

**Rationale:**
- Plan 20 is the critical path - the core algorithm that everything else feeds into
- Plan 22 feeds chips into Plan 20 but can be developed independently
- Plan 21 is post-processing that requires Plan 20's output (acPower, built count)
- Together these three plans complete the Tool Factory system noted as "Not Implemented" in Plan 19

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
