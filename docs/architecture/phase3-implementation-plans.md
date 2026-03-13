# Phase 3: Orchestration & Integration Plans (23-28)

This document contains implementation plans for connecting the modernized subsystems
into a working game engine. Phase 1 (Plans 1-3) and Phase 2 (Plans 4-22) built the
individual subsystems. Phase 3 wires them together.

## Status Summary

**Prior Work:** 1,117 tests passing across 32 test files. 19 engine modules implemented.

### Completed (Phase 1 & 2)
| # | Feature | Tests |
|---|---------|-------|
| 1 | Click Multipliers | in price-calculator |
| 2 | Dynamic Boost Functions | 76 buy, 11 countdown, 27 lock |
| 3 | Glass Production | chip/block production |
| 4 | Sand Tool Production Rates | per-tool rates |
| 5 | More Boost Functions | registry expanded |
| 6 | Badge Auto-Earn System | badge-checker |
| 7 | Discovery/Monument System | discovery-system |
| 8 | Coma/Reset System | reset-system |
| 9 | Parity Gap Reduction | cross-cutting |
| 10 | Castle Tool Production Rates | castle-rate-calculator |
| 11 | Time Travel System | time-travel |
| 12 | Factory Automation System | factory-automation |
| 13 | Redundakitty System | redundakitty |
| 14 | Boost Auto-Unlock | unlock-checker |
| 15 | Badge Auto-Earn Enhancement | badge-conditions |
| 16 | Dragon System | dragon |
| 17 | Logicat Puzzles | logicat |
| 18 | Infinite Resources | infinite-resources |
| 19 | Glass Ceiling Enhancement | glass-ceiling |
| 20 | Tool Factory Core | tool-factory |
| 21 | Auto-Assembly & Blast Furnace | auto-assembly |
| 22 | Chip Generation & PC Control | chip-generation |

### Phase 3 Overview
| # | Feature | Complexity | Dependencies |
|---|---------|------------|-------------|
| 23 | Game Tick Orchestration | High | All subsystems |
| 24 | Beach Click System | High | 23 |
| 25 | ONG Transition System | Very High | 23, 24 |
| 26 | Judgement Dip & Papal Decrees | Medium | 25 |
| 27 | Time Travel & Temporal Rift | High | 25, 26 |
| 28 | Shopping, Donkey & Remaining Boost Mechanics | Medium | 25, 26 |

---

## Plan 23: Game Tick Orchestration

### Goal
Implement `processTick()` to match legacy `Molpy.Think()` (castle.js:3338-3457).
The modern engine already has a `processTick()` skeleton. This plan fills in the
missing operations to achieve full tick parity.

### Current State (modern-engine.ts)
`processTick()` already handles:
- ONG elapsed time tracking
- npbONG window detection
- Sand tool production (sandPermNP accumulation)
- Redundakitty tick processing
- Boost countdown ticking
- Badge checking on tick

### Missing Operations (from Molpy.Think)

#### 1. Sand.toCastles() - Auto-castle building
```
Reference: castle.js:3340
Molpy.Boosts['Sand'].toCastles()
```
Every tick, excess sand is automatically converted to castles based on the
`nextCastleSand` cost. This is the auto-building mechanic.

**Legacy logic (boosts.js Sand.toCastles):**
- While sand >= nextCastleSand: spend sand, build castle, update nextCastleSand
- nextCastleSand grows: each castle costs more sand
- Influenced by: Fractal Sandcastles, Glass Jaw, castle price boosts

#### 2. Price Protection countdown
```
Reference: castle.js:3343-3344
if(pp.power > 1) pp.power--;
```
Simple per-tick power decrement for Price Protection boost.

#### 3. Boost classChange processing
```
Reference: castle.js:3367-3375
```
For each bought boost with a `classChange` function, evaluate it and update
the className if changed. This affects shop display categorization.

#### 4. Badge classChange processing
```
Reference: castle.js:3377-3391
```
Same as boost classChange but for earned badges. Only runs when not in Coma.

#### 5. Sand tool total tracking
```
Reference: castle.js:3395-3399
```
Each sand tool accumulates `totalSand` and `totalGlass` per tick from stored rates.

#### 6. Sand digging with Papal multiplier
```
Reference: castle.js:3401
Molpy.Boosts['Sand'].dig(sandPermNP * Papal('Sand'))
```
The main sand production per tick, multiplied by Papal decree if active.

