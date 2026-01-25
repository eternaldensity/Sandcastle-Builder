/**
 * Tests for the boost unlock checker
 */

import { describe, it, expect } from 'vitest';
import {
  evaluateCondition,
  checkUnlockRules,
  UnlockChecker,
  type UnlockCheckState,
} from './unlock-checker.js';
import {
  Conditions,
  toolUnlockRules,
  type UnlockRule,
} from './unlock-conditions.js';

/**
 * Create a minimal test state
 */
function createTestState(overrides: Partial<UnlockCheckState> = {}): UnlockCheckState {
  return {
    sandTools: new Map([
      ['Bucket', { amount: 0 }],
      ['Cuegan', { amount: 0 }],
      ['Flag', { amount: 0 }],
      ['Ladder', { amount: 0 }],
      ['Bag', { amount: 0 }],
      ['LaPetite', { amount: 0 }],
    ]),
    castleTools: new Map([
      ['NewPixBot', { amount: 0 }],
      ['Trebuchet', { amount: 0 }],
      ['Scaffold', { amount: 0 }],
      ['Wave', { amount: 0 }],
      ['River', { amount: 0 }],
    ]),
    boosts: new Map([
      ['Bigger Buckets', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Huge Buckets', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Helping Hand', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Cooperation', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Spring Fling', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Flag Bearer', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Glass Ceiling', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['The Fading', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Goats', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['HoM', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['DoRD', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Factory Automation', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Flung', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Flying Buckets', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
      ['Seacoal', { unlocked: 0, bought: 0, power: 0, countdown: 0 }],
    ]),
    badges: new Map([
      ['Flung', false],
    ]),
    resources: {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
    },
    badgeGroupCounts: {},
    ...overrides,
  };
}

describe('evaluateCondition', () => {
  describe('tool-amount conditions', () => {
    it('returns false when tool amount is below threshold', () => {
      const state = createTestState();
      const condition = Conditions.toolAmount('sand', 'Bucket', 1);
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns true when tool amount equals threshold', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 1 });
      const condition = Conditions.toolAmount('sand', 'Bucket', 1);
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns true when tool amount exceeds threshold', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 10 });
      const condition = Conditions.toolAmount('sand', 'Bucket', 4);
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('works with castle tools', () => {
      const state = createTestState();
      state.castleTools.set('Trebuchet', { amount: 5 });
      const condition = Conditions.toolAmount('castle', 'Trebuchet', 5);
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns false for unknown tool', () => {
      const state = createTestState();
      const condition = Conditions.toolAmount('sand', 'NonExistent', 1);
      expect(evaluateCondition(condition, state)).toBe(false);
    });
  });

  describe('boost-power conditions', () => {
    it('returns false when power is below threshold', () => {
      const state = createTestState();
      state.boosts.set('Glass Ceiling', { unlocked: 1, bought: 1, power: 100, countdown: 0 });
      const condition = Conditions.boostPower('Glass Ceiling', 1024);
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns true when power meets threshold', () => {
      const state = createTestState();
      state.boosts.set('Glass Ceiling', { unlocked: 1, bought: 1, power: 1024, countdown: 0 });
      const condition = Conditions.boostPower('Glass Ceiling', 1024);
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns true when power exceeds threshold', () => {
      const state = createTestState();
      state.boosts.set('Goats', { unlocked: 1, bought: 1, power: 50, countdown: 0 });
      const condition = Conditions.boostPower('Goats', 20);
      expect(evaluateCondition(condition, state)).toBe(true);
    });
  });

  describe('boost-bought conditions', () => {
    it('returns false when boost not bought', () => {
      const state = createTestState();
      const condition = Conditions.boostBought('DoRD', 1);
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns true when boost is bought', () => {
      const state = createTestState();
      state.boosts.set('DoRD', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
      const condition = Conditions.boostBought('DoRD', 1);
      expect(evaluateCondition(condition, state)).toBe(true);
    });
  });

  describe('badge-earned conditions', () => {
    it('returns false when badge not earned', () => {
      const state = createTestState();
      const condition = Conditions.badgeEarned('Flung');
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns true when badge is earned', () => {
      const state = createTestState();
      state.badges.set('Flung', true);
      const condition = Conditions.badgeEarned('Flung');
      expect(evaluateCondition(condition, state)).toBe(true);
    });
  });

  describe('badge-group-count conditions', () => {
    it('returns false when group count is below threshold', () => {
      const state = createTestState();
      state.badgeGroupCounts = { diamm: 2 };
      const condition = Conditions.badgeGroupCount('diamm', 3);
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns true when group count meets threshold', () => {
      const state = createTestState();
      state.badgeGroupCounts = { diamm: 3 };
      const condition = Conditions.badgeGroupCount('diamm', 3);
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns false when badgeGroupCounts is undefined', () => {
      const state = createTestState();
      state.badgeGroupCounts = undefined;
      const condition = Conditions.badgeGroupCount('diamm', 1);
      expect(evaluateCondition(condition, state)).toBe(false);
    });
  });

  describe('AND conditions', () => {
    it('returns true when all conditions are met', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 100 });
      state.badges.set('Flung', true);
      const condition = Conditions.and(
        Conditions.toolAmount('sand', 'Bucket', 100),
        Conditions.badgeEarned('Flung')
      );
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns false when one condition is not met', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 100 });
      // Flung badge not earned
      const condition = Conditions.and(
        Conditions.toolAmount('sand', 'Bucket', 100),
        Conditions.badgeEarned('Flung')
      );
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('returns false when no conditions are met', () => {
      const state = createTestState();
      const condition = Conditions.and(
        Conditions.toolAmount('sand', 'Bucket', 100),
        Conditions.badgeEarned('Flung')
      );
      expect(evaluateCondition(condition, state)).toBe(false);
    });
  });

  describe('OR conditions', () => {
    it('returns true when all conditions are met', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 10 });
      state.sandTools.set('Cuegan', { amount: 10 });
      const condition = Conditions.or(
        Conditions.toolAmount('sand', 'Bucket', 5),
        Conditions.toolAmount('sand', 'Cuegan', 5)
      );
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns true when only one condition is met', () => {
      const state = createTestState();
      state.sandTools.set('Bucket', { amount: 10 });
      // Cuegan is 0
      const condition = Conditions.or(
        Conditions.toolAmount('sand', 'Bucket', 5),
        Conditions.toolAmount('sand', 'Cuegan', 5)
      );
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('returns false when no conditions are met', () => {
      const state = createTestState();
      const condition = Conditions.or(
        Conditions.toolAmount('sand', 'Bucket', 5),
        Conditions.toolAmount('sand', 'Cuegan', 5)
      );
      expect(evaluateCondition(condition, state)).toBe(false);
    });
  });
});

describe('checkUnlockRules', () => {
  it('identifies boosts to unlock', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 1 });

    const rules: UnlockRule[] = [
      { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
    ];

    const result = checkUnlockRules(rules, state);
    expect(result.toUnlock).toContain('Bigger Buckets');
    expect(result.alreadyUnlocked).toHaveLength(0);
    expect(result.notReady).toHaveLength(0);
  });

  it('identifies already unlocked boosts', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 1 });
    state.boosts.set('Bigger Buckets', { unlocked: 1, bought: 0, power: 0, countdown: 0 });

    const rules: UnlockRule[] = [
      { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
    ];

    const result = checkUnlockRules(rules, state);
    expect(result.toUnlock).toHaveLength(0);
    expect(result.alreadyUnlocked).toContain('Bigger Buckets');
  });

  it('identifies boosts not ready to unlock', () => {
    const state = createTestState();
    // Bucket amount is 0

    const rules: UnlockRule[] = [
      { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
    ];

    const result = checkUnlockRules(rules, state);
    expect(result.toUnlock).toHaveLength(0);
    expect(result.notReady).toContain('Bigger Buckets');
  });

  it('handles multiple rules correctly', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 4 });
    state.boosts.set('Bigger Buckets', { unlocked: 1, bought: 1, power: 0, countdown: 0 });

    const rules: UnlockRule[] = [
      { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
      { boostAlias: 'Huge Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 4) },
      { boostAlias: 'Cooperation', condition: Conditions.toolAmount('sand', 'Cuegan', 4) },
    ];

    const result = checkUnlockRules(rules, state);
    expect(result.alreadyUnlocked).toContain('Bigger Buckets');
    expect(result.toUnlock).toContain('Huge Buckets');
    expect(result.notReady).toContain('Cooperation');
  });
});

