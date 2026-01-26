import { describe, it, expect } from 'vitest';
import {
  calculateBucketRate,
  calculateCueganRate,
  calculateFlagRate,
  calculateLadderRate,
  calculateBagRate,
  calculateLaPetiteRate,
  calculateGlobalSandMultiplier,
  calculateGlassCeilingMult,
  calculateBBCMult,
  calculateAllSandToolRates,
  calculateTotalSandRate,
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

  it('multiplies by 4 with Carrybot', () => {
    expect(calculateBucketRate({ ...baseState, carrybot: true })).toBe(0.4);
  });

  it('doubles with Buccaneer', () => {
    expect(calculateBucketRate({ ...baseState, buccaneer: true })).toBe(0.2);
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

  it('applies Trebuchet Pong multiplier', () => {
    const rate = calculateBucketRate({
      ...baseState,
      trebuchetPong: true,
      trebuchets: 10,
    });
    // floor(10/2) = 5, 1.5^5 = 7.59375
    expect(rate).toBeCloseTo(0.1 * Math.pow(1.5, 5), 5);
  });

  it('caps Trebuchet Pong at 2000', () => {
    const rate = calculateBucketRate({
      ...baseState,
      trebuchetPong: true,
      trebuchets: 5000,
    });
    expect(rate).toBe(0.1 * Math.pow(1.5, 2000));
  });

  it('applies Flying Buckets multiplier', () => {
    const rate = calculateBucketRate({
      ...baseState,
      flyingBuckets: true,
      trebuchets: 10,
    });
    expect(rate).toBe(0.1 * 10);
  });

  it('combines base rate increase with multipliers', () => {
    const rate = calculateBucketRate({
      ...baseState,
      biggerBucketsPower: 3,  // baseRate = 0.4
      hugeBuckets: true,      // 2x
      carrybot: true,         // 4x
    });
    expect(rate).toBe(0.4 * 2 * 4);
  });
});

describe('calculateCueganRate', () => {
  it('returns 0.6 base rate', () => {
    expect(calculateCueganRate(baseState)).toBe(0.6);
  });

  it('adds 0.2 per Helping Hand power', () => {
    expect(calculateCueganRate({ ...baseState, helpingHandPower: 5 })).toBe(1.6);
  });

  it('doubles with Megball', () => {
    expect(calculateCueganRate({ ...baseState, megball: true })).toBe(1.2);
  });

  it('multiplies by 4 with Stickbot', () => {
    expect(calculateCueganRate({ ...baseState, stickbot: true })).toBe(2.4);
  });

  it('multiplies by 40 with The Forty', () => {
    expect(calculateCueganRate({ ...baseState, theForty: true })).toBe(24);
  });

  it('applies Cooperation multiplier', () => {
    const rate = calculateCueganRate({
      ...baseState,
      cooperation: true,
      buckets: 20,
    });
    // floor(20/2) = 10, 1.05^10 ≈ 1.62889
    expect(rate).toBeCloseTo(0.6 * Math.pow(1.05, 10), 5);
  });

  it('caps Cooperation at 8000', () => {
    const rate = calculateCueganRate({
      ...baseState,
      cooperation: true,
      buckets: 20000,
    });
    expect(rate).toBe(0.6 * Math.pow(1.05, 8000));
  });

  it('applies Human Cannonball multiplier', () => {
    const rate = calculateCueganRate({
      ...baseState,
      humanCannonball: true,
      trebuchets: 5,
    });
    expect(rate).toBe(0.6 * 2 * 5);
  });
});

describe('calculateFlagRate', () => {
  it('returns 8 base rate', () => {
    expect(calculateFlagRate(baseState)).toBe(8);
  });

  it('adds 2 per Flag Bearer power', () => {
    expect(calculateFlagRate({ ...baseState, flagBearerPower: 5 })).toBe(18);
  });

  it('multiplies by 2.5 with Magic Mountain', () => {
    expect(calculateFlagRate({ ...baseState, magicMountain: true })).toBe(20);
  });

  it('multiplies by 4 with Standardbot', () => {
    expect(calculateFlagRate({ ...baseState, standardbot: true })).toBe(32);
  });

  it('applies Balancing Act multiplier', () => {
    const rate = calculateFlagRate({
      ...baseState,
      balancingAct: true,
      scaffolds: 100,
    });
    expect(rate).toBeCloseTo(8 * Math.pow(1.05, 100), 5);
  });

  it('caps Balancing Act at 2000', () => {
    const rate = calculateFlagRate({
      ...baseState,
      balancingAct: true,
      scaffolds: 3000,
    });
    expect(rate).toBe(8 * Math.pow(1.05, 2000));
  });

  it('applies Fly the Flag multiplier', () => {
    const rate = calculateFlagRate({
      ...baseState,
      flyTheFlag: true,
      trebuchets: 3,
    });
    expect(rate).toBe(8 * 10 * 3);
  });
});

describe('calculateLadderRate', () => {
  it('returns 54 base rate', () => {
    expect(calculateLadderRate(baseState)).toBe(54);
  });

  it('adds 18 per Extension Ladder power', () => {
    expect(calculateLadderRate({ ...baseState, extensionLadderPower: 5 })).toBe(144);
  });

  it('applies Ninja Climber multiplier', () => {
    const rate = calculateLadderRate({
      ...baseState,
      ninjaClimber: true,
      ninjaStealth: 10,
    });
    expect(rate).toBe(54 * 10);
  });

  it('doubles with Level Up', () => {
    expect(calculateLadderRate({ ...baseState, levelUp: true })).toBe(108);
  });

  it('multiplies by 4 with Climbbot', () => {
    expect(calculateLadderRate({ ...baseState, climbbot: true })).toBe(216);
  });

  it('applies Broken Rung multiplier', () => {
    const rate = calculateLadderRate({
      ...baseState,
      brokenRung: true,
      buckets: 10,
      cuegans: 15,
      flags: 8,
      ladders: 12,
      bags: 20,
      laPetite: 5,
    });
    // min = 5
    expect(rate).toBe(54 * 5);
  });

  it('applies Up Up and Away multiplier', () => {
    const rate = calculateLadderRate({
      ...baseState,
      upUpAndAway: true,
      trebuchets: 3,
    });
    expect(rate).toBe(54 * 10 * 3);
  });
});

describe('calculateBagRate', () => {
  it('returns 600 base rate', () => {
    expect(calculateBagRate(baseState)).toBe(600);
  });

  it('applies Embaggening multiplier', () => {
    const rate = calculateBagRate({
      ...baseState,
      embaggening: true,
      cuegans: 20,
    });
    // 20 - 14 = 6, 1.02^6 ≈ 1.12616
    expect(rate).toBeCloseTo(600 * Math.pow(1.02, 6), 5);
  });

  it('Embaggening requires >14 cuegans', () => {
    const rate = calculateBagRate({
      ...baseState,
      embaggening: true,
      cuegans: 10,
    });
    expect(rate).toBe(600); // No bonus
  });

  it('caps Embaggening at 8000', () => {
    const rate = calculateBagRate({
      ...baseState,
      embaggening: true,
      cuegans: 10000,
    });
    expect(rate).toBe(600 * Math.pow(1.02, 8000));
  });

  it('applies Sandbag multiplier', () => {
    const rate = calculateBagRate({
      ...baseState,
      sandbag: true,
      rivers: 100,
    });
    expect(rate).toBeCloseTo(600 * Math.pow(1.05, 100), 5);
  });

  it('caps Sandbag at 2000', () => {
    const rate = calculateBagRate({
      ...baseState,
      sandbag: true,
      rivers: 3000,
    });
    expect(rate).toBe(600 * Math.pow(1.05, 2000));
  });

  it('multiplies by 4 with Luggagebot', () => {
    expect(calculateBagRate({ ...baseState, luggagebot: true })).toBe(2400);
  });

  it('doubles with Bag Puns', () => {
    expect(calculateBagRate({ ...baseState, bagPuns: true })).toBe(1200);
  });

  it('multiplies by 5 with Air Drop', () => {
    expect(calculateBagRate({ ...baseState, airDrop: true })).toBe(3000);
  });
});

describe('calculateLaPetiteRate', () => {
  it('returns 2e137 base rate', () => {
    expect(calculateLaPetiteRate(baseState)).toBe(2e137);
  });

  it('multiplies by 1e42 with Frenchbot', () => {
    expect(calculateLaPetiteRate({ ...baseState, frenchbot: true })).toBe(2e137 * 1e42);
  });

  it('applies Bacon multiplier', () => {
    const rate = calculateLaPetiteRate({
      ...baseState,
      bacon: true,
      newPixBots: 10,
    });
    expect(rate).toBe(2e137 * Math.pow(1.03, 10));
  });
});

describe('calculateGlassCeilingMult', () => {
  it('returns 1 with no ceilings', () => {
    expect(calculateGlassCeilingMult([], 0, 0)).toBe(1);
  });

  it('returns 33 for one ceiling', () => {
    expect(calculateGlassCeilingMult([0], 0, 0)).toBe(33);
  });

  it('returns 33^n for n ceilings', () => {
    expect(calculateGlassCeilingMult([0, 2], 0, 0)).toBe(33 * 33);
    expect(calculateGlassCeilingMult([0, 2, 4], 0, 0)).toBe(33 * 33 * 33);
  });

  it('applies WWB multiplier', () => {
    const mult = calculateGlassCeilingMult([0], 1, 10);
    // acPower = 33 * 2^(1-5) * 10 = 33 * 0.0625 * 10 = 20.625
    expect(mult).toBeCloseTo(20.625, 5);
  });

  it('scales with WWB bought count', () => {
    const mult = calculateGlassCeilingMult([0], 6, 10);
    // acPower = 33 * 2^(6-5) * 10 = 33 * 2 * 10 = 660
    expect(mult).toBe(660);
  });
});

describe('calculateBBCMult', () => {
  it('returns 1 with no power', () => {
    expect(calculateBBCMult(0, 0)).toBe(1);
  });

  it('returns 20 with power and no RB', () => {
    expect(calculateBBCMult(1, 0)).toBe(20);
  });

  it('scales with RB bought', () => {
    expect(calculateBBCMult(1, 1)).toBe(20 * 200);
    expect(calculateBBCMult(1, 2)).toBe(20 * Math.pow(200, 2));
  });
});

describe('calculateGlobalSandMultiplier', () => {
  it('returns 1 with no boosts', () => {
    expect(calculateGlobalSandMultiplier(baseState)).toBe(1);
  });

  it('adds 1% per badge with Molpies', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      molpies: true,
      badgesOwned: 100,
    });
    expect(mult).toBe(2); // 1 + 0.01 * 100
  });

  it('adds 2% per badge with Grapevine', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      grapevine: true,
      badgesOwned: 50,
    });
    expect(mult).toBe(2); // 1 + 0.02 * 50
  });

  it('adds 5% per badge with Chirpies', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      chirpies: true,
      badgesOwned: 20,
    });
    expect(mult).toBe(2); // 1 + 0.05 * 20
  });

  it('adds 10% per badge with Facebugs', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      facebugs: true,
      badgesOwned: 10,
    });
    expect(mult).toBe(2); // 1 + 0.1 * 10
  });

  it('stacks badge multipliers additively', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      molpies: true,
      grapevine: true,
      badgesOwned: 100,
    });
    // 1 + 0.01*100 + 0.02*100 = 1 + 1 + 2 = 4
    expect(mult).toBe(4);
  });

  it('adds Overcompensating in longpix', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      overcompensating: true,
      overcompensatingPower: 5,
      npLength: 2000,
    });
    expect(mult).toBe(6); // 1 + 5
  });

  it('ignores Overcompensating in shortpix', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      overcompensating: true,
      overcompensatingPower: 5,
      npLength: 1500,
    });
    expect(mult).toBe(1);
  });

  it('applies Blitzing multiplier', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      blitzing: true,
      blitzingPower: 200,
    });
    expect(mult).toBe(2); // 1 * 200/100
  });

  it('applies BBC multiplier', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      bbc: true,
      bbcPower: 1,
      rbBought: 1,
    });
    expect(mult).toBe(20 * 200); // 1 * BBC
  });

  it('applies glass usage penalty', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      glassUse: 50,
    });
    expect(mult).toBe(0.5); // 1 * (100-50)/100
  });

  it('applies Hugo multiplier', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      hugo: true,
    });
    expect(mult).toBe(1.1);
  });

  it('combines additive and multiplicative boosts correctly', () => {
    const mult = calculateGlobalSandMultiplier({
      ...baseState,
      molpies: true,
      badgesOwned: 100,  // +1 (additive)
      hugo: true,        // *1.1 (multiplicative)
      blitzing: true,
      blitzingPower: 200, // *2 (multiplicative)
    });
    // (1 + 1) * 1.1 * 2 = 4.4
    expect(mult).toBe(4.4);
  });
});