#### 7. Vacuum Cleaner processing
```
Reference: castle.js:3403-3434
```
Complex endgame mechanic: if Vacuum Cleaner enabled and has infinite sand,
spends FluxCrystals/QQ to gain Vacuum resource. Affected by Black Hole,
Tractor Beam, Overtime. **Defer to Plan 28** (endgame mechanic).

#### 8. Glass block/chip rate calculation
```
Reference: castle.js:3436-3437
Molpy.Boosts['GlassBlocks'].calculateBlocksPermNP()
Molpy.Boosts['GlassChips'].calculateChipsPermNP()
```
Already partially covered by chip-generation.ts.

#### 9. Tool Factory glass digging
```
Reference: castle.js:3439
```
Already covered by tool-factory.ts `RunToolFactory`.

#### 10. RunToolFactory & RunPhoto
```
Reference: castle.js:3441-3442
```
RunToolFactory already implemented. RunPhoto is a minor display feature.

#### 11. Dragon digging (per mNP)
```
Reference: castle.js:3443
Molpy.DragonDigging(0)
```
Already implemented in dragon.ts.

#### 12. PerformJudgement
```
Reference: castle.js:3454
```
See Plan 26.

#### 13. Donkey (auto-buy)
```
Reference: castle.js:3455
```
See Plan 28.

### Implementation Steps

**File: `src/engine/modern-engine.ts`**

Update `processTick()` to add the missing operations in the correct order:

```typescript
private processTick(): void {
  // 1. Auto-castle building (Sand.toCastles)
  this.autoConvertSandToCastles();

  // 2. Price Protection countdown
  this.tickPriceProtection();

  // 3. Check ONG (unless ketchup or Coma)
  // Already handled: ONG elapsed tracking, npbONG detection

  // 4. Boost countdown ticking (existing)
  this.tickBoostCountdowns();

  // 5. Boost classChange processing
  this.tickBoostClassChanges();

  // 6. Badge classChange processing
  this.tickBadgeClassChanges();

  // 7. Recalculate rates if flagged
  if (this.needsRateRecalc) this.calculateRates();

  // 8. Sand tool total tracking
  this.accumulateSandToolTotals();

  // 9. Sand digging (main production)
  this.digSand();

  // 10. Glass block/chip rate calculation
  this.calculateGlassRates();

  // 11. Tool Factory operations
  this.runToolFactory();

  // 12. Dragon digging
  this.processDragonDigging('mnp');

  // 13. Rate recalc (second pass)
  if (this.needsRateRecalc) this.calculateRates();

  // 14. Redundakitty (existing)
  this.tickRedundakitty();

  // 15. Badge checking (existing)
  this.badgeChecker.check('tick', this.buildBadgeCheckState());

  // 16. Judgement (Plan 26)
  // this.performJudgement();

  // 17. Donkey auto-buy (Plan 28)
  // this.donkey();

  // 18. Life counter
  this.core.life++;
}
```

#### New methods needed:
1. `autoConvertSandToCastles()` - sand-to-castle conversion loop
2. `tickPriceProtection()` - simple power decrement
3. `tickBoostClassChanges()` - evaluate classChange for bought boosts
4. `tickBadgeClassChanges()` - evaluate classChange for earned badges
5. `accumulateSandToolTotals()` - per-tool total tracking
6. `digSand()` - main sand production with Papal multiplier
7. `calculateRates()` - aggregate rate recalculation (delegates to existing calculators)

### Tests
- Tick produces sand at correct rate
- Sand auto-converts to castles when threshold met
- Price Protection power decrements per tick
- Rate recalculation triggers correctly
- Sand tool totals accumulate
- Dragon digging fires per tick

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Expand `processTick()`, add 7 new methods |
| `src/engine/modern-engine.test.ts` | Tick orchestration tests |

---

## Plan 24: Beach Click System

### Goal
Implement complete beach click handling matching legacy `Molpy.ClickBeach()`
(castle.js:151-306), `StealthClick()` (309-371), and `NinjaUnstealth()` (419-461).

### Current State
`processBeachClick()` in modern-engine.ts already handles:
- Beach click counter increment
- Basic sand gain via click multipliers
- npbONG-based stealth/unstealth branching
- Basic stealth click (castle build, badges)
- Basic ninja unstealth (hope/penance/forgiveness)
- Ninja Ritual unlock checks

### Missing Operations

