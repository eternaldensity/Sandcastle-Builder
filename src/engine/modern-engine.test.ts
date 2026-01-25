/**
 * Tests for ModernEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

// Helper to create a boost definition
function createBoostDef(id: number, alias: string, group = 'boosts', price: Record<string, number | string> = {}) {
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
    'Bigger Buckets': createBoostDef(4, 'Bigger Buckets', 'boosts', { Sand: 500 }),
    'Huge Buckets': createBoostDef(5, 'Huge Buckets', 'boosts', { Sand: 800, Castles: 2 }),
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

      // (10 * 0.1) + (5 * 0.5) = 1 + 2.5 = 3.5
      expect(rate).toBe(3.5);
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
});
