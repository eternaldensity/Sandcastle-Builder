# Phase 4: Remaining Systems & Parity Completion (Plans 29-36)

This document contains implementation plans for completing the remaining game systems
not yet covered by Phases 1-3. Phase 4 focuses on mid-to-late game mechanics, resource
systems, and edge cases needed for full headless simulation parity with the legacy engine.

## Status Summary

**Starting point:** 1,179 tests passing across 32 test files. Phases 1-3 complete.

### What Phase 4 Covers

| # | Feature | Complexity | Priority |
|---|---------|-----------|----------|
| 29 | Photo & Color Reaction System | Large | High |
| 30 | Blackprints Construction | Large | High |
| 31 | Goat System & Monty Haul Problem | Medium | Medium |
| 32 | Vacuum Cleaner & Endgame Resources | Medium-Large | Medium |
| 33 | Flux Crystals & Temporal Resources | Medium | Medium |
| 34 | Advanced Ninja Mechanics | Small-Medium | Low |
| 35 | Ketchup Fast-Forward System | Medium | High |
| 36 | Parity Integration & Save Round-Trip | Medium | High |

### Dependencies

```
Plan 29 (Photo) ──────────────┐
Plan 30 (Blackprints) ────────┤
Plan 31 (Goats/Monty) ────────┼──► Plan 36 (Parity & Save Round-Trip)
Plan 32 (Vacuum) ─► Plan 33 ──┤
Plan 34 (Ninja) ──────────────┤
Plan 35 (Ketchup) ────────────┘
```

Plans 29-35 can be done in any order (some minor cross-references but no hard blocks).
Plan 36 should be done last as it validates everything together.

---

## Plan 29: Photo & Color Reaction System

### Goal
Implement the Photo/Inker system matching legacy `Molpy.RunPhoto()` (castle.js:3461-3635).
This is a color-resource reaction system where five color types (Blueness, Otherness,
Blackness, Whiteness, Grayness) interact through decay, crafting, and unlock chains.

### Reference
- `Molpy.RunPhoto()` — castle.js:3461 (orchestrator, called per mNP tick)
- `Molpy.getPhoto()` — castle.js:3471 (generate photo materials)
- `Molpy.decayPhoto()` — castle.js:3508 (blueness/otherness decay)
- `Molpy.reactPhoto()` — castle.js:3519 (reaction between colors)
- `Molpy.craftPhoto()` — castle.js:3545 (robotic inker auto-craft)
- `Molpy.RunFastPhoto()` — castle.js:3563 (photoelectricity system)
- `Molpy.unlockPhoto()` — castle.js:3607 (conditional unlocks based on color power)

### Key Mechanics

#### Color Resources
Five color-typed boosts act as resources, each with a `power` value:
- **Blueness** — Base color, generated from glass blocks
- **Otherness** — Generated from Blueness decay
- **Blackness** — Generated from Otherness reaction
- **Whiteness** — Generated from Blackness reaction
- **Grayness** — Generated from Whiteness reaction

#### Photo Generation (`getPhoto`)
```
Reference: castle.js:3471-3506
```
- Runs when Camera boost is enabled
- Generates Blueness from glass blocks at a rate determined by Camera level
- Papal decree 'Camera' multiplies generation rate
- Bag Burning adds bonus generation
- Glass Trolling interaction (disable if active)

#### Decay (`decayPhoto`)
```
Reference: castle.js:3508-3517
```
- Each color decays at a rate proportional to its power
- Decay rate modified by Robotic Inker level
- Decay feeds the next color in the chain (Blueness → Otherness → ...)

#### Reaction (`reactPhoto`)
```
Reference: castle.js:3519-3543
```
- Colors react with adjacent colors in the chain
- Reaction rate depends on both colors' power levels
- Products feed downstream colors
- Conservation laws apply (total color power conserved minus decay losses)

#### Robotic Inker Crafting (`craftPhoto`)
```
Reference: castle.js:3545-3561
```
- Auto-crafts photo products when Robotic Inker is enabled
- Consumes color resources to produce Blackprints pages
- Crafting rate depends on Inker level and color power

