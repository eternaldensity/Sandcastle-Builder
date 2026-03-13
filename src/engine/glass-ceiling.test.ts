import { describe, it, expect } from 'vitest';
import {
  calculateGlassCeilingCount,
  calculateGlassCeilingMultiplier,
  hasGlassCeiling,
  isGlassCeilingLocked,
  canToggleGlassCeiling,
  getGlassCeilingMultiplierForTool,
  calculateGlassCeilingPrice,
  GLASS_CEILING_TOOL_MAP,
  GLASS_CEILING_BADGES,
  GLASS_CEILING_PRICE_INCS,
  GLASS_CEILING_DESCRIPTIONS,
  type GlassCeilingState,
} from './glass-ceiling.js';
import {
  isCeilingTogglable,
  glassCeilingUnlockCheck,
  type BoostFunctionContext,
} from './boost-functions.js';

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

  describe('GLASS_CEILING_PRICE_INCS', () => {
    it('has 12 entries', () => {
      expect(GLASS_CEILING_PRICE_INCS).toHaveLength(12);
    });

    it('has correct values', () => {
      expect(GLASS_CEILING_PRICE_INCS[0]).toBe(1.1);
      expect(GLASS_CEILING_PRICE_INCS[1]).toBe(1.25);
      expect(GLASS_CEILING_PRICE_INCS[2]).toBe(1.6);
      expect(GLASS_CEILING_PRICE_INCS[10]).toBe(1);
      expect(GLASS_CEILING_PRICE_INCS[11]).toBe(1);
    });
  });

  describe('GLASS_CEILING_DESCRIPTIONS', () => {
    it('has 12 entries', () => {
      expect(GLASS_CEILING_DESCRIPTIONS).toHaveLength(12);
    });

    it('has correct first and last entries', () => {
      expect(GLASS_CEILING_DESCRIPTIONS[0]).toBe('Sand rate of Buckets');
      expect(GLASS_CEILING_DESCRIPTIONS[11]).toBe('Castles produced by Beanie Builders');
    });
  });

  describe('calculateGlassCeilingPrice', () => {
    it('calculates price for ceiling 0 at power 0', () => {
      const price = calculateGlassCeilingPrice(0, 0);
      // 6 * 1000^1 * 1.1^0 = 6000
      expect(price.sand).toBe(6000);
      expect(price.castles).toBe(6000);
      expect(price.glassBlocks).toBe(50);
    });

    it('calculates price for ceiling 0 at power 1', () => {
      const price = calculateGlassCeilingPrice(0, 1);
      // 6 * 1000 * 1.1^1 = 6600
      expect(price.sand).toBeCloseTo(6600);
      expect(price.castles).toBeCloseTo(6600);
      expect(price.glassBlocks).toBe(50);
    });

    it('calculates price for ceiling 1 at power 0', () => {
      const price = calculateGlassCeilingPrice(1, 0);
      // 6 * 1000^2 * 1.25^0 = 6,000,000
      expect(price.sand).toBe(6000000);
      expect(price.castles).toBe(6000000);
      expect(price.glassBlocks).toBe(100);
    });

    it('scales GlassBlocks by index', () => {
      for (let i = 0; i < 12; i++) {
        const price = calculateGlassCeilingPrice(i, 0);
        expect(price.glassBlocks).toBe(50 * (i + 1));
      }
    });

    it('increases price exponentially with power for ceiling with inc > 1', () => {
      const p0 = calculateGlassCeilingPrice(3, 0); // inc = 2
      const p1 = calculateGlassCeilingPrice(3, 1);
      const p2 = calculateGlassCeilingPrice(3, 2);
      expect(p1.sand).toBeCloseTo(p0.sand * 2);
      expect(p2.sand).toBeCloseTo(p0.sand * 4);
    });

    it('price stays constant for ceiling 10 and 11 (inc = 1)', () => {
      const p0 = calculateGlassCeilingPrice(10, 0);
      const p5 = calculateGlassCeilingPrice(10, 5);
      expect(p0.sand).toBe(p5.sand); // 1^n = 1
    });
  });
});

// =============================================================================
// Glass Ceiling Boost Functions (from boost-functions.ts)
// =============================================================================

/**
 * Create a mock BoostFunctionContext for testing glass ceiling functions.
 */
