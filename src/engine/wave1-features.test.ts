/**
 * Tests for Wave 1 features: Plans 29, 31, 34, 35
 * - Plan 29: Photo & Color Reaction System
 * - Plan 31: Goat System & Monty Haul Problem
 * - Plan 34: Advanced Ninja Mechanics (Factory Ninja + Ninjasaw/VJ)
 * - Plan 35: Ketchup Fast-Forward System
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData, BoostGroup, BoostDefinition } from '../types/game-data.js';
import {
  decayPhoto,
  reactPhoto,
  craftPhoto,
  runFastPhoto,
  unlockPhoto,
  getPhoto,
  createInitialColorState,
  type PhotoColorState,
  type PhotoBoostAccess,
} from './photo-system.js';

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

// Minimal game data with boosts needed for Wave 1 tests
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
    'MHP': createBoostDef(20, 'MHP', 'boosts'),
    'HoM': createBoostDef(21, 'HoM', 'boosts'),
    'Gruff': createBoostDef(22, 'Gruff', 'boosts'),
    'BeretGuy': createBoostDef(23, 'BeretGuy', 'boosts'),
    'NinjaBuilder': createBoostDef(30, 'NinjaBuilder', 'boosts'),
    'FactoryNinja': createBoostDef(31, 'FactoryNinja', 'boosts'),
    'NinjaAssistants': createBoostDef(32, 'NinjaAssistants', 'boosts'),
    'SkullAndCrossbones': createBoostDef(33, 'SkullAndCrossbones', 'boosts'),
    'GlassJaw': createBoostDef(34, 'GlassJaw', 'boosts'),
    'NinjaClimber': createBoostDef(35, 'NinjaClimber', 'boosts'),
    'Ninjasaw': createBoostDef(36, 'Ninjasaw', 'boosts'),
    'VJ': createBoostDef(37, 'VJ', 'boosts'),
    'Coma Molpy Style': createBoostDef(40, 'Coma Molpy Style', 'boosts'),
    'PoG': createBoostDef(41, 'PoG', 'boosts'),
    'ASHF': createBoostDef(42, 'ASHF', 'boosts'),
    'SoS': createBoostDef(43, 'SoS', 'boosts'),
    'Blitzing': createBoostDef(44, 'Blitzing', 'boosts'),
    'LSoS': createBoostDef(45, 'LSoS', 'boosts'),
    'Shork': createBoostDef(46, 'Shork', 'stuff'),
    'BB': createBoostDef(47, 'BB', 'stuff'),
    'Mustard': createBoostDef(48, 'Mustard', 'stuff'),
    'Camera': createBoostDef(50, 'Camera', 'boosts'),
    'Blueness': createBoostDef(51, 'Blueness', 'stuff'),
    'Otherness': createBoostDef(52, 'Otherness', 'stuff'),
    'Blackness': createBoostDef(53, 'Blackness', 'stuff'),
    'Whiteness': createBoostDef(54, 'Whiteness', 'stuff'),
    'Grayness': createBoostDef(55, 'Grayness', 'stuff'),
    'OceanBlue': createBoostDef(56, 'OceanBlue', 'boosts'),
    'Meteor': createBoostDef(57, 'Meteor', 'boosts'),
    'HallowedGround': createBoostDef(58, 'HallowedGround', 'boosts'),
    'Argy': createBoostDef(59, 'Argy', 'boosts'),
    'bluhint': createBoostDef(60, 'bluhint', 'boosts'),
    'ImprovedScaling': createBoostDef(61, 'ImprovedScaling', 'boosts'),
    'Polarizer': createBoostDef(62, 'Polarizer', 'boosts'),
    'RoboticInker': createBoostDef(63, 'RoboticInker', 'boosts'),
    'NaP': createBoostDef(64, 'NaP', 'boosts'),
    'EquilibriumConstant': createBoostDef(65, 'EquilibriumConstant', 'boosts'),
    'Photoelectricity': createBoostDef(66, 'Photoelectricity', 'boosts'),
    'Doubletap': createBoostDef(67, 'Doubletap', 'boosts'),
  },
  boostsById: [{ alias: 'Sand' }, { alias: 'Castles' }] as any,
  badges: {},
  badgesById: [] as any,
  sandTools: [
    { id: 0, name: 'Bucket', commonName: 'bucket', icon: 'bucket', description: '', type: 'sand' as const, basePrice: 10, nextThreshold: 100, hasDynamicRate: false },
    { id: 1, name: 'Cuegan', commonName: 'cuegan', icon: 'cuegan', description: '', type: 'sand' as const, basePrice: 100, nextThreshold: 1000, hasDynamicRate: false },
    { id: 2, name: 'Flag', commonName: 'flag', icon: 'flag', description: '', type: 'sand' as const, basePrice: 420, nextThreshold: 100, hasDynamicRate: false },
    { id: 3, name: 'Ladder', commonName: 'ladder', icon: 'ladder', description: '', type: 'sand' as const, basePrice: 1700, nextThreshold: 100, hasDynamicRate: false },
    { id: 4, name: 'Bag', commonName: 'bag', icon: 'bag', description: '', type: 'sand' as const, basePrice: 12000, nextThreshold: 100, hasDynamicRate: false },
  ],
  castleTools: [
    { id: 0, name: 'NewPixBot', commonName: 'newpixbot', icon: 'newpixbot', description: '', type: 'castle' as const, basePrice: 50, nextThreshold: 100, hasDynamicRate: false },
  ],
  groups: {} as any,
};

let engine: ModernEngine;

beforeEach(async () => {
  engine = new ModernEngine(testGameData);
  await engine.initialize();
});

// =============================================================================
// Plan 31: Goat System & Monty Haul Problem
// =============================================================================

describe('Plan 31: Goat System & Monty Haul Problem', () => {
  describe('getYourGoat', () => {
    it('adds goats to the goat resource', async () => {
      (engine as any).getYourGoat(5);
      const goats = (engine as any).boosts.get('Goats');
      expect(goats.power).toBe(5);
    });

    it('unlocks HoM at 20 goats', async () => {
      (engine as any).getYourGoat(20);
      const hom = (engine as any).boosts.get('HoM');
      expect(hom.unlocked).toBe(1);
    });

    it('unlocks BeretGuy at 200 goats', async () => {
      (engine as any).getYourGoat(200);
      const bg = (engine as any).boosts.get('BeretGuy');
      expect(bg.unlocked).toBe(1);
    });
  });

  describe('Monty Haul Problem', () => {
    beforeEach(() => {
      const mhp = (engine as any).boosts.get('MHP');
      mhp.bought = 1;
      mhp.unlocked = 1;
      mhp.power = 0;
    });

    it('montyStart sets up a valid game state', () => {
      const result = engine.montyStart();
      expect(result).toBe(true);
      const state = engine.getMontyState();
      expect(state.active).toBe(true);
      expect(['A', 'B', 'C']).toContain(state.prize);
    });

    it('montyStart fails if MHP not bought', () => {
      const mhp = (engine as any).boosts.get('MHP');
      mhp.bought = 0;
      expect(engine.montyStart()).toBe(false);
    });

    it('first pick reveals a goat door', () => {
      engine.montyStart();
      const state = engine.getMontyState();
      const result = engine.montyChoose('A');
      expect(result).not.toBeNull();
      if (result!.result === 'goat-revealed') {
        expect(result!.goatDoor).toBeDefined();
        expect(result!.goatDoor).not.toBe('A');
        expect(result!.goatDoor).not.toBe(state.prize);
      }
      // If it's win/lose, that's valid too (edge case)
    });

    it('win awards 50% of castles', () => {
      (engine as any).resources.castles = 100;
      engine.montyStart();
      const prize = engine.getMontyState().prize;

      // Choose the prize door directly
      const result = engine.montyChoose(prize);
      if (result?.result === 'goat-revealed') {
        // Second pick - choose prize
        engine.montyChoose(prize);
      }

      // Should have gained 50% = 50, total 150
      expect((engine as any).resources.castles).toBe(150);
    });

    it('loss destroys all castles and grants 1 goat', () => {
      (engine as any).resources.castles = 100;
      engine.montyStart();
      const prize = engine.getMontyState().prize;

      // Choose a non-prize door
      const wrongDoor = ['A', 'B', 'C'].find(d => d !== prize)!;
      const result = engine.montyChoose(wrongDoor);
      if (result?.result === 'goat-revealed') {
        // Stay with wrong door (don't switch to prize)
        const goatDoor = result.goatDoor!;
        const stayDoor = ['A', 'B', 'C'].find(d => d !== prize && d !== goatDoor) || wrongDoor;
        engine.montyChoose(stayDoor);
      }

      expect((engine as any).resources.castles).toBe(0);
      expect((engine as any).boosts.get('Goats').power).toBe(1);
    });

    it('win with Gruff grants 3 goats', () => {
      (engine as any).resources.castles = 100;
      (engine as any).boosts.get('Gruff').bought = 1;

      engine.montyStart();
      const prize = engine.getMontyState().prize;
      const result = engine.montyChoose(prize);
      if (result?.result === 'goat-revealed') {
        engine.montyChoose(prize);
      }

      expect((engine as any).boosts.get('Goats').power).toBe(3);
    });

    it('HoM adds glass chip bonus on win', () => {
      (engine as any).resources.castles = 100;
      (engine as any).resources.glassChips = 500;
      const hom = (engine as any).boosts.get('HoM');
      hom.bought = 1;
      hom.power = 1; // enabled

      engine.montyStart();
      const prize = engine.getMontyState().prize;
      const result = engine.montyChoose(prize);
      if (result?.result === 'goat-revealed') {
        engine.montyChoose(prize);
      }

      // Win: gain 1/5 of 500 = 100 chips
      expect((engine as any).resources.glassChips).toBe(600);
    });

    it('HoM removes glass chips on loss', () => {
      (engine as any).resources.castles = 100;
      (engine as any).resources.glassChips = 300;
      const hom = (engine as any).boosts.get('HoM');
      hom.bought = 1;
      hom.power = 1; // enabled

      engine.montyStart();
      const prize = engine.getMontyState().prize;
      const wrongDoor = ['A', 'B', 'C'].find(d => d !== prize)!;
      const result = engine.montyChoose(wrongDoor);
      if (result?.result === 'goat-revealed') {
        const goatDoor = result.goatDoor!;
        const stayDoor = ['A', 'B', 'C'].find(d => d !== prize && d !== goatDoor) || wrongDoor;
        engine.montyChoose(stayDoor);
      }

      // Loss: lose 1/3 of 300 = 100 chips
      expect((engine as any).resources.glassChips).toBe(200);
    });

    it('MHP power increments after each round', () => {
      const mhp = (engine as any).boosts.get('MHP');
      expect(mhp.power).toBe(0);

      engine.montyStart();
      const prize = engine.getMontyState().prize;
      const result = engine.montyChoose(prize);
      if (result?.result === 'goat-revealed') {
        engine.montyChoose(prize);
      }

      expect(mhp.power).toBe(1);
    });
  });
});

// =============================================================================
// Plan 34: Advanced Ninja Mechanics
// =============================================================================

describe('Plan 34: Advanced Ninja Mechanics', () => {
  describe('Factory Ninja', () => {
    it('runs factory automation during stealth click', async () => {
      // Set up Factory Ninja with power > 0
      (engine as any).boosts.set('FactoryNinja', { unlocked: 1, bought: 1, power: 3 });
      (engine as any).boosts.set('NinjaBuilder', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).core.ninjaStealth = 5;

      // Call stealthClick directly
      (engine as any).stealthClick();

      // Factory Ninja power should decrement
      const fn = (engine as any).boosts.get('FactoryNinja');
      expect(fn.power).toBe(2);
    });

    it('locks Factory Ninja when power reaches 0', async () => {
      (engine as any).boosts.set('FactoryNinja', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('NinjaBuilder', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).core.ninjaStealth = 5;

      (engine as any).stealthClick();

      const fn = (engine as any).boosts.get('FactoryNinja');
      expect(fn.power).toBe(0);
      expect(fn.bought).toBe(0); // locked
    });
  });

  describe('Ninjasaw + VJ in calcStealthBuild', () => {
    it('multiplies by VJ reward when Ninjasaw and VJ enabled', () => {
      (engine as any).core.ninjaStealth = 10;
      (engine as any).boosts.set('Ninjasaw', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).resources.glassBlocks = 100;

      const result = (engine as any).calcStealthBuild(true, true);
      // 10 * 5 (VJ power) = 50
      expect(result).toBe(50);
      // Should spend 50 glass blocks
      expect((engine as any).resources.glassBlocks).toBe(50);
    });

    it('skips VJ if insufficient glass blocks', () => {
      (engine as any).core.ninjaStealth = 10;
      (engine as any).boosts.set('Ninjasaw', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).resources.glassBlocks = 10; // not enough

      const result = (engine as any).calcStealthBuild(true, true);
      expect(result).toBe(10); // no multiplier
    });

    it('skips VJ when useVJ is false', () => {
      (engine as any).core.ninjaStealth = 10;
      (engine as any).boosts.set('Ninjasaw', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('VJ', { unlocked: 1, bought: 1, power: 5 });
      (engine as any).resources.glassBlocks = 100;

      const result = (engine as any).calcStealthBuild(false, false);
      expect(result).toBe(10); // no VJ
    });
  });
});

// =============================================================================
// Plan 35: Ketchup Fast-Forward System
// =============================================================================

describe('Plan 35: Ketchup Fast-Forward System', () => {
  describe('processKetchup', () => {
    it('processes correct number of ticks', () => {
      const result = engine.processKetchup(5400, 1800);
      // 5400 / 1800 = 3 ticks
      expect(result.ticksProcessed).toBe(3);
    });

    it('caps lateness at 7200ms', () => {
      const result = engine.processKetchup(20000, 1800);
      // Capped to 7200, 7200/1800 = 4 ticks max
      expect(result.ticksProcessed).toBe(4);
    });

    it('skips ONG checks during ketchup', () => {
      // Set up state where ONG would normally trigger
      (engine as any).ong.elapsed = 1800000; // well past threshold
      const ongBefore = (engine as any).core.newpixNumber;

      engine.processKetchup(3600, 1800);

      // NP should not have changed (ONG skipped during ketchup)
      expect((engine as any).core.newpixNumber).toBe(ongBefore);
    });

    it('converts excess lateness to BB', () => {
      const result = engine.processKetchup(20000, 1800);
      // Excess = 20000 - 7200 = 12800, 12800/1800 ≈ 7.1 → 7 BB
      expect(result.bb).toBe(7);
    });

    it('converts to Shorks when PoG+ASHF enabled', () => {
      (engine as any).boosts.set('PoG', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('ASHF', { unlocked: 1, bought: 1, power: 0 });

      // 5,000,000ms lateness with mNPlength=1800 → np = floor(5000000/1000/1800) = 2
      const result = engine.processKetchup(5000000, 1800);
      expect(result.shorks).toBeGreaterThan(0);
    });

    it('SoS adds 1 extra shork', () => {
      // First run WITH SoS
      (engine as any).boosts.set('PoG', { unlocked: 1, bought: 1, power: 1 });
      (engine as any).boosts.set('ASHF', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('SoS', { unlocked: 1, bought: 1, power: 0 });

      const result1 = engine.processKetchup(5000000, 1800);

      // Second engine WITHOUT SoS
      const engine2 = new ModernEngine(testGameData);
      (engine2 as any).initialized = true;
      (engine2 as any).boosts.set('PoG', { unlocked: 1, bought: 1, power: 1 });
      (engine2 as any).boosts.set('ASHF', { unlocked: 1, bought: 1, power: 0 });
      (engine2 as any).boosts.set('SoS', { unlocked: 0, bought: 0, power: 0 });
      (engine2 as any).boosts.set('Shork', { unlocked: 1, bought: 0, power: 0 });

      const result2 = engine2.processKetchup(5000000, 1800);
      expect(result1.shorks).toBe(result2.shorks + 1);
    });

    it('returns 0 ticks for small elapsed time', () => {
      const result = engine.processKetchup(500, 1800);
      expect(result.ticksProcessed).toBe(0);
    });
  });

  describe('mustardCleanup', () => {
    it('cleans NaN sand power', () => {
      const sand = (engine as any).boosts.get('Sand');
      sand.power = NaN;

      const cleaned = engine.mustardCleanup();
      expect(cleaned).toBe(true);
      expect(sand.power).toBe(0);
    });

    it('returns false when nothing to clean', () => {
      const cleaned = engine.mustardCleanup();
      expect(cleaned).toBe(false);
    });
  });
});

// =============================================================================
// Plan 29: Photo & Color Reaction System (unit tests)
// =============================================================================

describe('Plan 29: Photo & Color Reaction System', () => {
  function createMockCtx(boosts: Record<string, { has: boolean; enabled?: boolean; power?: number }>): PhotoBoostAccess {
    const badges: string[] = [];
    const unlocked: string[] = [];
    return {
      hasBoost: (name) => boosts[name]?.has ?? false,
      isEnabled: (name) => boosts[name]?.enabled ?? false,
      getLevel: (name) => boosts[name]?.power ?? 0,
      getPower: (name) => boosts[name]?.power ?? 0,
      setPower: (name, value) => {
        if (!boosts[name]) boosts[name] = { has: true };
        boosts[name].power = value;
      },
      addPower: (name, amount) => {
        if (!boosts[name]) boosts[name] = { has: true };
        boosts[name].power = (boosts[name].power ?? 0) + amount;
      },
      unlockBoost: (name) => unlocked.push(name),
      earnBadge: (name) => badges.push(name),
      papal: () => 1,
    };
  }

  describe('decayPhoto', () => {
    it('decays Blueness at 0.1% per tick', () => {
      const colors = createInitialColorState();
      colors.blueness = 1000;
      const ctx = createMockCtx({});

      decayPhoto(colors, ctx);

      expect(colors.blueness).toBeLessThan(1000);
      // Lost ~1, gained some from otherness (0)
      expect(colors.blueness).toBeCloseTo(999, 0);
    });

    it('feeds decayed Blueness into Otherness', () => {
      const colors = createInitialColorState();
      colors.blueness = 1000;
      const ctx = createMockCtx({});

      decayPhoto(colors, ctx);

      // 1000 * 0.001 = 1 lost, * 2/3 conversion ≈ 0.667 Otherness
      expect(colors.otherness).toBeCloseTo(0.667, 2);
    });

    it('Improved Scaling increases conversion efficiency', () => {
      const colors1 = createInitialColorState();
      colors1.blueness = 1000;
      const ctx1 = createMockCtx({});
      decayPhoto(colors1, ctx1);
      const otherWithout = colors1.otherness;

      const colors2 = createInitialColorState();
      colors2.blueness = 1000;
      const ctx2 = createMockCtx({ ImprovedScaling: { has: true } });
      decayPhoto(colors2, ctx2);
      const otherWith = colors2.otherness;

      expect(otherWith).toBeGreaterThan(otherWithout);
    });
  });

  describe('reactPhoto', () => {
    it('converts Blackness + Whiteness to Grayness', () => {
      const colors = createInitialColorState();
      colors.blackness = 10;
      colors.whiteness = 10;
      const ctx = createMockCtx({});

      reactPhoto(colors, ctx);

      expect(colors.grayness).toBeGreaterThan(0);
      expect(colors.blackness).toBeLessThan(10);
      expect(colors.whiteness).toBeLessThan(10);
    });

    it('Equilibrium Constant enables reverse reaction', () => {
      const colors = createInitialColorState();
      colors.grayness = 100;
      colors.blackness = 0;
      colors.whiteness = 0;
      const ctx = createMockCtx({
        EquilibriumConstant: { has: true, enabled: true, power: 10 },
      });

      reactPhoto(colors, ctx);

      // Reverse: grayness consumed, blackness+whiteness produced
      expect(colors.grayness).toBeLessThan(100);
      expect(colors.blackness).toBeGreaterThan(0);
      expect(colors.whiteness).toBeGreaterThan(0);
    });
  });

  describe('craftPhoto', () => {
    it('Argy crafts squids: 50 Blue + 50 Other → 1 Black', () => {
      const colors = createInitialColorState();
      colors.blueness = 100;
      colors.otherness = 100;
      colors.blackness = 1;
      const ctx = createMockCtx({
        RoboticInker: { has: true, power: 1 }, // bit 0 = argy recipe
        Argy: { has: true },
      });

      craftPhoto(colors, ctx);

      expect(colors.blueness).toBe(50);
      expect(colors.otherness).toBe(50);
      expect(colors.blackness).toBe(2);
    });

    it('does nothing without Robotic Inker', () => {
      const colors = createInitialColorState();
      colors.blueness = 100;
      colors.otherness = 100;
      const ctx = createMockCtx({});

      craftPhoto(colors, ctx);

      expect(colors.blueness).toBe(100);
    });

    it('Polarizer dualizes: 5 Black → 1 White', () => {
      const colors = createInitialColorState();
      colors.blackness = 15;
      const ctx = createMockCtx({
        RoboticInker: { has: true, power: 2 }, // bit 1 = polarizer recipe
        Polarizer: { has: true },
      });

      craftPhoto(colors, ctx);

      expect(colors.blackness).toBe(0);
      expect(colors.whiteness).toBe(3);
    });
  });

  describe('getPhoto (passive)', () => {
    it('Meteor adds 10 Otherness per mNP', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({ Meteor: { has: true } });

      getPhoto(colors, ctx, 0);
      expect(colors.otherness).toBe(10);
    });

    it('Hallowed Ground adds 1 Grayness per mNP', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({ HallowedGround: { has: true } });

      getPhoto(colors, ctx, 0);
      expect(colors.grayness).toBe(1);
    });

    it('Ocean Blue adds power Blueness per mNP', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({ OceanBlue: { has: true, power: 5 } });

      getPhoto(colors, ctx, 0);
      expect(colors.blueness).toBe(5);
    });

    it('bluhint multiplies Ocean Blue generation', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({
        OceanBlue: { has: true, power: 5 },
        bluhint: { has: true, power: 3 },
      });

      getPhoto(colors, ctx, 0);
      expect(colors.blueness).toBe(15);
    });
  });

  describe('getPhoto (click)', () => {
    it('adds blueness on click', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({});

      getPhoto(colors, ctx, 1);
      expect(colors.blueness).toBe(1);
    });

    it('Doubletap doubles click generation', () => {
      const colors = createInitialColorState();
      const ctx = createMockCtx({ Doubletap: { has: true } });

      getPhoto(colors, ctx, 1);
      expect(colors.blueness).toBe(2);
    });
  });

  describe('unlockPhoto', () => {
    it('unlocks Argy at 15 Otherness', () => {
      const colors = createInitialColorState();
      colors.otherness = 15;
      const unlocked: string[] = [];
      const ctx = createMockCtx({});
      ctx.unlockBoost = (name) => unlocked.push(name);

      unlockPhoto(colors, ctx);

      expect(unlocked).toContain('Argy');
    });

    it('unlocks Polarizer at 5 Blackness', () => {
      const colors = createInitialColorState();
      colors.blackness = 5;
      const unlocked: string[] = [];
      const ctx = createMockCtx({});
      ctx.unlockBoost = (name) => unlocked.push(name);

      unlockPhoto(colors, ctx);

      expect(unlocked).toContain('Polarizer');
    });

    it('unlocks Photoelectricity at 10 Whiteness', () => {
      const colors = createInitialColorState();
      colors.whiteness = 10;
      const unlocked: string[] = [];
      const ctx = createMockCtx({});
      ctx.unlockBoost = (name) => unlocked.push(name);

      unlockPhoto(colors, ctx);

      expect(unlocked).toContain('Photoelectricity');
    });

    it('earns Colorrific badge when all 5 colors present', () => {
      const colors: PhotoColorState = {
        blueness: 1, otherness: 1, blackness: 1, whiteness: 1, grayness: 1,
      };
      const badges: string[] = [];
      const ctx = createMockCtx({});
      ctx.earnBadge = (name) => badges.push(name);

      unlockPhoto(colors, ctx);

      expect(badges).toContain('Colorrific');
    });
  });

  describe('runFastPhoto', () => {
    it('accumulates sqrt power in Photoelectricity', () => {
      const ctx = createMockCtx({
        Photoelectricity: { has: true, power: 0 },
      });

      runFastPhoto(25, ctx);

      // sqrt(25) = 5 → triggers 1 discovery, remaining power = 0
      expect(ctx.getPower('Photoelectricity')).toBeCloseTo(0, 5);
    });
  });

  describe('engine integration', () => {
    it('photo system runs during tick when Camera owned', async () => {
      (engine as any).boosts.set('Camera', { unlocked: 1, bought: 1, power: 0 });
      (engine as any).boosts.set('Meteor', { unlocked: 1, bought: 1, power: 0 });

      await engine.tick(1);

      const colors = engine.getPhotoColors();
      // Meteor adds 10, then decay removes ~0.01, so ~9.99
      expect(colors.otherness).toBeCloseTo(10, 0);
    });

    it('photo click generates Blueness', async () => {
      (engine as any).boosts.set('Camera', { unlocked: 1, bought: 1, power: 0 });
      engine.setPhotoColors({ blueness: 0 });

      await engine.clickBeach(1);

      const colors = engine.getPhotoColors();
      expect(colors.blueness).toBeGreaterThan(0);
    });
  });
});