describe('calculateAllSandToolRates', () => {
  it('calculates all tool rates', () => {
    const rates = calculateAllSandToolRates(baseState);
    expect(rates.Bucket).toBe(0.1);
    expect(rates.Cuegan).toBe(0.6);
    expect(rates.Flag).toBe(8);
    expect(rates.Ladder).toBe(54);
    expect(rates.Bag).toBe(600);
    expect(rates.LaPetite).toBe(2e137);
  });

  it('applies per-tool boosts', () => {
    const rates = calculateAllSandToolRates({
      ...baseState,
      biggerBucketsPower: 1,
      helpingHandPower: 1,
      hugeBuckets: true,
      megball: true,
    });
    expect(rates.Bucket).toBe(0.2 * 2); // (0.1 + 0.1) * 2
    expect(rates.Cuegan).toBe(0.8 * 2); // (0.6 + 0.2) * 2
  });
});

describe('calculateTotalSandRate', () => {
  it('returns 0 with no tools', () => {
    expect(calculateTotalSandRate(baseState)).toBe(0);
  });

  it('calculates rate for single tool', () => {
    const rate = calculateTotalSandRate({
      ...baseState,
      buckets: 10,
    });
    expect(rate).toBe(10 * 0.1); // 10 buckets * 0.1 rate
  });

  it('sums rates for multiple tools', () => {
    const rate = calculateTotalSandRate({
      ...baseState,
      buckets: 10,
      cuegans: 5,
    });
    expect(rate).toBe(10 * 0.1 + 5 * 0.6); // 1 + 3 = 4
  });

  it('applies global multiplier', () => {
    const rate = calculateTotalSandRate({
      ...baseState,
      buckets: 10,
      hugo: true,
    });
    expect(rate).toBe(10 * 0.1 * 1.1); // 1.1
  });

  it('combines per-tool and global multipliers', () => {
    const rate = calculateTotalSandRate({
      ...baseState,
      buckets: 10,
      hugeBuckets: true,  // 2x per-tool
      hugo: true,         // 1.1x global
    });
    expect(rate).toBe(10 * 0.1 * 2 * 1.1); // 2.2
  });
});
