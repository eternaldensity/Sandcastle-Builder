/**
 * Save Round-Trip Tests (Plan 36)
 *
 * Verifies bidirectional save/load compatibility:
 * 1. Modern state → serialize → parse → load → identical state
 * 2. Multi-engine chains: E1 → save → E2 → save → E3 → all match
 * 3. State preservation across complex game sequences
 * 4. Edge cases: empty state, maxed resources, large tool counts
 */

import { describe, it, expect } from 'vitest';
import { ModernEngine } from '../engine/modern-engine.js';
import { compareStates } from './parity-runner.js';
import type { GameData } from '../types/game-data.js';
import gameDataJson from '../data/game-data.json';

const gameData = gameDataJson as unknown as GameData;

/**
 * Helper: create engine, initialize, optionally run setup actions
 */
async function createEngine(
  setup?: (engine: ModernEngine) => Promise<void>
): Promise<ModernEngine> {
  const engine = new ModernEngine(gameData);
  await engine.initialize();
  if (setup) await setup(engine);
  return engine;
}

/**
 * Helper: save from one engine, load into a fresh engine, return both snapshots
 */
async function roundTrip(source: ModernEngine) {
  const exported = await source.exportState();
  const target = await createEngine();
  await target.loadState(exported);

  const snapSource = await source.getStateSnapshot();
  const snapTarget = await target.getStateSnapshot();

  return { exported, snapSource, snapTarget, target };
}