#### Photoelectricity (`RunFastPhoto`)
```
Reference: castle.js:3563-3605
```
- Advanced system triggered by Photoelectricity boost
- Randomly discovers new boosts based on color power ratios
- Discovery probability scales with total color power

#### Photo Unlocks (`unlockPhoto`)
```
Reference: castle.js:3607-3635
```
- Various boosts unlock when specific color power thresholds are reached
- Unlock conditions check combinations of color levels

### Integration Points
- Called from `processTick()` once per mNP
- Feeds into Blackprints system (Plan 30) via crafted pages
- Glass blocks consumed as input
- Papal decree 'Camera' affects generation rate

### Implementation Steps
1. Add color resource tracking to game state (Blueness, Otherness, Blackness, Whiteness, Grayness power values)
2. Implement `getPhoto()` — Blueness generation from glass blocks
3. Implement `decayPhoto()` — color chain decay
4. Implement `reactPhoto()` — inter-color reactions
5. Implement `craftPhoto()` — Robotic Inker auto-crafting
6. Implement `RunFastPhoto()` — Photoelectricity discovery
7. Implement `unlockPhoto()` — threshold-based unlocks
8. Wire `runPhoto()` into `processTick()` mNP loop
9. Add tests for each sub-function

### Tests
- Blueness generated from glass blocks at correct rate
- Color decay chain produces downstream colors
- Reaction conserves total color (minus decay)
- Robotic Inker crafts pages from colors
- Photoelectricity discovery probability scales correctly
- Unlocks trigger at correct color power thresholds
- Glass Trolling disables photo generation
- Papal Camera decree multiplies generation

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/photo-system.ts` | New file: Photo/Inker/color reaction system |
| `src/engine/photo-system.test.ts` | Tests for photo system |
| `src/engine/modern-engine.ts` | Wire `runPhoto()` into tick loop |
| `src/types/game-data.ts` | Add color resource types if needed |

---

## Plan 30: Blackprints Construction

### Goal
Implement the Blackprints construction system matching legacy logic in boosts.js:4127-4338.
Blackprints are a mid-to-late game progression gate where players collect pages from
Factory Automation runs and spend them to construct powerful boosts.

### Reference
- `Molpy.BlackprintReport()` — boosts.js:4186 (status display)
- `Molpy.GetBlackprintPages()` — boosts.js:4196 (determine page target)
- `Molpy.GetBlackprintSubject()` — boosts.js:4217 (current construction target)
- `Molpy.StartBlackprintConstruction()` — boosts.js:4252 (initialize construction)
- `Molpy.DoBlackprintConstruction()` — boosts.js:4258 (process construction tick)
- `Molpy.CheckBlackprintDepartment()` — boosts.js:4241 (department reward eligibility)
- `Molpy.blackprintCosts` — boosts.js:4314 (hardcoded cost dictionary)

### Key Mechanics

#### Page Collection
- Factory Automation runs produce Blackprint pages as a byproduct
- Pages accumulate in `Blackprints.power` (the page count)
- Different boosts require different page costs

#### Construction Target Selection
```
Reference: boosts.js:4196-4250
```
- `GetBlackprintSubject()` determines which boost to construct next
- Order is deterministic based on which boosts are already bought
- Construction chain: SMM → SMF → GMM → GMF → TFLL → BG → Bacon → AO → AA → SG → AE → Milo → ZK → VS → CFT → BoH → VV → ...

#### Construction Process
```
Reference: boosts.js:4258-4312
```
- `DoBlackprintConstruction()` runs per tick when construction is active
- Consumes pages at a rate
- When enough pages consumed, the target boost is bought/unlocked
- Construction can be paused/resumed

#### Cost Dictionary
```
Reference: boosts.js:4314-4338
```
Hardcoded costs for each constructable boost:
- SMM/SMF: 100 pages each
- GMM/GMF: 200 pages each
- TFLL: 500 pages
- Higher-tier boosts: escalating costs

#### Department Rewards
```
Reference: boosts.js:4241-4256
```
- Completing certain construction milestones unlocks "department" rewards
- Departments grant bonus production rates or new capabilities

### Integration Points
- Pages generated by Factory Automation (already in tool-factory.ts)
- Construction runs during tick processing
- Constructed boosts feed into all existing boost systems
- Some constructed boosts are prerequisites for Vacuum Cleaner (Plan 32)

### Implementation Steps
1. Define Blackprint cost dictionary as typed data
2. Implement `getBlackprintSubject()` — deterministic target selection
3. Implement `startBlackprintConstruction()` — initialize construction state
4. Implement `doBlackprintConstruction()` — per-tick page consumption
5. Implement `checkBlackprintDepartment()` — milestone reward checks
6. Wire construction into `processTick()`
7. Connect page generation from Factory Automation output
8. Add tests

### Tests
- Construction target selection follows correct order
- Page consumption at correct rate
- Boost unlocked when construction completes
- Department rewards trigger at milestones
- Construction pauses when pages run out
- Cost dictionary covers all constructable boosts
- Integration with Factory Automation page generation

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/blackprints.ts` | New file: Construction system |
| `src/engine/blackprints.test.ts` | Tests |
| `src/engine/modern-engine.ts` | Wire into tick, connect to FA output |
| `src/engine/tool-factory.ts` | Ensure page generation output is accessible |