#### 1. Boost-specific click handlers
```
Reference: castle.js:161-165
Molpy.Boosts['Sand'].clickBeach()   -- sand per click calculation
Molpy.Boosts['TF'].clickBeach()     -- Tool Factory click chips
Molpy.Boosts['Mustard'].clickBeach() -- Mustard injection
Molpy.Boosts['DQ'].clickBeach()     -- Dragon Quest
Molpy.Boosts['Blueness'].clickBeach() -- Blueness mechanic
```

#### 2. Click achievement checking
```
Reference: castle.js:167
Molpy.CheckClickAchievements()
```

#### 3. Ninja Ritual with Ritual Sacrifice/Rift
```
Reference: castle.js:172-210
```
When clicking during npbONG window: Ritual Sacrifice (spend 5 goats) or
Ritual Rift (spend flux crystals) to preserve ninja ritual streak.

#### 4. VJ (Vaulting Jackhammer) system
```
Reference: castle.js:222-279
```
When no NPB: every Nth click triggers VJ reward including Glass Saw processing.
Complex glass block production via Glass Saw, Buzz Saw mechanics.

#### 5. Bag Puns progression
```
Reference: castle.js:280-286
```
Every 20 clicks, increment Bag Puns power, eventually unlock VJ.

#### 6. Spare Tools
```
Reference: castle.js:288-291
```
Creates a random tool from tfOrder on each click.

#### 7. Temporal Rift click interaction
```
Reference: castle.js:297-300
```
Random chance of slipping through temporal rift on click.

#### 8. Doubletap recursion
```
Reference: castle.js:303
```
If Doubletap boost owned, click fires twice.

#### 9. Post-click sand-to-castles & mustard cleanup
```
Reference: castle.js:304-305
```

#### 10. Enhanced StealthClick
Missing from current implementation:
- Active Ninja (3x in longpix)
- Ninja Lockdown toggle
- Ninja League/Legion/Ninja Ninja Duck multipliers
- Papal('Ninja') multiplier
- Ninja Builder (CalcStealthBuild with assistants, skull/crossbones, glass jaw, ninja climber)
- Factory Ninja (runs factory automation during stealth)
- Stealth Cam (Shutter mechanic)
- Higher stealth badges (Pact, Unity, Ventus Vehemens)

#### 11. Enhanced NinjaUnstealth
Missing:
- Impervious Ninja (spend glass chips to forgive)
- Ninja Shortcomings badge (stealth 30-35)

### Implementation Steps

**File: `src/engine/modern-engine.ts`**

Expand `processBeachClick()` with the full click pipeline:

```typescript
private processBeachClick(): void {
  this.core.beachClicks++;

  // Boost-specific click handlers
  this.clickSandGain();           // Sand.clickBeach
  this.clickToolFactoryChips();   // TF.clickBeach (already in chip-generation)
  this.clickMustard();            // Mustard.clickBeach
  this.clickDragonQuest();        // DQ.clickBeach

  // Click achievements
  this.checkClickAchievements();

  // Ninja mechanics (existing, enhanced)
  if (!this.core.ninjad && this.hasNewPixBots()) {
    if (this.ong.npbONG === 1) {
      this.stealthClick();        // Enhanced
      this.handleRitualPreservation();
    } else if (this.ong.npbONG === 0) {
      this.ninjaUnstealth();      // Enhanced
      this.handleNinjaRitualProgression();
    }
  } else if (this.hasBoost('VJ')) {
    this.processVJClick();        // New
  }

  // Bag Puns
  this.processBagPuns();

  // Spare Tools
  if (this.hasBoost('SpareTools')) this.createRandomTool();

  this.core.ninjad = true;

  // HandleClickNP badges
  this.handleClickNPBadges();

  // Temporal Rift random jump
  this.checkTemporalRiftClick();

  // Donkey
  // this.donkey(); // Plan 28

  // Doubletap recursion
  if (this.hasBoost('Doubletap') && !this._inDoubletap) {
    this._inDoubletap = true;
    this.processBeachClick();
    this._inDoubletap = false;
  }

  // Post-click
  this.autoConvertSandToCastles();
}
```

### Tests
- Click gives correct sand with multipliers
- Stealth click builds castles with ninja builder formula
- Ninja unstealth checks Impervious Ninja, Hope, Penance
- VJ fires every Nth click with correct glass saw logic
- Doubletap causes double click
- Bag Puns progression
- Ritual Sacrifice/Rift preserves streak

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Expand `processBeachClick()`, add ~15 new methods |
| `src/engine/modern-engine.test.ts` | Beach click tests |

---

## Plan 25: ONG Transition System

