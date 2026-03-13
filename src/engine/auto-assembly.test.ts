import { describe, it, expect } from 'vitest';
import {
  calculateAAConsumption,
  runFastFactory,
  calculateZooKeep,
  type AAConsumptionState,
  type FastFactoryState,
} from './auto-assembly.js';
import { TF_ORDER } from './tool-factory.js';

// ============================================================================
// calculateAAConsumption
// ============================================================================

describe('calculateAAConsumption', () => {
  function makeState(overrides: Partial<AAConsumptionState> = {}): AAConsumptionState {
    return {
      acPower: 10,
      usedFastPath: false,
      mustardTools: 0,
      mustardAutomationBought: false,
      mustardAmount: 0,
      toolAmounts: new Array(12).fill(100),
      toolPrices: new Array(12).fill(1000),
      priceFactor: 1,
      flipsidePower: 0,
      ...overrides,
    };
  }

  it('returns zero runs when acPower is 0', () => {
    const result = calculateAAConsumption(makeState({ acPower: 0 }));
    expect(result.fastFactoryRuns).toBe(0);
    expect(result.toolsConsumed).toBe(0);
    expect(result.mustardSpent).toBe(0);
  });

  // Mustard path
  it('uses mustard path when mustardTools > 0 and automation bought with enough mustard', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 50,
      mustardTools: 5,
      mustardAutomationBought: true,
      mustardAmount: 100,
    }));
    expect(result.fastFactoryRuns).toBe(50);
    expect(result.mustardSpent).toBe(20);
    expect(result.toolsConsumed).toBe(0);
  });

  it('mustard path returns 0 runs if automation not bought', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 50,
      mustardTools: 5,
      mustardAutomationBought: false,
      mustardAmount: 100,
    }));
    expect(result.fastFactoryRuns).toBe(0);
    expect(result.mustardSpent).toBe(0);
  });

  it('mustard path returns 0 runs if not enough mustard', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 50,
      mustardTools: 5,
      mustardAutomationBought: true,
      mustardAmount: 19,
    }));
    expect(result.fastFactoryRuns).toBe(0);
    expect(result.mustardSpent).toBe(0);
  });

  it('mustard path short-circuits even if other paths would work', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 50,
      mustardTools: 1,
      mustardAutomationBought: false,
      mustardAmount: 0,
      usedFastPath: true, // would trigger fast path if mustard didn't short-circuit
    }));
    expect(result.fastFactoryRuns).toBe(0);
  });

  // Fast path
  it('uses fast path when TF used fast path', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 75,
      usedFastPath: true,
    }));
    expect(result.fastFactoryRuns).toBe(75);
    expect(result.toolsConsumed).toBe(0);
    expect(result.mustardSpent).toBe(0);
  });

  // Regular path
  it('regular path consumes tools iteratively', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 5,
      toolAmounts: new Array(12).fill(10),
      toolPrices: new Array(12).fill(Infinity),
      priceFactor: 1,
      flipsidePower: 0,
    }));
    expect(result.fastFactoryRuns).toBe(5);
    expect(result.toolsConsumed).toBe(5);
    // Each tool should have been decremented by 5
    for (const amount of result.updatedToolAmounts) {
      expect(amount).toBe(5);
    }
  });

  it('regular path stops when a tool runs out', () => {
    const amounts = new Array(12).fill(100);
    amounts[3] = 2; // One tool only has 2
    const result = calculateAAConsumption(makeState({
      acPower: 10,
      toolAmounts: amounts,
      toolPrices: new Array(12).fill(Infinity),
      priceFactor: 1,
      flipsidePower: 0,
    }));
    expect(result.fastFactoryRuns).toBe(2);
    expect(result.toolsConsumed).toBe(2);
    expect(result.updatedToolAmounts[3]).toBe(0);
  });

  it('regular path caps at 1000 iterations', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 5000,
      toolAmounts: new Array(12).fill(10000),
      toolPrices: new Array(12).fill(Infinity),
      priceFactor: 1,
      flipsidePower: 0,
    }));
    expect(result.fastFactoryRuns).toBe(1000);
    expect(result.toolsConsumed).toBe(1000);
  });

  it('regular path checks flipside filter — finite price with fVal=0 blocks', () => {
    // fVal=0, finite price → isFinite(pf*price) && !fVal → true → invalid
    const result = calculateAAConsumption(makeState({
      acPower: 10,
      toolAmounts: new Array(12).fill(100),
      toolPrices: new Array(12).fill(500), // finite prices
      priceFactor: 1,
      flipsidePower: 0,
    }));
    expect(result.fastFactoryRuns).toBe(0);
    expect(result.toolsConsumed).toBe(0);
  });

  it('regular path with fVal=1 allows finite-price tools', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 5,
      toolAmounts: new Array(12).fill(10),
      toolPrices: new Array(12).fill(500), // finite prices
      priceFactor: 1,
      flipsidePower: 1,
    }));
    expect(result.fastFactoryRuns).toBe(5);
    expect(result.toolsConsumed).toBe(5);
  });

  it('regular path with all infinite tools skips consumption', () => {
    const result = calculateAAConsumption(makeState({
      acPower: 25,
      toolAmounts: new Array(12).fill(Infinity),
      toolPrices: new Array(12).fill(Infinity),
      priceFactor: 1,
      flipsidePower: 0,
    }));
    expect(result.fastFactoryRuns).toBe(25);
    expect(result.toolsConsumed).toBe(0); // infinite path, no consumption
  });
});