---

## Plan 31: Goat System & Monty Haul Problem

### Goal
Implement the Goat resource system and the Monty Haul Problem (MHP) minigame.
Goats are a resource obtained from losing at MHP, and they gate several boost unlocks.

### Reference
- `Molpy.Monty()` — boosts.js:439-470 (main MHP logic)
- `Molpy.GetDoor()` — boosts.js:468 (random door selection)
- `Molpy.RewardMonty()` — boosts.js:472-498 (win/loss distribution)
- `Molpy.GetYourGoat()` — boosts.js:488 (goat reward handler)
- Goat-gated unlocks scattered through boosts.js

### Key Mechanics

#### Monty Haul Problem
```
Reference: boosts.js:439-470
```
A three-door game show minigame:
1. Player selects one of three doors (A, B, C)
2. Host reveals a goat behind one of the other doors
3. Player can switch or stay
4. Behind doors: one has castles (win), two have goats (lose)

State tracking:
- `MontyDoors` — array of door contents
- `MontyMethod` — goat door selection algorithm
- `MontyChosen` — player's current selection
- `MontyRevealed` — which door was revealed

Win reward: castles based on current castle value
Loss reward: goats (which is actually useful for progression)

#### Hall of Mirrors Interaction
```
Reference: boosts.js:445-450
```
- When Hall of Mirrors (HoM) boost is active, MHP also awards glass chips
- HoM level determines chip multiplier

#### Goat Resource
```
Reference: boosts.js:488-498
```
- Goats stored as a resource (boost power value)
- Gruff boost triples goat gain
- Goat milestones trigger unlocks:
  - 20 goats → Hall of Mirrors unlock check
  - 200 goats → Beret Guy unlock check
  - 400 goats → Bag of Holding unlock check

#### Goat ONG Interactions
- Some goat-related boosts interact with ONG transitions
- GoatONG processing during newpix advancement

### Implementation Steps
1. Add MHP state to game state (doors, chosen, revealed, method)
2. Implement `montySetup()` — randomize door contents
3. Implement `montyChoose(door)` — player selects a door
4. Implement `montyReveal()` — host reveals a goat door
5. Implement `montyDecide(switch: boolean)` — player switches or stays
6. Implement `rewardMonty()` — distribute win/loss rewards
7. Implement `getYourGoat()` — add goats, check unlock milestones
8. Wire Hall of Mirrors glass chip bonus
9. Add Gruff triple goat multiplier
10. Add goat milestone unlock triggers
11. Add tests