### Goal
Implement complete ONG (newpix transition) matching legacy `Molpy.ONG()`
(castle.js:3722-3736), `ONGBase()` (3738-3885), and `ONGs[0]()` (3886-3913).

### Current State
`ongBase()` in modern-engine.ts already handles:
- Glass chip production (Sand Refinery)
- Glass block production (Glass Chiller)
- Castle tool destroy/build cycle
- Ninja unstealth at ONG
- Basic newpix advancement
- Period handling (NP length, period/era names)
- npbONG/ninjad reset

### Missing Operations in ONGBase

#### 1. Fractal Sandcastles reset
```
Reference: castle.js:3748
Molpy.Boosts['Fractal Sandcastles'].power = 0;
```

#### 2. Lucky Glass reset
```
Reference: castle.js:3763
Molpy.Boosts['GlassBlocks'].luckyGlass = Glass Chiller.power + 1;
```

#### 3. Doublepost (activate castle tools twice)
```
Reference: castle.js:3765
var activateTimes = 1 + Molpy.Got('Doublepost');
```

#### 4. Backing Out (reverse castle tool order)
```
Reference: castle.js:3769-3786
```
If Backing Out boost: run destroy then build in forward order.
Otherwise: run all destroys, then all builds in reverse.

#### 5. Castle price rollback
```
Reference: castle.js:3791-3794
```
Reset nextCastleSand to 1 and prevCastleSand to 0 at ONG.

#### 6. Ninja Ritual at ONG
```
Reference: castle.js:3800-3810
```
If not clicked (ninjad=0) and has Ninja Ritual: reset or process ritual.
Ninja Herder allows keeping the streak.

#### 7. Temporal Rift department setup
```
Reference: castle.js:3815-3818
```
Random chance of temporal rift appearing, influenced by Time Travel/Flux
Capacitor/Flux Turbine/Minus Worlds badge count.

#### 8. Bag Burning
```
Reference: castle.js:3820-3824
```
Random bag destruction if NavCode not enabled.

#### 9. BBC (Beach Ball Convention) processing
```
Reference: castle.js:3825-3840
```
Spends glass blocks, modifies MHP power.

#### 10. Logicat puzzle reset at ONG
```
Reference: castle.js:3849-3858
```
Reset Caged Logicat count, WotA progression.

#### 11. Lightning Rod decay
```
Reference: castle.js:3862-3874
```
LR power decays by 5% per ONG, clamped by Lightning in a Bottle / Kite and Key.

#### 12. Glass Trolling disable
```
Reference: castle.js:3876
```
Glass Trolling resets to disabled each ONG.

#### 13. The Pope reset
```
Reference: castle.js:3878
```
Reset Papal decree unless Permanent Staff active.

#### 14. Time Lord reset & Flux Harvest refresh
```
Reference: castle.js:3847-3848
```
Reset Time Lord, refresh Flux Harvest (unless Temporal Rift active).

### Missing Operations in ONGs[0] (newpix advancement)

#### 1. Signpost redirect
```
Reference: castle.js:3888-3889
```
If Signpost power=1, redirect to NP 0 instead of advancing.

#### 2. Temporal Anchor (freeze NP)
```
Reference: castle.js:3887
```
If Temporal Anchor enabled, don't advance NP.

#### 3. Highest NP tracking
```
Reference: castle.js:3898-3907
```
Track highestNPvisited, earn Below the Horizon badge, unlock Time Travel.

#### 4. Controlled Hysteresis
```
Reference: castle.js:3884
```
Override NP number from Controlled Hysteresis power.

#### 5. Story-specific ONG variants (ONGs[0.1])
```
Reference: castle.js:3914-3942
```
Aperture Science storyline variant with doorhole limits.

### Implementation Steps

Expand existing `ongBase()` and `ongAdvanceNewpix()` with full operation set.
Add `processOngPostAdvance()` for operations after NP advancement.

### Tests
- Castle tools cycle correctly at ONG with Doublepost
- Backing Out reverses tool order
- Castle prices reset at ONG
- Temporal Rift department set probabilistically
- Logicat count resets at ONG
- Lightning Rod decays
- Glass Trolling disables
- Papal decree resets
- NP advancement with Temporal Anchor freeze
- Signpost redirect to NP 0
- Highest NP tracking

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Expand `ongBase()`, `ongAdvanceNewpix()`, add ~12 methods |
| `src/engine/modern-engine.test.ts` | ONG transition tests |

---

## Plan 26: Judgement Dip & Papal Decrees

### Goal
Implement the Judgement Dip system and Papal Decree multiplier system.