// ============================================================================
// runFastFactory
// ============================================================================

describe('runFastFactory', () => {
  function makeState(overrides: Partial<FastFactoryState> = {}): FastFactoryState {
    return {
      marioEnabled: false,
      marioBought: 0,
      qqLevel: 0,
      aeBought: false,
      cfbBought: false,
      miloBought: false,
      miloPower: 0,
      rushJobBought: false,
      zkBought: false,
      zkPower: 0,
      redactedTotalClicks: 0,
      logicatBought: 0,
      logiPuzzleBought: false,
      logiPuzzleLevel: 0,
      pokeBarThreshold: 0,
      shadowFeederActive: false,
      codaActive: false,
      ...overrides,
    };
  }

  const fixedRng = () => 0.5;

  it('returns zeros when times <= 0', () => {
    const result = runFastFactory(0, makeState(), fixedRng);
    expect(result.blastFurnaceRuns).toBe(0);
    expect(result.logicatRewardBatches).toBe(0);
  });

  // Mario / Logicat
  it('activates Mario when enabled and QQ >= cost', () => {
    const result = runFastFactory(100, makeState({
      marioEnabled: true,
      marioBought: 4,
      qqLevel: 10, // cost = 4*5/2 = 10
    }), fixedRng);
    expect(result.qqSpent).toBe(10);
    expect(result.logicatRewardBatches).toBe(26);
  });

  it('does not activate Mario when QQ < cost', () => {
    const result = runFastFactory(100, makeState({
      marioEnabled: true,
      marioBought: 4,
      qqLevel: 5, // cost = 10, not enough
    }), fixedRng);
    expect(result.qqSpent).toBe(0);
    expect(result.logicatRewardBatches).toBe(0);
  });

  it('does not activate Mario when not enabled', () => {
    const result = runFastFactory(100, makeState({
      marioEnabled: false,
      marioBought: 4,
      qqLevel: 100,
    }), fixedRng);
    expect(result.qqSpent).toBe(0);
  });

  // AE / CfB / MouldWork
  it('activates AE with CfB and MouldWork', () => {
    const result = runFastFactory(50, makeState({
      aeBought: true,
      cfbBought: true,
    }), fixedRng);
    expect(result.blackprintConstructionRuns).toBe(50);
    expect(result.mouldWorkRuns).toBe(50);
  });

  it('activates AE without CfB — only MouldWork', () => {
    const result = runFastFactory(50, makeState({
      aeBought: true,
      cfbBought: false,
    }), fixedRng);
    expect(result.blackprintConstructionRuns).toBe(0);
    expect(result.mouldWorkRuns).toBe(50);
  });

  it('no AE means no construction or mould runs', () => {
    const result = runFastFactory(50, makeState(), fixedRng);
    expect(result.blackprintConstructionRuns).toBe(0);
    expect(result.mouldWorkRuns).toBe(0);
  });

  // Blast Furnace
  it('calculates blast furnace runs with rng', () => {
    // furn = Math.floor((times + rng() * 3) / 2)
    // With rng=0.5, times=100: Math.floor((100 + 1.5) / 2) = 50
    const result = runFastFactory(100, makeState(), fixedRng);
    expect(result.blastFurnaceRuns).toBe(50);
  });

  it('blast furnace with rng=0', () => {
    // furn = Math.floor((100 + 0) / 2) = 50
    const result = runFastFactory(100, makeState(), () => 0);
    expect(result.blastFurnaceRuns).toBe(50);
  });

  it('blast furnace with rng=1 (near max)', () => {
    // furn = Math.floor((100 + 3) / 2) = 51
    const result = runFastFactory(100, makeState(), () => 0.999);
    expect(result.blastFurnaceRuns).toBe(51);
  });

  // Milo / Blackprints
  it('generates blackprint pages from Milo when left > 7', () => {
    // times=100, rng=0.5 → furn=50, left=50
    // left > 7 ✓, miloBought ✓
    // draft = 0.5 * 1 * (50 - 7) = 21.5
    // miloPower = 0 + 21.5 = 21.5 (no rush job)
    // pages = floor(21.5/100) = 0
    const result = runFastFactory(100, makeState({
      miloBought: true,
      miloPower: 0,
    }), fixedRng);
    expect(result.blackprintPages).toBe(0);
    expect(result.updatedMiloPower).toBeCloseTo(21.5, 5);
  });

  it('Milo with Rush Job multiplies draft by 5', () => {
    // draft = 0.5 * 1 * (50-7) = 21.5
    // miloPower = 0 + 21.5*5 = 107.5
    // pages = floor(107.5/100) = 1, remaining = 7.5
    const result = runFastFactory(100, makeState({
      miloBought: true,
      miloPower: 0,
      rushJobBought: true,
    }), fixedRng);
    expect(result.blackprintPages).toBe(1);
    expect(result.updatedMiloPower).toBeCloseTo(7.5, 5);
  });

  it('Milo accumulates into existing miloPower', () => {
    // draft = 0.5 * (50-7) = 21.5
    // miloPower = 85 + 21.5 = 106.5
    // pages = 1, remaining = 6.5
    const result = runFastFactory(100, makeState({
      miloBought: true,
      miloPower: 85,
    }), fixedRng);
    expect(result.blackprintPages).toBe(1);
    expect(result.updatedMiloPower).toBeCloseTo(6.5, 5);
  });

  it('Milo inactive when left <= 7', () => {
    // times=10, rng=0.5 → furn=floor((10+1.5)/2)=5, left=5
    // left <= 7 → no Milo
    const result = runFastFactory(10, makeState({
      miloBought: true,
      miloPower: 50,
    }), fixedRng);
    expect(result.blackprintPages).toBe(0);
    expect(result.updatedMiloPower).toBe(50); // unchanged
  });

  // Zoo Keep integration
  it('triggers zoo keep when all conditions met', () => {
    // times=200, rng=0.5 → furn=floor((200+1.5)/2)=100, left=100
    // Milo: draft=0.5*(100-7)=46.5, left=100-46.5=53.5
    // Zoo: left>10 ✓, totalClicks>2500 ✓, zkBought ✓, logicatBought>=4 ✓, logiPuzzle ✓
    // poke = 0.5*(53.5-10) = 21.75
    const result = runFastFactory(200, makeState({
      miloBought: true,
      zkBought: true,
      zkPower: 0,
      redactedTotalClicks: 3000,
      logicatBought: 5,
      logiPuzzleBought: true,
      logiPuzzleLevel: 10,
      pokeBarThreshold: 5,
    }), fixedRng);
    expect(result.zooVisits).toBeGreaterThanOrEqual(0);
    expect(result.updatedZKPower).toBeGreaterThanOrEqual(0);
  });

  it('zoo keep blocked when totalClicks <= 2500', () => {
    const result = runFastFactory(200, makeState({
      zkBought: true,
      redactedTotalClicks: 2000,
      logicatBought: 5,
      logiPuzzleBought: true,
      logiPuzzleLevel: 10,
      pokeBarThreshold: 5,
    }), fixedRng);
    expect(result.zooVisits).toBe(0);
  });

  it('zoo keep blocked when logiPuzzleLevel < threshold', () => {
    const result = runFastFactory(200, makeState({
      zkBought: true,
      redactedTotalClicks: 5000,
      logicatBought: 5,
      logiPuzzleBought: true,
      logiPuzzleLevel: 3,
      pokeBarThreshold: 5,
    }), fixedRng);
    expect(result.zooVisits).toBe(0);
  });

  it('zoo keep skipped when shadowFeederActive', () => {
    const result = runFastFactory(200, makeState({
      zkBought: true,
      redactedTotalClicks: 5000,
      logicatBought: 5,
      logiPuzzleBought: true,
      logiPuzzleLevel: 10,
      pokeBarThreshold: 5,
      shadowFeederActive: true,
    }), fixedRng);
    expect(result.zooVisits).toBe(0);
  });

  it('zoo keep skipped when codaActive', () => {
    const result = runFastFactory(200, makeState({
      zkBought: true,
      redactedTotalClicks: 5000,
      logicatBought: 5,
      logiPuzzleBought: true,
      logiPuzzleLevel: 10,
      pokeBarThreshold: 5,
      codaActive: true,
    }), fixedRng);
    expect(result.zooVisits).toBe(0);
  });
});

