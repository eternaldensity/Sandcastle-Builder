/**
 * Tests for Flux Crystals, QQ, and Vacuum System
 */

import { describe, it, expect } from 'vitest';
import {
  VACUUM_COST_MULTIPLIER,
  processVacuumTick,
  calculateBlackHoleMultiplier,
  calculateThisSucksIncreaseCost,
  calculateThisSucksDecreaseCost,
  shouldUnlockBlackhat,
  calculateFluxSurgeGeneration,
  calculateRiftFluxGeneration,
  calculateExplorerFluxGeneration,
  calculateFluxHarvest,
  calculate3DLensFlux,
  calculateLogicatQQ,
  calculateVoidStareMultiplier,
  calculateTesseractMultiplier,
  calculateMarioQQ,
  calculateMarioUpgradeCost,
  type VacuumTickState,
} from './flux-system.js';

function makeVacuumState(overrides: Partial<VacuumTickState> = {}): VacuumTickState {
  return {
    vacuumCleanerEnabled: true,
    sandIsInfinite: true,
    thisSucksLevel: 1,
    fluxCrystals: 1000,
    fluxCrystalsInfinite: false,
    qq: 1000,
    qqInfinite: false,
    papalDyson: 1,
    hasBlackHole: false,
    blackhatPower: 0,
    isLongpix: false,
    hasOvertime: false,
    hasTractorBeam: false,
    goatsLevel: 0,
    ...overrides,
  };
}