### Judgement Dip
Reference: castle.js:3637-3659 (PerformJudgement), badges.js:370+ (JudgementDipReport)

The Judgement system periodically destroys castles based on the "judge level",
which is determined by the ratio of castle tools to sand tools.

**PerformJudgement (castle.js:3637):**
```javascript
// If Fireproof + NavCode disabled: wipe all castles
if (Got('Fireproof') && Got('NavCode') && !NavCode.IsEnabled) {
  Castles.power = 0;
  return;
}
// Every 25 seconds of ONG elapsed:
if (judgeLevel > 1 && floor(ONGelapsed / 1000) % 25 == 0) {
  dAmount = JDestroyAmount() * NewPixBot.amount * 25;
  dAmount = ceil(min(Castles.power * 0.9, dAmount));
  Destroy('Castles', dAmount, 1);
}
```

**JudgementDipReport (badges.js:370):**
Returns judge level based on ratio of castle tools to sand tools.
Levels: 0 (safe), 1 (warning), 2+ (destruction).

**CalcReportJudgeLevel (castle.js:489-524):**
Reports level changes via notifications and earns badges.

### Papal Decrees
Reference: boosts.js:10006-10008

```javascript
Molpy.Papal = function(raptor) {
  return (Decreename != raptor) ? 1 :
    (Decree.value > 1) ? Decree.value * PapalBoostFactor :
    Decree.value / PapalBoostFactor;
}
```

The Papal system is a global multiplier that applies to one game system at a time.
`Decreename` identifies which system gets the boost. `Decree.value` is the
multiplier. `PapalBoostFactor` adjusts the effective multiplier.

**Affected systems (from grep of Papal calls):**
- `Papal('Sand')` - sand production per tick
- `Papal('Chips')` - glass chip production
- `Papal('Blocks')` - glass block production
- `Papal('Castles')` - castle building
- `Papal('GlassCastle')` - glass castle building
- `Papal('Ninja')` - ninja stealth increment
- `Papal('GlassSand')` - tool factory glass sand
- `Papal('GlassSaw')` - glass saw production
- `Papal('Fractal')` - fractal sandcastles
- `Papal('Shards')` - glass shard production
- `Papal('Dyson')` - vacuum cleaner
- `Papal('ToolF')` - tool factory costs
- `Papal('Logicats')` - logicat rewards
- `Papal('QQs')` - question qube rewards
- `Papal('BlackP')` - blackprint production

### Implementation Steps

#### Step 1: Papal Decree function
```typescript
// Simple implementation
papal(raptor: string): number {
  if (this.decreeName !== raptor) return 1;
  if (this.decreeValue > 1) return this.decreeValue * this.papalBoostFactor;
  return this.decreeValue / this.papalBoostFactor;
}
```

#### Step 2: Judgement Dip Report
Implement `judgementDipReport()` based on castle-to-sand tool ratio.

#### Step 3: PerformJudgement
Add to tick processing (Plan 23 placeholder).

#### Step 4: Wire Papal into existing systems
Update sand production, glass production, tool factory, etc. to call `this.papal()`.

### Tests
- Papal returns 1 when decree doesn't match
- Papal returns multiplied value when decree matches
- Judge level calculated from tool ratio
- Castle destruction at correct intervals
- Fireproof + NavCode override

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add `papal()`, `judgementDipReport()`, `performJudgement()` |
| `src/engine/modern-engine.test.ts` | Judgement and papal tests |

---

## Plan 27: Time Travel & Temporal Rift

### Goal
Implement Time Travel and Temporal Rift mechanics.

### Time Travel
Reference: boosts.js:692-771

**TimeTravelPrice (boosts.js:692):**
```javascript
price = newpixNumber + (Castles.power * newpixNumber / 3094) + travelCount;
if (Got('Flux Capacitor')) price = ceil(price * 0.2);
price = ceil(price / priceFactor);
```

**TimeTravel (boosts.js:705):**
Calls `TTT(targetNP, 0)` which:
1. Validates target NP (can't go beyond visited, can't cross timelines)
2. Charges castle or glass chip price
3. Moves to target NP
4. Triggers ONG-like processing
5. Earns travel badges (Fast Forward, And Back, Primer, Wimey, Hot Tub, etc.)

**TTT (boosts.js:729-790+):**
Core time travel function. Handles:
- Validation (can't travel to unvisited NPs, can't cross story boundaries)
- Payment (castles or glass chips via CalcJumpEnergy)
- NP movement
- Post-travel cleanup

