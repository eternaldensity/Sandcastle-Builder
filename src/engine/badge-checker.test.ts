/**
 * Tests for Badge Auto-Earn System
 *
 * Tests badge conditions, badge checker, and integration with ModernEngine.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BadgeChecker } from './badge-checker.js';
import {
  badgeConditions,
  getConditionsForTrigger,
  getConditionBadgeNames,
  getConditionForBadge,
  type BadgeCheckState,
} from './badge-conditions.js';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

// Minimal game data for testing
const testGameData: GameData = {
  version: '1.0.0',
  sourceVersion: 4.12,
  extractedAt: '2026-01-26T00:00:00.000Z',
  boosts: {
    'Sand': {
      id: 0,
      name: 'Sand',
      alias: 'Sand',
      icon: 'sand',
      group: 'stuff',
      description: 'Sand resource',
      price: {},
      isToggle: false,
      isStuff: true,
      hasDynamicDescription: false,
      hasDynamicStats: false,
      hasDynamicPrice: false,
      hasBuyFunction: false,
      hasLockFunction: false,
      hasUnlockFunction: false,
      hasCountdownFunction: false,
      hasLoadFunction: false,
    },
    'Castles': {
      id: 1,
      name: 'Castles',
      alias: 'Castles',
      icon: 'castles',
      group: 'stuff',
      description: 'Castles resource',
      price: {},
      isToggle: false,
      isStuff: true,
      hasDynamicDescription: false,
      hasDynamicStats: false,
      hasDynamicPrice: false,
      hasBuyFunction: false,
      hasLockFunction: false,
      hasUnlockFunction: false,
      hasCountdownFunction: false,
      hasLoadFunction: false,
    },
  },
  boostsById: [] as any,
  badges: {
    'Amazon Patent': {
      id: 0,
      name: 'Amazon Patent',
      group: 'click',
      description: 'Clicked the beach once',
      visibility: 0,
      hasDynamicDescription: false,
    },
    'Not So Redundant': {
      id: 1,
      name: 'Not So Redundant',
      group: 'click',
      description: 'Clicked twice',
      visibility: 0,
      hasDynamicDescription: false,
    },
    'Beachscaper': {
      id: 2,
      name: 'Beachscaper',
      group: 'tools',
      description: 'Own 200 sand tools',
      visibility: 0,
      hasDynamicDescription: false,
    },
    'Ninja Stealth': {
      id: 3,
      name: 'Ninja Stealth',
      group: 'ninja',
      description: 'Ninja stealth >= 6',
      visibility: 0,
      hasDynamicDescription: false,
    },
    'Plain Potato Chips': {
      id: 4,
      name: 'Plain Potato Chips',
      group: 'rate',
      description: 'Sand rate >= 5000',
      visibility: 0,
      hasDynamicDescription: false,
    },
  },
  badgesById: [] as any,
  sandTools: [
    {
      id: 0,
      name: 'Bucket',
      commonName: 'bucket',
      icon: 'bucket',
      description: 'Digs sand',
      type: 'sand' as const,
      basePrice: 10,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
  ],
  castleTools: [],
  groups: {} as any,
};

describe('Badge Conditions', () => {
  it('has conditions defined', () => {
    expect(badgeConditions.length).toBeGreaterThan(0);
  });

  it('filters conditions by trigger', () => {
    const clickConditions = getConditionsForTrigger('click');
    expect(clickConditions.length).toBeGreaterThan(0);
    expect(clickConditions.every(c => c.trigger === 'click')).toBe(true);
  });

  it('gets all condition badge names', () => {
    const names = getConditionBadgeNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain('Amazon Patent');
  });

  it('gets condition for specific badge', () => {
    const condition = getConditionForBadge('Amazon Patent');
    expect(condition).toBeDefined();
    expect(condition?.trigger).toBe('click');
  });
});

describe('BadgeChecker', () => {
  let earnedBadges: string[];
  let checker: BadgeChecker;

  beforeEach(() => {
    earnedBadges = [];
    checker = new BadgeChecker((badge) => earnedBadges.push(badge));
  });

  it('initializes with no earned badges', () => {
    expect(checker.getEarnedCount()).toBe(0);
    expect(checker.isEarned('Amazon Patent')).toBe(false);
  });

  it('sets earned badges from array', () => {
    checker.setEarnedBadges(['Amazon Patent', 'Not So Redundant']);
    expect(checker.getEarnedCount()).toBe(2);
    expect(checker.isEarned('Amazon Patent')).toBe(true);
    expect(checker.isEarned('Not So Redundant')).toBe(true);
  });

  it('checks click badge conditions', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 1,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: {},
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('click', state);
    expect(newBadges).toContain('Amazon Patent');
    expect(earnedBadges).toContain('Amazon Patent');
  });

  it('does not re-earn already earned badges', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 2,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: {},
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    // First check earns all badges that match beachClicks >= 2
    // Amazon Patent (>= 1), Click Ninja (>= 1), Oops (>= 2), Not So Redundant (>= 2)
    const first = checker.check('click', state);
    expect(first.length).toBe(4);
    expect(earnedBadges.length).toBe(4);

    // Second check with same state earns nothing
    earnedBadges = [];
    const second = checker.check('click', state);
    expect(second.length).toBe(0);
    expect(earnedBadges.length).toBe(0);
  });

  it('manually earns a badge', () => {
    checker.manuallyEarn('Amazon Patent');
    expect(checker.isEarned('Amazon Patent')).toBe(true);
    expect(earnedBadges).toContain('Amazon Patent');
  });

  it('unearns a badge', () => {
    checker.manuallyEarn('Amazon Patent');
    expect(checker.isEarned('Amazon Patent')).toBe(true);

    checker.unearn('Amazon Patent');
    expect(checker.isEarned('Amazon Patent')).toBe(false);
  });

  it('clears all badges', () => {
    checker.manuallyEarn('Amazon Patent');
    checker.manuallyEarn('Not So Redundant');
    expect(checker.getEarnedCount()).toBe(2);

    checker.clearAll();
    expect(checker.getEarnedCount()).toBe(0);
  });
});

describe('Badge Integration with ModernEngine', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(testGameData);
    await engine.initialize();
  });

  it('earns click badges automatically', async () => {
    // Click once
    await engine.clickBeach(1);

    const state = await engine.getStateSnapshot();
    expect(state.badges['Amazon Patent']).toBe(true);
  });

  it('earns multiple click badges', async () => {
    // Click twice
    await engine.clickBeach(2);

    const state = await engine.getStateSnapshot();
    expect(state.badges['Amazon Patent']).toBe(true);
    expect(state.badges['Not So Redundant']).toBe(true);
  });

  it('earns tool count badges', async () => {
    // Force enough resources - need a lot because prices increase exponentially
    engine.forceResources({ castles: 1e20 });

    // Buy 200 buckets
    await engine.buyTool('sand', 'Bucket', 200);

    const state = await engine.getStateSnapshot();

    // Verify badge was earned
    expect(state.badges['Beachscaper']).toBe(true);
  });

  it('preserves earned badges across loads', async () => {
    // Earn a badge
    await engine.clickBeach(1);

    // Export and load state
    const saved = await engine.exportState();
    const engine2 = new ModernEngine(testGameData);
    await engine2.initialize();
    await engine2.loadState(saved);

    // Click again should not re-earn
    await engine2.clickBeach(1);

    const state = await engine2.getStateSnapshot();
    expect(state.badges['Amazon Patent']).toBe(true);
  });
});
