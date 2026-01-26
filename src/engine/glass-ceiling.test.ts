import { describe, it, expect } from 'vitest';
import {
  calculateGlassCeilingCount,
  calculateGlassCeilingMultiplier,
  hasGlassCeiling,
  isGlassCeilingLocked,
  canToggleGlassCeiling,
  getGlassCeilingMultiplierForTool,
  GLASS_CEILING_TOOL_MAP,
  GLASS_CEILING_BADGES,
  type GlassCeilingState,
} from './glass-ceiling.js';

describe('Glass Ceiling System', () => {
  describe('calculateGlassCeilingCount', () => {
    it('returns 0 when no ceilings owned', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingCount(state)).toBe(0);
    });

    it('counts all owned ceilings', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingCount(state)).toBe(3);
    });

    it('handles all 12 ceilings', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingCount(state)).toBe(12);
    });

    it('handles non-contiguous ceilings', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 5, 11],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingCount(state)).toBe(3);
    });
  });

  describe('calculateGlassCeilingMultiplier', () => {
    it('returns 1 with no ceilings (33^0)', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingMultiplier(state)).toBe(1);
    });

    it('returns 33 with 1 ceiling (33^1)', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingMultiplier(state)).toBe(33);
    });

    it('returns 1089 with 2 ceilings (33^2)', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(calculateGlassCeilingMultiplier(state)).toBe(1089);
    });

    it('calculates exponential growth correctly', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2, 3],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      // 33^4 = 1,185,921
      expect(calculateGlassCeilingMultiplier(state)).toBe(1185921);
    });

    it('applies WWB multiplier to base', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0],
        hasWWB: true,
        wwbBought: 5, // 2^(5-5) = 1
        scaffoldAmount: 10,
        lockedCeilings: new Set(),
      };

      // Base = 33 * (2^0 * 10) = 33 * 10 = 330
      // Multiplier = 330^1 = 330
      expect(calculateGlassCeilingMultiplier(state)).toBe(330);
    });

    it('calculates WWB factor correctly with bought > 5', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0],
        hasWWB: true,
        wwbBought: 7, // 2^(7-5) = 4
        scaffoldAmount: 5,
        lockedCeilings: new Set(),
      };

      // Base = 33 * (4 * 5) = 33 * 20 = 660
      // Multiplier = 660^1 = 660
      expect(calculateGlassCeilingMultiplier(state)).toBe(660);
    });

    it('calculates WWB factor correctly with bought < 5', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0],
        hasWWB: true,
        wwbBought: 3, // 2^(3-5) = 0.25
        scaffoldAmount: 8,
        lockedCeilings: new Set(),
      };

      // Base = 33 * (0.25 * 8) = 33 * 2 = 66
      // Multiplier = 66^1 = 66
      expect(calculateGlassCeilingMultiplier(state)).toBe(66);
    });

    it('handles massive multipliers with multiple ceilings and WWB', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: true,
        wwbBought: 6, // 2^1 = 2
        scaffoldAmount: 100,
        lockedCeilings: new Set(),
      };

      // Base = 33 * (2 * 100) = 6600
      // Multiplier = 6600^3 = 287,496,000,000
      expect(calculateGlassCeilingMultiplier(state)).toBe(287496000000);
    });

    it('ignores WWB when not owned', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1],
        hasWWB: false,
        wwbBought: 10, // Should be ignored
        scaffoldAmount: 1000, // Should be ignored
        lockedCeilings: new Set(),
      };

      // Base = 33 (no WWB multiplier)
      // Multiplier = 33^2 = 1089
      expect(calculateGlassCeilingMultiplier(state)).toBe(1089);
    });

    it('returns 1 when WWB owned but not bought', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0],
        hasWWB: true,
        wwbBought: 0,
        scaffoldAmount: 100,
        lockedCeilings: new Set(),
      };

      // WWB bought = 0, so no WWB multiplier applied
      expect(calculateGlassCeilingMultiplier(state)).toBe(33);
    });
  });

  describe('hasGlassCeiling', () => {
    it('returns true for owned ceiling', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 2, 5],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(hasGlassCeiling(state, 0)).toBe(true);
      expect(hasGlassCeiling(state, 2)).toBe(true);
      expect(hasGlassCeiling(state, 5)).toBe(true);
    });

    it('returns false for unowned ceiling', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 2, 5],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(hasGlassCeiling(state, 1)).toBe(false);
      expect(hasGlassCeiling(state, 3)).toBe(false);
      expect(hasGlassCeiling(state, 11)).toBe(false);
    });
  });

  describe('isGlassCeilingLocked', () => {
    it('returns true for locked ceiling', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set([1, 2]),
      };

      expect(isGlassCeilingLocked(state, 1)).toBe(true);
      expect(isGlassCeilingLocked(state, 2)).toBe(true);
    });

    it('returns false for unlocked ceiling', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set([1]),
      };

      expect(isGlassCeilingLocked(state, 0)).toBe(false);
      expect(isGlassCeilingLocked(state, 2)).toBe(false);
    });
  });

  describe('canToggleGlassCeiling', () => {
    describe('before Ceiling Broken badge', () => {
      it('cannot toggle unowned ceiling', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 0, false)).toBe(false);
      });

      it('can toggle ceiling 0 if owned', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [0],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 0, false)).toBe(true);
      });

      it('can toggle ceiling 1 if ceiling 0 is owned', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [0, 1],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 1, false)).toBe(true);
      });

      it('cannot toggle ceiling 1 if ceiling 0 not owned', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [1],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 1, false)).toBe(false);
      });

      it('cannot toggle ceiling 2 if ceiling 0 is owned (must only have ceiling 1)', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [0, 1, 2],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 2, false)).toBe(false);
      });

      it('can toggle ceiling 5 if only ceiling 4 is owned (no lower ceilings)', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [4, 5],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 5, false)).toBe(true);
      });
    });

    describe('after Ceiling Broken badge', () => {
      it('can toggle any ceiling regardless of rules', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [0, 5, 11],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 0, true)).toBe(true);
        expect(canToggleGlassCeiling(state, 5, true)).toBe(true);
        expect(canToggleGlassCeiling(state, 11, true)).toBe(true);
      });

      it('can toggle ceiling even without previous ceiling', () => {
        const state: GlassCeilingState = {
          ceilingsOwned: [5],
          hasWWB: false,
          wwbBought: 0,
          scaffoldAmount: 0,
          lockedCeilings: new Set(),
        };

        expect(canToggleGlassCeiling(state, 5, true)).toBe(true);
      });
    });
  });

  describe('getGlassCeilingMultiplierForTool', () => {
    it('returns 1 for tool with no ceiling owned', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(getGlassCeilingMultiplierForTool(state, 'Bucket')).toBe(1);
      expect(getGlassCeilingMultiplierForTool(state, 'NewPixBot')).toBe(1);
    });

    it('returns multiplier for tool with corresponding ceiling owned', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0], // Ceiling 0 = Bucket
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(getGlassCeilingMultiplierForTool(state, 'Bucket')).toBe(33);
      expect(getGlassCeilingMultiplierForTool(state, 'Cuegan')).toBe(1); // No ceiling 2
    });

    it('returns same multiplier for all tools with ceilings', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      const multiplier = calculateGlassCeilingMultiplier(state); // 33^3 = 35937

      expect(getGlassCeilingMultiplierForTool(state, 'Bucket')).toBe(multiplier);
      expect(getGlassCeilingMultiplierForTool(state, 'NewPixBot')).toBe(multiplier);
      expect(getGlassCeilingMultiplierForTool(state, 'Cuegan')).toBe(multiplier);
    });

    it('returns 1 for unknown tool', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [0, 1, 2],
        hasWWB: false,
        wwbBought: 0,
        scaffoldAmount: 0,
        lockedCeilings: new Set(),
      };

      expect(getGlassCeilingMultiplierForTool(state, 'UnknownTool')).toBe(1);
    });

    it('applies WWB boost to tool multiplier', () => {
      const state: GlassCeilingState = {
        ceilingsOwned: [4], // Ceiling 4 = Flag
        hasWWB: true,
        wwbBought: 6, // 2^1 = 2
        scaffoldAmount: 50,
        lockedCeilings: new Set(),
      };

      // Base = 33 * (2 * 50) = 3300
      // Multiplier = 3300^1 = 3300
      expect(getGlassCeilingMultiplierForTool(state, 'Flag')).toBe(3300);
    });
  });

  describe('GLASS_CEILING_TOOL_MAP', () => {
    it('has 12 tool mappings', () => {
      expect(Object.keys(GLASS_CEILING_TOOL_MAP)).toHaveLength(12);
    });

    it('maps indices 0-11', () => {
      for (let i = 0; i < 12; i++) {
        expect(GLASS_CEILING_TOOL_MAP[i]).toBeDefined();
      }
    });

    it('maps to expected tools', () => {
      expect(GLASS_CEILING_TOOL_MAP[0]).toBe('Bucket');
      expect(GLASS_CEILING_TOOL_MAP[1]).toBe('NewPixBot');
      expect(GLASS_CEILING_TOOL_MAP[2]).toBe('Cuegan');
      expect(GLASS_CEILING_TOOL_MAP[3]).toBe('Trebuchet');
      expect(GLASS_CEILING_TOOL_MAP[11]).toBe('BeanieBuilder');
    });
  });

  describe('GLASS_CEILING_BADGES', () => {
    it('has correct thresholds', () => {
      expect(GLASS_CEILING_BADGES.CEILING_BROKEN).toBe(10);
      expect(GLASS_CEILING_BADGES.CEILING_DISINTEGRATED).toBe(12);
    });
  });
});
