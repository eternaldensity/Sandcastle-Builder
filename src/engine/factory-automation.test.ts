import { describe, it, expect } from 'vitest';
import {
  calculateFactoryAutomationRuns,
  getDepartmentBoosts,
  calculateBlastFurnaceRate,
  calculateSandMouldCost,
  calculateGlassMouldCost,
  calculateSandMouldFillCost,
  calculateGlassMouldFillCost,
  canUpgradeFactoryAutomation,
  FA_UPGRADE_COSTS,
  MOULD_RUN_REQUIREMENTS,
} from './factory-automation.js';
import type { BoostDefinition } from '../types/game-data.js';

describe('Factory Automation', () => {
  describe('calculateFactoryAutomationRuns', () => {
    it('calculates basic FA runs without safety boosts', () => {
      const result = calculateFactoryAutomationRuns(
        0, // FA level 0 (power = 0)
        100, // 100 NewPixBots (can run 5 times max)
        10000000, // 10M sand
        false, // no Safety Pumpkin
        false, // no Safety Goggles
        false, // no Cracks
        false // no Aleph One
      );

      // Level 0 FA can run once (need 2M sand)
      expect(result.runs).toBe(1);
      expect(result.sandSpent).toBe(2000000);
    });

    it('calculates FA runs with higher level', () => {
      const result = calculateFactoryAutomationRuns(
        2, // FA level 2 (power = 2)
        200, // 200 NewPixBots (can run 10 times)
        1e15, // Huge sand amount
        false,
        false,
        false,
        false
      );

      // Level 2 FA can run 3 times
      // Costs: 2M × 10000^2, 2M × 10000^1, 2M × 10000^0
      expect(result.runs).toBe(3);
      expect(result.sandSpent).toBe(2000000 + 2000000 * 10000 + 2000000 * 100000000);
    });

    it('caps runs to available NewPixBots', () => {
      const result = calculateFactoryAutomationRuns(
        5, // FA level 5
        60, // Only 60 NewPixBots (can run 3 times)
        1e30,
        false,
        false,
        false,
        false
      );

      // Limited by bots: floor(60 / 20) = 3
      expect(result.runs).toBe(3);
    });

    it('caps runs to available sand', () => {
      const result = calculateFactoryAutomationRuns(
        3, // FA level 3
        200, // Plenty of bots
        5000000, // Only 5M sand
        false,
        false,
        false,
        false
      );

      // Can only afford level 0 run (2M) and level 1 run (20M > 5M, skip)
      // Actually tries in reverse: level 3, 2, 1, 0
      // None of the high levels are affordable, only level 0 (2M)
      expect(result.runs).toBe(1);
      expect(result.sandSpent).toBe(2000000);
    });

    it('caps level to 61 without Cracks/Aleph One', () => {
      const result = calculateFactoryAutomationRuns(
        70, // FA level 70
        10000, // Plenty of bots
        1e100,
        false,
        false,
        false, // no Cracks
        false // no Aleph One
      );

      // Should cap to 61
      expect(result.runs).toBeLessThanOrEqual(61);
    });

    it('allows high levels with Cracks', () => {
      const result = calculateFactoryAutomationRuns(
        70, // FA level 70
        2000, // 2000 bots = floor(2000/20) = 100 runs max
        Infinity, // Infinite sand
        false,
        false,
        true, // has Cracks
        false
      );

      // Should allow higher than 61
      // Limited by bots: floor(2000 / 20) = 100
      expect(result.runs).toBeGreaterThan(61);
    });
  });

  describe('getDepartmentBoosts', () => {
    it('returns boosts with department flag that are not unlocked', () => {
      const boostDefs = new Map<string, BoostDefinition>([
        [
          'Hand it Up',
          {
            id: 1,
            name: 'Hand it Up',
            alias: 'Hand it Up',
            icon: 'handitup',
            group: 'boosts',
            description: 'Boost 1',
            price: {},
            department: true,
            isToggle: false,
            isStuff: false,
            hasDynamicDescription: false,
            hasDynamicStats: false,
            hasDynamicPrice: false,
            hasBuyFunction: false,
            hasLockFunction: false,
            hasUnlockFunction: false,
            hasCountdownFunction: false,
            hasLoadFunction: false,
          },
        ],
        [
          'Riverish',
          {
            id: 2,
            name: 'Riverish',
            alias: 'Riverish',
            icon: 'riverish',
            group: 'boosts',
            description: 'Boost 2',
            price: {},
            department: true,
            isToggle: false,
            isStuff: false,
            hasDynamicDescription: false,
            hasDynamicStats: false,
            hasDynamicPrice: false,
            hasBuyFunction: false,
            hasLockFunction: false,
            hasUnlockFunction: false,
            hasCountdownFunction: false,
            hasLoadFunction: false,
          },
        ],
        [
          'Grapevine',
          {
            id: 3,
            name: 'Grapevine',
            alias: 'Grapevine',
            icon: 'grapevine',
            group: 'boosts',
            description: 'Boost 3',
            price: {},
            department: true,
            isToggle: false,
            isStuff: false,
            hasDynamicDescription: false,
            hasDynamicStats: false,
            hasDynamicPrice: false,
            hasBuyFunction: false,
            hasLockFunction: false,
            hasUnlockFunction: false,
            hasCountdownFunction: false,
            hasLoadFunction: false,
          },
        ],
        [
          'Regular Boost',
          {
            id: 4,
            name: 'Regular Boost',
            alias: 'Regular Boost',
            icon: 'regular',
            group: 'boosts',
            description: 'Not a department boost',
            price: {},
            isToggle: false,
            isStuff: false,
            hasDynamicDescription: false,
            hasDynamicStats: false,
            hasDynamicPrice: false,
            hasBuyFunction: false,
            hasLockFunction: false,
            hasUnlockFunction: false,
            hasCountdownFunction: false,
            hasLoadFunction: false,
          },
        ],
      ]);

      const unlocked = new Set(['Riverish']); // Riverish already unlocked

      const result = getDepartmentBoosts(boostDefs, unlocked);

      expect(result).toHaveLength(2);
      expect(result).toContain('Hand it Up');
      expect(result).toContain('Grapevine');
      expect(result).not.toContain('Riverish'); // Already unlocked
      expect(result).not.toContain('Regular Boost'); // Not a department boost
    });

    it('returns empty array when all department boosts are unlocked', () => {
      const boostDefs = new Map<string, BoostDefinition>([
        [
          'Hand it Up',
          {
            id: 1,
            name: 'Hand it Up',
            alias: 'Hand it Up',
            icon: 'handitup',
            group: 'boosts',
            description: 'Boost 1',
            price: {},
            department: true,
            isToggle: false,
            isStuff: false,
            hasDynamicDescription: false,
            hasDynamicStats: false,
            hasDynamicPrice: false,
            hasBuyFunction: false,
            hasLockFunction: false,
            hasUnlockFunction: false,
            hasCountdownFunction: false,
            hasLoadFunction: false,
          },
        ],
      ]);

      const unlocked = new Set(['Hand it Up']);

      const result = getDepartmentBoosts(boostDefs, unlocked);

      expect(result).toHaveLength(0);
    });
  });

  describe('calculateBlastFurnaceRate', () => {
    it('returns base rate of 1000 without any boosts', () => {
      const rate = calculateBlastFurnaceRate(false, 0, false, 0, false);
      expect(rate).toBe(1000);
    });

    it('reduces rate with Fractal Sandcastles', () => {
      const rate = calculateBlastFurnaceRate(true, 10, false, 0, false);
      expect(rate).toBeLessThan(1000);
      expect(rate).toBeGreaterThanOrEqual(5); // Min is 5
    });

    it('further reduces rate with Blitzing', () => {
      const withoutBlitz = calculateBlastFurnaceRate(true, 10, false, 0, false);
      const withBlitz = calculateBlastFurnaceRate(true, 10, true, 0, false);

      expect(withBlitz).toBe(withoutBlitz / 2);
    });

    it('applies BKJ bonus when Blitzing power > 800', () => {
      const rate = calculateBlastFurnaceRate(true, 10, true, 1000, true);

      // Should have both Blitzing (/2) and BKJ adjustments
      expect(rate).toBeGreaterThan(0);
    });

    it('respects minimum rate of 5', () => {
      // Very high fractal power should still cap at 5
      const rate = calculateBlastFurnaceRate(true, 1000, true, 0, false);
      expect(rate).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Mould cost calculations', () => {
    describe('calculateSandMouldCost', () => {
      it('calculates cost for positive NP', () => {
        const cost = calculateSandMouldCost(10, false);
        expect(cost).toBe(1000); // 10 × 100
      });

      it('calculates cost for negative NP without Minus Worlds', () => {
        const cost = calculateSandMouldCost(-5, false);
        expect(cost).toBe(500); // abs(-5) × 100
      });

      it('squares cost for negative NP with Minus Worlds', () => {
        const cost = calculateSandMouldCost(-5, true);
        expect(cost).toBe(250000); // (5 × 100)^2 = 500^2
      });
    });

    describe('calculateGlassMouldCost', () => {
      it('calculates cost for positive NP', () => {
        const cost = calculateGlassMouldCost(10, false);
        expect(cost).toBeCloseTo(1000 * Math.pow(1.01, 10));
      });

      it('calculates cost for negative NP with Minus Worlds', () => {
        const cost = calculateGlassMouldCost(-5, true);
        const baseCost = 1000 * Math.pow(1.01, 5);
        expect(cost).toBeCloseTo(baseCost * baseCost);
      });
    });

    describe('calculateSandMouldFillCost', () => {
      it('calculates fill cost for positive NP', () => {
        const cost = calculateSandMouldFillCost(10, false);
        expect(cost).toBeCloseTo(100 * Math.pow(1.2, 10));
      });

      it('squares cost for negative NP with Minus Worlds', () => {
        const cost = calculateSandMouldFillCost(-5, true);
        const baseCost = 100 * Math.pow(1.2, 5);
        expect(cost).toBeCloseTo(baseCost * baseCost);
      });
    });

    describe('calculateGlassMouldFillCost', () => {
      it('calculates fill cost for positive NP', () => {
        const cost = calculateGlassMouldFillCost(10, false);
        expect(cost).toBeCloseTo(1000000 * Math.pow(1.02, 10));
      });

      it('squares cost for negative NP with Minus Worlds', () => {
        const cost = calculateGlassMouldFillCost(-5, true);
        const baseCost = 1000000 * Math.pow(1.02, 5);
        expect(cost).toBeCloseTo(baseCost * baseCost);
      });
    });
  });

  describe('canUpgradeFactoryAutomation', () => {
    it('requires Doublepost', () => {
      const canUpgrade = canUpgradeFactoryAutomation(0, 1000, false, 2000);
      expect(canUpgrade).toBe(false);
    });

    it('requires NP length > 1800', () => {
      const canUpgrade = canUpgradeFactoryAutomation(0, 1000, true, 1800);
      expect(canUpgrade).toBe(false);
    });

    it('requires sufficient NewPixBots', () => {
      const canUpgrade = canUpgradeFactoryAutomation(0, 50, true, 2000);
      expect(canUpgrade).toBe(false); // Need 100 bots for level 1
    });

    it('allows upgrade when all conditions met', () => {
      const canUpgrade = canUpgradeFactoryAutomation(0, 100, true, 2000);
      expect(canUpgrade).toBe(true);
    });

    it('returns false when at max level', () => {
      const maxLevel = FA_UPGRADE_COSTS.length;
      const canUpgrade = canUpgradeFactoryAutomation(maxLevel, 100000, true, 2000);
      expect(canUpgrade).toBe(false);
    });

    it('checks correct cost for each level', () => {
      expect(canUpgradeFactoryAutomation(0, 100, true, 2000)).toBe(true); // Level 0 → 1: 100 bots
      expect(canUpgradeFactoryAutomation(1, 200, true, 2000)).toBe(true); // Level 1 → 2: 200 bots
      expect(canUpgradeFactoryAutomation(2, 400, true, 2000)).toBe(true); // Level 2 → 3: 400 bots
      expect(canUpgradeFactoryAutomation(2, 399, true, 2000)).toBe(false); // Not enough
    });
  });

  describe('Constants', () => {
    it('has correct FA upgrade costs', () => {
      expect(FA_UPGRADE_COSTS).toHaveLength(10);
      expect(FA_UPGRADE_COSTS[0]).toBe(100);
      expect(FA_UPGRADE_COSTS[9]).toBe(51200);
    });

    it('has correct mould run requirements', () => {
      expect(MOULD_RUN_REQUIREMENTS.SMM).toBe(100);
      expect(MOULD_RUN_REQUIREMENTS.SMF).toBe(200);
      expect(MOULD_RUN_REQUIREMENTS.GMM).toBe(400);
      expect(MOULD_RUN_REQUIREMENTS.GMF).toBe(800);
    });
  });
});
