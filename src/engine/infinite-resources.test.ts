/**
 * Tests for Infinite Resource Handling
 *
 * Covers:
 * - TF unlock and Shop Failed badge on infinite tool price
 * - Glass chip pricing fallback when TF owned
 * - Infinite resource spending edge cases (Infinity - Infinity = NaN guard)
 * - Infinity in save/load round-trip
 *
 * Reference: castle.js:598-600, 727-730, 910-912, 1128-1131
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData, BoostGroup, BoostDefinition } from '../types/game-data.js';
import { parseBoostState } from './save-parser.js';

// Helper to create a boost definition
function createBoostDef(
  id: number,
  alias: string,
  group: BoostGroup = 'boosts',
  price: Record<string, number | string> = {}
): BoostDefinition {
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

// Minimal game data for testing infinite resources
const testGameData: GameData = {
  version: '1.0.0',
  sourceVersion: 4.12,
  extractedAt: '2026-01-25T00:00:00.000Z',
  boosts: {
    Sand: createBoostDef(0, 'Sand', 'stuff'),
    Castles: createBoostDef(1, 'Castles', 'stuff'),
    GlassChips: createBoostDef(2, 'GlassChips', 'stuff'),
    GlassBlocks: createBoostDef(3, 'GlassBlocks', 'stuff'),
  },
  boostsById: [
    { alias: 'Sand' },
    { alias: 'Castles' },
    { alias: 'GlassChips' },
    { alias: 'GlassBlocks' },
  ] as any,
  badges: {},
  badgesById: [] as any,
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

describe('Infinite Resource Handling', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(testGameData);
    await engine.initialize();
  });

  describe('TF virtual boost initialization', () => {
    it('initializes TF boost with unlocked=0', async () => {
      const tf = await engine.getBoostState('TF');
      expect(tf.unlocked).toBe(0);
      expect(tf.bought).toBe(0);
      expect(tf.power).toBe(0);
    });
  });

  describe('infinite sand tool price', () => {
    it('unlocks TF when sand tool price is infinite (>9000 tools)', async () => {
      // Set bucket amount to 9001 so price becomes Infinity
      engine.setSandToolAmount('Bucket', 9001);
      engine.forceResources({ castles: 1e15 }); // lots of castles, but price is Infinity

      await engine.buyTool('sand', 'Bucket');

      const tf = await engine.getBoostState('TF');
      expect(tf.unlocked).toBeGreaterThan(0);
    });

    it('earns Shop Failed badge for sand tool with infinite price', async () => {
      engine.setSandToolAmount('Bucket', 9001);
      engine.forceResources({ castles: 1e15 });

      await engine.buyTool('sand', 'Bucket');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.badges['Bucket Shop Failed']).toBe(true);
    });

    it('does not buy sand tool when price is infinite and TF not bought', async () => {
      engine.setSandToolAmount('Bucket', 9001);
      engine.forceResources({ castles: 1e15 });

      await engine.buyTool('sand', 'Bucket');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sandTools['Bucket'].amount).toBe(9001); // unchanged
    });

    it('buys sand tool with glass chips when TF is bought and price is infinite', async () => {
      engine.setSandToolAmount('Bucket', 9001);
      // TF must be bought (not just unlocked)
      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });
      // Glass chip price for Bucket (id=0): 1000 * (0 * 2 + 1) = 1000
      engine.forceResources({ glassChips: 2000 });

      await engine.buyTool('sand', 'Bucket');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sandTools['Bucket'].amount).toBe(9002);
      expect(snapshot.glassChips).toBe(1000); // 2000 - 1000
    });

    it('calculates correct glass chip price for each sand tool id', async () => {
      // Cuegan (id=1): glass price = 1000 * (1 * 2 + 1) = 3000
      engine.setSandToolAmount('Cuegan', 9001);
      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });
      engine.forceResources({ glassChips: 5000 });

      await engine.buyTool('sand', 'Cuegan');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sandTools['Cuegan'].amount).toBe(9002);
      expect(snapshot.glassChips).toBe(2000); // 5000 - 3000
    });

    it('does not buy sand tool with glass chips if insufficient', async () => {
      engine.setSandToolAmount('Bucket', 9001);
      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });
      engine.forceResources({ glassChips: 500 }); // need 1000

      await engine.buyTool('sand', 'Bucket');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.sandTools['Bucket'].amount).toBe(9001); // unchanged
      expect(snapshot.glassChips).toBe(500); // unchanged
    });
  });

  describe('infinite castle tool price', () => {
    it('unlocks TF when castle tool price is infinite', async () => {
      // Set NewPixBot amount very high so Fibonacci price overflows to Infinity
      engine.setSandToolAmount('NewPixBot', 1); // Wrong method, need castle tool
      // Castle tools use Fibonacci pricing; large amounts produce Infinity
      // For testing, we need to set the castle tool amount extremely high
      // The Fibonacci sequence grows exponentially, reaching Infinity around amount ~1500
      const castleTools = (engine as any).castleTools;
      const npbState = castleTools.get('NewPixBot');
      if (npbState) npbState.amount = 1501;

      engine.forceResources({ castles: 1e15 });

      await engine.buyTool('castle', 'NewPixBot');

      const tf = await engine.getBoostState('TF');
      expect(tf.unlocked).toBeGreaterThan(0);
    });

    it('earns Shop Failed badge for castle tool with infinite price', async () => {
      const castleTools = (engine as any).castleTools;
      const npbState = castleTools.get('NewPixBot');
      if (npbState) npbState.amount = 1501;

      engine.forceResources({ castles: 1e15 });

      await engine.buyTool('castle', 'NewPixBot');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.badges['NewPixBot Shop Failed']).toBe(true);
    });

    it('buys castle tool with glass chips when TF is bought', async () => {
      const castleTools = (engine as any).castleTools;
      const npbState = castleTools.get('NewPixBot');
      if (npbState) npbState.amount = 1501;

      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });
      // NewPixBot (id=0): glass price = 1000 * (0 * 2 + 2) = 2000
      engine.forceResources({ glassChips: 5000 });

      await engine.buyTool('castle', 'NewPixBot');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.castleTools['NewPixBot'].amount).toBe(1502);
      expect(snapshot.glassChips).toBe(3000); // 5000 - 2000
    });

    it('calculates correct glass chip price for castle tool ids', async () => {
      const castleTools = (engine as any).castleTools;
      const trebState = castleTools.get('Trebuchet');
      if (trebState) trebState.amount = 1501;

      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });
      // Trebuchet (id=1): glass price = 1000 * (1 * 2 + 2) = 4000
      engine.forceResources({ glassChips: 6000 });

      await engine.buyTool('castle', 'Trebuchet');

      const snapshot = await engine.getStateSnapshot();
      expect(snapshot.castleTools['Trebuchet'].amount).toBe(1502);
      expect(snapshot.glassChips).toBe(2000); // 6000 - 4000
    });
  });

  describe('infinite resource spending edge cases', () => {
    it('spending from infinite sand keeps it infinite', async () => {
      engine.forceResources({ sand: Infinity });

      // Spend some sand via castle building (clickBeach triggers toCastles)
      await engine.clickBeach(1);
      const snapshot = await engine.getStateSnapshot();

      // Sand should stay infinite (not become NaN from Infinity - Infinity)
      expect(snapshot.sand).toBe(Infinity);
    });

    it('spending from infinite castles keeps it infinite', async () => {
      engine.forceResources({ castles: Infinity });

      // Buy a tool (costs castles)
      await engine.buyTool('sand', 'Bucket');
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.castles).toBe(Infinity);
    });

    it('spending from infinite glass chips keeps it infinite', async () => {
      engine.forceResources({ glassChips: Infinity });

      // Set up a tool with infinite price + TF bought to trigger glass chip spending
      engine.setSandToolAmount('Bucket', 9001);
      engine.forceBoostState('TF', { unlocked: 1, bought: 1 });

      await engine.buyTool('sand', 'Bucket');
      const snapshot = await engine.getStateSnapshot();

      expect(snapshot.glassChips).toBe(Infinity);
    });

    it('adding to infinite resource keeps it infinite', async () => {
      engine.forceResources({ sand: Infinity });

      await engine.clickBeach(100);
      const snapshot = await engine.getStateSnapshot();

      // Should still be infinite, not NaN
      expect(snapshot.sand).toBe(Infinity);
    });
  });

  describe('Infinity in save/load round-trip', () => {
    it('parseBoostState preserves Infinity in power', () => {
      const state = parseBoostState(['1', '1', 'Infinity', '0']);
      expect(state.power).toBe(Infinity);
    });

    it('parseBoostState preserves Infinity in countdown', () => {
      const state = parseBoostState(['1', '1', '0', 'Infinity']);
      expect(state.countdown).toBe(Infinity);
    });

    it('round-trips infinite sand through save/load', async () => {
      engine.forceResources({ sand: Infinity });

      const saved = await engine.exportState();

      const engine2 = new ModernEngine(testGameData);
      await engine2.initialize();
      await engine2.loadState(saved);

      const snapshot = await engine2.getStateSnapshot();
      expect(snapshot.sand).toBe(Infinity);
    });

    it('round-trips infinite castles through save/load', async () => {
      engine.forceResources({ castles: Infinity });

      const saved = await engine.exportState();

      const engine2 = new ModernEngine(testGameData);
      await engine2.initialize();
      await engine2.loadState(saved);

      const snapshot = await engine2.getStateSnapshot();
      expect(snapshot.castles).toBe(Infinity);
    });

    it('round-trips infinite glass chips through save/load', async () => {
      engine.forceResources({ glassChips: Infinity });

      const saved = await engine.exportState();

      const engine2 = new ModernEngine(testGameData);
      await engine2.initialize();
      await engine2.loadState(saved);

      const snapshot = await engine2.getStateSnapshot();
      expect(snapshot.glassChips).toBe(Infinity);
    });

    it('round-trips TF boost state through save/load', async () => {
      engine.forceBoostState('TF', { unlocked: 1, bought: 1, power: 5000 });

      const saved = await engine.exportState();

      const engine2 = new ModernEngine(testGameData);
      await engine2.initialize();
      await engine2.loadState(saved);

      const tf = await engine2.getBoostState('TF');
      expect(tf.unlocked).toBe(1);
      expect(tf.bought).toBe(1);
      expect(tf.power).toBe(5000);
    });
  });
});
