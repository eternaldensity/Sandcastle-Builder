/**
 * Tests for ModernEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

// Minimal game data for testing
const testGameData: GameData = {
  version: '1.0.0',
  sourceVersion: 4.12,
  extractedAt: '2026-01-25T00:00:00.000Z',
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
    'GlassChips': {
      id: 2,
      name: 'Glass Chips',
      alias: 'GlassChips',
      icon: 'glasschips',
      group: 'stuff',
      description: 'Glass chips resource',
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
    'GlassBlocks': {
      id: 3,
      name: 'Glass Blocks',
      alias: 'GlassBlocks',
      icon: 'glassblocks',
      group: 'stuff',
      description: 'Glass blocks resource',
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
    'Bigger Buckets': {
      id: 4,
      name: 'Bigger Buckets',
      alias: 'Bigger Buckets',
      icon: 'biggerbuckets',
      group: 'boosts',
      description: 'Raises sand rate of buckets',
      price: { Sand: '500' },
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
      name: 'Flag',
      commonName: 'flag',
      icon: 'flag',
      description: 'Builds castles',
      type: 'castle' as const,
      basePrice: 10,
      nextThreshold: 100,
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

      expect(snapshot.castleTools['Flag']).toBeDefined();
      expect(snapshot.castleTools['Flag'].amount).toBe(0);
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
});
