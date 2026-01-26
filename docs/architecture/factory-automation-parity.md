# Factory Automation Parity Verification

This document tracks parity between the legacy and modern Factory Automation implementations.

## Implementation Status

### ✅ Completed (Has Parity Tests)

1. **FA Run Calculation** (`calculateFactoryAutomationRuns`)
   - ✅ FA level calculation (power + 1)
   - ✅ Industrial accident logic (20% base, +10% per safety boost, -1% per FA level)
   - ✅ Safety Pumpkin unlock (when accident at level > 14)
   - ✅ Level cap to 61 (unless Cracks or Aleph One enabled)
   - ✅ NewPixBot requirement (20 bots per run)
   - ✅ Sand cost per run (2M × 10000^i for level i)
   - ✅ Run count calculation (tries most expensive first)
   - **Reference:** castle.js:3117-3148
   - **Tests:** factory-automation.test.ts (30 tests passing)

2. **Department Boost Filtering** (`getDepartmentBoosts`)
   - ✅ Filters boosts with department=1 flag
   - ✅ Excludes already unlocked boosts
   - **Tests:** factory-automation.test.ts

3. **Blast Furnace Rate** (`calculateBlastFurnaceRate`)
   - ✅ Base rate: 1000
   - ✅ Fractal Sandcastles reduction: 1000 × 0.94^power
   - ✅ Blitzing divisor: ÷2
   - ✅ BKJ adjustment: ÷max(1, (blitzingPower - 800) / 600)
   - ✅ Minimum rate: 5
   - **Reference:** castle.js:2851-2871
   - **Tests:** factory-automation.test.ts

4. **Mould Cost Calculations**
   - ✅ `calculateSandMouldCost`: abs(NP) × 100, squared if negative with Minus Worlds
   - ✅ `calculateGlassMouldCost`: 1000 × 1.01^abs(NP), squared if negative
   - ✅ `calculateSandMouldFillCost`: 100 × 1.2^abs(NP), squared if negative
   - ✅ `calculateGlassMouldFillCost`: 1M × 1.02^abs(NP), squared if negative
   - **Reference:** boosts.js:4350-4820
   - **Tests:** factory-automation.test.ts

5. **FA Upgrade Conditions** (`canUpgradeFactoryAutomation`)
   - ✅ Requires Doublepost boost
   - ✅ Requires NP length > 1800
   - ✅ Requires sufficient NewPixBots (100, 200, 400, ...)
   - ✅ Max level: 10
   - **Reference:** boosts.js:2933-2935
   - **Tests:** factory-automation.test.ts

### 🚧 Deferred to Future Phase

The following FA functionality is **not yet implemented** and has a TODO comment in modern-engine.ts:1618:

1. **Mould Work Processing** (`DoMouldWork`)
   - ❌ Fill Glass Mould Work (GMF) - consumes glass blocks, earns monument badges
   - ❌ Make Glass Mould Work (GMM) - consumes glass chips, creates glass moulds
   - ❌ Fill Sand Mould Work (SMF) - consumes sand, earns discovery monuments
   - ❌ Make Sand Mould Work (SMM) - consumes glass chips, creates sand moulds
   - ❌ Mould looping with Automation Optimiser + Mould Press
   - ❌ Cold Mould toggle (disables all mould work)
   - ❌ Break the Mould power accumulation on insufficient resources
   - ❌ Draft Dragon integration (auto-fill after make)
   - **Reference:** castle.js:3166-3185, boosts.js:4570-4821

2. **DoRD Rewards** (`RewardRedacted`)
   - ❌ DoRD activation (12.5% chance per FA run)
   - ❌ Blast Furnace reward (25% chance if owned)
   - ❌ Department boost unlock (random selection from available)
   - ❌ Temporary boost grants for free boosts
   - ❌ Double Department (runs DoRD twice)
   - **Reference:** castle.js:2786-2816

3. **Blackprint Construction** (`DoBlackprintConstruction`)
   - ❌ Construction from Blackprints (CfB) processing
   - ❌ Integration with mould work
   - **Reference:** castle.js:3151-3153 (call site only, implementation not shown)

4. **FA Integration Features**
   - ❌ Pure Genius badge (FA runs with infinite sand)
   - ❌ FA notifications (success messages)
   - ❌ Automation Optimiser (AO) - allows both mould work and standard tasks

## Parity Test Strategy

### Phase 1: Current Implementation (✅ Complete)

**Approach:** Unit tests for pure calculation functions
- All calculation functions tested in isolation
- No browser/Playwright needed
- Fast, deterministic tests
- **Result:** 30/30 tests passing

### Phase 2: Future Processing Logic (🚧 Pending)

**Approach:** Integration tests with LegacyEngine comparison

When the deferred FA processing is implemented, add these parity tests:

```typescript
describe('FA Mould Work Parity', () => {
  it('processes GMF the same as legacy', async () => {
    // Setup: Start GMF with power=1 and sufficient glass blocks
    // Execute: Run FA with enough runs (>800)
    // Verify: GMF completes, badge earned, glass blocks spent correctly
  });

  it('processes SMM the same as legacy', async () => {
    // Setup: Start SMM with power=1 and sufficient glass chips
    // Execute: Run FA with enough runs (>100)
    // Verify: SMM completes, mould created
  });

  it('handles Mould Press looping correctly', async () => {
    // Setup: Own AO + Mould Press, start multiple moulds
    // Execute: Run FA
    // Verify: Processes all moulds in sequence, loops as needed
  });
});

describe('FA DoRD Rewards Parity', () => {
  it('unlocks department boosts at correct rate', async () => {
    // Setup: Own DoRD, no department boosts unlocked
    // Execute: Run FA 100 times (simulate randomness)
    // Verify: ~12.5% of runs trigger DoRD
  });

  it('grants Blast Furnace reward correctly', async () => {
    // Setup: Own DoRD + Blast Furnace
    // Execute: Run FA multiple times
    // Verify: Blast Furnace conversion happens at correct rate
  });
});
```

## Known Differences (Intentional)

None currently - the modern implementation aims for exact parity with legacy.

## Verification Commands

```bash
# Run FA unit tests (current implementation)
npm test -- src/engine/factory-automation.test.ts

# Run ModernEngine integration tests
npm test -- src/engine/modern-engine.test.ts

# Run all parity tests (when implemented)
npm run test:parity
```

## Next Steps

When implementing the deferred FA processing logic (mould work, DoRD, blackprints):

1. Remove TODO comment from modern-engine.ts:1618
2. Implement processing functions in factory-automation.ts
3. Add integration tests comparing with LegacyEngine
4. Update this document with parity test results
5. Verify critical differences < 100 in engine-comparison tests

## References

- Legacy FA activation: castle.js:3117-3148
- Legacy FA run processing: castle.js:3149-3164
- Legacy DoRD rewards: castle.js:2786-2816
- Legacy mould work: castle.js:3166-3185
- Mould work implementations: boosts.js:4570-4821
- Modern implementation: src/engine/factory-automation.ts
- Modern integration: src/engine/modern-engine.ts:1580-1621
- Tests: src/engine/factory-automation.test.ts
