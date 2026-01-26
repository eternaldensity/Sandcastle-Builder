import { describe, it, expect } from 'vitest';
import {
  calculateKittySpawnTime,
  calculateKittyDespawnTime,
  determineRewardType,
  calculateBlitzingReward,
  calculateNotLuckyReward,
  determineKittyClickAction,
  applyKittyClickResult,
  type RedundakittyBoostState,
  type RedundakittyState
} from './redundakitty.js';

describe('Redundakitty System', () => {
  describe('calculateKittySpawnTime', () => {
    const baseState: RedundakittyBoostState = {
      kitnip: false,
      kittiesGalore: false,
      rrsrUnlocked: false,
      rrsrBought: false,
      doRD: false,
      blastFurnace: false,
      bkj: false,
      bkjPower: 0,
      redunception: false,
      logicat: false,
      sgc: false,
      doubleDepartment: false,
      schizoblitz: false,
      seaMining: false,
      ventusVehemensEnabled: false
    };

    it('calculates base spawn time (200-290 mNP)', () => {
      const time = calculateKittySpawnTime(baseState);
      expect(time).toBeGreaterThanOrEqual(200);
      expect(time).toBeLessThanOrEqual(290);
    });

    it('reduces spawn time with Kitnip (120-210 mNP)', () => {
      const time = calculateKittySpawnTime({ ...baseState, kitnip: true });
      expect(time).toBeGreaterThanOrEqual(120);
      expect(time).toBeLessThanOrEqual(210);
    });

    it('reduces spawn time with Kitties Galore (120-210 mNP)', () => {
      const time = calculateKittySpawnTime({ ...baseState, kittiesGalore: true });
      expect(time).toBeGreaterThanOrEqual(120);
      expect(time).toBeLessThanOrEqual(210);
    });

    it('reduces spawn time with both Kitnip and Kitties Galore (40-90 mNP)', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        kitnip: true,
        kittiesGalore: true
      });
      expect(time).toBeGreaterThanOrEqual(40);
      expect(time).toBeLessThanOrEqual(90);
    });

    it('reduces spawn time with RRSR bought alone (170-240 mNP)', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        rrsrUnlocked: true,
        rrsrBought: true
      });
      expect(time).toBeGreaterThanOrEqual(170);
      expect(time).toBeLessThanOrEqual(240);
    });

    it('greatly reduces spawn time with RRSR bought (10-40 mNP with all kitty boosts)', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        kitnip: true,
        kittiesGalore: true,
        rrsrUnlocked: true,
        rrsrBought: true
      });
      expect(time).toBeGreaterThanOrEqual(10);
      expect(time).toBeLessThanOrEqual(40);
    });

    it('greatly increases spawn time with RRSR unlocked but not bought (2400-3492 mNP)', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        rrsrUnlocked: true,
        rrsrBought: false
      });
      expect(time).toBeGreaterThanOrEqual(2400);
      expect(time).toBeLessThanOrEqual(3492); // 200 + ceil(90 * 1) = 291, * 12 = 3492
    });

    it('increases spawn time 4x with Ventus Vehemens enabled', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        ventusVehemensEnabled: true
      });
      expect(time).toBeGreaterThanOrEqual(800); // 200 * 4
      expect(time).toBeLessThanOrEqual(1160); // 290 * 4
    });

    it('combines all modifiers correctly', () => {
      const time = calculateKittySpawnTime({
        ...baseState,
        kitnip: true,
        kittiesGalore: true,
        rrsrUnlocked: true,
        rrsrBought: false,
        ventusVehemensEnabled: true
      });
      // (40-90) * 12 * 4 = 1920-4320 mNP
      expect(time).toBeGreaterThanOrEqual(1920);
      expect(time).toBeLessThanOrEqual(4320);
    });
  });

  describe('calculateKittyDespawnTime', () => {
    const baseState: RedundakittyBoostState = {
      kitnip: false,
      kittiesGalore: false,
      rrsrUnlocked: false,
      rrsrBought: false,
      doRD: false,
      blastFurnace: false,
      bkj: false,
      bkjPower: 0,
      redunception: false,
      logicat: false,
      sgc: false,
      doubleDepartment: false,
      schizoblitz: false,
      seaMining: false,
      ventusVehemensEnabled: false
    };

    it('calculates base despawn time (24 mNP)', () => {
      const time = calculateKittyDespawnTime(baseState);
      expect(time).toBe(24);
    });

    it('increases despawn time with Kitnip (30 mNP)', () => {
      const time = calculateKittyDespawnTime({ ...baseState, kitnip: true });
      expect(time).toBe(30);
    });

    it('increases despawn time with SGC (36 mNP)', () => {
      const time = calculateKittyDespawnTime({ ...baseState, sgc: true });
      expect(time).toBe(36);
    });

    it('increases despawn time with both Kitnip and SGC (42 mNP)', () => {
      const time = calculateKittyDespawnTime({
        ...baseState,
        kitnip: true,
        sgc: true
      });
      expect(time).toBe(42);
    });
  });

  describe('determineRewardType', () => {
    const baseState: RedundakittyBoostState = {
      kitnip: false,
      kittiesGalore: false,
      rrsrUnlocked: false,
      rrsrBought: false,
      doRD: false,
      blastFurnace: false,
      bkj: false,
      bkjPower: 0,
      redunception: false,
      logicat: false,
      sgc: false,
      doubleDepartment: false,
      schizoblitz: false,
      seaMining: false,
      ventusVehemensEnabled: false
    };

    it('returns not-lucky or blitzing without special boosts', () => {
      const rewards = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const reward = determineRewardType(baseState, false);
        rewards.add(reward);
      }
      expect(rewards.size).toBeGreaterThan(0);
      expect([...rewards].every(r => r === 'not-lucky' || r === 'blitzing')).toBe(true);
    });

    it('can return dord reward when DoRD is owned', () => {
      const rewards = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const reward = determineRewardType({ ...baseState, doRD: true }, false);
        rewards.add(reward);
      }
      expect(rewards.has('dord')).toBe(true);
    });

    it('can return blast-furnace reward when owned', () => {
      const rewards = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const reward = determineRewardType({ ...baseState, blastFurnace: true }, false);
        rewards.add(reward);
      }
      expect(rewards.has('blast-furnace')).toBe(true);
    });

    it('returns blast-furnace instead of blitzing when sand is infinite', () => {
      const rewards = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const reward = determineRewardType(baseState, true);
        rewards.add(reward);
      }
      expect(rewards.has('blitzing')).toBe(false);
      expect(rewards.has('not-lucky') || rewards.has('blast-furnace')).toBe(true);
    });

    it('prioritizes DoRD over other rewards', () => {
      // With DoRD, there's a 12.5% chance of DoRD
      const rewards: string[] = [];
      for (let i = 0; i < 1000; i++) {
        const reward = determineRewardType({
          ...baseState,
          doRD: true,
          blastFurnace: true
        }, false);
        rewards.push(reward);
      }
      const dordCount = rewards.filter(r => r === 'dord').length;
      // Should be around 125 ± some tolerance
      expect(dordCount).toBeGreaterThan(80);
      expect(dordCount).toBeLessThan(170);
    });
  });

  describe('calculateBlitzingReward', () => {
    const baseState: RedundakittyBoostState = {
      kitnip: false,
      kittiesGalore: false,
      rrsrUnlocked: false,
      rrsrBought: false,
      doRD: false,
      blastFurnace: false,
      bkj: false,
      bkjPower: 0,
      redunception: false,
      logicat: false,
      sgc: false,
      doubleDepartment: false,
      schizoblitz: false,
      seaMining: false,
      ventusVehemensEnabled: false
    };

    it('calculates base blitzing reward (800% speed, 23 mNP duration)', () => {
      const reward = calculateBlitzingReward(baseState, 0, 0);
      expect(reward.speed).toBe(800);
      expect(reward.duration).toBe(23);
    });

    it('adds BKJ power bonus (20% per power)', () => {
      const reward = calculateBlitzingReward(
        { ...baseState, bkj: true, bkjPower: 10 },
        0,
        0
      );
      expect(reward.speed).toBe(1000); // 800 + 10*20
      expect(reward.duration).toBe(23);
    });

    it('doubles speed with Schizoblitz', () => {
      const reward = calculateBlitzingReward(
        { ...baseState, schizoblitz: true },
        0,
        0
      );
      expect(reward.speed).toBe(1600); // 800 * 2
      expect(reward.duration).toBe(23);
    });

    it('adds current Blitzing speed and half countdown', () => {
      const reward = calculateBlitzingReward(baseState, 200, 40);
      expect(reward.speed).toBe(1000); // 800 + 200
      expect(reward.duration).toBe(43); // 23 + floor(40/2)
    });

    it('combines all bonuses correctly', () => {
      const reward = calculateBlitzingReward(
        { ...baseState, bkj: true, bkjPower: 5, schizoblitz: true },
        100,
        30
      );
      // (800 + 5*20) * 2 + 100 = 1900 * 2 (wait, schizoblitz multiplies before BKJ)
      // Actually: base=800, +BKJ=100, *schizo=2, +current=100
      // = (800 + 100) * 2 + 100 = 1900
      expect(reward.speed).toBe(1900);
      expect(reward.duration).toBe(38); // 23 + floor(30/2)
    });
  });

  describe('calculateNotLuckyReward', () => {
    it('calculates base reward with no tools or boosts', () => {
      const reward = calculateNotLuckyReward(
        {}, // no sand tools
        {}, // no castle tools
        0, // no boosts
        0, // no badges
        0, // no kitty clicks
        0, // no BKJ power
        false, false, 0, false, 0, 1000
      );
      expect(reward.castles).toBe(0);
    });

    it('calculates reward based on sand tools', () => {
      const reward = calculateNotLuckyReward(
        { Bucket: 10, Cuegan: 5 }, // sand tools
        {},
        0, 0, 0, 0,
        false, false, 0, false, 0, 1000000
      );
      // Bucket: 10 * 3.5^1 = 35
      // Cuegan: 5 * 3.5^2 = 61.25
      // Total: 96.25 = 96
      expect(reward.castles).toBe(96);
    });

    it('calculates reward based on castle tools', () => {
      const reward = calculateNotLuckyReward(
        {},
        { NewPixBot: 10, Trebuchet: 5 }, // castle tools
        0, 0, 0, 0,
        false, false, 0, false, 0, 1000000
      );
      // NewPixBot: 10 * 2.5^1 = 25
      // Trebuchet: 5 * 2.5^2 = 31.25
      // Total: 56.25 = 56
      expect(reward.castles).toBe(56);
    });

    it('adds boosts and badges to reward', () => {
      const reward = calculateNotLuckyReward(
        {}, {},
        50, // boosts
        100, // badges
        0, 0,
        false, false, 0, false, 0, 1000000
      );
      expect(reward.castles).toBe(150);
    });

    it('adds kitty clicks bonus (10 per click)', () => {
      const reward = calculateNotLuckyReward(
        {}, {},
        0, 0,
        20, // kitty clicks
        0,
        false, false, 0, false, 0, 1000000
      );
      expect(reward.castles).toBe(200); // 20 * 10
    });

    it('applies BKJ multiplier', () => {
      const reward = calculateNotLuckyReward(
        {}, {},
        0, 0,
        10, // kitty clicks = 100 base
        5, // BKJ power
        true, // has BKJ
        false, 0, false, 0, 1000000
      );
      // 100 * (1 + 0.2 * 5) = 100 * 2 = 200
      expect(reward.castles).toBe(200);
    });

    it('applies BKJ and Blitzing multipliers', () => {
      const reward = calculateNotLuckyReward(
        {}, {},
        0, 0,
        10, // kitty clicks = 100 base
        10, // BKJ power
        true, // has BKJ
        true, // has Blitzing
        1000, // Blitzing power
        false, 0, 1000000
      );
      // 100 * (1 + 0.2 * 10) = 100 * 3 = 300
      // 300 * min(2, (1000-800)/200) = 300 * 1 = 300
      expect(reward.castles).toBe(300);
    });

    it('applies Fractal Sandcastles multiplier with nerf cap', () => {
      const reward = calculateNotLuckyReward(
        {}, {},
        0, 0,
        10, // kitty clicks = 100 base
        0, false, false, 0,
        true, // has Fractal Sandcastles
        9, // fractal power
        1000 // total castles built
      );
      // 100 * ceil((9+1)/10) = 100 * 1 = 100
      // Nerf cap: min(100, 1000/50) = min(100, 20) = 20
      expect(reward.castles).toBe(20);
    });

    it('calculates complex reward with multiple tools and bonuses', () => {
      const reward = calculateNotLuckyReward(
        { Bucket: 100, Cuegan: 50, Flag: 25 },
        { NewPixBot: 50, Trebuchet: 25 },
        50, // boosts
        30, // badges
        50, // kitty clicks
        15, // BKJ power
        true, true, 1200,
        false, 0,
        500000
      );
      // Sand tools: 100*3.5 + 50*12.25 + 25*42.875 = 350 + 612.5 + 1071.875 = 2034.375
      // Castle tools: 50*2.5 + 25*6.25 = 125 + 156.25 = 281.25
      // Boosts/badges: 80
      // Kitty clicks: 500
      // Subtotal: 2895.625
      // BKJ mult: 2895.625 * (1 + 0.2*15) = 2895.625 * 4 = 11582.5
      // Blitzing mult: min(2, (1200-800)/200) = 2
      // Total: 11582.5 * 2 = 23165
      expect(reward.castles).toBe(23165);
    });
  });

  describe('determineKittyClickAction', () => {
    const baseState: RedundakittyBoostState = {
      kitnip: false,
      kittiesGalore: false,
      rrsrUnlocked: false,
      rrsrBought: false,
      doRD: false,
      blastFurnace: false,
      bkj: false,
      bkjPower: 0,
      redunception: false,
      logicat: false,
      sgc: false,
      doubleDepartment: false,
      schizoblitz: false,
      seaMining: false,
      ventusVehemensEnabled: false
    };

    it('returns hide when clicking beyond drawType length', () => {
      const result = determineKittyClickAction(5, ['show'], baseState, false, false);
      expect(result.action).toBe('hide');
      if (result.action === 'hide') {
        expect(result.reason).toBe('missed');
      }
    });

    it('returns show when current type is not show', () => {
      const result = determineKittyClickAction(0, ['recur'], baseState, false, false);
      expect(result.action).toBe('show');
      if (result.action === 'show') {
        expect(result.level).toBe(0);
      }
    });

    it('can trigger RRSR rickroll', () => {
      const results = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const result = determineKittyClickAction(
          0,
          ['show'],
          { ...baseState, rrsrBought: true },
          false,
          false
        );
        results.add(result.action);
      }
      expect(results.has('rickroll')).toBe(true);
    });

    it('can trigger Redunception recursion', () => {
      const results = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const result = determineKittyClickAction(
          0,
          ['show'],
          { ...baseState, redunception: true },
          false,
          false
        );
        results.add(result.action);
      }
      expect(results.has('recurse')).toBe(true);
    });

    it('can trigger Logicat puzzle', () => {
      const results = new Set<string>();
      for (let i = 0; i < 200; i++) {
        const result = determineKittyClickAction(
          0,
          ['show'],
          { ...baseState, logicat: true },
          false,
          false
        );
        results.add(result.action);
      }
      expect(results.has('logicat')).toBe(true);
    });

    it('prevents recursion beyond depth 21', () => {
      const deepDrawType = Array(21).fill('show');
      const result = determineKittyClickAction(
        0,
        deepDrawType,
        { ...baseState, redunception: true },
        false,
        false
      );
      expect(result.action).not.toBe('recurse');
    });

    it('Ranger catches logicat when enabled', () => {
      const result = determineKittyClickAction(
        0,
        ['show', 'show', 'show'], // Depth 3 = 50% chance
        { ...baseState, logicat: true },
        true, // hasRanger
        false // cage not full
      );
      // With 50% chance at depth 3, we should eventually get logicat
      let gotLogicat = false;
      for (let i = 0; i < 100; i++) {
        const r = determineKittyClickAction(
          0,
          ['show', 'show', 'show'],
          { ...baseState, logicat: true },
          true,
          false
        );
        if (r.action === 'logicat' && !r.extendTimer) {
          gotLogicat = true;
          break;
        }
      }
      expect(gotLogicat).toBe(true);
    });

    it('falls through when Ranger cage is full', () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const result = determineKittyClickAction(
          0,
          ['show', 'show', 'show'],
          { ...baseState, logicat: true, redunception: true },
          true, // hasRanger
          true  // cage full
        );
        results.add(result.action);
      }
      // Should get recurse or hide, but not logicat with extendTimer=false
      expect(results.has('recurse') || results.has('hide')).toBe(true);
    });
  });

  describe('applyKittyClickResult', () => {
    it('resets state on hide action', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 5,
        chainMax: 8,
        spawnCountdown: 0,
        despawnCountdown: 10,
        isActive: true,
        recursionDepth: 2,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 1,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'hide', reason: 'missed' }, state, 0);

      expect(state.isActive).toBe(false);
      expect(state.despawnCountdown).toBe(0);
      expect(state.drawType).toEqual([]);
      expect(state.chainCurrent).toBe(0);
      expect(state.keepPosition).toBe(0);
    });

    it('updates to show and trims deeper levels', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 3,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 10,
        isActive: true,
        recursionDepth: 4,
        drawType: ['show', 'recur', 'hide1', 'show', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'show', level: 2 }, state, 2);

      expect(state.drawType).toEqual(['show', 'recur', 'show']);
      expect(state.drawType.length).toBe(3);
    });

    it('adds recursive level on recurse action', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 2,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 10,
        isActive: true,
        recursionDepth: 2,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'recurse', newDepth: 4 }, state, 2);

      expect(state.drawType).toEqual(['show', 'recur', 'recur', 'show']);
      expect(state.chainCurrent).toBe(3);
    });

    it('extends timer for deep recursion', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 2,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 3,
        isActive: true,
        recursionDepth: 3,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'recurse', newDepth: 4 }, state, 2);

      expect(state.despawnCountdown).toBe(5); // Extended to minimum 5
    });

    it('sets hide2 and extends timer for logicat puzzle', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 2,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 15,
        isActive: true,
        recursionDepth: 2,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'logicat', extendTimer: true }, state, 2);

      expect(state.drawType[2]).toBe('hide2');
      expect(state.despawnCountdown).toBe(20); // Extended to minimum 20
      expect(state.chainCurrent).toBe(3);
      expect(state.keepPosition).toBe(1); // Locked for puzzle
    });

    it('resets state for Ranger logicat catch', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 3,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 15,
        isActive: true,
        recursionDepth: 3,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'logicat', extendTimer: false }, state, 2);

      expect(state.isActive).toBe(false);
      expect(state.despawnCountdown).toBe(0);
      expect(state.drawType).toEqual([]);
      expect(state.chainCurrent).toBe(0);
    });

    it('sets hide1 and timer for rickroll', () => {
      const state: RedundakittyState = {
        totalClicks: 10,
        chainCurrent: 2,
        chainMax: 5,
        spawnCountdown: 0,
        despawnCountdown: 20,
        isActive: true,
        recursionDepth: 2,
        drawType: ['show', 'recur', 'show'],
        keepPosition: 0,
        logicatState: { activePuzzle: null, timeRemaining: 0, totalCorrect: 0, totalIncorrect: 0, currentStreak: 0, bestStreak: 0 }
      };

      applyKittyClickResult({ action: 'rickroll', duration: 65 }, state, 2);

      expect(state.drawType[2]).toBe('hide1');
      expect(state.despawnCountdown).toBe(65);
      expect(state.chainCurrent).toBe(3);
    });
  });
});