### Temporal Rift
Reference: boosts.js:1732-1900

**RiftJump (boosts.js:1874):**
Random displacement to a different NP. Uses flux crystals.
Can appear as `department=1` on certain NP multiples.

**Rift interaction with clicks (castle.js:297-300):**
Random chance of slipping through rift on beach click.

### Implementation Steps

```typescript
// Core methods
timeTravel(direction: number): boolean
ttt(targetNP: number, chipCost: number): boolean
timeTravelPrice(): number
calcJumpEnergy(targetNP: number): number
riftJump(): void
```

### Tests
- Time travel price calculation
- Can't travel beyond highest visited NP
- Can't cross timeline boundaries
- Castle cost deducted
- Travel count badges earned
- Flux Capacitor reduces price
- Rift jump to random NP
- Rift click interaction

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add time travel methods |
| `src/engine/modern-engine.test.ts` | Time travel tests |

---

## Plan 28: Shopping, Donkey & Remaining Boost Mechanics

### Goal
Implement remaining boost mechanics that wire into the game loop.

### Donkey (Auto-buy)
Reference: boosts.js:1672-1690

Runs every tick (castle.js:3455). Two modes:
1. **Shopping Assistant + ASHF**: auto-buys the selected shopping item at 1.05x price
2. **Rob**: auto-buys boosts based on Rob's boost-ID list

### Monty Haul Problem (MHP)
Reference: boosts.js:439-470

Door-selection mini-game. Player picks a door, goat is revealed behind another,
player can switch or stay. Rewards vary by door contents.

### Goat System
Reference: boosts.js:479-500

**GetYourGoat (boosts.js:488):**
Adds goats as resource. Gruff boost triples goat gain.
GoatONG interactions during ONG transitions.

### Mustard System
Temporary boost injection on clicks. Relatively minor.

### Void Stare
Reference: boosts.js:9504-9512

Multiplier for blackprint production based on Vacuum resource.
```javascript
if (IsEnabled(staretype) && isFinite(Blackprints.power)) {
  pages *= pow(1.01, Level('Vacuum') / 100);
}
```

### Flux Harvest
Reference: boosts.js:9662+

Harvests flux crystals from accumulated temporal rifts.

### NinjaRitual
Reference: boosts.js:9115+

Ritual streak mechanic tied to ninja clicks. Already partially in modern engine.

### Implementation Steps

Group these into logical sub-tasks:
1. **Donkey auto-buy** - add to tick processing
2. **Goat system** - resource management + ONG interactions
3. **VoidStare** - simple multiplier function
4. **Papal decree selection** - UI-driven, add state + accessor
5. **Monty** - door selection game state machine
6. **Flux Harvest** - flux crystal harvesting from rifts
7. **Mustard** - click-based temporary boost

### Tests
- Donkey auto-buys with Shopping Assistant
- Donkey Rob mode buys boost list
- GetYourGoat adds goats correctly
- VoidStare multiplier calculation
- Monty door selection logic
- Flux Harvest crystal calculation

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add Donkey, Goat, VoidStare, Monty methods |
| `src/engine/modern-engine.test.ts` | Shopping/misc boost tests |
| `src/engine/boost-functions.ts` | Register remaining boost functions |

---

## Implementation Order

```
Plan 23 (Tick)
  └─► Plan 24 (Beach Clicks)
        └─► Plan 25 (ONG)
              ├─► Plan 26 (Judgement & Papal)
              ├─► Plan 27 (Time Travel)
              └─► Plan 28 (Shopping & Misc)
```

Plans 26-28 can be done in parallel once 25 is complete.

### Success Criteria (per plan)
- Zero TypeScript errors (`npm run typecheck`)
- All existing tests still pass
- New tests cover the implemented behavior
- Key parity comparisons verified against legacy

---

## Future Work (Beyond Phase 3)

After Phase 3, the engine should be functionally complete for headless simulation.
Remaining work:

| Area | Description | Priority |
|------|-------------|----------|
| **UI Layer** | React/web UI to replace legacy HTML | Separate project |
| **Options/Settings** | Game option persistence | Medium |
| **Number Formatting** | Molpify/DeMolpify (partially in utils) | Low |
| **Notifications** | Event-based notification system | Low |
| **Save Compatibility** | Full round-trip save/load with legacy | Medium |
| **Performance** | Optimize tick processing for ketchup | Low |
| **Endgame** | Vacuum Cleaner, Black Hole, Tractor Beam | Low |
| **Story Content** | Period-specific events and descriptions | Low |
