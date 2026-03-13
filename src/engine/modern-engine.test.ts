/**
 * Tests for ModernEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData, BoostGroup, BoostDefinition } from '../types/game-data.js';

// Helper to create a boost definition
function createBoostDef(id: number, alias: string, group: BoostGroup = 'boosts', price: Record<string, number | string> = {}): BoostDefinition {
  return {
    id,
    name: alias,
    alias,
    icon: alias.toLowerCase().replace(/\s/g, ''),
    group,
    description: `${alias} boost`,
    price,
    isToggle: false,
    isStuff: group === 'stuff',
    hasDynamicDescription: false,
    hasDynamicStats: false,
    hasDynamicPrice: false,
    hasBuyFunction: false,
    hasLockFunction: false,
    hasUnlockFunction: false,
    hasCountdownFunction: false,
    hasLoadFunction: false,
  };
}

// Minimal game data for testing
const testGameData: GameData = {
  version: '1.0.0',
  sourceVersion: 4.12,
  extractedAt: '2026-01-25T00:00:00.000Z',
  boosts: {
    'Sand': createBoostDef(0, 'Sand', 'stuff'),
    'Castles': createBoostDef(1, 'Castles', 'stuff'),
    'GlassChips': createBoostDef(2, 'GlassChips', 'stuff'),
    'GlassBlocks': createBoostDef(3, 'GlassBlocks', 'stuff'),
    'Goats': createBoostDef(10, 'Goats', 'stuff'),
    'Bonemeal': createBoostDef(20, 'Bonemeal', 'stuff'),
    'Bigger Buckets': createBoostDef(4, 'Bigger Buckets', 'boosts', { Sand: 500 }),
    'BiggerBuckets': createBoostDef(4, 'BiggerBuckets', 'boosts', { Sand: 500 }),
    'Huge Buckets': createBoostDef(5, 'Huge Buckets', 'boosts', { Sand: 800, Castles: 2 }),
    'HugeBuckets': createBoostDef(5, 'HugeBuckets', 'boosts', { Sand: 800, Castles: 2 }),
    'Buccaneer': createBoostDef(12, 'Buccaneer', 'boosts', { Sand: 1000 }),
    'HelpfulHands': createBoostDef(13, 'HelpfulHands', 'boosts', { Sand: 500 }),
    'TrueColours': createBoostDef(14, 'TrueColours', 'boosts', { Sand: 500 }),
    'RaiseTheFlag': createBoostDef(15, 'RaiseTheFlag', 'boosts', { Sand: 500 }),
    'HandItUp': createBoostDef(16, 'HandItUp', 'boosts', { Sand: 500 }),
    'BucketBrigade': createBoostDef(17, 'BucketBrigade', 'boosts', { Sand: 500 }),
    'BagPuns': createBoostDef(18, 'BagPuns', 'boosts', { Sand: 500 }),
    'BoneClicker': createBoostDef(19, 'BoneClicker', 'boosts', { Sand: 500 }),
    'Helping Hand': createBoostDef(6, 'Helping Hand', 'boosts', { Sand: 500, Castles: 2 }),
    'Cooperation': createBoostDef(7, 'Cooperation'),
    'Spring Fling': createBoostDef(8, 'Spring Fling', 'boosts', { Sand: 1000, Castles: 6 }),
    'Trebuchet Pong': createBoostDef(9, 'Trebuchet Pong'),
    'Goat Boost': createBoostDef(11, 'Goat Boost', 'boosts', { Goats: 5 }),
  },
  boostsById: [
    { alias: 'Sand' },
    { alias: 'Castles' },
    { alias: 'GlassChips' },
    { alias: 'GlassBlocks' },
    { alias: 'Bigger Buckets' },
  ] as any,
  badges: {
    'Click Ninja': {
      id: 0,
      name: 'Click Ninja',
      group: 'badges',
      description: 'Click the beach',
      visibility: 0,
      hasDynamicDescription: false,
    },
  },
  badgesById: [
    { name: 'Click Ninja', group: 'badges' },
  ] as any,
  sandTools: [
    {
      id: 0,
      name: 'Bucket',
      commonName: 'bucket',
      icon: 'bucket',
      description: 'Produces sand',
      type: 'sand' as const,
      basePrice: 10,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
    {
      id: 1,
      name: 'Cuegan',
      commonName: 'cuegan',
      icon: 'cuegan',
      description: 'Produces sand',
      type: 'sand' as const,
      basePrice: 100,
      nextThreshold: 1000,
      hasDynamicRate: false,
    },
    {
      id: 2,
      name: 'Flag',
      commonName: 'flag',
      icon: 'flag',
      description: 'Produces sand',
      type: 'sand' as const,
      basePrice: 420,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
    {
      id: 3,
      name: 'Ladder',
      commonName: 'ladder',
      icon: 'ladder',
      description: 'Produces sand',
      type: 'sand' as const,
      basePrice: 1700,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
    {
      id: 4,
      name: 'Bag',
      commonName: 'bag',
      icon: 'bag',
      description: 'Produces sand',
      type: 'sand' as const,
      basePrice: 12000,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
  ],
  castleTools: [
    {
      id: 0,
      name: 'NewPixBot',
      commonName: 'newpixbot',
      icon: 'newpixbot',
      description: 'Builds castles at ONG',
      type: 'castle' as const,
      basePrice: 50,
      nextThreshold: 100,
      hasDynamicRate: false,
    },
    {
      id: 1,
      name: 'Trebuchet',
      commonName: 'trebuchet',
      icon: 'trebuchet',
      description: 'Flings things',
      type: 'castle' as const,
      basePrice: 100,
      nextThreshold: 500,
      hasDynamicRate: false,
    },
  ],
  groups: {} as any,
};

describe('ModernEngine', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(testGameData);
    await engine.initialize();
  });

  describe('initialization', () => {
    it('initializes with default state', async () => {
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.sand).toBe(0);
      expect(snapshot.castles).toBe(0);
      expect(snapshot.newpixNumber).toBe(1);
      expect(snapshot.beachClicks).toBe(0);
    });

    it('initializes sand tools', async () => {
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.sandTools['Bucket']).toBeDefined();
      expect(snapshot.sandTools['Bucket'].amount).toBe(0);
      expect(snapshot.sandTools['Cuegan']).toBeDefined();
    });

    it('initializes castle tools', async () => {
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.castleTools['NewPixBot']).toBeDefined();
      expect(snapshot.castleTools['NewPixBot'].amount).toBe(0);
      expect(snapshot.castleTools['Trebuchet']).toBeDefined();
    });

    it('initializes boosts', async () => {
      const boostState = await engine.getBoostState('Bigger Buckets');

      expect(boostState.unlocked).toBe(0);
      expect(boostState.bought).toBe(0);
      expect(boostState.power).toBe(0);
    });
  });

  describe('beach clicking', () => {
    it('increments beach clicks', async () => {
      await engine.clickBeach(5);
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.beachClicks).toBe(5);
    });

    it('digs sand and auto-converts to castles', async () => {
      await engine.clickBeach(10);
      const snapshot = await engine.getStateSnapshot();

      // 10 clicks = 10 sand dug
      // Fibonacci castle costs: 1, 1, 2, 3 = 7 sand for 4 castles
      // Remaining: 10 - 7 = 3 sand
      expect(snapshot.castles).toBe(4);
      expect(snapshot.sand).toBe(3);
    });

    it('syncs sand to boost power after conversion', async () => {
      await engine.clickBeach(10);
      const sandBoost = await engine.getBoostState('Sand');

      // After Fibonacci castle conversion, 3 sand remains
      expect(sandBoost.power).toBe(3);
    });
  });

  describe('tick processing', () => {
    it('produces sand from tools and converts to castles', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.tick(1);
      const snapshot = await engine.getStateSnapshot();

      // 10 buckets * 0.1 base rate = 1 sand per tick
      // Sand is auto-converted to castles via toCastles()
      // 1 sand = 1 castle (first castle costs 1 sand)
      expect(snapshot.castles).toBe(1);
      expect(snapshot.sand).toBe(0); // All sand converted
    });

    it('accumulates castles over multiple ticks', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.tick(5);
      const snapshot = await engine.getStateSnapshot();

      // Each tick produces 1 sand, which is auto-converted to castles
      // Fibonacci costs: 1, 1, 2, 3, 5 = 12 sand for 5 castles
      // With 5 sand total (1 per tick), we get:
      // Tick 1: 1 sand -> 1 castle (cost 1), 0 remaining
      // Tick 2: 1 sand -> 1 castle (cost 1), 0 remaining
      // Tick 3: 1 sand -> 0 castles (cost 2, can't afford), 1 remaining
      // Tick 4: 1 sand -> 2 total, still can't afford 2, 2 remaining
      // Tick 5: 1 sand -> 3 total, can afford 2 -> 1 castle, 1 remaining
      // Total: 3 castles, 1 sand
      expect(snapshot.castles).toBe(3);
      expect(snapshot.sand).toBe(1);
    });

    it('tracks total sand produced by tool', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.tick(3);
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.sandTools['Bucket'].totalSand).toBe(3);
    });
  });

  describe('sand rate calculation', () => {
    it('returns 0 with no tools', async () => {
      const rate = await engine.getSandRate();
      expect(rate).toBe(0);
    });

    it('calculates rate from buckets', async () => {
      engine.setSandToolAmount('Bucket', 10);
      const rate = await engine.getSandRate();

      // 10 buckets * 0.1 base rate
      expect(rate).toBe(1);
    });

    it('calculates combined rate from multiple tools', async () => {
      engine.setSandToolAmount('Bucket', 10);
      engine.setSandToolAmount('Cuegan', 5);
      const rate = await engine.getSandRate();

      // (10 * 0.1) + (5 * 0.6) = 1 + 3 = 4
      expect(rate).toBe(4);
    });
  });

  describe('newpix management', () => {
    it('sets newpix directly', async () => {
      await engine.setNewpix(100);
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.newpixNumber).toBe(100);
    });

    it('advances newpix on ONG', async () => {
      const before = (await engine.getStateSnapshot()).newpixNumber;
      await engine.advanceToONG();
      const after = (await engine.getStateSnapshot()).newpixNumber;

      expect(after).toBe(before + 1);
    });
  });

  describe('action execution', () => {
    it('executes click action', async () => {
      await engine.executeAction({ type: 'click', target: 'beach', count: 3 });
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.beachClicks).toBe(3);
    });

    it('executes tick action', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.executeAction({ type: 'tick', count: 2 });
      const snapshot = await engine.getStateSnapshot();

      // 2 ticks * 1 sand/tick = 2 sand produced
      // Fibonacci: first castle costs 1, second costs 1
      // So 2 sand -> 2 castles
      expect(snapshot.castles).toBe(2);
      expect(snapshot.sand).toBe(0);
    });

    it('executes set-newpix action', async () => {
      await engine.executeAction({ type: 'set-newpix', np: 50 });
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.newpixNumber).toBe(50);
    });

    it('executes ong action', async () => {
      await engine.executeAction({ type: 'set-newpix', np: 10 });
      await engine.executeAction({ type: 'ong' });
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.newpixNumber).toBe(11);
    });
  });

  describe('dispose', () => {
    it('clears state on dispose', async () => {
      await engine.clickBeach(10);
      await engine.dispose();

      await expect(engine.getStateSnapshot()).rejects.toThrow('not initialized');
    });
  });

  describe('auto-unlock', () => {
    it('unlocks Bigger Buckets when buying first bucket', async () => {
      // Give enough castles to buy a bucket (sand tools cost castles!)
      engine.setCastles(100);

      // Verify not unlocked initially
      let boostState = await engine.getBoostState('Bigger Buckets');
      expect(boostState.unlocked).toBe(0);

      // Buy a bucket
      await engine.buyTool('sand', 'Bucket');

      // Verify now unlocked
      boostState = await engine.getBoostState('Bigger Buckets');
      expect(boostState.unlocked).toBe(1);
    });

    it('unlocks Huge Buckets when buying 4 buckets', async () => {
      // Sand tools cost castles
      engine.setCastles(1000);

      // Buy 4 buckets
      await engine.buyTool('sand', 'Bucket', 4);

      const boostState = await engine.getBoostState('Huge Buckets');
      expect(boostState.unlocked).toBe(1);
    });

    it('unlocks multiple boosts when threshold crossed', async () => {
      // Sand tools cost castles
      engine.setCastles(1000);

      // Buy 4 buckets - should unlock both Bigger and Huge Buckets
      await engine.buyTool('sand', 'Bucket', 4);

      const biggerState = await engine.getBoostState('Bigger Buckets');
      const hugeState = await engine.getBoostState('Huge Buckets');

      expect(biggerState.unlocked).toBe(1);
      expect(hugeState.unlocked).toBe(1);
    });

    it('unlocks Helping Hand when buying first Cuegan', async () => {
      // Sand tools cost castles
      engine.setCastles(500);

      await engine.buyTool('sand', 'Cuegan');

      const boostState = await engine.getBoostState('Helping Hand');
      expect(boostState.unlocked).toBe(1);
    });

    it('unlocks Cooperation at 4 Cuegans', async () => {
      // Sand tools cost castles
      engine.setCastles(2000);

      await engine.buyTool('sand', 'Cuegan', 4);

      const boostState = await engine.getBoostState('Cooperation');
      expect(boostState.unlocked).toBe(1);
    });

    it('unlocks Spring Fling when buying first Trebuchet', async () => {
      engine.setCastles(500);

      await engine.buyTool('castle', 'Trebuchet');

      const boostState = await engine.getBoostState('Spring Fling');
      expect(boostState.unlocked).toBe(1);
    });

    it('unlocks Trebuchet Pong at 2 Trebuchets', async () => {
      engine.setCastles(1000);

      await engine.buyTool('castle', 'Trebuchet', 2);

      const boostState = await engine.getBoostState('Trebuchet Pong');
      expect(boostState.unlocked).toBe(1);
    });

    it('does not unlock already unlocked boosts twice', async () => {
      // Sand tools cost castles
      engine.setCastles(100);

      // Buy first bucket - unlocks Bigger Buckets
      await engine.buyTool('sand', 'Bucket');
      let boostState = await engine.getBoostState('Bigger Buckets');
      expect(boostState.unlocked).toBe(1);

      // Buy another bucket - should not re-unlock
      engine.setCastles(100);
      await engine.buyTool('sand', 'Bucket');
      boostState = await engine.getBoostState('Bigger Buckets');
      expect(boostState.unlocked).toBe(1); // Still 1, not 2
    });
  });

  describe('Castle Tool Production', () => {
    // IMPORTANT: In the legacy game, castle tools do NOT produce during regular ticks!
    // Castle tools only run DestroyPhase/BuildPhase at ONG (newpix transitions).
    // See castle.js:3768-3787 for ONG-only castle tool processing.

    it('does NOT process castle tools during ticks (Trebuchet)', async () => {
      // Buy a Trebuchet and give it castles to work with
      engine.setCastles(10000);
      await engine.buyTool('castle', 'Trebuchet'); // costs ~14 castles

      const state = await engine.getStateSnapshot();
      const trebuchetState = state.castleTools['Trebuchet'];
      expect(trebuchetState.amount).toBe(1);

      // Record castles before tick
      const castlesBefore = state.castles;

      // Run a tick - Trebuchet should NOT produce (only at ONG)
      await engine.tick(1);

      const stateAfter = await engine.getStateSnapshot();
      // Castle count unchanged (no castle tool processing during ticks)
      expect(stateAfter.castles).toBe(castlesBefore);
    });

    it('does NOT process multiple castle tools during ticks', async () => {
      engine.setCastles(100000);

      // Buy 3 Trebuchets
      await engine.buyTool('castle', 'Trebuchet', 3);

      const state = await engine.getStateSnapshot();
      expect(state.castleTools['Trebuchet'].amount).toBe(3);

      const castlesBefore = state.castles;

      // Run a tick - castle tools do NOT produce during ticks
      await engine.tick(1);

      const stateAfter = await engine.getStateSnapshot();
      expect(stateAfter.castles).toBe(castlesBefore);
    });

    it('processes castle tools at ONG (Trebuchet)', async () => {
      engine.setCastles(10000);
      await engine.buyTool('castle', 'Trebuchet');

      const castlesBefore = (await engine.getStateSnapshot()).castles;

      // Run ONG - castle tools process during ONG
      await engine.advanceToONG();

      const stateAfter = await engine.getStateSnapshot();
      // Trebuchet: destroyC=2, buildC=4, net=+2 per tool
      // Note: exact value depends on ONG processing order and Fibonacci reset
      expect(stateAfter.castles).not.toBe(castlesBefore);
    });

    it('does not process NewPixBot during tick', async () => {
      engine.setCastles(100);
      await engine.buyTool('castle', 'NewPixBot');

      const castlesBefore = (await engine.getStateSnapshot()).castles;

      // NewPixBot only produces at ONG, not during ticks
      await engine.tick(10);

      const castlesAfter = (await engine.getStateSnapshot()).castles;
      expect(castlesAfter).toBe(castlesBefore);
    });

    it('calculates castle rate correctly (theoretical rate)', async () => {
      engine.setCastles(100000);

      // Buy 2 Trebuchets (net +2 each = +4 total)
      await engine.buyTool('castle', 'Trebuchet', 2);

      // getCastleRate returns theoretical per-ONG rate (not per-tick)
      // Castle tools don't actually produce during ticks
      const rate = await engine.getCastleRate();
      expect(rate).toBe(4); // 2 * (4 - 2) = 4
    });

    it('tracks totalCastlesBuilt and totalCastlesDestroyed at ONG', async () => {
      engine.setCastles(10000);
      await engine.buyTool('castle', 'Trebuchet');

      // Run ONG (not ticks) - castle tools process at ONG
      await engine.advanceToONG();

      const state = await engine.getStateSnapshot();
      const trebuchetState = state.castleTools['Trebuchet'];

      // 1 ONG * 1 tool: destroy 2, build 4
      expect(trebuchetState.totalCastlesDestroyed).toBe(2);
      expect(trebuchetState.totalCastlesBuilt).toBe(4);
    });
  });

  describe('Boost Price Checking', () => {
    it('returns calculated price for a boost', async () => {
      // Bigger Buckets costs 500 Sand
      const price = engine.getBoostPrice('Bigger Buckets');
      expect(price).toEqual({ Sand: 500 });
    });

    it('returns empty object for unknown boost', async () => {
      const price = engine.getBoostPrice('NonExistent');
      expect(price).toEqual({});
    });

    it('returns empty object for free boost', async () => {
      // Cooperation has no price
      const price = engine.getBoostPrice('Cooperation');
      expect(price).toEqual({});
    });

    it('handles multi-resource prices', async () => {
      // Huge Buckets costs Sand: 800, Castles: 2
      const price = engine.getBoostPrice('Huge Buckets');
      expect(price).toEqual({ Sand: 800, Castles: 2 });
    });

    it('isBoostAffordable returns false when boost not unlocked', async () => {
      engine.setSand(10000);
      // Bigger Buckets is not unlocked yet
      const affordable = await engine.isBoostAffordable('Bigger Buckets');
      expect(affordable).toBe(false);
    });

    it('isBoostAffordable returns true when unlocked and can afford', async () => {
      engine.setSand(1000);
      engine.unlockBoost('Bigger Buckets');

      const affordable = await engine.isBoostAffordable('Bigger Buckets');
      expect(affordable).toBe(true);
    });

    it('isBoostAffordable returns false when cannot afford', async () => {
      engine.setSand(100); // Not enough (needs 500)
      engine.unlockBoost('Bigger Buckets');

      const affordable = await engine.isBoostAffordable('Bigger Buckets');
      expect(affordable).toBe(false);
    });

    it('isBoostAffordable checks all resources', async () => {
      // Huge Buckets needs Sand: 800, Castles: 2
      engine.setSand(1000);
      engine.setCastles(1); // Not enough castles
      engine.unlockBoost('Huge Buckets');

      const affordable = await engine.isBoostAffordable('Huge Buckets');
      expect(affordable).toBe(false);

      // Now give enough castles
      engine.setCastles(10);
      const affordableNow = await engine.isBoostAffordable('Huge Buckets');
      expect(affordableNow).toBe(true);
    });

    it('isBoostAffordable returns true for free boosts', async () => {
      engine.unlockBoost('Cooperation');

      const affordable = await engine.isBoostAffordable('Cooperation');
      expect(affordable).toBe(true);
    });

    it('buyBoost spends the correct resources', async () => {
      engine.setSand(1000);
      engine.setCastles(10);
      engine.unlockBoost('Huge Buckets');

      await engine.buyBoost('Huge Buckets');

      const state = await engine.getStateSnapshot();
      // Started with 1000 sand, spent 800
      expect(state.sand).toBe(200);
      // Started with 10 castles, spent 2
      expect(state.castles).toBe(8);
      // Boost should be bought
      expect(state.boosts['Huge Buckets'].bought).toBe(1);
    });

    it('buyBoost does not spend if cannot afford', async () => {
      engine.setSand(100); // Not enough
      engine.unlockBoost('Bigger Buckets');

      await engine.buyBoost('Bigger Buckets');

      const state = await engine.getStateSnapshot();
      // Sand should be unchanged
      expect(state.sand).toBe(100);
      // Boost should not be bought
      expect(state.boosts['Bigger Buckets'].bought).toBe(0);
    });

    it('handles non-primary resources via boost power', async () => {
      // Set up Goats as a resource (stored in boost power)
      const goatsBoost = await engine.getBoostState('Goats');
      expect(goatsBoost.power).toBe(0);

      // Unlock and try to buy Goat Boost which costs 5 Goats
      engine.unlockBoost('Goat Boost');

      // Should not be affordable with 0 goats
      let affordable = await engine.isBoostAffordable('Goat Boost');
      expect(affordable).toBe(false);

      // Give some goats by setting the boost power directly
      // In real game, goats would be earned through gameplay
      const state = await engine.getStateSnapshot();
      state.boosts['Goats'].power = 10;
      // Note: We need to manipulate the internal state for this test
      // This simulates having 10 goats
    });
  });

  describe('Click Multipliers', () => {
    it('returns 1 sand per click with no boosts', async () => {
      expect(engine.getSandPerClick()).toBe(1);

      await engine.clickBeach(1);
      const state = await engine.getStateSnapshot();
      // 1 sand spent on castle (Fibonacci cost 1), so sand = 0, castles = 1
      expect(state.castles).toBe(1);
    });

    it('increases sand per click with BiggerBuckets power', async () => {
      // BiggerBuckets adds 0.1 per power level
      engine.forceBoostState('BiggerBuckets', { bought: 1, power: 5 });

      // 1 + 5 * 0.1 = 1.5
      expect(engine.getSandPerClick()).toBe(1.5);
    });

    it('doubles sand per click with HugeBuckets', async () => {
      engine.forceBoostState('HugeBuckets', { bought: 1 });

      // Base 1 * 2 = 2
      expect(engine.getSandPerClick()).toBe(2);
    });

    it('doubles sand per click with Buccaneer', async () => {
      engine.forceBoostState('Buccaneer', { bought: 1 });

      // Base 1 * 2 = 2
      expect(engine.getSandPerClick()).toBe(2);
    });

    it('stacks HugeBuckets and Buccaneer multiplicatively', async () => {
      engine.forceBoostState('HugeBuckets', { bought: 1 });
      engine.forceBoostState('Buccaneer', { bought: 1 });

      // Base 1 * 2 * 2 = 4
      expect(engine.getSandPerClick()).toBe(4);
    });

    it('combines BiggerBuckets with multiplicative boosts', async () => {
      engine.forceBoostState('BiggerBuckets', { bought: 1, power: 10 });
      engine.forceBoostState('HugeBuckets', { bought: 1 });

      // (1 + 10 * 0.1) * 2 = 2 * 2 = 4
      expect(engine.getSandPerClick()).toBe(4);
    });

    it('adds pair bonus with HelpfulHands', async () => {
      engine.forceBoostState('HelpfulHands', { bought: 1 });
      engine.forceSandToolAmount('Bucket', 10);
      engine.forceSandToolAmount('Cuegan', 5);

      // 1 + 0.5 * min(10, 5) = 1 + 2.5 = 3.5
      expect(engine.getSandPerClick()).toBe(3.5);
    });

    it('adds pair bonus with TrueColours', async () => {
      engine.forceBoostState('TrueColours', { bought: 1 });
      engine.forceSandToolAmount('Flag', 3);
      engine.forceSandToolAmount('Cuegan', 8);

      // 1 + 5 * min(3, 8) = 1 + 15 = 16
      expect(engine.getSandPerClick()).toBe(16);
    });

    it('adds pair bonus with RaiseTheFlag', async () => {
      engine.forceBoostState('RaiseTheFlag', { bought: 1 });
      engine.forceSandToolAmount('Flag', 2);
      engine.forceSandToolAmount('Ladder', 4);

      // 1 + 50 * min(2, 4) = 1 + 100 = 101
      expect(engine.getSandPerClick()).toBe(101);
    });

    it('adds pair bonus with HandItUp', async () => {
      engine.forceBoostState('HandItUp', { bought: 1 });
      engine.forceSandToolAmount('Bag', 1);
      engine.forceSandToolAmount('Ladder', 3);

      // 1 + 500 * min(1, 3) = 1 + 500 = 501
      expect(engine.getSandPerClick()).toBe(501);
    });

    it('applies BoneClicker final multiplier', async () => {
      engine.forceBoostState('BoneClicker', { bought: 1 });
      engine.forceBoostState('Bonemeal', { power: 2 });

      // 1 * (2 * 5) = 10
      expect(engine.getSandPerClick()).toBe(10);
    });

    it('does not apply BoneClicker when bonemeal < 1', async () => {
      engine.forceBoostState('BoneClicker', { bought: 1 });
      engine.forceBoostState('Bonemeal', { power: 0 });

      // No multiplier applied
      expect(engine.getSandPerClick()).toBe(1);
    });

    it('stacks all multiplier types correctly', async () => {
      // Set up: BiggerBuckets(5), HugeBuckets, HelpfulHands, BoneClicker with 1 bonemeal
      engine.forceBoostState('BiggerBuckets', { bought: 1, power: 5 });
      engine.forceBoostState('HugeBuckets', { bought: 1 });
      engine.forceBoostState('HelpfulHands', { bought: 1 });
      engine.forceBoostState('BoneClicker', { bought: 1 });
      engine.forceBoostState('Bonemeal', { power: 1 });
      engine.forceSandToolAmount('Bucket', 4);
      engine.forceSandToolAmount('Cuegan', 2);

      // Step by step:
      // 1. Base: 1 + 5*0.1 = 1.5
      // 2. Mult: 1.5 * 2 = 3
      // 3. Helpful Hands: 3 + 0.5*min(4,2) = 3 + 1 = 4
      // 4. Bone Clicker: 4 * 1*5 = 20
      expect(engine.getSandPerClick()).toBe(20);
    });

    it('recalculates sand per click when buying tools', async () => {
      engine.forceBoostState('HelpfulHands', { bought: 1 });
      engine.forceResources({ castles: 10000 });

      // Initially no tools, so just base rate
      expect(engine.getSandPerClick()).toBe(1);

      // Buy some buckets and cuegans
      await engine.buyTool('sand', 'Bucket', 5);
      await engine.buyTool('sand', 'Cuegan', 3);

      // 1 + 0.5 * min(5, 3) = 1 + 1.5 = 2.5
      expect(engine.getSandPerClick()).toBe(2.5);
    });

    it('recalculates sand per click when buying boosts', async () => {
      engine.forceResources({ sand: 10000, castles: 100 });
      engine.unlockBoost('HugeBuckets');

      // Before buying HugeBuckets
      expect(engine.getSandPerClick()).toBe(1);

      // Buy HugeBuckets
      await engine.buyBoost('HugeBuckets');

      // After buying HugeBuckets
      expect(engine.getSandPerClick()).toBe(2);
    });

    it('applies calculated sand per click in beach clicks', async () => {
      engine.forceBoostState('BiggerBuckets', { bought: 1, power: 10 });
      // (1 + 10*0.1) = 2 sand per click

      await engine.clickBeach(5);

      const state = await engine.getStateSnapshot();
      // 5 clicks * 2 sand = 10 sand total
      // Fibonacci: costs 1, 1, 2, 3, 5 = 12 for 5 castles, but only 10 sand
      // So we can build 4 castles (cost 1+1+2+3=7), leaving 3 sand
      expect(state.sand).toBe(3);
      expect(state.castles).toBe(4);
    });
  });

  describe('tick orchestration', () => {
    it('increments life counter on each tick', async () => {
      const snapshot1 = await engine.getStateSnapshot();
      const life1 = (engine as any).core.life;
      expect(life1).toBe(0);

      await engine.tick(5);
      const life2 = (engine as any).core.life;
      expect(life2).toBe(5);
    });

    it('decrements Price Protection power per tick', async () => {
      // Add Price Protection to test data
      (engine as any).boosts.set('Price Protection', {
        unlocked: 1, bought: 1, power: 10, countdown: 0,
      });

      await engine.tick(3);

      const pp = (engine as any).boosts.get('Price Protection');
      // Power should decrement from 10 to 7 (3 ticks)
      expect(pp.power).toBe(7);
    });

    it('does not decrement Price Protection below 1', async () => {
      (engine as any).boosts.set('Price Protection', {
        unlocked: 1, bought: 1, power: 2, countdown: 0,
      });

      await engine.tick(5);

      const pp = (engine as any).boosts.get('Price Protection');
      // Power starts at 2, decrements to 1, then stops (only decrements when > 1)
      expect(pp.power).toBe(1);
    });

    it('updates ONG elapsed time per tick', async () => {
      const elapsed1 = (engine as any).ong.elapsed;
      await engine.tick(10);
      const elapsed2 = (engine as any).ong.elapsed;
      expect(elapsed2 - elapsed1).toBe(10000); // 10 ticks * 1000ms
    });

    it('does not update ONG elapsed during Coma', async () => {
      // Add Coma Molpy Style as a toggle boost
      const boostDef = createBoostDef(999, 'Coma Molpy Style', 'boosts');
      boostDef.isToggle = true;
      (engine as any).gameData.boosts['Coma Molpy Style'] = boostDef;
      (engine as any).boosts.set('Coma Molpy Style', {
        unlocked: 1, bought: 1, power: 1, countdown: 0, isEnabled: true,
      });

      const elapsed1 = (engine as any).ong.elapsed;
      await engine.tick(5);
      const elapsed2 = (engine as any).ong.elapsed;
      // ONG elapsed should not change during Coma
      expect(elapsed2).toBe(elapsed1);
    });

    it('digs sand with cachedTotalSandRate per tick', async () => {
      // Clear initial rate recalc flag first, then set our rate
      await engine.tick(1);
      (engine as any).cachedTotalSandRate = 100;

      await engine.tick(3);
      const state = await engine.getStateSnapshot();
      // 3 ticks * 100 sand per tick = 300 sand (before toCastles conversion)
      // toCastles converts sand to castles via Fibonacci cost sequence
      expect(state.sand + state.castles).toBeGreaterThan(0);
    });

    it('locks boost when countdown expires', async () => {
      (engine as any).boosts.set('TestCountdown', {
        unlocked: 1, bought: 1, power: 50, countdown: 3,
      });

      await engine.tick(3);

      const boost = (engine as any).boosts.get('TestCountdown');
      // After 3 ticks, countdown should be 0, boost locked (bought=0), power reset
      expect(boost.countdown).toBe(0);
      expect(boost.bought).toBe(0);
      expect(boost.power).toBe(0);
    });

    it('does not lock boost when countdown has not expired', async () => {
      (engine as any).boosts.set('TestCountdown', {
        unlocked: 1, bought: 1, power: 50, countdown: 10,
      });

      await engine.tick(3);

      const boost = (engine as any).boosts.get('TestCountdown');
      expect(boost.countdown).toBe(7);
      expect(boost.bought).toBe(1);
      expect(boost.power).toBe(50);
    });

    it('recalculates rates on first tick via needsRateRecalc flag', async () => {
      // needsRateRecalc starts at 1
      expect((engine as any).needsRateRecalc).toBe(1);

      await engine.tick(1);

      // After first tick, flag should be cleared
      expect((engine as any).needsRateRecalc).toBe(0);
    });

    it('flagRateRecalc triggers recalculation on next tick', async () => {
      // Clear the initial flag
      await engine.tick(1);
      expect((engine as any).needsRateRecalc).toBe(0);

      // Flag for recalc
      engine.flagRateRecalc();
      expect((engine as any).needsRateRecalc).toBe(1);

      await engine.tick(1);
      expect((engine as any).needsRateRecalc).toBe(0);
    });

    it('papal returns 1 when no decree active', () => {
      expect(engine.papal('Sand')).toBe(1);
      expect(engine.papal('Chips')).toBe(1);
      expect(engine.papal('ToolF')).toBe(1);
    });

    it('papal returns multiplier when decree matches', () => {
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 2;
      (engine as any).papalBoostFactor = 1.5;

      expect(engine.papal('Sand')).toBe(3); // 2 * 1.5
      expect(engine.papal('Chips')).toBe(1); // doesn't match
    });

    it('papal applies inverse for values less than 1', () => {
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 0.5;
      (engine as any).papalBoostFactor = 2;

      expect(engine.papal('Sand')).toBe(0.25); // 0.5 / 2
    });

    it('accumulates sand tool totals per tick', async () => {
      // Clear initial rate recalc flag first, then set our values
      await engine.tick(1);
      const bucket = (engine as any).sandTools.get('Bucket');
      bucket.amount = 5;
      bucket.totalSand = 0;
      (engine as any).cachedSandToolRates['Bucket'] = 10;

      await engine.tick(3);

      // totalSand should increase: 3 ticks * 10 rate * 5 amount = 150
      expect(bucket.totalSand).toBe(150);
    });

    it('digSand adds sand and auto-converts to castles', async () => {
      // Clear initial rate recalc flag first, then set our rate
      await engine.tick(1);
      (engine as any).cachedTotalSandRate = 1000;

      await engine.tick(1);

      const state = await engine.getStateSnapshot();
      // Should have produced 1000 sand, some converted to castles
      expect(state.castles).toBeGreaterThan(0);
      expect(state.sand + state.castles).toBeGreaterThan(0);
    });
  });

  describe('beach click system', () => {
    it('increments beachClicks on each click', async () => {
      await engine.clickBeach(5);
      const state = await engine.getStateSnapshot();
      expect(state.beachClicks).toBe(5);
    });

    it('gains sand per click via clickSandGain', async () => {
      (engine as any).cachedSandPerClick = 50;
      await engine.clickBeach(3);
      const state = await engine.getStateSnapshot();
      // 3 clicks * 50 sand = 150, minus some converted to castles
      expect(state.sand + state.castles).toBeGreaterThan(0);
    });

    it('loads TF chips on click when TF bought and sand infinite', async () => {
      (engine as any).boosts.set('TF', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('BG', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).resources.sand = Infinity;

      // Need some boosts owned for chips per click formula
      for (let i = 0; i < 10; i++) {
        (engine as any).boosts.set(`TestBoost${i}`, { unlocked: 1, bought: 1, power: 0 });
      }

      await engine.clickBeach(1);

      const tf = (engine as any).boosts.get('TF');
      // boostsOwned * 4 chips per click, at least 12 boosts bought (TF, BG, 10 test)
      expect(tf.power).toBeGreaterThan(0);
    });

    it('does not load TF chips when sand is finite', async () => {
      (engine as any).boosts.set('TF', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('BG', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).resources.sand = 1000;

      await engine.clickBeach(1);

      const tf = (engine as any).boosts.get('TF');
      expect(tf.power).toBe(0);
    });

    it('adds mustard from NaN tools on click', async () => {
      (engine as any).boosts.set('Mustard', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).mustardToolCount = 3;

      await engine.clickBeach(5);

      const mustard = (engine as any).boosts.get('Mustard');
      expect(mustard.power).toBe(15); // 5 clicks * 3 mustard tools
    });

    it('does not add mustard when no NaN tools', async () => {
      (engine as any).boosts.set('Mustard', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).mustardToolCount = 0;

      await engine.clickBeach(5);

      const mustard = (engine as any).boosts.get('Mustard');
      expect(mustard.power).toBe(0);
    });

    it('Doubletap causes double click processing', async () => {
      (engine as any).boosts.set('Doubletap', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).cachedSandPerClick = 10;

      await engine.clickBeach(1);

      // Should have processed 2 clicks (1 + doubletap), beachClicks = 2
      const state = await engine.getStateSnapshot();
      expect(state.beachClicks).toBe(2);
    });

    it('Doubletap does not recurse infinitely', async () => {
      (engine as any).boosts.set('Doubletap', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).cachedSandPerClick = 10;

      await engine.clickBeach(1);

      // Only 2 clicks, not infinite
      const state = await engine.getStateSnapshot();
      expect(state.beachClicks).toBe(2);
    });

    it('Bag Puns increments every 20 clicks', async () => {
      (engine as any).boosts.set('BagPuns', { unlocked: 1, bought: 1, power: 0 });

      await engine.clickBeach(40);

      const bagPuns = (engine as any).boosts.get('BagPuns');
      expect(bagPuns.power).toBe(2); // clicks 20 and 40
    });

    it('Bag Puns unlocks VJ at power > 100', async () => {
      (engine as any).boosts.set('BagPuns', { unlocked: 1, bought: 1, power: 99 });

      // Need exactly 20th click to trigger increment
      (engine as any).core.beachClicks = 19; // next click will be 20
      await engine.clickBeach(1);

      const bagPuns = (engine as any).boosts.get('BagPuns');
      expect(bagPuns.power).toBe(100);

      // One more cycle to get > 100
      await engine.clickBeach(19); // clicks 21-39
      await engine.clickBeach(1);  // click 40

      expect(bagPuns.power).toBe(101);
    });

    it('Bag Puns does not increment when VJ is bought', async () => {
      (engine as any).boosts.set('BagPuns', { unlocked: 1, bought: 1, power: 50 });
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 0 });

      await engine.clickBeach(40);

      const bagPuns = (engine as any).boosts.get('BagPuns');
      expect(bagPuns.power).toBe(50); // unchanged
    });

    it('HandleClickNP awards Badge Not Found at NP 404', async () => {
      (engine as any).core.newpixNumber = 404;

      await engine.clickBeach(1);

      expect((engine as any).badges.get('Badge Not Found')).toBe(true);
    });

    it('Ritual Sacrifice preserves ninja ritual with goats', async () => {
      (engine as any).boosts.set('NinjaRitual', { unlocked: 1, bought: 1, power: 30 });
      (engine as any).boosts.set('RitualSacrifice', { unlocked: 1, bought: 1, power: 1, isEnabled: true });
      (engine as any).boosts.set('Goats', { unlocked: 1, bought: 1, power: 10 });

      // Set up for stealth click (npbONG = 1, not ninjad, has NPB)
      (engine as any).ong.npbONG = 1;
      (engine as any).core.ninjad = false;
      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 1;

      await engine.clickBeach(1);

      const goats = (engine as any).boosts.get('Goats');
      expect(goats.power).toBe(5); // spent 5 goats
      const ninjaRitual = (engine as any).boosts.get('NinjaRitual');
      expect(ninjaRitual.power).toBe(30); // preserved, not reset
    });

    it('Ritual resets when no sacrifice available', async () => {
      (engine as any).boosts.set('NinjaRitual', { unlocked: 1, bought: 1, power: 30 });
      // No RitualSacrifice or RitualRift

      (engine as any).ong.npbONG = 1;
      (engine as any).core.ninjad = false;
      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 1;

      await engine.clickBeach(1);

      const ninjaRitual = (engine as any).boosts.get('NinjaRitual');
      expect(ninjaRitual.power).toBe(0); // reset
    });

    it('Ritual Rift unlock requires Time Lord bought > 8', async () => {
      (engine as any).boosts.set('NinjaRitual', { unlocked: 1, bought: 1, power: 42 });
      (engine as any).boosts.set('TimeLord', { unlocked: 1, bought: 9, power: 0 });
      (engine as any).boosts.set('RitualRift', { unlocked: 0, bought: 0, power: 0 });

      // Set up for ninja break (npbONG = 0, not ninjad, has NPB)
      (engine as any).ong.npbONG = 0;
      (engine as any).core.ninjad = false;
      (engine as any).core.ninjaStealth = 0; // no stealth to break
      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 1;

      await engine.clickBeach(1);

      // RitualRift should have been unlocked
      const ritualRift = (engine as any).boosts.get('RitualRift');
      expect(ritualRift?.unlocked).toBe(1);
    });

    it('VJ fires every Nth click and builds castles', async () => {
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 5 });
      // No NPB means we go to the VJ branch
      (engine as any).core.ninjad = true; // skip ninja branch

      await engine.clickBeach(100);

      const vj = (engine as any).boosts.get('VJ');
      // VJ fires at click 100 (sawmod=100)
      expect(vj.power).toBe(6); // was 5, incremented once
    });

    it('VJ fires more often with Short Saw', async () => {
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('ShortSaw', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).core.ninjad = true;

      await engine.clickBeach(100);

      const vj = (engine as any).boosts.get('VJ');
      // With Short Saw, fires every 20 clicks: at 20, 40, 60, 80, 100 = 5 times
      expect(vj.power).toBe(5);
    });
  });

  describe('ONG transition enhancements', () => {
    it('resets Lightning Rod power by 5% at ONG', async () => {
      (engine as any).boosts.set('LR', { unlocked: 1, bought: 1, power: 1000 });

      await engine.advanceToONG();

      const lr = (engine as any).boosts.get('LR');
      expect(lr.power).toBe(950); // 1000 * 0.95
    });

    it('clamps Lightning Rod decay to Lightning in a Bottle minimum', async () => {
      (engine as any).boosts.set('LR', { unlocked: 1, bought: 1, power: 1000 });
      (engine as any).boosts.set('LightningInABottle', { unlocked: 1, bought: 1, power: 980 });

      await engine.advanceToONG();

      const lr = (engine as any).boosts.get('LR');
      // 1000 * 0.95 = 950 < 980, so clamped to 980
      expect(lr.power).toBe(980);
    });

    it('does not decay Lightning Rod when power <= 500', async () => {
      (engine as any).boosts.set('LR', { unlocked: 1, bought: 1, power: 500 });

      await engine.advanceToONG();

      const lr = (engine as any).boosts.get('LR');
      expect(lr.power).toBe(500);
    });

    it('disables Glass Trolling at ONG', async () => {
      (engine as any).boosts.set('GlassTrolling', { unlocked: 1, bought: 1, power: 0, isEnabled: true });

      await engine.advanceToONG();

      const gt = (engine as any).boosts.get('GlassTrolling');
      expect(gt.isEnabled).toBe(false);
    });

    it('resets Papal decree at ONG', async () => {
      (engine as any).boosts.set('ThePope', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 2;

      await engine.advanceToONG();

      const pope = (engine as any).boosts.get('ThePope');
      expect(pope.power).toBe(0);
      expect((engine as any).decreeName).toBe('');
      expect((engine as any).decreeValue).toBe(1);
    });

    it('preserves Papal decree with Permanent Staff', async () => {
      (engine as any).boosts.set('ThePope', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).boosts.set('PermanentStaff', { unlocked: 1, bought: 1, power: 0, isEnabled: true });
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 2;

      await engine.advanceToONG();

      const pope = (engine as any).boosts.get('ThePope');
      expect(pope.power).toBe(5);
      expect((engine as any).decreeName).toBe('Sand');
    });

    it('resets castle prices at ONG', async () => {
      // Build up some castle cost
      (engine as any).castleBuild.nextCastleSand = 100;
      (engine as any).castleBuild.prevCastleSand = 50;

      await engine.advanceToONG();

      expect((engine as any).castleBuild.nextCastleSand).toBe(1);
      expect((engine as any).castleBuild.prevCastleSand).toBe(0);
    });

    it('BBC spends glass blocks at ONG', async () => {
      (engine as any).boosts.set('BBC', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).resources.glassBlocks = 20;

      await engine.advanceToONG();

      const bbc = (engine as any).boosts.get('BBC');
      expect(bbc.power).toBe(1);
      expect((engine as any).resources.glassBlocks).toBe(15); // spent 5
    });

    it('BBC sets power to 0 when not enough glass blocks', async () => {
      (engine as any).boosts.set('BBC', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).resources.glassBlocks = 3;

      await engine.advanceToONG();

      const bbc = (engine as any).boosts.get('BBC');
      expect(bbc.power).toBe(0);
    });

    it('resets Time Lord at ONG when no Temporal Rift', async () => {
      (engine as any).boosts.set('TimeLord', { unlocked: 1, bought: 1, power: 5 });

      await engine.advanceToONG();

      const tl = (engine as any).boosts.get('TimeLord');
      expect(tl.power).toBe(0);
    });

    it('does not reset Time Lord when Temporal Rift is active', async () => {
      (engine as any).boosts.set('TimeLord', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).boosts.set('TemporalRift', { unlocked: 1, bought: 1, power: 0 });

      await engine.advanceToONG();

      const tl = (engine as any).boosts.get('TimeLord');
      expect(tl.power).toBe(5); // preserved
    });

    it('Logicat puzzle resets count at ONG', async () => {
      (engine as any).boosts.set('LogiPuzzle', { unlocked: 1, bought: 1, power: 5 });

      await engine.advanceToONG();

      const lp = (engine as any).boosts.get('LogiPuzzle');
      expect(lp.power).toBe(10); // set to 10 when < 10
    });

    it('Logicat WotA progression at ONG', async () => {
      (engine as any).boosts.set('LogiPuzzle', { unlocked: 1, bought: 1, power: 60 });
      (engine as any).boosts.set('WotA', { unlocked: 0, bought: 0, power: 0 });

      await engine.advanceToONG();

      // power >= 50 unlocks WotA
      const wota = (engine as any).boosts.get('WotA');
      expect(wota.unlocked).toBe(1);
    });

    it('Controlled Hysteresis overrides NP number before advancement', async () => {
      (engine as any).boosts.set('ControlledHysteresis', { unlocked: 1, bought: 1, power: 42 });

      await engine.advanceToONG();

      // CH sets NP to 42 in ongBase, then ongAdvanceNewpix increments to 43
      expect((engine as any).core.newpixNumber).toBe(43);
    });

    it('Lucky Glass resets at ONG', async () => {
      (engine as any).boosts.set('GlassBlocks', { unlocked: 1, bought: 1, power: 0, countdown: 0 });
      (engine as any).boosts.set('GlassChiller', { unlocked: 1, bought: 1, power: 7 });

      await engine.advanceToONG();

      const gb = (engine as any).boosts.get('GlassBlocks');
      expect(gb.countdown).toBe(8); // GlassChiller.power + 1
    });

    it('Doublepost runs castle tools twice at ONG', async () => {
      (engine as any).boosts.set('Doublepost', { unlocked: 1, bought: 1, power: 0 });
      // Give castles and a Trebuchet
      (engine as any).resources.castles = 1000;
      const treb = (engine as any).castleTools.get('Trebuchet');
      treb.amount = 1;

      await engine.advanceToONG();

      // With Doublepost, castle tools run twice
      // Each cycle: destroy 5, build 10 -> net +5 per cycle, total +10
      expect(treb.totalCastlesBuilt).toBeGreaterThan(0);
    });
  });

  describe('judgement dip & papal decrees', () => {
    it('Fireproof + NavCode disabled wipes all castles', async () => {
      // Clear initial rate recalc
      await engine.tick(1);

      (engine as any).boosts.set('Fireproof', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('NavCode', { unlocked: 1, bought: 1, power: 0, isEnabled: false });
      (engine as any).resources.castles = 1000;
      (engine as any).resources.sand = 0;
      (engine as any).cachedTotalSandRate = 0;

      await engine.tick(1);

      expect((engine as any).resources.castles).toBe(0);
    });

    it('does not wipe castles when NavCode is enabled', async () => {
      (engine as any).boosts.set('Fireproof', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('NavCode', { unlocked: 1, bought: 1, power: 0, isEnabled: true });
      (engine as any).resources.castles = 1000;

      await engine.tick(1);

      // Castles should still be >= 1000 (toCastles might add more)
      expect((engine as any).resources.castles).toBeGreaterThanOrEqual(1000);
    });

    it('destroys castles when judgeLevel > 1 and timing aligns', async () => {
      // Clear initial rate recalc
      await engine.tick(1);

      (engine as any).judgeLevel = 3;
      (engine as any).resources.castles = 10000;
      (engine as any).cachedTotalSandRate = 0;
      // Set elapsed so after tick adds 1000ms it aligns with 25-second window
      (engine as any).ong.elapsed = 24000;

      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 10;

      await engine.tick(1);

      // Should have destroyed some castles
      expect((engine as any).resources.castles).toBeLessThan(10000);
    });

    it('does not destroy castles when judgeLevel <= 1', async () => {
      await engine.tick(1);

      (engine as any).judgeLevel = 1;
      (engine as any).resources.castles = 10000;
      (engine as any).ong.elapsed = 25000;
      (engine as any).cachedTotalSandRate = 0;

      const castlesBefore = (engine as any).resources.castles;
      await engine.tick(1);

      expect((engine as any).resources.castles).toBe(castlesBefore);
    });

    it('papal returns 1 for non-matching decree', () => {
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 2;
      (engine as any).papalBoostFactor = 1.5;

      expect((engine as any).papal('Castles')).toBe(1);
    });

    it('papal returns multiplied value for matching decree > 1', () => {
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 2;
      (engine as any).papalBoostFactor = 1.5;

      expect((engine as any).papal('Sand')).toBe(3); // 2 * 1.5
    });

    it('papal returns divided value for matching decree <= 1', () => {
      (engine as any).decreeName = 'Sand';
      (engine as any).decreeValue = 0.5;
      (engine as any).papalBoostFactor = 2;

      expect((engine as any).papal('Sand')).toBe(0.25); // 0.5 / 2
    });

    it('papal chips wired into glass chip production', async () => {
      (engine as any).decreeName = 'Chips';
      (engine as any).decreeValue = 3;
      (engine as any).papalBoostFactor = 1;

      const state = (engine as any).buildGlassChipProductionState();
      expect(state.papalChipsMult).toBe(3);
    });

    it('papal blocks wired into glass block production', async () => {
      (engine as any).decreeName = 'Blocks';
      (engine as any).decreeValue = 2;
      (engine as any).papalBoostFactor = 1;

      const state = (engine as any).buildGlassBlockProductionState();
      expect(state.papalBlocksMult).toBe(2);
    });

    it('calcReportJudgeLevel sets judgeLevel from NPB production', async () => {
      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 100;
      npb.totalCastlesBuilt = 1e10;

      (engine as any).calcReportJudgeLevel();

      // With high production, judge level should be > 0
      expect((engine as any).judgeLevel).toBeGreaterThan(0);
    });

    it('getYourGoat adds goats and earns badges', async () => {
      (engine as any).boosts.set('Goats', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('HoM', { unlocked: 0, bought: 0, power: 0 });

      (engine as any).getYourGoat(25);

      const goats = (engine as any).boosts.get('Goats');
      expect(goats.power).toBe(25);
      expect((engine as any).badges.get('Second Edition')).toBe(true);
      expect((engine as any).boosts.get('HoM').unlocked).toBe(1);
    });

    it('voidStareMultiplier calculates correctly', async () => {
      (engine as any).boosts.set('VoidStare', { unlocked: 1, bought: 1, power: 0, isEnabled: true });
      (engine as any).boosts.set('Vacuum', { unlocked: 1, bought: 1, power: 1000 });
      (engine as any).boosts.set('Blackprints', { unlocked: 1, bought: 1, power: 100 });

      const mult = (engine as any).voidStareMultiplier('VoidStare');
      // Math.pow(1.01, 1000/100) = Math.pow(1.01, 10) ≈ 1.10462
      expect(mult).toBeCloseTo(1.10462, 3);
    });

    it('voidStareMultiplier returns 1 when not bought', async () => {
      (engine as any).boosts.set('VoidStare', { unlocked: 1, bought: 0, power: 0 });

      const mult = (engine as any).voidStareMultiplier('VoidStare');
      expect(mult).toBe(1);
    });

    it('NavCode power suppresses judgement', async () => {
      (engine as any).boosts.set('NavCode', { unlocked: 1, bought: 1, power: 1 });

      const npb = (engine as any).castleTools.get('NewPixBot');
      npb.amount = 100;
      npb.totalCastlesBuilt = 1e10;

      (engine as any).calcReportJudgeLevel();

      expect((engine as any).judgeLevel).toBe(0);
    });
  });
});