### Tests
- MHP door randomization produces valid configurations
- Switching doors changes outcome correctly
- Win awards castles proportional to castle value
- Loss awards goats
- Gruff triples goat gain
- Hall of Mirrors adds glass chips on MHP
- Goat milestones (20, 200, 400) trigger correct unlocks
- MHP state resets correctly between rounds

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/monty-haul.ts` | New file: MHP minigame + goat system |
| `src/engine/monty-haul.test.ts` | Tests |
| `src/engine/modern-engine.ts` | Wire MHP methods, goat milestone checks |

---

## Plan 32: Vacuum Cleaner & Endgame Resources

### Goal
Implement the Vacuum Cleaner endgame resource system matching legacy logic in
castle.js:3403-3434 and boosts.js:9433-9913. Vacuum is a late-game resource generated
by consuming infinite sand, flux crystals, and QQ.

### Reference
- Vacuum generation — castle.js:3403-3434
- `Molpy.VacCost` — boosts.js (cost calculation object)
- "This Sucks" boost — boosts.js:9700 (vacuum rate control)
- Tractor Beam — boosts.js (vacuum → goat conversion)
- Black Hole — boosts.js (vacuum multiplier)
- Dyson papal decree — boosts.js (vacuum output boost)

### Key Mechanics

#### Vacuum Generation
```
Reference: castle.js:3403-3434
```
Per-mNP tick processing:
1. Check if Vacuum Cleaner boost is enabled
2. Calculate vacuum generation rate from "This Sucks" level
3. Consume resources: infinite sand + FluxCrystals + QQ
4. If insufficient resources, reduce generation rate
5. Apply Black Hole multiplier
6. Apply Dyson papal decree multiplier
7. Add generated vacuum to Vacuum resource

#### Cost Calculation
```
Reference: boosts.js VacCost
```
- Sand cost: always infinite (requires infinite sand production)
- FluxCrystal cost: scales with "This Sucks" level
- QQ cost: scales with vacuum level

#### "This Sucks" Rate Curve
```
Reference: boosts.js:9700
```
- Player-adjustable rate control
- Higher levels = faster vacuum generation but higher resource cost
- Level affects the cost curve exponentially

#### Tractor Beam (Alternative Path)
```
Reference: boosts.js
```
- When Tractor Beam is enabled, vacuum generates goats instead
- Conversion rate: vacuum units → goat units
- Goats feed back into goat progression (Plan 31)

#### Black Hole Multiplier
- Flat multiplier on vacuum output
- Stacks with Dyson decree

#### Void Starer Integration
```
Reference: boosts.js:9504-9512
```
- Already partially referenced in modern engine
- Multiplier for blackprint production: `pages *= pow(1.01, Level('Vacuum') / 100)`
- Links Vacuum resource to Blackprint system (Plan 30)

### Prerequisites
- Plan 33 (Flux Crystals) should be done first or concurrently — vacuum consumes flux crystals
- Plan 31 (Goats) for Tractor Beam goat conversion path

### Implementation Steps
1. Add Vacuum resource tracking to game state
2. Implement vacuum cost calculation (VacCost)
3. Implement "This Sucks" rate curve
4. Implement vacuum generation per-mNP in tick loop
5. Implement Black Hole multiplier
6. Implement Dyson papal decree multiplier
7. Implement Tractor Beam → goat conversion path
8. Wire Void Starer to use Vacuum level for blackprint multiplication
9. Add tests

### Tests
- Vacuum generation requires infinite sand
- FluxCrystal cost scales with "This Sucks" level
- Black Hole multiplier correctly applied
- Dyson decree multiplier correctly applied
- Generation stops when resources insufficient
- Tractor Beam converts vacuum to goats
- Void Starer multiplier uses Vacuum level correctly
- "This Sucks" rate curve matches legacy

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/vacuum-system.ts` | New file: Vacuum generation, costs, multipliers |
| `src/engine/vacuum-system.test.ts` | Tests |
| `src/engine/modern-engine.ts` | Wire into mNP tick loop |