function createMockContext(overrides: {
  boostAlias?: string;
  boostPower?: number;
  boostBought?: number;
  boughtBoosts?: Record<string, number>;
  earnedBadges?: string[];
} = {}): BoostFunctionContext {
  const boughtBoosts: Record<string, number> = overrides.boughtBoosts ?? {};
  const earnedBadges = new Set(overrides.earnedBadges ?? []);
  const boostPowers: Record<string, number> = {};
  const unlocked: Record<string, boolean> = {};
  const locked: Record<string, boolean> = {};

  return {
    boostAlias: overrides.boostAlias ?? 'Glass Ceiling 0',
    boostPower: overrides.boostPower ?? 0,
    boostCountdown: 0,
    boostBought: overrides.boostBought ?? 0,

    getBeachClicks: () => 0,
    getResource: () => 0,
    getBoostPower: (alias) => boostPowers[alias] ?? 0,
    getBoostBought: (alias) => boughtBoosts[alias] ?? 0,
    isBoostEnabled: () => false,
    isBoostBought: (alias) => (boughtBoosts[alias] ?? 0) > 0,
    isBadgeEarned: (name) => earnedBadges.has(name),

    setBoostPower: (alias, power) => { boostPowers[alias] = power; },
    setBoostCountdown: () => {},
    addResource: () => {},
    subtractResource: () => {},
    lockBoost: (alias) => { locked[alias] = true; delete unlocked[alias]; },
    unlockBoost: (alias) => { unlocked[alias] = true; delete locked[alias]; },
    permalockBoost: () => {},
    recalculatePriceFactor: () => {},
    earnBadge: (name) => { earnedBadges.add(name); },
    notify: () => {},
  };
}

describe('Glass Ceiling Boost Functions', () => {
  describe('isCeilingTogglable', () => {
    it('ceiling 0 is always toggleable', () => {
      const ctx = createMockContext();
      expect(isCeilingTogglable(0, ctx)).toBe(true);
    });

    it('ceiling 1 is toggleable when ceiling 0 is bought', () => {
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 0': 1 },
      });
      expect(isCeilingTogglable(1, ctx)).toBe(true);
    });

    it('ceiling 1 is not toggleable when ceiling 0 is not bought', () => {
      const ctx = createMockContext();
      expect(isCeilingTogglable(1, ctx)).toBe(false);
    });

    it('ceiling 2 is toggleable when only ceiling 1 is bought', () => {
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 1': 1 },
      });
      expect(isCeilingTogglable(2, ctx)).toBe(true);
    });

    it('ceiling 2 is not toggleable when ceilings 0 and 1 are both bought', () => {
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 0': 1, 'Glass Ceiling 1': 1 },
      });
      expect(isCeilingTogglable(2, ctx)).toBe(false);
    });

    it('ceiling 5 is toggleable when only ceiling 4 is bought', () => {
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 4': 1 },
      });
      expect(isCeilingTogglable(5, ctx)).toBe(true);
    });

    it('ceiling 5 is not toggleable when ceilings 3 and 4 are both bought', () => {
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 3': 1, 'Glass Ceiling 4': 1 },
      });
      expect(isCeilingTogglable(5, ctx)).toBe(false);
    });
  });

  describe('glassCeilingUnlockCheck', () => {
    it('unlocks ceiling 0 when no ceilings are bought', () => {
      const unlocked: string[] = [];
      const ctx = createMockContext();
      // Override unlockBoost to track calls
      ctx.unlockBoost = (alias) => { unlocked.push(alias); };

      glassCeilingUnlockCheck(ctx);

      expect(unlocked).toContain('Glass Ceiling 0');
    });

    it('does not unlock ceilings when Ceiling Broken badge is earned', () => {
      const unlocked: string[] = [];
      const locked: string[] = [];
      const ctx = createMockContext({ earnedBadges: ['Ceiling Broken'] });
      ctx.unlockBoost = (alias) => { unlocked.push(alias); };
      ctx.lockBoost = (alias) => { locked.push(alias); };

      glassCeilingUnlockCheck(ctx);

      // With Ceiling Broken, the check should not auto-unlock/lock
      expect(unlocked).toHaveLength(0);
      expect(locked).toHaveLength(0);
    });

    it('locks non-toggleable ceilings', () => {
      const locked: string[] = [];
      const ctx = createMockContext();
      ctx.lockBoost = (alias) => { locked.push(alias); };

      glassCeilingUnlockCheck(ctx);

      // Ceilings 1-9 should be locked since only ceiling 0 is toggleable (no ceilings bought)
      for (let i = 1; i <= 9; i++) {
        expect(locked).toContain(`Glass Ceiling ${i}`);
      }
    });

    it('unlocks next ceiling when previous is bought', () => {
      const unlocked: string[] = [];
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 0': 1 },
      });
      ctx.unlockBoost = (alias) => { unlocked.push(alias); };

      glassCeilingUnlockCheck(ctx);

      expect(unlocked).toContain('Glass Ceiling 1');
    });

    it('skips bought ceilings during check', () => {
      const unlocked: string[] = [];
      const locked: string[] = [];
      const ctx = createMockContext({
        boughtBoosts: { 'Glass Ceiling 0': 1, 'Glass Ceiling 1': 1 },
      });
      ctx.unlockBoost = (alias) => { unlocked.push(alias); };
      ctx.lockBoost = (alias) => { locked.push(alias); };

      glassCeilingUnlockCheck(ctx);

      // Ceilings 0 and 1 are bought, so they should not be in unlock or lock lists
      expect(unlocked).not.toContain('Glass Ceiling 0');
      expect(unlocked).not.toContain('Glass Ceiling 1');
      expect(locked).not.toContain('Glass Ceiling 0');
      expect(locked).not.toContain('Glass Ceiling 1');
    });
  });
});
