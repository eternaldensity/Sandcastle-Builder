/**
 * Tests for Flux Crystals, QQ, and Vacuum System
 */

import { describe, it, expect } from 'vitest';
import {
  VACUUM_COST_PER_TICK,
  processVacuumTick,
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
  type VacuumTickState,
} from './flux-system.js';

function makeVacuumState(overrides: Partial<VacuumTickState> = {}): VacuumTickState {
  return {
    vacuumCleanerEnabled: true,
    thisSucksLevel: 1,
    fluxCrystals: 100,
    qq: 100,
    papalDyson: 1,
    hasBlackHole: false,
    blackHoleMultiplier: 2,
    isLongpix: false,
    hasOvertime: false,
    blackhatPower: 0,
    ...overrides,
  };
}

describe('Flux System', () => {
  describe('VACUUM_COST_PER_TICK', () => {
    it('should cost 10 flux crystals and 10 QQ per tick', () => {
      expect(VACUUM_COST_PER_TICK.fluxCrystals).toBe(10);
      expect(VACUUM_COST_PER_TICK.qq).toBe(10);
    });
  });

  describe('processVacuumTick', () => {
    it('should return no result when vacuum cleaner is disabled', () => {
      const state = makeVacuumState({ vacuumCleanerEnabled: false });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
      expect(result.vacuumGenerated).toBe(0);
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

    it('should generate vacuum based on This Sucks level', () => {
      const state = makeVacuumState({ thisSucksLevel: 5 });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(true);
      expect(result.vacuumGenerated).toBe(5);
      expect(result.fluxCrystalsSpent).toBe(10);
      expect(result.qqSpent).toBe(10);
    });

    it('should use 1 as base rate when This Sucks is 0', () => {
      const state = makeVacuumState({ thisSucksLevel: 0 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(1);
    });

    it('should apply Papal Dyson multiplier', () => {
      const state = makeVacuumState({ thisSucksLevel: 3, papalDyson: 4 });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(12); // 3 * 4
    });

    it('should apply Black Hole multiplier', () => {
      const state = makeVacuumState({
        thisSucksLevel: 5,
        hasBlackHole: true,
        blackHoleMultiplier: 2,
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(10); // 5 * 2
    });

    it('should apply Overtime doubling on longpix', () => {
      const state = makeVacuumState({
        thisSucksLevel: 3,
        hasOvertime: true,
        isLongpix: true,
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(6); // 3 * 2
    });

    it('should not apply Overtime on shortpix', () => {
      const state = makeVacuumState({
        thisSucksLevel: 3,
        hasOvertime: true,
        isLongpix: false,
      });
      const result = processVacuumTick(state);
      expect(result.vacuumGenerated).toBe(3);
    });

    it('should stack Black Hole and Overtime', () => {
      const state = makeVacuumState({
        thisSucksLevel: 5,
        papalDyson: 2,
        hasBlackHole: true,
        blackHoleMultiplier: 3,
        hasOvertime: true,
        isLongpix: true,
      });
      const result = processVacuumTick(state);
      // 5 * 2 = 10 (base * papal), * 3 (BH) = 30, * 2 (overtime) = 60
      expect(result.vacuumGenerated).toBe(60);
    });

    it('should prevent spending with blackhat power > 8 on underflow', () => {
      const state = makeVacuumState({
        fluxCrystals: 5,
        blackhatPower: 9,
      });
      const result = processVacuumTick(state);
      expect(result.wasActive).toBe(false);
    });
  });

  describe('calculateThisSucksIncreaseCost', () => {
    it('should calculate vacuum cost as |2000 - n| * n', () => {
      const cost = calculateThisSucksIncreaseCost(10, 0);
      expect(cost.vacuum).toBe(1990 * 10); // |2000-10| * 10
    });

    it('should have cheapest vacuum cost near n=2000', () => {
      const cost2000 = calculateThisSucksIncreaseCost(2000, 0);
      expect(cost2000.vacuum).toBe(0); // |2000-2000| * 2000 = 0
    });

    it('should calculate blackprint cost scaling with vacuum level', () => {
      const cost = calculateThisSucksIncreaseCost(10, 0);
      expect(cost.blackprints).toBe(10000); // 10 * 1000 * 1.01^0 = 10000

      const costWithVacuum = calculateThisSucksIncreaseCost(10, 100);
      // 10 * 1000 * 1.01^1 = 10100
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
      // random=0.5, bought=10, level=5, no TDE
      // floor(0.5 * (10-5+1) * 1) = floor(3) = 3
      expect(calculateRiftFluxGeneration(10, 5, false, 0.5)).toBe(3);
    });

    it('should double with TDE', () => {
      // floor(0.5 * 6 * 2) = 6
      expect(calculateRiftFluxGeneration(10, 5, true, 0.5)).toBe(6);
    });

    it('should return 0 with random=0', () => {
      expect(calculateRiftFluxGeneration(10, 5, false, 0)).toBe(0);
    });
  });

  describe('calculateExplorerFluxGeneration', () => {
    it('should generate based on AC level / 1000', () => {
      expect(calculateExplorerFluxGeneration(3000, false, 1)).toBe(3);
      expect(calculateExplorerFluxGeneration(3500, false, 1)).toBe(3); // floor
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
      // avg = (100-50)/2 * 1 = 25, total = 25 * 10 = 250
      const result = calculateFluxHarvest(100, 50, false, 10, false, 0);
      expect(result).toBe(250);
    });

    it('should apply Bonemeal multiplier', () => {
      // avg = 25, total = 250, * (1 + 50/100) = 250 * 1.5 = 375
      const result = calculateFluxHarvest(100, 50, false, 10, true, 50);
      expect(result).toBe(375);
    });

    it('should double with TDE for Time Lord >= 100', () => {
      // avg = (100-50)/2 * 2 = 50, total = 50 * 10 = 500
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
      expect(calculateLogicatQQ(8, 1)).toBe(3); // 8-5 = 3
    });

    it('should apply Papal QQs multiplier', () => {
      expect(calculateLogicatQQ(10, 2)).toBe(10); // (10-5) * 2
    });

    it('should floor the result', () => {
      expect(calculateLogicatQQ(7, 1.5)).toBe(3); // floor(2 * 1.5) = 3
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
});