---

## Plan 33: Flux Crystals & Temporal Resources

### Goal
Implement the Flux Crystal resource system — generation from multiple sources and
consumption by Vacuum Cleaner and various boosts.

### Reference
- Flux Harvest — boosts.js:9662+
- Time Reaper interactions — boosts.js (scattered)
- Temporal Rift crystal conversion — castle.js
- Dragon nesting material usage — dragons.js
- Vacuum consumption — castle.js:3411-3432

### Key Mechanics

#### Flux Crystal Generation Sources
1. **Flux Harvest boost** — periodic crystal generation from accumulated temporal rift time
2. **Temporal Rift** — crystals generated when rift is active
3. **Dragon breeding** — crystals as dragon nesting byproduct
4. **Time Reaper** — crystals from time reaper interactions

#### Flux Harvest
```
Reference: boosts.js:9662+
```
- Activated boost that harvests crystals periodically
- Harvest amount based on temporal rift accumulation
- Papal decree 'Flux' modifies harvest rate
- Refresh cycle resets accumulation

#### Consumption
- Vacuum Cleaner (Plan 32) — primary consumer
- Various boost purchases that require flux crystals as currency
- Dragon nest lining materials

#### QQ Resource
- Related endgame resource used alongside flux crystals
- Generated from specific late-game boosts
- Consumed by Vacuum Cleaner

### Implementation Steps
1. Add FluxCrystals and QQ resource tracking to game state
2. Implement Flux Harvest generation logic
3. Implement temporal rift crystal conversion
4. Wire dragon breeding crystal byproduct (extend existing dragon.ts)
5. Implement Time Reaper crystal generation
6. Implement QQ generation mechanics
7. Wire consumption into Vacuum system (Plan 32)
8. Add Flux papal decree modifier
9. Add tests

