import { describe, it, expect } from 'vitest';
import {
  calculateChipRatePermNP,
  calculateChipsPerClick,
  calculateManualLoad,
  calculatePCControlCost,
  canControlPC,
  calculatePapal,
  PC_MAX_POWER,
  PC_NOPE_THRESHOLD,
  type ChipRateState,
  type ChipClickState,
  type ManualLoadState,
  type PCControlState,
} from './chip-generation.js';

function makeChipRateState(overrides?: Partial<ChipRateState>): ChipRateState {
  return {
    sandToGlassBought: true,
    sandIsInfinite: true,
    sandToolChipRates: [
      { amount: 100, gpmNP: 10, hasInfinitePrice: true },
      { amount: 50, gpmNP: 20, hasInfinitePrice: true },
    ],
    glBought: false,
    glPower: 0,
    cftBought: false,
    castlesGlobalMult: 1,
    ...overrides,
  };
}

function makeChipClickState(overrides?: Partial<ChipClickState>): ChipClickState {
  return {
    sandIsInfinite: true,
    bgBought: true,
    gmBought: false,
    boneClickerBought: false,
    bonemealLevel: 0,
    boostsOwned: 50,
    loadedPermNP: 10000,
    ...overrides,
  };
}

function makeManualLoadState(overrides?: Partial<ManualLoadState>): ManualLoadState {
  return {
    amount: 100,
    glassChipsAvailable: 500,
    tfBought: true,
    bucketAmount: 8000,
    newPixBotAmount: 2000,
    sandRateIsInfinite: true,
    castlesPowerIsInfinite: true,
    ...overrides,
  };
}

function makePCControlState(overrides?: Partial<PCControlState>): PCControlState {
  return {
    currentPower: 10,
    increment: 1,
    glassBlocksAvailable: 1e10,
    noSellPower: 0,
    nopeBadgeEarned: false,
    ...overrides,
  };
}

describe('calculateChipRatePermNP', () => {
  it('returns 0 when Sand to Glass not bought', () => {
    const state = makeChipRateState({ sandToGlassBought: false });
    const result = calculateChipRatePermNP(state);
    expect(result.rate).toBe(0);
  });

  it('returns 0 when Sand is not infinite', () => {
    const state = makeChipRateState({ sandIsInfinite: false });
    const result = calculateChipRatePermNP(state);
    expect(result.rate).toBe(0);
  });

  it('only counts tools with infinite prices', () => {
    const state = makeChipRateState({
      sandToolChipRates: [
        { amount: 100, gpmNP: 10, hasInfinitePrice: true },
        { amount: 50, gpmNP: 20, hasInfinitePrice: false },
      ],
    });
    const result = calculateChipRatePermNP(state);
    // Only first tool: 100 * 10 = 1000
    expect(result.rate).toBe(1000);
    expect(result.perToolRates[0]).toBe(1000);
    expect(result.perToolRates[1]).toBe(0);
  });

  it('calculates base rate as sum of tool.amount * tool.gpmNP for qualifying tools', () => {
    const state = makeChipRateState();
    const result = calculateChipRatePermNP(state);
    // 100*10 + 50*20 = 1000 + 1000 = 2000
    expect(result.rate).toBe(2000);
  });

  it('applies GL multiplier: rate *= GL.power / 100', () => {
    const state = makeChipRateState({
      glBought: true,
      glPower: 200,
    });
    const result = calculateChipRatePermNP(state);
    // 2000 * (200/100) = 4000
    expect(result.rate).toBe(4000);
    expect(result.globalMultiplier).toBe(2);
  });

  it('applies CFT multiplier: rate *= castlesGlobalMult', () => {
    const state = makeChipRateState({
      cftBought: true,
      castlesGlobalMult: 3,
    });
    const result = calculateChipRatePermNP(state);
    // 2000 * 3 = 6000
    expect(result.rate).toBe(6000);
    expect(result.globalMultiplier).toBe(3);
  });

  it('applies both GL and CFT multipliers together', () => {
    const state = makeChipRateState({
      glBought: true,
      glPower: 200,
      cftBought: true,
      castlesGlobalMult: 3,
    });
    const result = calculateChipRatePermNP(state);
    // 2000 * 2 * 3 = 12000
    expect(result.rate).toBe(12000);
    expect(result.globalMultiplier).toBe(6);
  });

  it('returns Infinity rate for infinite tool amount', () => {
    const state = makeChipRateState({
      sandToolChipRates: [
        { amount: Infinity, gpmNP: 10, hasInfinitePrice: true },
      ],
    });
    const result = calculateChipRatePermNP(state);
    expect(result.rate).toBe(Infinity);
  });

  it('earns badges when rate increases past thresholds', () => {
    const state = makeChipRateState({
      sandToolChipRates: [
        { amount: 1000, gpmNP: 100, hasInfinitePrice: true },
      ],
    });
    // rate = 100000, previousRate = 0
    const result = calculateChipRatePermNP(state, 0);
    expect(result.rate).toBe(100000);
    expect(result.badges).toContain('Plain Potato Chips');
    expect(result.badges).toContain('Crinkle Cut Chips');
    expect(result.badges).not.toContain('BBQ Chips'); // 800000 threshold
  });

  it('earns all 11 badges at very high rate', () => {
    const state = makeChipRateState({
      sandToolChipRates: [
        { amount: 1e15, gpmNP: 1e10, hasInfinitePrice: true },
      ],
    });
    const result = calculateChipRatePermNP(state, 0);
    expect(result.badges).toHaveLength(11);
    expect(result.badges).toContain('Blue Poker Chips');
  });

  it('does not earn badges when rate did not increase', () => {
    const state = makeChipRateState();
    // previousRate equals current rate
    const result = calculateChipRatePermNP(state, 2000);
    expect(result.badges).toHaveLength(0);
  });

  it('tool with amount=0 contributes 0', () => {
    const state = makeChipRateState({
      sandToolChipRates: [
        { amount: 0, gpmNP: 10, hasInfinitePrice: true },
        { amount: 50, gpmNP: 20, hasInfinitePrice: true },
      ],
    });
    const result = calculateChipRatePermNP(state);
    expect(result.rate).toBe(1000); // only second tool: 50*20
    expect(result.perToolRates[0]).toBe(0);
  });
});