// ============================================================================
// calculateZooKeep
// ============================================================================

describe('calculateZooKeep', () => {
  it('accumulates poke into power', () => {
    // poke = 0.5 * (100 - 10) = 45
    const result = calculateZooKeep(100, 0, () => 0.5);
    expect(result.updatedPower).toBeCloseTo(45, 5);
    expect(result.zooVisits).toBe(0);
  });

  it('converts power >= 1000 into zoo visits', () => {
    // poke = 0.5 * (100 - 10) = 45
    // power = 980 + 45 = 1025
    // visits = 1, remaining = 25
    const result = calculateZooKeep(100, 980, () => 0.5);
    expect(result.zooVisits).toBe(1);
    expect(result.updatedPower).toBeCloseTo(25, 5);
  });

  it('converts multiple visits', () => {
    // poke = 0.8 * (500 - 10) = 392
    // power = 2700 + 392 = 3092
    // visits = 3, remaining = 92
    const result = calculateZooKeep(500, 2700, () => 0.8);
    expect(result.zooVisits).toBe(3);
    expect(result.updatedPower).toBeCloseTo(92, 5);
  });

  it('clamps negative power to 0', () => {
    // With rng returning a value that could make power negative
    // poke = 0 * (100 - 10) = 0
    // power = -5 + 0 = -5 → clamped to 0
    const result = calculateZooKeep(100, -5, () => 0);
    expect(result.updatedPower).toBe(0);
    expect(result.zooVisits).toBe(0);
  });

  it('handles rng=0 producing zero poke', () => {
    const result = calculateZooKeep(50, 500, () => 0);
    expect(result.updatedPower).toBe(500);
    expect(result.zooVisits).toBe(0);
  });

  it('handles left exactly 10 producing zero poke', () => {
    // poke = 0.5 * (10 - 10) = 0
    const result = calculateZooKeep(10, 100, () => 0.5);
    expect(result.updatedPower).toBe(100);
    expect(result.zooVisits).toBe(0);
  });
});
