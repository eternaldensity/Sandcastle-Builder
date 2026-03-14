/**
 * Tests for Blackprints Construction System
 */

import { describe, it, expect } from 'vitest';
import {
  BLACKPRINT_COSTS,
  BLACKPRINT_ORDER,
  checkBlackprintPrereqs,
  getBlackprintSubject,
  calculateConstructionRuns,
  processBlackprintConstruction,
  calculateMiloBlackprints,
  calculateLockedCrateBlackprints,
  calculateLockedVaultBlackprints,
  getAvailableBlackprints,
  type BlackprintPrereqState,
} from './blackprints.js';

// Helper to create a default prereq state
function makePrereqState(overrides: Partial<BlackprintPrereqState> = {}): BlackprintPrereqState {
  return {
    hasBadge: () => false,
    hasBoost: () => false,
    getBoostPower: () => 0,
    getBoostBought: () => 0,
    aaRuns: 0,
    redactedClicks: 0,
    ...overrides,
  };
}

describe('Blackprints', () => {
  describe('BLACKPRINT_COSTS', () => {
    it('should have costs for all items in BLACKPRINT_ORDER', () => {
      for (const subject of BLACKPRINT_ORDER) {
        expect(BLACKPRINT_COSTS[subject]).toBeDefined();
      }
    });

    it('should have correct costs for early boosts', () => {
      expect(BLACKPRINT_COSTS['SMM']).toBe(10);
      expect(BLACKPRINT_COSTS['SMF']).toBe(15);
      expect(BLACKPRINT_COSTS['GMM']).toBe(25);
      expect(BLACKPRINT_COSTS['GMF']).toBe(30);
      expect(BLACKPRINT_COSTS['SG']).toBe(5);
    });

    it('should have correct costs for late-game boosts', () => {
      expect(BLACKPRINT_COSTS['VS']).toBe(5000);
      expect(BLACKPRINT_COSTS['CFT']).toBe(40000);
      expect(BLACKPRINT_COSTS['BoH']).toBe(90000);
      expect(BLACKPRINT_COSTS['VV']).toBe(750000);
      expect(BLACKPRINT_COSTS['Nest']).toBe(5e12);
    });

    it('should have Infinity cost for diamond boosts', () => {
      expect(BLACKPRINT_COSTS['DMM']).toBe(Infinity);
      expect(BLACKPRINT_COSTS['DMF']).toBe(Infinity);
      expect(BLACKPRINT_COSTS['DMC']).toBe(Infinity);
      expect(BLACKPRINT_COSTS['DMB']).toBe(Infinity);
      expect(BLACKPRINT_COSTS['DMP']).toBe(Infinity);
    });
  });

  describe('BLACKPRINT_ORDER', () => {
    it('should have 23 entries', () => {
      expect(BLACKPRINT_ORDER).toHaveLength(23);
    });

    it('should start with SMM and end with DMP', () => {
      expect(BLACKPRINT_ORDER[0]).toBe('SMM');
      expect(BLACKPRINT_ORDER[BLACKPRINT_ORDER.length - 1]).toBe('DMP');
    });
  });

  describe('checkBlackprintPrereqs', () => {
    it('should return true for boosts with no special prereqs', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('SMM', state)).toBe(true);
      expect(checkBlackprintPrereqs('AO', state)).toBe(true);
      expect(checkBlackprintPrereqs('Bacon', state)).toBe(true);
    });

    it('should require Minus Worlds badge for CFT', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('CFT', state)).toBe(false);

      const withBadge = makePrereqState({
        hasBadge: (b) => b === 'Minus Worlds',
      });
      expect(checkBlackprintPrereqs('CFT', withBadge)).toBe(true);
    });

    it('should require 2+ Vacuum for VS', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('VS', state)).toBe(false);

      const withVacuum = makePrereqState({
        getBoostPower: (name) => (name === 'Vacuum' ? 2 : 0),
      });
      expect(checkBlackprintPrereqs('VS', withVacuum)).toBe(true);
    });

    it('should require VS boost for VV', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('VV', state)).toBe(false);

      const withVS = makePrereqState({
        hasBoost: (name) => name === 'VS',
      });
      expect(checkBlackprintPrereqs('VV', withVS)).toBe(true);
    });

    it('should require 400+ Goats for BoH', () => {
      const state = makePrereqState({
        getBoostPower: (name) => (name === 'Goats' ? 399 : 0),
      });
      expect(checkBlackprintPrereqs('BoH', state)).toBe(false);

      const withGoats = makePrereqState({
        getBoostPower: (name) => (name === 'Goats' ? 400 : 0),
      });
      expect(checkBlackprintPrereqs('BoH', withGoats)).toBe(true);
    });

    it('should require DNS boost and badge for Nest', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('Nest', state)).toBe(false);

      const withDNS = makePrereqState({
        hasBoost: (name) => name === 'DNS',
        hasBadge: (b) => b === 'Domain Name Server',
      });
      expect(checkBlackprintPrereqs('Nest', withDNS)).toBe(true);
    });

    it('should require 21+ AA runs and 2500+ redacted clicks for ZK', () => {
      const state = makePrereqState({ aaRuns: 20, redactedClicks: 2499 });
      expect(checkBlackprintPrereqs('ZK', state)).toBe(false);

      const withReqs = makePrereqState({ aaRuns: 21, redactedClicks: 2500 });
      expect(checkBlackprintPrereqs('ZK', withReqs)).toBe(true);
    });

    it('should require Nest boost for diamond boosts', () => {
      const state = makePrereqState();
      expect(checkBlackprintPrereqs('DMM', state)).toBe(false);

      const withNest = makePrereqState({
        hasBoost: (name) => name === 'Nest',
      });
      expect(checkBlackprintPrereqs('DMM', withNest)).toBe(true);
      expect(checkBlackprintPrereqs('DMF', withNest)).toBe(true);
      expect(checkBlackprintPrereqs('DMP', withNest)).toBe(true);
    });
  });

  describe('getBlackprintSubject', () => {
    it('should return first unbought boost with enough pages', () => {
      const state = makePrereqState();
      const bought = new Set<string>();
      expect(getBlackprintSubject(10, bought, state)).toBe('SMM');
    });

    it('should skip bought boosts', () => {
      const state = makePrereqState();
      const bought = new Set(['SMM']);
      expect(getBlackprintSubject(15, bought, state)).toBe('SMF');
    });

    it('should return null if not enough pages for any unbought boost', () => {
      const state = makePrereqState();
      const bought = new Set(['SMM', 'SMF', 'GMM', 'GMF', 'SG']);
      // Next is TFLL at 80, Bacon at 40
      expect(getBlackprintSubject(39, bought, state)).toBe(null);
    });

    it('should skip boosts with unmet prereqs', () => {
      const state = makePrereqState();
      // Have enough pages for everything but prereqs block CFT, VS, etc.
      const bought = new Set(BLACKPRINT_ORDER.slice(0, 13)); // up to ZK
      expect(getBlackprintSubject(100000, bought, state)).toBe(null);
    });

    it('should return SG (cost 5) before SMM (cost 10) based on order', () => {
      // SG is at index 10 in order, SMM at index 0
      // So SMM comes first even though SG is cheaper
      const state = makePrereqState();
      const bought = new Set<string>();
      expect(getBlackprintSubject(5, bought, state)).toBe('SG');
    });

    it('should find SG with only 5 pages since its cost is 5', () => {
      const state = makePrereqState();
      const bought = new Set<string>();
      // SMM costs 10, so with 5 pages we skip it. SG costs 5 and is at index 10.
      const result = getBlackprintSubject(5, bought, state);
      expect(result).toBe('SG');
    });
  });

  describe('calculateConstructionRuns', () => {
    it('should multiply base cost by 10', () => {
      expect(calculateConstructionRuns('SMM', true, true)).toBe(100);
      expect(calculateConstructionRuns('SMF', true, true)).toBe(150);
    });

    it('should cap at 40 runs (×10=400) when AE+AA not both owned and cost < 1000', () => {
      // SMM base cost 10, capped to 10*10=100 (no cap needed, 10 < 40)
      expect(calculateConstructionRuns('SMM', false, false)).toBe(100);

      // TFLL base cost 80, capped to 40*10=400
      expect(calculateConstructionRuns('TFLL', false, false)).toBe(400);

      // AO base cost 150, capped to 40*10=400
      expect(calculateConstructionRuns('AO', false, false)).toBe(400);
    });

    it('should not cap when AE+AA both owned', () => {
      expect(calculateConstructionRuns('TFLL', true, true)).toBe(800);
      expect(calculateConstructionRuns('AO', true, true)).toBe(1500);
    });

    it('should not cap when cost >= 1000', () => {
      expect(calculateConstructionRuns('VS', false, false)).toBe(50000);
    });

    it('should return Infinity for diamond boosts', () => {
      expect(calculateConstructionRuns('DMM', true, true)).toBe(Infinity);
    });
  });

  describe('processBlackprintConstruction', () => {
    it('should accumulate progress from FA runs', () => {
      const result = processBlackprintConstruction(5, 0, 100, 'SMM', false);
      expect(result.completed).toBe(false);
      expect(result.progress).toBe(5);
      expect(result.remainingRuns).toBe(0);
    });

    it('should complete when progress reaches target', () => {
      const result = processBlackprintConstruction(10, 90, 100, 'SMM', false);
      expect(result.completed).toBe(true);
      expect(result.completedBoost).toBe('SMM');
      expect(result.progress).toBe(0);
    });

    it('should return remaining runs when completing early', () => {
      const result = processBlackprintConstruction(20, 90, 100, 'SMM', false);
      expect(result.completed).toBe(true);
      expect(result.remainingRuns).toBe(10);
    });

    it('should complete exactly at target', () => {
      const result = processBlackprintConstruction(50, 50, 100, 'SMM', false);
      expect(result.completed).toBe(true);
      expect(result.remainingRuns).toBe(0);
    });
  });

  describe('calculateMiloBlackprints', () => {
    it('should generate 1 page per 100 accumulated power', () => {
      const result = calculateMiloBlackprints(0, 100, false, 1, 1);
      expect(result.pages).toBe(1);
      expect(result.remainingPower).toBe(0);
    });

    it('should accumulate power across ticks', () => {
      const result = calculateMiloBlackprints(50, 60, false, 1, 1);
      expect(result.pages).toBe(1);
      expect(result.remainingPower).toBe(10);
    });

    it('should generate 0 pages if under 100 accumulated', () => {
      const result = calculateMiloBlackprints(0, 99, false, 1, 1);
      expect(result.pages).toBe(0);
      expect(result.remainingPower).toBe(99);
    });

    it('should apply 5x Rush Job multiplier', () => {
      const result = calculateMiloBlackprints(0, 200, true, 1, 1);
      expect(result.pages).toBe(10); // 2 * 5
    });

    it('should apply Void Starer multiplier', () => {
      const result = calculateMiloBlackprints(0, 200, false, 1.5, 1);
      expect(result.pages).toBe(3); // floor(2 * 1.5) = 3
    });

    it('should apply Papal multiplier', () => {
      const result = calculateMiloBlackprints(0, 500, false, 1, 2);
      expect(result.pages).toBe(10); // 5 * 2
    });

    it('should apply all multipliers together', () => {
      const result = calculateMiloBlackprints(0, 300, true, 1.5, 2);
      // base: 3, rush: 15, void: floor(15*1.5)=22, papal: floor(22*2)=44
      expect(result.pages).toBe(44);
    });
  });

  describe('calculateLockedCrateBlackprints', () => {
    it('should generate pages equal to bought count', () => {
      expect(calculateLockedCrateBlackprints(5, 1)).toBe(5);
    });

    it('should apply Papal multiplier', () => {
      expect(calculateLockedCrateBlackprints(10, 2)).toBe(20);
    });

    it('should floor the result', () => {
      expect(calculateLockedCrateBlackprints(3, 1.5)).toBe(4);
    });
  });

  describe('calculateLockedVaultBlackprints', () => {
    it('should use sigma-stacking formula', () => {
      // pages = power * times + times*(times+1)/2
      // power=0, times=1: 0*1 + 1*2/2 = 1
      expect(calculateLockedVaultBlackprints(0, 1, 1, 1)).toBe(1);

      // power=5, times=3: 5*3 + 3*4/2 = 15 + 6 = 21
      expect(calculateLockedVaultBlackprints(5, 3, 1, 1)).toBe(21);
    });

    it('should apply Void Vault multiplier', () => {
      // power=10, times=1: 10 + 1 = 11, * 2 = 22
      expect(calculateLockedVaultBlackprints(10, 1, 2, 1)).toBe(22);
    });

    it('should apply Papal multiplier', () => {
      // power=10, times=1: 11 * 1 * 3 = 33
      expect(calculateLockedVaultBlackprints(10, 1, 1, 3)).toBe(33);
    });
  });

  describe('getAvailableBlackprints', () => {
    it('should return total pages when not constructing', () => {
      expect(getAvailableBlackprints(100, false, null)).toBe(100);
    });

    it('should subtract reserved cost when constructing', () => {
      expect(getAvailableBlackprints(100, true, 'SMM')).toBe(90); // 100 - 10
    });

    it('should handle unknown subject gracefully', () => {
      expect(getAvailableBlackprints(100, true, 'Unknown')).toBe(100);
    });
  });
});