### Tests
- Flux Harvest generates crystals from rift accumulation
- Temporal Rift produces crystals when active
- Dragon breeding generates crystal byproduct
- Flux papal decree modifies harvest rate
- QQ generation from late-game boosts
- Resources properly consumed by Vacuum system

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/flux-system.ts` | New file: Flux crystal + QQ generation |
| `src/engine/flux-system.test.ts` | Tests |
| `src/engine/modern-engine.ts` | Wire flux harvest into tick, connect to rift |
| `src/engine/dragon.ts` | Add crystal byproduct to breeding |

---

## Plan 34: Advanced Ninja Mechanics

### Goal
Complete the remaining ninja system mechanics not yet implemented. The basic
stealth/unstealth system works, but several multiplier boosts and edge-case
interactions are missing.

### Reference
- Ninja multiplier chain — castle.js (ClickBeach ninja section)
- NinjaLeague/NinjaLegion/NinjaNinjaDuck — boosts.js
- NinjaBuilder — boosts.js
- FactoryNinja — boosts.js
- StealthCam/Shutter — boosts.js
- Impervious Ninja — boosts.js
- ActiveNinja — boosts.js

### Key Mechanics

#### Ninja Multiplier Chain
```
Reference: castle.js ClickBeach
```
Currently the modern engine references these boosts at lines ~2155-2175 but
doesn't implement their full mechanics:

1. **ActiveNinja** — 3x multiplier during longpix (NP > certain threshold)
2. **NinjaLeague** — Multiplier based on ninja streak length
3. **NinjaLegion** — Additional multiplier stacking with League
4. **NinjaNinjaDuck** — Hidden multiplier for extended stealth runs
5. **NinjaBuilder** — Builds castle tools during stealth (with assistant count)
6. **Ninja Builder Assistant** — Increases NinjaBuilder tool count

#### Factory Ninja
- Automates Factory operations during stealth periods
- Runs tool factory with ninja-specific parameters
- Interacts with stealth duration for efficiency

#### Stealth Cam / Shutter
- StealthCam records stealth sessions
- Shutter mechanic affects photo generation during stealth
- Interaction with Photo system (Plan 29)

#### Impervious Ninja
- "Forgive" mechanic using glass chips
- Preserves stealth streak when accidentally broken
- Cost scales with forgive count

#### Ninja Shortcomings Badge
- Badge earned for stealth duration 30-35 (specific range)
- Edge case in badge-checker

#### Ninja Lockdown
- Toggle that prevents unstealth
- Affects click processing flow

### Implementation Steps
1. Implement ActiveNinja 3x multiplier during longpix
2. Implement NinjaLeague streak multiplier calculation
3. Implement NinjaLegion stacking multiplier
4. Implement NinjaNinjaDuck hidden multiplier
5. Implement NinjaBuilder tool building during stealth
6. Implement FactoryNinja stealth automation
7. Implement StealthCam/Shutter interaction
8. Implement Impervious Ninja forgive mechanic
9. Add Ninja Lockdown toggle
10. Add Ninja Shortcomings badge condition
11. Add tests

### Tests
- ActiveNinja applies 3x during longpix only
- NinjaLeague multiplier scales with streak
- NinjaLegion stacks correctly with League
- NinjaNinjaDuck activates at correct stealth thresholds
- NinjaBuilder builds tools during stealth
- FactoryNinja runs factory during stealth
- Impervious Ninja forgive costs glass chips
- Impervious Ninja forgive cost scales correctly
- Ninja Lockdown prevents unstealth
- Ninja Shortcomings badge earned at stealth 30-35

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Implement ninja multipliers, lockdown, builder |
| `src/engine/modern-engine.test.ts` | Ninja mechanic tests |
| `src/engine/badge-conditions.ts` | Add Ninja Shortcomings condition |

---

## Plan 35: Ketchup Fast-Forward System

### Goal
Implement the ketchup/catch-up system that allows the game to fast-forward through
missed ticks when the player returns after being away.

### Reference
- Ketchup logic — castle.js (game loop catch-up)
- Mustard cleanup — boosts.js (scattered: 7572, 7850, 7988-7990, 8681, 8788, 8966)
- `Molpy.mustardCleanup()` — boosts.js
- `Molpy.mustardTools` — boosts.js

### Key Mechanics

#### Ketchup (Catch-Up) System
```
Reference: castle.js game loop
```
When the game detects that time has passed since the last tick:
1. Calculate number of missed ticks
2. Run ticks in fast-forward mode (simplified calculations)
3. Cap maximum catch-up to prevent browser hang
4. Apply accumulated resources

#### Fast-Forward Mode
During ketchup, certain operations are simplified:
- Reduced boost function calls (skip cosmetic effects)
- Batch resource calculations instead of per-tick
- Skip notification generation
- Skip animation/display updates (irrelevant for headless)

#### Mustard System
```
Reference: boosts.js scattered
```
Late-game QoL feature:
- `mustardCleanup()` converts tool amounts to Mustard resource
- `mustardTools` tracks which tools have been "mustarized"
- Allows spending infinite sand/castles via "mustard" mode
- Mustard mode doesn't affect actual resource totals

#### Ketchup/Mustard Interaction
- During ketchup, mustard mode accelerates catch-up
- Mustard tools process faster during fast-forward
- Prevents resource inconsistencies during long absence

### Implementation Steps
1. Implement ketchup tick detection (elapsed time since last tick)
2. Implement fast-forward tick mode (batched `processTick()`)
3. Add maximum catch-up cap
4. Implement `mustardCleanup()` — tool-to-mustard conversion
5. Add mustard mode state tracking
6. Implement mustard-accelerated ketchup
7. Add performance safeguards (prevent excessive computation)
8. Add tests

### Tests
- Ketchup detects missed ticks correctly
- Fast-forward processes correct number of ticks
- Maximum catch-up cap prevents excessive processing
- Mustard cleanup converts tools correctly
- Mustard mode doesn't affect actual resources
- Ketchup + mustard interaction works correctly
- Performance: ketchup of 1000 ticks completes in reasonable time

### Files Changed
| File | Changes |
|------|---------|
| `src/engine/modern-engine.ts` | Add ketchup detection, fast-forward loop |
| `src/engine/modern-engine.test.ts` | Ketchup/mustard tests |

---

## Plan 36: Parity Integration & Save Round-Trip

### Goal
Validate the complete modern engine against the legacy engine using comprehensive
parity tests and verify save/load round-trip compatibility.

### Key Activities

#### 1. Comprehensive Parity Test Suite
Run extended parity comparisons between legacy and modern engines:
- Start from fresh game → play 100 ticks → compare states
- Start from fresh game → reach each era → compare key resources
- Load legacy save files → verify modern engine produces same state
- Test specific scenarios: MHP game, photo system, vacuum operation

#### 2. Save Round-Trip Testing
```
Reference: save-parser.ts, save-serializer.ts (already exist)
```
- Load legacy save → parse → serialize → compare with original
- Load legacy save → run in modern engine → serialize → load in legacy → verify
- Test edge cases: infinite values, NaN handling, missing fields

#### 3. Gap Analysis
- Identify any remaining differences between legacy and modern behavior
- Categorize by severity (critical/important/cosmetic)
- Document known differences that are intentional (bug fixes, improvements)

#### 4. Regression Test Fixtures
Create standardized test fixtures for ongoing regression testing:
- Early game fixture (NP 1-100)
- Mid game fixture (NP 1000+, tools purchased)
- Late game fixture (infinite resources, vacuum running)
- Edge case fixtures (coma recovery, time travel, dragon combat)

### Implementation Steps
1. Create comprehensive parity test suite with multiple scenarios
2. Run parity comparisons, document all differences
3. Fix critical differences (resource mismatches, tool counts)
4. Verify save round-trip for 5+ legacy save files
5. Create regression fixtures for CI
6. Document known intentional differences
7. Final test count and coverage report

### Tests
- Parity: fresh game 100 ticks matches legacy (critical resources)
- Parity: tool purchase sequences match legacy prices
- Parity: ONG transitions produce same state changes
- Save round-trip: legacy save → parse → serialize matches original
- Save round-trip: modern state → serialize → parse → matches original
- Regression: all fixtures produce expected outputs

### Files Changed
| File | Changes |
|------|---------|
| `src/parity/comprehensive-parity.test.ts` | New: full parity test suite |
| `src/parity/save-roundtrip.test.ts` | New: save/load round-trip tests |
| `src/parity/fixtures/` | New: standardized test fixtures |

---

## Implementation Order

### Recommended Sequence

**Wave 1 (Independent, do in parallel):**
- Plan 29 (Photo) — Large but self-contained
- Plan 31 (Goats/Monty) — Small, quick win
- Plan 34 (Ninja) — Small, fills edge cases
- Plan 35 (Ketchup) — High priority for usability

**Wave 2 (After Wave 1):**
- Plan 33 (Flux Crystals) — Needs temporal rift awareness from Plan 35
- Plan 30 (Blackprints) — Benefits from Photo system feeding pages

**Wave 3 (After Wave 2):**
- Plan 32 (Vacuum) — Needs Flux Crystals + Goats + Blackprints
- Plan 36 (Parity) — Final validation after all systems implemented

### Success Criteria (per plan)
- Zero TypeScript errors (`npm run typecheck`)
- All existing tests still pass
- New tests cover implemented behavior
- Key parity comparisons verified against legacy where applicable

---

## Beyond Phase 4

After Phase 4, the engine should achieve full headless simulation parity.
Remaining work would be in separate project tracks:

| Track | Description | Priority |
|-------|-------------|----------|
| **UI Layer** | React/web UI to replace legacy HTML | Separate project |
| **Story Content** | Period-specific events, descriptions, flavor text | Low |
| **Notifications** | Event-based notification system | Low |
| **Performance** | Optimize for very long ketchup sessions | Low |
| **Mobile** | Touch-friendly UI considerations | Future |
