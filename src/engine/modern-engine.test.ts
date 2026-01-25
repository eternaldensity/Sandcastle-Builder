/**
 * Tests for ModernEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

// Helper to create a boost definition
function createBoostDef(id: number, alias: string, group = 'boosts') {
  return {
    id,
    name: alias,
    alias,
    icon: alias.toLowerCase().replace(/\s/g, ''),
    group,
    description: `${alias} boost`,
    price: {},
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
    'Bigger Buckets': createBoostDef(4, 'Bigger Buckets'),
    'Huge Buckets': createBoostDef(5, 'Huge Buckets'),
    'Helping Hand': createBoostDef(6, 'Helping Hand'),
    'Cooperation': createBoostDef(7, 'Cooperation'),
    'Spring Fling': createBoostDef(8, 'Spring Fling'),
    'Trebuchet Pong': createBoostDef(9, 'Trebuchet Pong'),
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
    it('produces sand from tools', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.tick(1);
      const snapshot = await engine.getStateSnapshot();

      // 10 buckets * 0.1 base rate = 1 sand per tick
      expect(snapshot.sand).toBe(1);
    });

    it('accumulates sand over multiple ticks', async () => {
      engine.setSandToolAmount('Bucket', 10);
      await engine.tick(5);
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.sand).toBe(5);
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

      expect(snapshot.sand).toBe(2);
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
});