describe('calculateChipsPerClick', () => {
  it('returns 0 when Sand is not infinite', () => {
    const state = makeChipClickState({ sandIsInfinite: false });
    expect(calculateChipsPerClick(state)).toBe(0);
  });

  it('returns 0 when BG not bought', () => {
    const state = makeChipClickState({ bgBought: false });
    expect(calculateChipsPerClick(state)).toBe(0);
  });

  it('base = boostsOwned * 4', () => {
    const state = makeChipClickState({ boostsOwned: 25 });
    expect(calculateChipsPerClick(state)).toBe(100);
  });

  it('GM adds loadedPermNP / 20', () => {
    const state = makeChipClickState({
      gmBought: true,
      boostsOwned: 25,
      loadedPermNP: 2000,
    });
    // 25*4 + 2000/20 = 100 + 100 = 200
    expect(calculateChipsPerClick(state)).toBe(200);
  });

  it('Bone Clicker multiplies by bonemealLevel * 5', () => {
    const state = makeChipClickState({
      boneClickerBought: true,
      bonemealLevel: 3,
      boostsOwned: 25,
    });
    // 25*4 * (3*5) = 100 * 15 = 1500
    expect(calculateChipsPerClick(state)).toBe(1500);
  });

  it('Bone Clicker requires bonemealLevel >= 1', () => {
    const state = makeChipClickState({
      boneClickerBought: true,
      bonemealLevel: 0,
      boostsOwned: 25,
    });
    // bonemealLevel < 1, so no multiplication
    expect(calculateChipsPerClick(state)).toBe(100);
  });

  it('all multipliers combined', () => {
    const state = makeChipClickState({
      gmBought: true,
      boneClickerBought: true,
      bonemealLevel: 2,
      boostsOwned: 10,
      loadedPermNP: 400,
    });
    // base = 10*4 = 40
    // + GM: 40 + 400/20 = 40 + 20 = 60
    // * Bone Clicker: 60 * (2*5) = 60 * 10 = 600
    expect(calculateChipsPerClick(state)).toBe(600);
  });
});

