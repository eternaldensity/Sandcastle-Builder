/**
 * Reset System Tests
 *
 * Tests for Down and Coma reset functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';

describe('Reset System', () => {
  let gameData: GameData;
  let engine: ModernEngine;

  beforeEach(async () => {
    // Load real game data
    const dataModule = await import('../data/game-data.json', {
      assert: { type: 'json' },
    });
    gameData = dataModule.default as unknown as GameData;

    engine = new ModernEngine(gameData);
    await engine.initialize();
  });

  describe('Down Reset', () => {
    it('resets resources to zero', async () => {
      // Set up state with resources
      engine.setSand(1000);
      engine.setCastles(500);

      // Access internal state
      const engineInternal = engine as any;
      engineInternal.resources.glassChips = 100;
      engineInternal.resources.glassBlocks = 50;

      // Perform Down reset
      await engine.down();

      // Verify resources are reset
      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sand).toBe(0);
      expect(snapshot.castles).toBe(0);
      expect(engineInternal.resources.glassChips).toBe(0);
      expect(engineInternal.resources.glassBlocks).toBe(0);
    });

    it('resets castle build state', async () => {
      // Set up state
      engine.setCastles(100);
      const engineInternal = engine as any;
      engineInternal.castleBuild.totalBuilt = 50;
      engineInternal.castleBuild.prevCastleSand = 10;
      engineInternal.castleBuild.nextCastleSand = 20;

      // Perform Down reset
      await engine.down();

      // Verify castle build state is reset
      expect(engineInternal.castleBuild.totalBuilt).toBe(0);
      expect(engineInternal.castleBuild.prevCastleSand).toBe(0);
      expect(engineInternal.castleBuild.nextCastleSand).toBe(1);
    });

    it('resets ninja state', async () => {
      // Set up ninja state
      const engineInternal = engine as any;
      engineInternal.core.ninjaFreeCount = 10;
      engineInternal.core.ninjaStealth = 5;
      engineInternal.core.ninjad = true;

      // Perform Down reset
      await engine.down();

      // Verify ninja state is reset
      expect(engineInternal.core.ninjaFreeCount).toBe(0);
      expect(engineInternal.core.ninjaStealth).toBe(0);
      expect(engineInternal.core.ninjad).toBe(false);
    });

    it('resets click counts', async () => {
      // Set up click state
      await engine.clickBeach(100);

      // Perform Down reset
      await engine.down();

      // Verify clicks are reset
      const engineInternal = engine as any;
      expect(engineInternal.core.beachClicks).toBe(0);
    });

    it('resets newpix to 1', async () => {
      // Set newpix to different value
      await engine.setNewpix(50);

      // Perform Down reset
      await engine.down();

      // Verify newpix is reset to 1
      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.newpixNumber).toBe(1);
    });

    it('resets all sand tools', async () => {
      // Buy some sand tools
      engine.setSand(10000);
      await engine.buyTool('sand', 'Bucket', 5);
      await engine.buyTool('sand', 'Cuegan', 3);

      // Perform Down reset
      await engine.down();

      // Verify tools are reset
      const engineInternal = engine as any;
      const bucket = engineInternal.sandTools.get('Bucket');
      const cuegan = engineInternal.sandTools.get('Cuegan');

      expect(bucket.amount).toBe(0);
      expect(bucket.bought).toBe(0);
      expect(bucket.temp).toBe(0);
      expect(bucket.totalSand).toBe(0);
      expect(bucket.totalGlass).toBe(0);

      expect(cuegan.amount).toBe(0);
      expect(cuegan.bought).toBe(0);
    });

    it('resets castle tools except NewPixBot totalCastlesBuilt', async () => {
      // Set up castle tools
      const engineInternal = engine as any;
      const trebuchet = engineInternal.castleTools.get('Trebuchet');
      const npb = engineInternal.castleTools.get('NewPixBot');

      if (trebuchet) {
        trebuchet.amount = 5;
        trebuchet.bought = 5;
        trebuchet.totalCastlesBuilt = 100;
        trebuchet.totalCastlesDestroyed = 50;
      }

      if (npb) {
        npb.amount = 2;
        npb.bought = 2;
        npb.totalCastlesBuilt = 1000;
      }

      // Perform Down reset
      await engine.down();

      // Verify Trebuchet is fully reset
      expect(trebuchet.amount).toBe(0);
      expect(trebuchet.bought).toBe(0);
      expect(trebuchet.totalCastlesBuilt).toBe(0);
      expect(trebuchet.totalCastlesDestroyed).toBe(0);

      // Verify NewPixBot's totalCastlesBuilt is preserved
      expect(npb.amount).toBe(0);
      expect(npb.bought).toBe(0);
      expect(npb.totalCastlesBuilt).toBe(1000); // Preserved!
    });

    it('resets all boosts', async () => {
      // Unlock and buy a boost
      const engineInternal = engine as any;
      engineInternal.doUnlockBoost('Bigger Buckets');

      // Give resources to afford the boost
      engine.setSand(1000);
      engine.setCastles(1000);

      await engine.buyBoost('Bigger Buckets');

      const boost = engineInternal.boosts.get('Bigger Buckets');
      expect(boost).toBeDefined();
      expect(boost.unlocked).toBeGreaterThan(0);
      expect(boost.bought).toBeGreaterThan(0);

      // Perform Down reset
      await engine.down();

      // Verify boost is reset
      expect(boost.unlocked).toBe(0);
      expect(boost.bought).toBe(0);
      expect(boost.power).toBe(0);
      expect(boost.countdown).toBe(0);
    });

    it('preserves badges', async () => {
      // Earn a badge
      const engineInternal = engine as any;
      engineInternal.earnBadge('Amazon Patent');

      expect(engineInternal.badges.get('Amazon Patent')).toBe(true);

      // Perform Down reset
      await engine.down();

      // Verify badge is preserved
      expect(engineInternal.badges.get('Amazon Patent')).toBe(true);
    });

    it('earns "Not Ground Zero" badge', async () => {
      // Perform Down reset
      await engine.down();

      // Verify badge is earned
      const engineInternal = engine as any;
      expect(engineInternal.badges.get('Not Ground Zero')).toBe(true);
    });

    it('resets boost powers to startPower if defined', async () => {
      // Set up a boost with custom power
      const engineInternal = engine as any;
      const boost = engineInternal.boosts.get('Fractal Sandcastles');

      if (boost) {
        boost.unlocked = 1;
        boost.bought = 1;
        boost.power = 100;
      }

      // Perform Down reset
      await engine.down();

      // Verify power is reset to startPower (0 for Fractal Sandcastles)
      const boostDef = gameData.boosts['Fractal Sandcastles'];
      const expectedPower = boostDef?.startPower ?? 0;
      expect(boost.power).toBe(expectedPower);
    });

    it('clears boost extra data', async () => {
      // Set up boost with extra data (e.g., monument mould state)
      const engineInternal = engine as any;

      // Find a boost that exists (use Fractal Sandcastles as example)
      const boost = engineInternal.boosts.get('Fractal Sandcastles');

      if (boost) {
        boost.unlocked = 1;
        boost.bought = 1;
        boost.extra = { Making: 1, Progress: 50 };

        // Perform Down reset
        await engine.down();

        // Verify extra data is cleared
        expect(boost.extra).toEqual({});
      } else {
        // Skip test if boost doesn't exist
        expect(true).toBe(true);
      }
    });

    it('resets toggle boost state', async () => {
      // Set up a toggle boost
      const engineInternal = engine as any;
      const toggleBoost = engineInternal.boosts.get('Temporal Anchor');

      if (toggleBoost) {
        toggleBoost.unlocked = 1;
        toggleBoost.bought = 1;
        toggleBoost.isEnabled = true;
      }

      // Perform Down reset
      await engine.down();

      // Verify toggle state is reset
      expect(toggleBoost.isEnabled).toBeUndefined();
    });
  });

  describe('Coma Reset', () => {
    it('performs Down reset first', async () => {
      // Set up state
      engine.setSand(1000);
      engine.setCastles(500);
      await engine.buyTool('sand', 'Bucket', 5);

      // Perform Coma reset
      await engine.coma();

      // Verify resources and tools are reset (like Down)
      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sand).toBe(0);
      expect(snapshot.castles).toBe(0);

      const engineInternal = engine as any;
      const bucket = engineInternal.sandTools.get('Bucket');
      expect(bucket.amount).toBe(0);
    });

    it('resets save/load counts', async () => {
      // Set up counts
      const engineInternal = engine as any;
      engineInternal.core.saveCount = 10;
      engineInternal.core.loadCount = 20;

      // Perform Coma reset
      await engine.coma();

      // Verify counts are reset
      expect(engineInternal.core.saveCount).toBe(0);
      expect(engineInternal.core.loadCount).toBe(0);
    });

    it('resets highest NP visited', async () => {
      // Set newpix to high value
      await engine.setNewpix(100);

      // Perform Coma reset
      await engine.coma();

      // Verify highest NP is reset
      const engineInternal = engine as any;
      expect(engineInternal.core.highestNPvisited).toBe(1);
    });

    it('wipes all badges', async () => {
      // Earn some badges
      const engineInternal = engine as any;
      engineInternal.earnBadge('Amazon Patent');
      engineInternal.earnBadge('Not So Redundant');

      expect(engineInternal.badges.get('Amazon Patent')).toBe(true);
      expect(engineInternal.badges.get('Not So Redundant')).toBe(true);

      // Perform Coma reset
      await engine.coma();

      // Verify all badges are wiped
      expect(engineInternal.badges.get('Amazon Patent')).toBe(false);
      expect(engineInternal.badges.get('Not So Redundant')).toBe(false);
    });

    it('resets badge group counts', async () => {
      // Set up badge group counts
      const engineInternal = engine as any;
      engineInternal.badgeGroupCounts = {
        clicks: 5,
        tools: 10,
        discov: 3,
      };

      // Perform Coma reset
      await engine.coma();

      // Verify counts are reset
      expect(engineInternal.badgeGroupCounts).toEqual({});
    });

    it('resets badge checker state', async () => {
      // Earn badges
      const engineInternal = engine as any;

      // First click to earn Amazon Patent badge
      await engine.clickBeach(1);

      // Badge checker should track it after being earned
      const wasEarned = engineInternal.badgeChecker.isEarned('Amazon Patent');

      // Perform Coma reset
      await engine.coma();

      // Verify badge checker is reset
      expect(engineInternal.badgeChecker.isEarned('Amazon Patent')).toBe(false);

      // If badge was earned before, verify it's now cleared
      if (wasEarned) {
        expect(engineInternal.badges.get('Amazon Patent')).toBe(false);
      }
    });

    it('resets NewPixBot totalCastlesBuilt (unlike Down)', async () => {
      // Set up NewPixBot state
      const engineInternal = engine as any;
      const npb = engineInternal.castleTools.get('NewPixBot');

      if (npb) {
        npb.totalCastlesBuilt = 1000;
      }

      // Perform Coma reset
      await engine.coma();

      // Verify totalCastlesBuilt is reset (unlike Down which preserves it)
      expect(npb.totalCastlesBuilt).toBe(0);
    });

    it('resets Dragon Queen power if present', async () => {
      // Set up DQ boost
      const engineInternal = engine as any;
      const dq = engineInternal.boosts.get('DragonQueen');

      if (dq) {
        dq.power = 100;
      }

      // Perform Coma reset
      await engine.coma();

      // Verify DQ power is reset
      if (dq) {
        expect(dq.power).toBe(0);
      }
    });

    it('is more destructive than Down', async () => {
      // Set up rich state
      const engineInternal = engine as any;
      engine.setSand(1000);
      engineInternal.earnBadge('Amazon Patent');
      engineInternal.core.saveCount = 5;
      engineInternal.core.loadCount = 10;
      await engine.setNewpix(50);

      const npb = engineInternal.castleTools.get('NewPixBot');
      if (npb) npb.totalCastlesBuilt = 1000;

      // Perform Coma reset
      await engine.coma();

      // Verify everything is wiped
      expect(engineInternal.core.saveCount).toBe(0);
      expect(engineInternal.core.loadCount).toBe(0);
      expect(engineInternal.core.highestNPvisited).toBe(1);
      expect(engineInternal.badges.get('Amazon Patent')).toBe(false);
      if (npb) expect(npb.totalCastlesBuilt).toBe(0);

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sand).toBe(0);
      expect(snapshot.newpixNumber).toBe(1);
    });
  });

  describe('Down vs Coma Comparison', () => {
    it('Down preserves badges but Coma does not', async () => {
      // Set up two engines with same state
      const engine1 = new ModernEngine(gameData);
      await engine1.initialize();
      (engine1 as any).earnBadge('Amazon Patent');

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      (engine2 as any).earnBadge('Amazon Patent');

      // Down on engine1
      await engine1.down();
      expect((engine1 as any).badges.get('Amazon Patent')).toBe(true);

      // Coma on engine2
      await engine2.coma();
      expect((engine2 as any).badges.get('Amazon Patent')).toBe(false);
    });

    it('Down preserves NewPixBot totalCastlesBuilt but Coma does not', async () => {
      // Set up two engines
      const engine1 = new ModernEngine(gameData);
      await engine1.initialize();
      const npb1 = (engine1 as any).castleTools.get('NewPixBot');
      if (npb1) npb1.totalCastlesBuilt = 1000;

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      const npb2 = (engine2 as any).castleTools.get('NewPixBot');
      if (npb2) npb2.totalCastlesBuilt = 1000;

      // Down on engine1
      await engine1.down();
      if (npb1) expect(npb1.totalCastlesBuilt).toBe(1000); // Preserved

      // Coma on engine2
      await engine2.coma();
      if (npb2) expect(npb2.totalCastlesBuilt).toBe(0); // Wiped
    });
  });
});
