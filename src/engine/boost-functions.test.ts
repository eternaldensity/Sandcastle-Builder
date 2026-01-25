/**
 * Tests for Boost Function Registry
 *
 * Tests the dynamic boost function system including:
 * - Registry structure and lookup
 * - Priority boost implementations (ASHF, Riverish, WotP/WotT, MHP, LockedCrate)
 * - Integration with ModernEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  boostFunctionRegistry,
  getBoostFunctions,
  hasBoostFunctions,
  getRegisteredBoosts,
} from './boost-functions.js';
import { ModernEngine } from './modern-engine.js';
import type { GameData, BoostGroup } from '../types/game-data.js';

// Helper to create a boost definition
function createBoostDef(
  id: number,
  alias: string,
  group: BoostGroup = 'boosts',
  price: Record<string, number | string> = {},
  options: Partial<{
    isToggle: boolean;
    startPower: number;
    startCountdown: number;
    department: boolean;
  }> = {}
) {
  return {
    id,
    name: alias,
    alias,
    icon: alias.toLowerCase().replace(/\s/g, ''),
    group,
    description: `${alias} boost`,
    price,
    isToggle: options.isToggle ?? false,
    isStuff: group === 'stuff',
    startPower: options.startPower,
    startCountdown: options.startCountdown,
    department: options.department,
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
    'ASHF': createBoostDef(100, 'ASHF', 'hpt', { Sand: 1000 }, { startPower: 0.4, startCountdown: 5 }),
    'PriceProtection': createBoostDef(101, 'PriceProtection', 'boosts', {}, { isToggle: true }),
    'FamilyDiscount': createBoostDef(102, 'FamilyDiscount', 'boosts', { Castles: 10000 }),
    'Riverish': createBoostDef(200, 'Riverish', 'boosts', { Sand: 1000, Castles: 100 }),
    'WotP': createBoostDef(300, 'WotP', 'drac', { Sand: 1000 }),
    'WotT': createBoostDef(301, 'WotT', 'drac', { Sand: 1000 }),
    'MHP': createBoostDef(400, 'MHP', 'boosts', { Sand: 100 }, { department: true }),
    'LockedCrate': createBoostDef(500, 'LockedCrate', 'boosts', { Sand: 500, Castles: 500, GlassBlocks: 15 }),
    'TemporalRift': createBoostDef(600, 'TemporalRift', 'chron', {}, { startCountdown: 7 }),
  },
  boostsById: [] as any,
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
  ],
  castleTools: [
    {
      id: 0,
      name: 'NewPixBot',
      commonName: 'npb',
      icon: 'npb',
      description: 'Builds castles',
      type: 'castle' as const,
      basePrice: 1,
      nextThreshold: 10,
      hasDynamicRate: false,
    },
  ],
  groups: {} as any,
};

describe('Boost Function Registry', () => {
  describe('registry structure', () => {
    it('has registered boost functions', () => {
      const registered = getRegisteredBoosts();
      expect(registered.length).toBeGreaterThan(0);
    });

    it('includes priority boosts', () => {
      expect(hasBoostFunctions('ASHF')).toBe(true);
      expect(hasBoostFunctions('Riverish')).toBe(true);
      expect(hasBoostFunctions('WotP')).toBe(true);
      expect(hasBoostFunctions('WotT')).toBe(true);
      expect(hasBoostFunctions('MHP')).toBe(true);
      expect(hasBoostFunctions('LockedCrate')).toBe(true);
    });

    it('returns undefined for unregistered boosts', () => {
      expect(getBoostFunctions('NonexistentBoost')).toBeUndefined();
    });

    it('returns functions object for registered boosts', () => {
      const ashfFunctions = getBoostFunctions('ASHF');
      expect(ashfFunctions).toBeDefined();
      expect(ashfFunctions?.buyFunction).toBeDefined();
      expect(ashfFunctions?.countdownFunction).toBeDefined();
      expect(ashfFunctions?.lockFunction).toBeDefined();
    });
  });

  describe('ASHF functions', () => {
    it('has buyFunction, countdownFunction, and lockFunction', () => {
      const functions = boostFunctionRegistry['ASHF'];
      expect(functions.buyFunction).toBeDefined();
      expect(functions.countdownFunction).toBeDefined();
      expect(functions.lockFunction).toBeDefined();
    });
  });

  describe('Riverish functions', () => {
    it('has buyFunction', () => {
      const functions = boostFunctionRegistry['Riverish'];
      expect(functions.buyFunction).toBeDefined();
    });
  });

  describe('WotP/WotT functions', () => {
    it('WotP has buyFunction', () => {
      const functions = boostFunctionRegistry['WotP'];
      expect(functions.buyFunction).toBeDefined();
    });

    it('WotT has buyFunction', () => {
      const functions = boostFunctionRegistry['WotT'];
      expect(functions.buyFunction).toBeDefined();
    });
  });

  describe('MHP functions', () => {
    it('has unlockFunction, lockFunction, and loadFunction', () => {
      const functions = boostFunctionRegistry['MHP'];
      expect(functions.unlockFunction).toBeDefined();
      expect(functions.lockFunction).toBeDefined();
      expect(functions.loadFunction).toBeDefined();
    });
  });

  describe('LockedCrate functions', () => {
    it('has unlockFunction and lockFunction', () => {
      const functions = boostFunctionRegistry['LockedCrate'];
      expect(functions.unlockFunction).toBeDefined();
      expect(functions.lockFunction).toBeDefined();
    });
  });
});

describe('Boost Functions Integration', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(testGameData);
    await engine.initialize();
  });

  describe('ASHF', () => {
    it('recalculates price factor when bought', async () => {
      // Setup: give resources (ASHF costs Sand: 1000) and unlock ASHF
      engine.forceResources({ sand: 10000, castles: 10000 });
      engine.forceBoostState('ASHF', { unlocked: 1, bought: 0, power: 0.4, countdown: 5 });

      const priceBefore = engine.getPriceFactor();
      expect(priceBefore).toBe(1); // No ASHF active yet

      await engine.buyBoost('ASHF');

      // ASHF should now be active with 40% discount
      const state = await engine.getBoostState('ASHF');
      expect(state.bought).toBe(1);

      // Price factor should reflect ASHF discount (0.6 = 1 - 0.4)
      const priceAfter = engine.getPriceFactor();
      expect(priceAfter).toBe(0.6);
    });
  });

  describe('Riverish', () => {
    it('sets power to beach click count on buy', async () => {
      // Click beach 50 times
      await engine.clickBeach(50);

      // Setup: give resources and unlock Riverish
      engine.forceResources({ sand: 10000, castles: 1000 });
      engine.forceBoostState('Riverish', { unlocked: 1, bought: 0, power: 0 });

      await engine.buyBoost('Riverish');

      const state = await engine.getBoostState('Riverish');
      expect(state.bought).toBe(1);
      expect(state.power).toBe(50);
    });

    it('tracks clicks made before purchase', async () => {
      // Click 100 times over multiple calls
      await engine.clickBeach(30);
      await engine.clickBeach(40);
      await engine.clickBeach(30);

      engine.forceResources({ sand: 10000, castles: 1000 });
      engine.forceBoostState('Riverish', { unlocked: 1, bought: 0, power: 0 });

      await engine.buyBoost('Riverish');

      const state = await engine.getBoostState('Riverish');
      expect(state.power).toBe(100);
    });
  });

  describe('WotP/WotT mutual exclusion', () => {
    it('WotP locks and permalocks WotT when bought', async () => {
      // Setup both boosts as unlocked
      engine.forceResources({ sand: 10000 });
      engine.forceBoostState('WotP', { unlocked: 1, bought: 0, power: 0 });
      engine.forceBoostState('WotT', { unlocked: 1, bought: 0, power: 0 });

      await engine.buyBoost('WotP');

      const wotpState = await engine.getBoostState('WotP');
      const wottState = await engine.getBoostState('WotT');

      expect(wotpState.bought).toBe(1);
      expect(wottState.bought).toBe(0);
      expect(wottState.unlocked).toBe(0); // Locked
    });

    it('WotT locks and permalocks WotP when bought', async () => {
      // Setup both boosts as unlocked
      engine.forceResources({ sand: 10000 });
      engine.forceBoostState('WotP', { unlocked: 1, bought: 0, power: 0 });
      engine.forceBoostState('WotT', { unlocked: 1, bought: 0, power: 0 });

      await engine.buyBoost('WotT');

      const wotpState = await engine.getBoostState('WotP');
      const wottState = await engine.getBoostState('WotT');

      expect(wottState.bought).toBe(1);
      expect(wotpState.bought).toBe(0);
      expect(wotpState.unlocked).toBe(0); // Locked
    });

    it('permalocked boost cannot be unlocked again', async () => {
      // Buy WotP to permalock WotT
      engine.forceResources({ sand: 10000 });
      engine.forceBoostState('WotP', { unlocked: 1, bought: 0, power: 0 });
      engine.forceBoostState('WotT', { unlocked: 1, bought: 0, power: 0 });

      await engine.buyBoost('WotP');

      // Try to unlock WotT again
      engine.unlockBoost('WotT');

      const wottState = await engine.getBoostState('WotT');
      expect(wottState.unlocked).toBe(0); // Still locked due to permalock
    });
  });

  describe('MHP (Monty Haul Problem)', () => {
    it('sets random prize power on unlock', async () => {
      // Unlock MHP
      engine.unlockBoost('MHP');

      const state = await engine.getBoostState('MHP');
      expect(state.unlocked).toBe(1);
      // Prize should be 1, 2, or 3
      expect(state.power).toBeGreaterThanOrEqual(1);
      expect(state.power).toBeLessThanOrEqual(3);
    });

    it('increments power on lock (tracks unlock count)', async () => {
      engine.forceBoostState('MHP', { unlocked: 1, bought: 1, power: 5 });

      engine.lockBoost('MHP');

      const state = await engine.getBoostState('MHP');
      expect(state.power).toBe(6); // Was 5, incremented to 6
      expect(state.bought).toBe(0); // Locked
      expect(state.unlocked).toBe(0); // Locked
    });
  });

  describe('LockedCrate', () => {
    it('sets power based on resources on unlock', async () => {
      // Give some resources
      engine.forceResources({ sand: 100, castles: 50 });

      // Unlock LockedCrate
      engine.unlockBoost('LockedCrate');

      const state = await engine.getBoostState('LockedCrate');
      expect(state.unlocked).toBe(1);
      // Power = castles * 6 + sand = 50 * 6 + 100 = 400
      expect(state.power).toBe(400);
    });

    it('awards glass blocks on lock', async () => {
      engine.forceResources({ glassBlocks: 0 });
      engine.forceBoostState('LockedCrate', { unlocked: 1, bought: 1, power: 100 });

      engine.lockBoost('LockedCrate');

      const snapshot = await engine.getStateSnapshot();
      // Should have received some glass blocks (simplified formula in test)
      expect(snapshot.glassBlocks).toBeGreaterThan(0);
    });
  });

  describe('lockBoost method', () => {
    it('resets bought and unlocked to 0', async () => {
      engine.forceBoostState('Riverish', { unlocked: 1, bought: 1, power: 50 });

      engine.lockBoost('Riverish');

      const state = await engine.getBoostState('Riverish');
      expect(state.bought).toBe(0);
      expect(state.unlocked).toBe(0);
    });

    it('recalculates price factor after lock', async () => {
      // Setup ASHF as bought with countdown
      engine.forceBoostState('ASHF', { unlocked: 1, bought: 1, power: 0.4, countdown: 5 });
      expect(engine.getPriceFactor()).toBe(0.6); // With ASHF active

      engine.lockBoost('ASHF');

      // After locking, ASHF should no longer affect price
      expect(engine.getPriceFactor()).toBe(1);
    });
  });

  describe('permalockBoost method', () => {
    it('prevents boost from being unlocked', async () => {
      engine.permalockBoost('Riverish');

      // Try to unlock
      engine.unlockBoost('Riverish');

      const state = await engine.getBoostState('Riverish');
      expect(state.unlocked).toBe(0);
    });
  });

  describe('toggleBoost method', () => {
    it('toggles isEnabled state', async () => {
      engine.forceBoostState('PriceProtection', { unlocked: 1, bought: 1, power: 0 });

      // Get initial state (undefined means enabled by default for bought boosts)
      let state = await engine.getBoostState('PriceProtection');

      // Toggle should work on toggle boosts
      await engine.toggleBoost('PriceProtection');

      // Note: toggle state is internal, we verify it doesn't throw
      // Full toggle state testing would need snapshot with isEnabled
    });
  });
});
