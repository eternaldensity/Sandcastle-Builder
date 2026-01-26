/**
 * Tests for the monument creation system.
 *
 * Monuments are created from discoveries through a multi-step process:
 * 1. Discovery -> Sand Monument (via Sand Mould Maker + Filler)
 * 2. Sand Monument -> Glass Monument (via Glass Mould Maker + Filler)
 * 3. Glass Monument -> Diamond Masterpiece (via Diamond Mould Maker + Filler)
 *
 * Each step requires Factory Automation runs and consumes resources.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

describe('Monument System', () => {
  let engine: ModernEngine;
  let gameData: GameData;

  beforeEach(async () => {
    // Load real game data
    const dataModule = await import('../data/game-data.json', {
      assert: { type: 'json' },
    });
    gameData = dataModule.default as GameData;

    engine = new ModernEngine(gameData);
    await engine.initialize();
  });

  describe('Sand Monument Creation', () => {
    beforeEach(async () => {
      // Set up initial state for monument creation
      // - Earn a discovery first
      // - Create SMM and SMF boosts (they may not exist in base game data)
      // - Give resources

      // Advance to NP 1 and earn discovery
      await engine.setNewpix(1);

      // Access internal state for test setup
      const engineInternal = engine as any;

      // Manually earn discovery and monument badges for testing
      engineInternal.badges.set('discov1', true);
      engineInternal.badges.set('monums1', false); // Exists but not earned

      // Create Sand Mould Maker and Filler boosts if they don't exist
      if (!engineInternal.boosts.has('SMM')) {
        engineInternal.boosts.set('SMM', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      } else {
        const smm = engineInternal.boosts.get('SMM');
        smm.bought = 1;
        smm.unlocked = 1;
        smm.power = 0;
        smm.extra = { Making: 0 };
      }

      if (!engineInternal.boosts.has('SMF')) {
        engineInternal.boosts.set('SMF', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      } else {
        const smf = engineInternal.boosts.get('SMF');
        smf.bought = 1;
        smf.unlocked = 1;
        smf.power = 0;
        smf.extra = { Making: 0 };
      }

      // Give plenty of resources
      engineInternal.resources.glassChips = 1e12;
      engineInternal.resources.sand = 1e12;
    });

    it('should start making a sand mould', () => {
      const engineInternal = engine as any;

      engine.makeSandMould(1);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(1);
      expect(smm?.extra?.Making).toBe(1);
    });

    it('should not start if Sand Mould Maker is not owned', () => {
      const engineInternal = engine as any;
      const smm = engineInternal.boosts.get('SMM');
      if (smm) smm.bought = 0;

      engine.makeSandMould(1);

      expect(smm?.power).toBe(0);
    });

    it('should not start if Sand Mould Maker is already in use', () => {
      const engineInternal = engine as any;
      const smm = engineInternal.boosts.get('SMM');
      if (smm) {
        smm.power = 50; // Already making something
        if (!smm.extra) smm.extra = {};
        smm.extra.Making = 2;
      }

      engine.makeSandMould(1);

      // Should not change state
      expect(smm?.power).toBe(50);
      expect(smm?.extra?.Making).toBe(2);
    });

    it('should process sand mould work and consume glass chips', () => {
      const engineInternal = engine as any;

      // Start making mould for NP 1
      engine.makeSandMould(1);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(1);

      const initialChips = engineInternal.resources.glassChips;

      // Process 10 runs (costs 100 chips per run for NP 1)
      const remaining = engine.makeSandMouldWork(10);

      expect(remaining).toBe(0); // Should consume all runs
      expect(smm?.power).toBe(11); // Power increased by 10
      expect(engineInternal.resources.glassChips).toBe(initialChips - 1000); // 10 runs * 100 chips
    });

    it('should complete sand mould after 100 runs', () => {
      const engineInternal = engine as any;

      engine.makeSandMould(1);

      // Process 100 runs to complete
      engine.makeSandMouldWork(100);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(101); // > 100 means complete
    });

    it('should stop early if not enough glass chips', () => {
      const engineInternal = engine as any;
      engineInternal.resources.glassChips = 500; // Only enough for 5 runs

      engine.makeSandMould(1);

      const remaining = engine.makeSandMouldWork(10);

      expect(remaining).toBe(5); // Should have 5 runs remaining
    });

    it('should start filling sand mould after making is complete', () => {
      const engineInternal = engine as any;

      // Complete making the mould
      engine.makeSandMould(1);
      engine.makeSandMouldWork(100);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(101);

      // Start filling
      engine.fillSandMould(1);

      const smf = engineInternal.boosts.get('SMF');
      expect(smf?.power).toBe(1);
      expect(smf?.extra?.Making).toBe(1);
      expect(smm?.power).toBe(0); // Maker should be reset
      expect(smm?.extra?.Making).toBe(0);
    });

    it('should not fill if mould is not ready', () => {
      const engineInternal = engine as any;

      engine.makeSandMould(1);
      engine.makeSandMouldWork(50); // Only halfway

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(51);

      engine.fillSandMould(1);

      const smf = engineInternal.boosts.get('SMF');
      expect(smf?.power).toBe(0); // Should not start filling
    });

    it('should process sand mould filling and consume sand', () => {
      const engineInternal = engine as any;

      // Complete making and start filling
      engine.makeSandMould(1);
      engine.makeSandMouldWork(100);
      engine.fillSandMould(1);

      const initialSand = engineInternal.resources.sand;

      // Process 10 runs (costs 100 * 1.2^1 = 120 sand per run)
      const remaining = engine.fillSandMouldWork(10);

      const smf = engineInternal.boosts.get('SMF');
      expect(remaining).toBe(0);
      expect(smf?.power).toBe(11);
      expect(engineInternal.resources.sand).toBeCloseTo(initialSand - 1200, 1);
    });

    it('should earn sand monument badge after 200 fills', async () => {
      const engineInternal = engine as any;

      // Complete making and filling
      engine.makeSandMould(1);
      engine.makeSandMouldWork(100);
      engine.fillSandMould(1);
      engine.fillSandMouldWork(200);

      const state = await engine.getStateSnapshot();
      expect(state.badges['monums1']).toBe(true);
    });

    it('should handle negative NP with squared costs', () => {
      const engineInternal = engine as any;

      // Earn discovery for NP -1 and create monument badge
      engineInternal.badges.set('discov-1', true);
      engineInternal.badges.set('monums-1', false); // Exists but not earned

      const initialChips = engineInternal.resources.glassChips;

      engine.makeSandMould(-1);

      // For NP -1: cost = (-1 * 100) * (-1 * 100) = 10000 chips per run
      engine.makeSandMouldWork(1);

      expect(engineInternal.resources.glassChips).toBe(initialChips - 10000);
    });
  });

  describe('Glass Monument Creation', () => {
    beforeEach(async () => {
      // Set up for glass monument creation
      await engine.setNewpix(1);

      const engineInternal = engine as any;
      engineInternal.badges.set('discov1', true);
      engineInternal.badges.set('monums1', true);
      engineInternal.badges.set('monumg1', false); // Exists but not earned

      // Create Glass Mould Maker and Filler boosts if they don't exist
      if (!engineInternal.boosts.has('GMM')) {
        engineInternal.boosts.set('GMM', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      } else {
        const gmm = engineInternal.boosts.get('GMM');
        gmm.bought = 1;
        gmm.unlocked = 1;
        gmm.power = 0;
        gmm.extra = { Making: 0 };
      }

      if (!engineInternal.boosts.has('GMF')) {
        engineInternal.boosts.set('GMF', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      } else {
        const gmf = engineInternal.boosts.get('GMF');
        gmf.bought = 1;
        gmf.unlocked = 1;
        gmf.power = 0;
        gmf.extra = { Making: 0 };
      }

      engineInternal.resources.glassChips = 1e12;
      engineInternal.resources.glassBlocks = 1e12;
    });

    it('should start making a glass mould', () => {
      const engineInternal = engine as any;

      engine.makeGlassMould(1);

      const gmm = engineInternal.boosts.get('GMM');
      expect(gmm?.power).toBe(1);
      expect(gmm?.extra?.Making).toBe(1);
    });

    it('should process glass mould work with exponential cost', () => {
      const engineInternal = engine as any;

      engine.makeGlassMould(1);

      const initialChips = engineInternal.resources.glassChips;

      // For NP 1: cost = 1000 * 1.01^1 = 1010 chips per run
      engine.makeGlassMouldWork(1);

      const gmm = engineInternal.boosts.get('GMM');
      expect(gmm?.power).toBe(2);
      expect(engineInternal.resources.glassChips).toBeCloseTo(initialChips - 1010, 1);
    });

    it('should complete glass mould after 400 runs', () => {
      const engineInternal = engine as any;

      engine.makeGlassMould(1);
      engine.makeGlassMouldWork(400);

      const gmm = engineInternal.boosts.get('GMM');
      expect(gmm?.power).toBe(401); // > 400 means complete
    });

    it('should start filling glass mould after making is complete', () => {
      const engineInternal = engine as any;

      engine.makeGlassMould(1);
      engine.makeGlassMouldWork(400);
      engine.fillGlassMould(1);

      const gmm = engineInternal.boosts.get('GMM');
      const gmf = engineInternal.boosts.get('GMF');
      expect(gmf?.power).toBe(1);
      expect(gmf?.extra?.Making).toBe(1);
      expect(gmm?.power).toBe(0);
    });

    it('should process glass mould filling and consume glass blocks', () => {
      const engineInternal = engine as any;

      engine.makeGlassMould(1);
      engine.makeGlassMouldWork(400);
      engine.fillGlassMould(1);

      const initialBlocks = engineInternal.resources.glassBlocks;

      // For NP 1: cost = 1M * 1.02^1 = 1,020,000 blocks per run
      engine.fillGlassMouldWork(1);

      const gmf = engineInternal.boosts.get('GMF');
      expect(gmf?.power).toBe(2);
      expect(engineInternal.resources.glassBlocks).toBeCloseTo(initialBlocks - 1020000, 1);
    });

    it('should earn glass monument badge after 800 fills', async () => {
      engine.makeGlassMould(1);
      engine.makeGlassMouldWork(400);
      engine.fillGlassMould(1);
      engine.fillGlassMouldWork(800);

      const state = await engine.getStateSnapshot();
      expect(state.badges['monumg1']).toBe(true);
    });
  });

  describe('doMouldWork Integration', () => {
    beforeEach(async () => {
      // Set up all boosts and resources
      await engine.setNewpix(1);

      const engineInternal = engine as any;
      engineInternal.badges.set('discov1', true);
      engineInternal.badges.set('monums1', false);

      for (const alias of ['SMM', 'SMF', 'GMM', 'GMF']) {
        if (!engineInternal.boosts.has(alias)) {
          engineInternal.boosts.set(alias, {
            unlocked: 1,
            bought: 1,
            power: 0,
            countdown: 0,
            extra: { Making: 0 },
          });
        } else {
          const boost = engineInternal.boosts.get(alias);
          boost.bought = 1;
          boost.unlocked = 1;
          boost.power = 0;
          boost.extra = { Making: 0 };
        }
      }

      engineInternal.resources.glassChips = 1e12;
      engineInternal.resources.sand = 1e12;
      engineInternal.resources.glassBlocks = 1e12;
    });

    it('should process all mould work in correct order', () => {
      const engineInternal = engine as any;

      // Start making sand mould
      engine.makeSandMould(1);

      // Process 50 FA runs
      let remaining = engine.doMouldWork(50);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(51); // Should advance sand mould making
      expect(remaining).toBe(0); // All consumed
    });

    it('should process multiple mould operations in one call', () => {
      const engineInternal = engine as any;

      // Start sand mould making already partway done
      engine.makeSandMould(1);
      const smm = engineInternal.boosts.get('SMM');
      if (smm) smm.power = 95;

      // Process 10 runs - should finish making (6 runs to go from 95->101) and have 4 left
      let remaining = engine.doMouldWork(10);

      expect(smm?.power).toBe(101); // Complete
      expect(remaining).toBe(4); // 4 runs remaining (10 - 6 = 4)
    });

    it('should not process if Cold Mould is enabled', () => {
      const engineInternal = engine as any;
      const coldMould = engineInternal.boosts.get('Cold Mould');
      if (!coldMould) {
        engineInternal.boosts.set('Cold Mould', {
          unlocked: 1,
          bought: 1,
          power: 1,
          countdown: 0,
        });
      } else {
        coldMould.power = 1;
      }

      engine.makeSandMould(1);

      const remaining = engine.doMouldWork(10);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(1); // Should not advance
      expect(remaining).toBe(10); // All runs returned
    });

    it('should handle resource exhaustion gracefully', () => {
      const engineInternal = engine as any;
      engineInternal.resources.glassChips = 500; // Only enough for 5 runs

      engine.makeSandMould(1);

      const remaining = engine.doMouldWork(10);

      const smm = engineInternal.boosts.get('SMM');
      expect(smm?.power).toBe(6); // Only 5 runs processed
      expect(remaining).toBe(5); // 5 runs remaining
    });
  });

  describe('Edge Cases', () => {
    it('should not create mould for non-existent discovery', () => {
      const engineInternal = engine as any;

      // Create SMM boost
      if (!engineInternal.boosts.has('SMM')) {
        engineInternal.boosts.set('SMM', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      }

      const smm = engineInternal.boosts.get('SMM');
      if (smm) {
        smm.bought = 1;
        smm.power = 0;
      }

      // Try to make mould for NP 9999 (doesn't exist)
      engine.makeSandMould(9999);

      expect(smm?.power).toBe(0); // Should not start
    });

    it('should not create mould for already earned monument', () => {
      const engineInternal = engine as any;

      engineInternal.badges.set('monums1', true); // Already earned

      // Create SMM boost
      if (!engineInternal.boosts.has('SMM')) {
        engineInternal.boosts.set('SMM', {
          unlocked: 1,
          bought: 1,
          power: 0,
          countdown: 0,
          extra: { Making: 0 },
        });
      }

      const smm = engineInternal.boosts.get('SMM');
      if (smm) smm.bought = 1;

      engine.makeSandMould(1);

      expect(smm?.power).toBe(0);
    });

    it('should handle making with zero FA runs', () => {
      const remaining = engine.makeSandMouldWork(0);

      expect(remaining).toBe(0);
    });
  });
});