describe('calculateManualLoad', () => {
  it('loads requested amount when available', () => {
    const state = makeManualLoadState();
    const result = calculateManualLoad(state);
    expect(result.chipsLoaded).toBe(100);
  });

  it('returns 0 when GlassChips insufficient', () => {
    const state = makeManualLoadState({
      amount: 1000,
      glassChipsAvailable: 500,
    });
    const result = calculateManualLoad(state);
    expect(result.chipsLoaded).toBe(0);
    expect(result.unlocks).toHaveLength(0);
  });

  it('unlocks Sand to Glass when Bucket >= 7470 AND TF bought AND Sand rate infinite', () => {
    const state = makeManualLoadState({
      bucketAmount: 7470,
      tfBought: true,
      sandRateIsInfinite: true,
    });
    const result = calculateManualLoad(state);
    expect(result.unlocks).toContain('Sand to Glass');
  });

  it('unlocks Castles to Glass when NPB >= 1515 AND TF bought AND Castles power infinite', () => {
    const state = makeManualLoadState({
      newPixBotAmount: 1515,
      tfBought: true,
      castlesPowerIsInfinite: true,
    });
    const result = calculateManualLoad(state);
    expect(result.unlocks).toContain('Castles to Glass');
  });

  it('does not unlock Sand to Glass when Bucket < 7470', () => {
    const state = makeManualLoadState({
      bucketAmount: 7469,
    });
    const result = calculateManualLoad(state);
    expect(result.unlocks).not.toContain('Sand to Glass');
  });

  it('does not unlock Sand to Glass when TF not bought', () => {
    const state = makeManualLoadState({
      tfBought: false,
    });
    const result = calculateManualLoad(state);
    expect(result.unlocks).not.toContain('Sand to Glass');
  });

  it('does not unlock Sand to Glass when Sand rate not infinite', () => {
    const state = makeManualLoadState({
      sandRateIsInfinite: false,
    });
    const result = calculateManualLoad(state);
    expect(result.unlocks).not.toContain('Sand to Glass');
  });
});

describe('calculatePCControlCost', () => {
  it('increase cost = 1e6 * increment * currentPower', () => {
    const state = makePCControlState({ increment: 2, currentPower: 5 });
    expect(calculatePCControlCost(state)).toBe(1e6 * 2 * 5);
  });

  it('decrease cost = 1e5 * abs(increment) * currentPower', () => {
    const state = makePCControlState({ increment: -3, currentPower: 5 });
    expect(calculatePCControlCost(state)).toBe(1e5 * 3 * 5);
  });
});

describe('canControlPC', () => {
  it('can increase when has enough Glass Blocks and no Nope badge', () => {
    const state = makePCControlState({
      increment: 1,
      currentPower: 10,
      glassBlocksAvailable: 1e10,
      nopeBadgeEarned: false,
    });
    expect(canControlPC(state)).toBe(true);
  });

  it('cannot increase when Nope badge earned', () => {
    const state = makePCControlState({
      increment: 1,
      nopeBadgeEarned: true,
    });
    expect(canControlPC(state)).toBe(false);
  });

  it('cannot decrease when No Sell power is set', () => {
    const state = makePCControlState({
      increment: -1,
      noSellPower: 1,
    });
    expect(canControlPC(state)).toBe(false);
  });

  it('cannot control when insufficient Glass Blocks', () => {
    const state = makePCControlState({
      increment: 1,
      currentPower: 10,
      glassBlocksAvailable: 0,
    });
    expect(canControlPC(state)).toBe(false);
  });

  it('PC max power constant is 6e51', () => {
    expect(PC_MAX_POWER).toBe(6e51);
  });

  it('Nope threshold is 5e51', () => {
    expect(PC_NOPE_THRESHOLD).toBe(5e51);
  });
});

describe('calculatePapal', () => {
  it('returns 1 when decree name != target', () => {
    expect(calculatePapal('Water', 'Sand', 2, 1.5)).toBe(1);
  });

  it('returns decreeValue * papalBoostFactor when decree matches and value > 1', () => {
    expect(calculatePapal('Sand', 'Sand', 3, 2)).toBe(6);
  });

  it('returns decreeValue / papalBoostFactor when decree matches and value <= 1', () => {
    expect(calculatePapal('Sand', 'Sand', 0.5, 2)).toBe(0.25);
  });

  it('returns decreeValue / papalBoostFactor when decree matches and value == 1', () => {
    expect(calculatePapal('Sand', 'Sand', 1, 4)).toBe(0.25);
  });
});