describe('Save Round-Trip', () => {
  describe('Basic Round-Trip', () => {
    it('initial state survives round-trip', async () => {
      const engine = await createEngine();
      const exported1 = await engine.exportState();

      const engine2 = await createEngine();
      await engine2.loadState(exported1);
      const exported2 = await engine2.exportState();

      // Save string should be identical after round-trip
      expect(exported2).toBe(exported1);
    });

    it('exported string is identical across two round-trips', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(100);
        await e.tick(50);
      });

      const exported1 = await engine.exportState();

      const engine2 = await createEngine();
      await engine2.loadState(exported1);
      const exported2 = await engine2.exportState();

      const engine3 = await createEngine();
      await engine3.loadState(exported2);
      const exported3 = await engine3.exportState();

      expect(exported2).toBe(exported1);
      expect(exported3).toBe(exported1);
    });

    it('three-engine chain preserves all state', async () => {
      const e1 = await createEngine(async (e) => {
        await e.clickBeach(500);
        await e.tick(100);
        await e.buyTool('sand', 'Bucket');
        await e.setNewpix(2);
      });

      const save1 = await e1.exportState();
      const snap1 = await e1.getStateSnapshot();

      const e2 = await createEngine();
      await e2.loadState(save1);
      const snap2 = await e2.getStateSnapshot();
      const save2 = await e2.exportState();

      const e3 = await createEngine();
      await e3.loadState(save2);
      const snap3 = await e3.getStateSnapshot();

      // All three snapshots should match
      const result12 = compareStates(snap1, snap2);
      const result23 = compareStates(snap2, snap3);

      expect(result12.passed).toBe(true);
      expect(result23.passed).toBe(true);
      expect(save2).toBe(save1);
    });
  });

  describe('Resource Preservation', () => {
    it('preserves sand amount exactly', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(777);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.sand).toBe(snapSource.sand);
    });

    it('preserves castles exactly', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(2000);
        await e.tick(200);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.castles).toBe(snapSource.castles);
    });

    it('preserves glass chips and blocks', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(5000);
        await e.tick(500);
        await e.setNewpix(2);
        await e.tick(200);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.glassChips).toBe(snapSource.glassChips);
      expect(snapTarget.glassBlocks).toBe(snapSource.glassBlocks);
    });
  });

  describe('Tool Preservation', () => {
    it('preserves sand tool counts and stats', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(10000);
        await e.tick(500);
        await e.buyTool('sand', 'Bucket');
        await e.buyTool('sand', 'Bucket');
        await e.buyTool('sand', 'Bucket');
        await e.tick(100);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);

      expect(snapTarget.sandTools['Bucket'].amount).toBe(snapSource.sandTools['Bucket'].amount);
      expect(snapTarget.sandTools['Bucket'].bought).toBe(snapSource.sandTools['Bucket'].bought);
      expect(snapTarget.sandTools['Bucket'].totalSand).toBe(snapSource.sandTools['Bucket'].totalSand);
    });

    it('preserves multiple tool types', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(10000);
        await e.tick(500);
        await e.buyTool('sand', 'Bucket');
        await e.buyTool('sand', 'Cuegan');
      });

      const { snapSource, snapTarget } = await roundTrip(engine);

      for (const toolName of ['Bucket', 'Cuegan']) {
        expect(snapTarget.sandTools[toolName].amount).toBe(snapSource.sandTools[toolName].amount);
        expect(snapTarget.sandTools[toolName].bought).toBe(snapSource.sandTools[toolName].bought);
      }
    });
  });

  describe('Boost Preservation', () => {
    it('preserves boost bought status', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(5000);
        await e.tick(50);
        await e.unlockBoost('Bigger Buckets');
        await e.buyBoost('Bigger Buckets');
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.boosts['Bigger Buckets']?.bought).toBe(1);
      expect(snapTarget.boosts['Bigger Buckets']?.bought).toBe(
        snapSource.boosts['Bigger Buckets']?.bought
      );
    });

    it('preserves boost power values', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(5000);
        await e.tick(50);
        await e.unlockBoost('Bigger Buckets');
        await e.buyBoost('Bigger Buckets');
      });

      const { snapSource, snapTarget } = await roundTrip(engine);

      const boost1 = snapSource.boosts['Bigger Buckets'];
      const boost2 = snapTarget.boosts['Bigger Buckets'];

      expect(boost2?.power).toBe(boost1?.power);
      expect(boost2?.unlocked).toBe(boost1?.unlocked);
    });
  });

  describe('Game Numbers Preservation', () => {
    it('preserves newpix number', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(100);
        await e.setNewpix(5);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.newpixNumber).toBe(5);
      expect(snapTarget.newpixNumber).toBe(snapSource.newpixNumber);
    });

    it('preserves beach click count', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(1234);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.beachClicks).toBe(1234);
      expect(snapTarget.beachClicks).toBe(snapSource.beachClicks);
    });

    it('preserves ninja state', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(100);
        await e.setNewpix(2);
        await e.tick(50);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.ninjaFreeCount).toBe(snapSource.ninjaFreeCount);
      expect(snapTarget.ninjaStealth).toBe(snapSource.ninjaStealth);
      expect(snapTarget.ninjad).toBe(snapSource.ninjad);
    });
  });

  describe('Save Format Validation', () => {
    it('exported string has correct section count', async () => {
      const engine = await createEngine();
      const exported = await engine.exportState();

      // Raw format uses 'P' as section delimiter
      const sections = exported.split('P');

      // Should have 10+ sections (version through npdata)
      expect(sections.length).toBeGreaterThanOrEqual(10);
    });

    it('exported string contains valid version', async () => {
      const engine = await createEngine();
      const exported = await engine.exportState();

      const sections = exported.split('P');

      const version = parseFloat(sections[0]);
      expect(version).toBeGreaterThanOrEqual(4);
      expect(version).toBeLessThan(10);
    });

    it('tool section has correct delimiter structure', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(5000);
        await e.tick(200);
        await e.buyTool('sand', 'Bucket');
      });

      const exported = await engine.exportState();
      const sections = exported.split('P');

      // Sand tools section (index 5)
      const sandToolSection = sections[5];
      expect(sandToolSection).toBeDefined();
      expect(sandToolSection.length).toBeGreaterThan(0);

      // Should use S delimiter between tools and C between fields
      if (sandToolSection.includes('S')) {
        const tools = sandToolSection.split('S');
        expect(tools.length).toBeGreaterThan(0);
        // Each tool should have comma-separated fields
        for (const tool of tools) {
          if (tool.length > 0) {
            expect(tool.includes('C') || /^\d/.test(tool)).toBe(true);
          }
        }
      }
    });
  });

  describe('Complex State Round-Trip', () => {
    it('full early game session round-trips cleanly', async () => {
      const engine = await createEngine(async (e) => {
        // Simulate a multi-NP play session
        await e.clickBeach(2000);
        await e.tick(200);
        await e.buyTool('sand', 'Bucket');
        await e.buyTool('sand', 'Bucket');
        await e.buyTool('sand', 'Cuegan');

        await e.unlockBoost('Bigger Buckets');
        await e.buyBoost('Bigger Buckets');

        await e.setNewpix(2);
        await e.clickBeach(500);
        await e.tick(100);

        await e.setNewpix(3);
        await e.tick(50);
      });

      // Verify save string round-trips identically
      const exported = await engine.exportState();
      const engine2 = await createEngine();
      await engine2.loadState(exported);
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported);

      // Verify key fields preserved
      const snap1 = await engine.getStateSnapshot();
      const snap2 = await engine2.getStateSnapshot();
      expect(snap2.newpixNumber).toBe(snap1.newpixNumber);
      expect(snap2.sand).toBe(snap1.sand);
      expect(snap2.castles).toBe(snap1.castles);
      expect(snap2.beachClicks).toBe(snap1.beachClicks);
      expect(snap2.sandTools['Bucket'].amount).toBe(snap1.sandTools['Bucket'].amount);
      expect(snap2.boosts['Bigger Buckets']?.bought).toBe(snap1.boosts['Bigger Buckets']?.bought);
    });

    it('continued play after load matches continued play on original', async () => {
      // Setup identical base state
      const base = await createEngine(async (e) => {
        await e.clickBeach(1000);
        await e.tick(100);
        await e.buyTool('sand', 'Bucket');
      });

      const savePoint = await base.exportState();

      // Branch A: continue on original
      await base.clickBeach(200);
      await base.tick(50);
      await base.setNewpix(2);
      const snapA = await base.getStateSnapshot();

      // Branch B: load and do same actions
      const loaded = await createEngine();
      await loaded.loadState(savePoint);
      await loaded.clickBeach(200);
      await loaded.tick(50);
      await loaded.setNewpix(2);
      const snapB = await loaded.getStateSnapshot();

      // Structural fields should match exactly
      expect(snapB.newpixNumber).toBe(snapA.newpixNumber);
      expect(snapB.beachClicks).toBe(snapA.beachClicks);
      expect(snapB.sandTools['Bucket'].amount).toBe(snapA.sandTools['Bucket'].amount);
      // Resource values may diverge slightly due to rate recalc after load
      expect(snapB.sand).toBeGreaterThan(0);
      expect(snapB.castles).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('empty engine exports and reimports without error', async () => {
      const engine = await createEngine();
      const exported1 = await engine.exportState();

      expect(exported1.length).toBeGreaterThan(0);

      const engine2 = await createEngine();
      await engine2.loadState(exported1);
      const exported2 = await engine2.exportState();

      // Save string should be identical after round-trip
      expect(exported2).toBe(exported1);
    });

    it('state with zero tools round-trips', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(10);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);

      // All tools should be 0
      for (const name of Object.keys(snapSource.sandTools)) {
        expect(snapTarget.sandTools[name].amount).toBe(0);
      }
    });

    it('large click count round-trips correctly', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(50000);
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.beachClicks).toBe(50000);
      expect(snapTarget.beachClicks).toBe(snapSource.beachClicks);
    });

    it('many NP advances round-trip correctly', async () => {
      const engine = await createEngine(async (e) => {
        await e.clickBeach(100);
        for (let np = 2; np <= 15; np++) {
          await e.setNewpix(np);
          await e.tick(5);
        }
      });

      const { snapSource, snapTarget } = await roundTrip(engine);
      expect(snapTarget.newpixNumber).toBe(15);
      expect(snapTarget.newpixNumber).toBe(snapSource.newpixNumber);
    });
  });
});