describe('UnlockChecker', () => {
  it('returns boosts to unlock based on state', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 5 });
    state.sandTools.set('Cuegan', { amount: 1 });

    const rules: UnlockRule[] = [
      { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
      { boostAlias: 'Huge Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 4) },
      { boostAlias: 'Helping Hand', condition: Conditions.toolAmount('sand', 'Cuegan', 1) },
    ];

    const checker = new UnlockChecker(rules);
    const toUnlock = checker.check(state);

    expect(toUnlock).toContain('Bigger Buckets');
    expect(toUnlock).toContain('Huge Buckets');
    expect(toUnlock).toContain('Helping Hand');
    expect(toUnlock).toHaveLength(3);
  });

  it('allows adding additional rules', () => {
    const checker = new UnlockChecker([]);
    expect(checker.getRules()).toHaveLength(0);

    checker.addRules([
      { boostAlias: 'Test', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
    ]);

    expect(checker.getRules()).toHaveLength(1);
  });
});

describe('toolUnlockRules', () => {
  it('includes expected early game unlocks', () => {
    const boostAliases = toolUnlockRules.map(r => r.boostAlias);

    // Bucket unlocks
    expect(boostAliases).toContain('Bigger Buckets');
    expect(boostAliases).toContain('Huge Buckets');

    // Cuegan unlocks
    expect(boostAliases).toContain('Helping Hand');
    expect(boostAliases).toContain('Cooperation');

    // Flag unlocks
    expect(boostAliases).toContain('Flag Bearer');
    expect(boostAliases).toContain('War Banner');

    // Trebuchet unlocks
    expect(boostAliases).toContain('Spring Fling');
    expect(boostAliases).toContain('Trebuchet Pong');
  });

  it('correctly unlocks Bigger Buckets at 1 bucket', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 1 });

    const biggerBucketsRule = toolUnlockRules.find(r => r.boostAlias === 'Bigger Buckets');
    expect(biggerBucketsRule).toBeDefined();
    expect(evaluateCondition(biggerBucketsRule!.condition, state)).toBe(true);
  });

  it('correctly requires badge for Flying Buckets', () => {
    const state = createTestState();
    state.sandTools.set('Bucket', { amount: 100 });

    const flyingBucketsRule = toolUnlockRules.find(r => r.boostAlias === 'Flying Buckets');
    expect(flyingBucketsRule).toBeDefined();

    // Without Flung badge
    expect(evaluateCondition(flyingBucketsRule!.condition, state)).toBe(false);

    // With Flung badge
    state.badges.set('Flung', true);
    expect(evaluateCondition(flyingBucketsRule!.condition, state)).toBe(true);
  });
});