describe('Flux System', () => {
  describe('VACUUM_COST_MULTIPLIER', () => {
    it('should cost 10 flux crystals and 10 QQ per vacuum unit', () => {
      expect(VACUUM_COST_MULTIPLIER.fluxCrystals).toBe(10);
      expect(VACUUM_COST_MULTIPLIER.qq).toBe(10);
    });
  });

  describe('calculateBlackHoleMultiplier', () => {
    it('should return 2 without blackhat', () => {
      expect(calculateBlackHoleMultiplier(0)).toBe(2);
    });

    it('should return 2 for negative blackhat power', () => {
      expect(calculateBlackHoleMultiplier(-1)).toBe(2);
    });

    it('should use exponential formula with blackhat', () => {
      // floor(2 + 1.03^(2.8^1)) = floor(2 + 1.03^2.8) = floor(2 + 1.0867...) = 3
      expect(calculateBlackHoleMultiplier(1)).toBe(3);
    });

    it('should scale rapidly at higher blackhat levels', () => {
      const mult2 = calculateBlackHoleMultiplier(2);
      const mult4 = calculateBlackHoleMultiplier(4);
      // 2.8^2=7.84, 1.03^7.84≈1.26 → floor(3.26)=3
      expect(mult2).toBe(3);
      // 2.8^4=61.47, 1.03^61.47≈6.15 → floor(8.15)=8
      expect(mult4).toBeGreaterThan(mult2);
    });
  });

  describe('processVacuumTick', () => {
    it('should return no result when vacuum cleaner is disabled', () => {
      const state = makeVacuumState({ vacuumCleanerEnabled: false });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
      expect(result.vacuumGenerated).toBe(0);
    });

    it('should return no result when sand is not infinite', () => {
      const state = makeVacuumState({ sandIsInfinite: false });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
    });

    it('should return no result when insufficient flux crystals', () => {
      const state = makeVacuumState({ fluxCrystals: 5 });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
    });

    it('should return no result when insufficient QQ', () => {
      const state = makeVacuumState({ qq: 5 });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
    });

    it('should generate vacuum and spend resources proportional to vacs', () => {
      const state = makeVacuumState({ thisSucksLevel: 5, fluxCrystals: 100, qq: 100 });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(true);
      expect(result.vacuumGenerated).toBe(5);
      expect(result.fluxCrystalsSpent).toBe(50); // 10 * 5
      expect(result.qqSpent).toBe(50); // 10 * 5
    });

    it('should use 1 as base rate when This Sucks is 0', () => {
      const state = makeVacuumState({ thisSucksLevel: 0 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(1);
      expect(result.fluxCrystalsSpent).toBe(10);
      expect(result.qqSpent).toBe(10);
    });

    it('should cap vacs by available flux crystals', () => {
      // TS=10 wants 10 vacs, but only 50 FC = 5 units affordable
      const state = makeVacuumState({ thisSucksLevel: 10, fluxCrystals: 50, qq: 1000 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(5);
      expect(result.fluxCrystalsSpent).toBe(50);
      expect(result.qqSpent).toBe(50);
    });

    it('should cap vacs by available QQ', () => {
      const state = makeVacuumState({ thisSucksLevel: 10, fluxCrystals: 1000, qq: 30 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(3);
      expect(result.fluxCrystalsSpent).toBe(30);
      expect(result.qqSpent).toBe(30);
    });

    it('should apply Papal Dyson multiplier', () => {
      const state = makeVacuumState({ thisSucksLevel: 3, papalDyson: 4 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(12); // 3 * 4
      expect(result.fluxCrystalsSpent).toBe(120); // 10 * 12
    });

    it('should apply Black Hole 2x multiplier (no blackhat)', () => {
      const state = makeVacuumState({ thisSucksLevel: 5, hasBlackHole: true });
      const result = processVacuumTick(state);
      // 5 vacs generated, costs 50 FC + 50 QQ, then *2 = 10 vacuum output
      expect(result.vacuumGenerated).toBe(10);
      expect(result.fluxCrystalsSpent).toBe(50); // cost based on pre-BH vacs
    });

    it('should apply Black Hole with blackhat scaling', () => {
      const state = makeVacuumState({
        thisSucksLevel: 5,
        hasBlackHole: true,
        blackhatPower: 1,
      });
      const result = processVacuumTick(state);
      const mult = calculateBlackHoleMultiplier(1); // 3
      expect(result.vacuumGenerated).toBe(5 * mult);
    });

    it('should run twice with Overtime on longpix', () => {
      const state = makeVacuumState({
        thisSucksLevel: 3,
        hasOvertime: true,
        isLongpix: true,
      });
      const result = processVacuumTick(state);
      // 2 iterations, each producing 3 vacs
      expect(result.vacuumGenerated).toBe(6);
      expect(result.fluxCrystalsSpent).toBe(60); // 30 * 2
    });

    it('should not double with Overtime on shortpix', () => {
      const state = makeVacuumState({
        thisSucksLevel: 3,
        hasOvertime: true,
        isLongpix: false,
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(3);
    });

    it('should not double with Overtime when Tractor Beam is enabled', () => {
      const state = makeVacuumState({
        thisSucksLevel: 3,
        hasOvertime: true,
        isLongpix: true,
        hasTractorBeam: true,
        goatsLevel: 100,
      });
      const result = processVacuumTick(state);
      // Tractor Beam prevents Overtime doubling, so only 1 iteration
      expect(result.goatsGenerated).toBe(100);
      expect(result.vacuumGenerated).toBe(0);
    });

    it('should generate goats instead of vacuum with Tractor Beam', () => {
      const state = makeVacuumState({
        thisSucksLevel: 5,
        hasTractorBeam: true,
        goatsLevel: 200,
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(0);
      expect(result.goatsGenerated).toBe(200); // doubles current goat level
    });

    it('should use safety cap with blackhat power > 8', () => {
      // blackhat>8: cap QQ usage to QQ/10M instead of QQ/10
      const state = makeVacuumState({
        thisSucksLevel: 100,
        blackhatPower: 9,
        fluxCrystals: 100000,
        qq: 50000000, // 50M → capped to 50M/10M = 5 vacs
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(5);
      expect(result.qqSpent).toBe(50); // 10 * 5
    });

    it('should signal Black Hole unlock when FC is infinite', () => {
      const state = makeVacuumState({
        fluxCrystalsInfinite: true,
        fluxCrystals: Infinity,
        qq: Infinity,
        qqInfinite: true,
      });
      const result = processVacuumTick(state);
      expect(result.shouldUnlockBlackHole).toBe(true);
    });

    it('should stack Black Hole and Overtime', () => {
      const state = makeVacuumState({
        thisSucksLevel: 5,
        papalDyson: 2,
        hasBlackHole: true,
        blackhatPower: 0,
        hasOvertime: true,
        isLongpix: true,
      });
      const result = processVacuumTick(state);
      // 2 iterations, each: base=floor(5*2)=10, *BH(2)=20 vacs
      // Total: 40 vacuum, cost: 10*10*2=200 FC+QQ
      expect(result.vacuumGenerated).toBe(40);
      expect(result.fluxCrystalsSpent).toBe(200);
    });

    it('should handle second iteration with reduced resources', () => {
      // Only enough resources for 1.5 iterations worth
      const state = makeVacuumState({
        thisSucksLevel: 5,
        hasOvertime: true,
        isLongpix: true,
        fluxCrystals: 70, // enough for 7 vacs total
        qq: 1000,
      });
      const result = processVacuumTick(state);
      // First iteration: 5 vacs, costs 50 FC (20 remaining)
      // Second iteration: capped to 2 vacs (20 FC / 10), costs 20 FC
      expect(result.vacuumGenerated).toBe(7);
      expect(result.fluxCrystalsSpent).toBe(70);
    });
  });

  describe('calculateThisSucksIncreaseCost', () => {
    it('should calculate vacuum cost as |2000 - n| * n', () => {
      const cost = calculateThisSucksIncreaseCost(10, 0);
      expect(cost.vacuum).toBe(1990 * 10);
    });

    it('should have cheapest vacuum cost at n=2000', () => {
      const cost2000 = calculateThisSucksIncreaseCost(2000, 0);
      expect(cost2000.vacuum).toBe(0);
    });

    it('should calculate blackprint cost scaling with vacuum level', () => {
      const cost = calculateThisSucksIncreaseCost(10, 0);
      expect(cost.blackprints).toBe(10000); // 10 * 1000 * 1.01^0

      const costWithVacuum = calculateThisSucksIncreaseCost(10, 100);
      expect(costWithVacuum.blackprints).toBe(Math.floor(10 * 1000 * Math.pow(1.01, 1)));
    });

    it('should have zero cost at level 0', () => {
      const cost = calculateThisSucksIncreaseCost(0, 0);
      expect(cost.vacuum).toBe(0);
      expect(cost.blackprints).toBe(0);
    });
  });

  describe('calculateThisSucksDecreaseCost', () => {
    it('should cost 1000 * current level in QQ', () => {
      expect(calculateThisSucksDecreaseCost(5)).toBe(5000);
      expect(calculateThisSucksDecreaseCost(100)).toBe(100000);
    });
  });

  describe('shouldUnlockBlackhat', () => {
    it('should unlock at level 4444', () => {
      expect(shouldUnlockBlackhat(4443)).toBe(false);
      expect(shouldUnlockBlackhat(4444)).toBe(true);
      expect(shouldUnlockBlackhat(5000)).toBe(true);
    });
  });

  describe('calculateFluxSurgeGeneration', () => {
    it('should generate 1 without TDE', () => {
      expect(calculateFluxSurgeGeneration(false)).toBe(1);
    });

    it('should generate 2 with TDE', () => {
      expect(calculateFluxSurgeGeneration(true)).toBe(2);
    });
  });

  describe('calculateRiftFluxGeneration', () => {
    it('should generate based on Time Lord bought vs level', () => {
      expect(calculateRiftFluxGeneration(10, 5, false, 0.5)).toBe(3);
    });

    it('should double with TDE', () => {
      expect(calculateRiftFluxGeneration(10, 5, true, 0.5)).toBe(6);
    });

    it('should return 0 with random=0', () => {
      expect(calculateRiftFluxGeneration(10, 5, false, 0)).toBe(0);
    });
  });

  describe('calculateExplorerFluxGeneration', () => {
    it('should generate based on AC level / 1000', () => {
      expect(calculateExplorerFluxGeneration(3000, false, 1)).toBe(3);
      expect(calculateExplorerFluxGeneration(3500, false, 1)).toBe(3);
    });

    it('should multiply by times', () => {
      expect(calculateExplorerFluxGeneration(2000, false, 5)).toBe(10);
    });

    it('should double with TDE', () => {
      expect(calculateExplorerFluxGeneration(1000, true, 1)).toBe(2);
    });

    it('should return 0 for AC < 1000', () => {
      expect(calculateExplorerFluxGeneration(999, false, 1)).toBe(0);
    });
  });

  describe('calculateFluxHarvest', () => {
    it('should use mathematical approximation for Time Lord >= 100', () => {
      const result = calculateFluxHarvest(100, 50, false, 10, false, 0);
      expect(result).toBe(250);
    });

    it('should apply Bonemeal multiplier', () => {
      const result = calculateFluxHarvest(100, 50, false, 10, true, 50);
      expect(result).toBe(375);
    });

    it('should double with TDE for Time Lord >= 100', () => {
      const result = calculateFluxHarvest(100, 50, true, 10, false, 0);
      expect(result).toBe(500);
    });
  });

  describe('calculate3DLensFlux', () => {
    it('should return 0 below NP 3095', () => {
      expect(calculate3DLensFlux(3094, true, true, false)).toBe(0);
    });

    it('should return 0 without 3D Lens', () => {
      expect(calculate3DLensFlux(3095, false, true, false)).toBe(0);
    });

    it('should return 0 without Infinity Goats', () => {
      expect(calculate3DLensFlux(3095, true, false, false)).toBe(0);
    });

    it('should return 1 without Retroreflector', () => {
      expect(calculate3DLensFlux(3095, true, true, false)).toBe(1);
    });

    it('should return 2 with Retroreflector', () => {
      expect(calculate3DLensFlux(3095, true, true, true)).toBe(2);
    });
  });

  describe('calculateLogicatQQ', () => {
    it('should return 0 when rewards <= 5', () => {
      expect(calculateLogicatQQ(5, 1)).toBe(0);
      expect(calculateLogicatQQ(3, 1)).toBe(0);
    });

    it('should generate QQ from excess rewards', () => {
      expect(calculateLogicatQQ(8, 1)).toBe(3);
    });

    it('should apply Papal QQs multiplier', () => {
      expect(calculateLogicatQQ(10, 2)).toBe(10);
    });

    it('should floor the result', () => {
      expect(calculateLogicatQQ(7, 1.5)).toBe(3);
    });
  });

  describe('calculateVoidStareMultiplier', () => {
    it('should return 1 for 0 vacuum', () => {
      expect(calculateVoidStareMultiplier(0)).toBe(1);
    });

    it('should return 1.01 for 100 vacuum', () => {
      expect(calculateVoidStareMultiplier(100)).toBeCloseTo(1.01, 5);
    });

    it('should scale exponentially', () => {
      const mult1000 = calculateVoidStareMultiplier(1000);
      expect(mult1000).toBeCloseTo(Math.pow(1.01, 10), 5);
    });
  });

  describe('calculateTesseractMultiplier', () => {
    it('should return 0 for power < 3', () => {
      expect(calculateTesseractMultiplier(0)).toBe(0);
      expect(calculateTesseractMultiplier(2)).toBe(0);
    });

    it('should calculate correctly at power 4', () => {
      // (2^0 * 4 * 3 * 2) / 3 = 24/3 = 8
      expect(calculateTesseractMultiplier(4)).toBe(8);
    });

    it('should calculate correctly at power 5', () => {
      // (2^1 * 5 * 4 * 3) / 3 = 2 * 60 / 3 = 40
      expect(calculateTesseractMultiplier(5)).toBe(40);
    });

    it('should use absolute value of power', () => {
      expect(calculateTesseractMultiplier(-4)).toBe(calculateTesseractMultiplier(4));
    });
  });

  describe('calculateMarioQQ', () => {
    it('should use triangular number formula', () => {
      expect(calculateMarioQQ(1)).toBe(1);
      expect(calculateMarioQQ(3)).toBe(6);
      expect(calculateMarioQQ(10)).toBe(55);
    });
  });

  describe('calculateMarioUpgradeCost', () => {
    it('should calculate vacuum and QQ costs', () => {
      const cost = calculateMarioUpgradeCost(5, 1);
      expect(cost.vacuum).toBe(1000);
      expect(cost.qq).toBe(250000); // 50000 * 5 * 1
    });

    it('should scale with upgrade amount', () => {
      const cost = calculateMarioUpgradeCost(5, 3);
      expect(cost.vacuum).toBe(3000);
      expect(cost.qq).toBe(750000);
    });
  });
});
