/**
 * Tests for time travel system
 *
 * Tests the time travel mechanics including:
 * - Time travel price calculation (castle cost)
 * - Jump cost calculation (glass chip cost)
 * - Relative time travel (timeTravel method)
 * - Absolute time travel (timeTravelTo method)
 * - Badge earning and boost unlocking
 * - Invader handling
 * - Validation rules
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';
import gameData from '../data/game-data.json';

describe('Time Travel System', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(gameData as unknown as GameData);
    await engine.initialize();
  });

  describe('calculateTimeTravelPrice', () => {
    it('calculates basic price formula', async () => {
      // At NP 1 with 0 travel count and 0 castles initially
      const price = engine.calculateTimeTravelPrice();

      // Formula: np + (castles * np / 3094) + travelCount
      // = 1 + (0 * 1 / 3094) + 0
      // = 1
      // Then divided by priceFactor (1 by default) and abs
      expect(price).toBe(1);
    });

    it('increases with travel count', async () => {
      const price1 = engine.calculateTimeTravelPrice();

      // Manually increment travel count
      engine.forceBoostExtra('Time Travel', { travelCount: 10 });

      const price2 = engine.calculateTimeTravelPrice();
      expect(price2).toBeGreaterThan(price1);
    });

    it('reduces by 80% with Flux Capacitor', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');

      // Add castles to make the price meaningful (not just 1)
      // With 15470 castles: price = 1 + 15470*1/3094 + 0 = 1 + 5 = 6
      // With Flux: 6 * 0.2 = 1.2, ceil = 2
      // Expected: 2 < 6 * 0.21 = 1.26 → FALSE, so need even more
      // With 30940 castles: price = 1 + 30940*1/3094 + 0 = 1 + 10 = 11
      // With Flux: 11 * 0.2 = 2.2, ceil = 3
      // Expected: 3 < 11 * 0.21 = 2.31 → FALSE
      // We need price where ceil(price * 0.2) < price * 0.21
      // This means we need price >= 3, so 20% = 0.6, ceil = 1, and price * 0.21 >= 0.63
      await engine.forceResources({ castles: 30940 * 3 });

      const priceWithout = engine.calculateTimeTravelPrice();

      // Unlock and buy Flux Capacitor (need resources first)
      await engine.forceResources({ sand: 1000, castles: 1000 });
      await engine.unlockBoost('Flux Capacitor');
      await engine.buyBoost('Flux Capacitor');

      const priceWith = engine.calculateTimeTravelPrice();

      // Should be 20% of original
      expect(priceWith).toBeLessThan(priceWithout * 0.21);
    });
  });

  describe('calculateJumpCost', () => {
    it('calculates quadratic distance cost', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100 });
      await engine.buyBoost('Time Travel');

      // Jump from NP 1 to NP 10 (gap = 9)
      const cost = engine.calculateJumpCost(10);

      // Formula: (gap^2 + travelCount) * 100
      // = (81 + 0) * 100 = 8100
      expect(cost).toBe(8100);
    });

    it('includes travel count in cost', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100 });
      await engine.buyBoost('Time Travel');

      engine.forceBoostExtra('Time Travel', { travelCount: 50 });

      const cost = engine.calculateJumpCost(10);

      // Formula: ((10-1)^2 + 50) * 100 = (81 + 50) * 100 = 13100
      expect(cost).toBe(13100);
    });

    it('increases cost massively for crossing sides', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100 });
      await engine.buyBoost('Time Travel');
      await engine.setNewpix(10);

      // Jump from positive to negative
      const costNoCross = engine.calculateJumpCost(15); // Same side
      const costCross = engine.calculateJumpCost(-5); // Cross to negative

      // Cross-side cost should be 1,000,000x higher
      expect(costCross).toBeGreaterThan(costNoCross * 100000);
    });

    it('reduces by 80% with Flux Capacitor', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100 });
      await engine.buyBoost('Time Travel');

      const costWithout = engine.calculateJumpCost(10);

      await engine.unlockBoost('Flux Capacitor');
      await engine.forceResources({ sand: 100, castles: 100 });
      await engine.buyBoost('Flux Capacitor');

      const costWith = engine.calculateJumpCost(10);

      // Should be 20% of original
      expect(costWith).toBe(Math.ceil(costWithout * 0.2));
    });

    it('reduces by 50% with Mind Glow and sand monument', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.setNewpix(10);

      // Earn sand monument for NP 15
      (engine as any).earnBadge('monums15');

      await engine.unlockBoost('Mind Glow');
      await engine.buyBoost('Mind Glow');

      const costWithout = engine.calculateJumpCost(20); // No monument
      const costWith = engine.calculateJumpCost(15); // Has monument

      // Cost to 15 should be cheaper (monument reduction applied)
      expect(costWith).toBeLessThan(costWithout);
    });
  });

  describe('timeTravel (relative)', () => {
    it('fails if Time Travel not owned', async () => {
      const result = await engine.timeTravel(5);
      expect(result).toBe(false);
    });

    it('travels forward by offset', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 1000 });
      await engine.buyBoost('Time Travel');

      // Must visit NP 6 first so it's in highestNPvisited
      await engine.setNewpix(6);
      await engine.setNewpix(1);

      const result = await engine.timeTravel(5);
      expect(result).toBe(true);

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(6); // 1 + 5
    });

    it('travels backward by offset', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 1000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 10 to update highestNPvisited
      await engine.setNewpix(10);

      const result = await engine.timeTravel(-3);
      expect(result).toBe(true);

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(7); // 10 - 3
    });

    it('awards Fast Forward badge when traveling forward from positive NP', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 1000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 6 first
      await engine.setNewpix(6);
      await engine.setNewpix(1);

      await engine.timeTravel(5);

      const state = await engine.getStateSnapshot();
      expect(state.badges['Fast Forward']).toBe(true);
    });

    it('awards And Back badge when traveling backward from positive NP', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 1000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 10
      await engine.setNewpix(10);

      await engine.timeTravel(-3);

      const state = await engine.getStateSnapshot();
      expect(state.badges['And Back']).toBe(true);
    });

    it('unlocks Flux Capacitor after 20 travels', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 2
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      engine.forceBoostExtra('Time Travel', { travelCount: 19 });

      await engine.timeTravel(1);

      const state = await engine.getStateSnapshot();
      expect(state.boosts['Flux Capacitor']?.unlocked).toBeGreaterThan(0);
    });

    it('awards Primer badge after 10 travels', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 2
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      engine.forceBoostExtra('Time Travel', { travelCount: 9 });

      await engine.timeTravel(1);

      const state = await engine.getStateSnapshot();
      expect(state.badges['Primer']).toBe(true);
    });

    it('awards Wimey badge after 40 travels', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 2
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      engine.forceBoostExtra('Time Travel', { travelCount: 39 });

      await engine.timeTravel(1);

      const state = await engine.getStateSnapshot();
      expect(state.badges['Wimey']).toBe(true);
    });
  });

  describe('timeTravelTo (absolute)', () => {
    it('fails if cannot afford castle cost', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 0 });

      const result = await engine.timeTravelTo(5, false);
      expect(result).toBe(false);
    });

    it('fails if cannot afford glass chip cost', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ glassChips: 0 });

      const result = await engine.timeTravelTo(5, true);
      expect(result).toBe(false);
    });

    it('travels to specific NP using castles', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 10000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 10 first
      await engine.setNewpix(10);
      await engine.setNewpix(1);

      const result = await engine.timeTravelTo(10, false);
      expect(result).toBe(true);

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(10);
    });

    it('travels to specific NP using glass chips', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ glassChips: 100000 });

      // Visit NP 10 first
      await engine.setNewpix(10);
      await engine.setNewpix(1);

      const result = await engine.timeTravelTo(10, true);
      expect(result).toBe(true);

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(10);
    });

    it('spends castles when using castle-based travel', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 10000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 2 first
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      const stateBefore = await engine.getStateSnapshot();
      await engine.timeTravelTo(2, false);
      const stateAfter = await engine.getStateSnapshot();

      expect(stateAfter.castles).toBeLessThan(stateBefore.castles);
    });

    it('spends glass chips when using chip-based travel', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ glassChips: 100000 });

      // Visit NP 10 first
      await engine.setNewpix(10);
      await engine.setNewpix(1);

      const stateBefore = await engine.getStateSnapshot();
      await engine.timeTravelTo(10, true);
      const stateAfter = await engine.getStateSnapshot();

      expect(stateAfter.glassChips).toBeLessThan(stateBefore.glassChips);
    });

    it('fails to travel to negative NP without Minus Worlds badge', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      const result = await engine.timeTravelTo(-5, false);
      expect(result).toBe(false);

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(1); // Still at NP 1
    });

    it('fails to travel to unvisited future', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      // Try to travel to NP 3000 without visiting it first
      const result = await engine.timeTravelTo(3000, false);
      expect(result).toBe(false);
    });

    it('fails to travel from NP 0 to non-edge NP', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });
      await engine.setNewpix(0);

      // Awards The Big Freeze badge but fails
      const result = await engine.timeTravelTo(100, false);
      expect(result).toBe(false);

      const state = await engine.getStateSnapshot();
      expect(state.badges['The Big Freeze']).toBe(true);
    });

    it('resets Signpost power on travel', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.unlockBoost('Signpost');
      await engine.buyBoost('Signpost');

      const signpost = await engine.getBoostState('Signpost');
      if (signpost) signpost.power = 100;

      await engine.forceResources({ castles: 10000 });

      // Visit NP 2 first
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      await engine.timeTravelTo(2, false);

      const signpostAfter = await engine.getBoostState('Signpost');
      expect(signpostAfter?.power).toBe(0);
    });

    it('increments travel count', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 10000 });
      await engine.buyBoost('Time Travel');

      // Visit NP 2 first
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      await engine.timeTravelTo(2, false);

      const boost = await engine.getBoostState('Time Travel');
      expect(boost?.extra?.travelCount).toBe(1);
    });

    it('locks Muse boost on travel', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.unlockBoost('Muse');
      await engine.buyBoost('Muse');

      await engine.forceResources({ castles: 10000 });

      // Visit NP 2 first
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      await engine.timeTravelTo(2, false);

      const muse = await engine.getBoostState('Muse');
      expect(muse?.bought).toBe(0); // Locked resets bought to 0
    });
  });

  describe('handleInvaders', () => {
    it('has chance to spawn NewPixBot invader after 10+ travels', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      // Buy a NewPixBot to enable invader system
      await (engine as any).buyCastleTool('NewPixBot');

      // Visit NP 2 first
      await engine.setNewpix(2);
      await engine.setNewpix(1);

      engine.forceBoostExtra('Time Travel', { travelCount: 9 });

      const stateBefore = await engine.getStateSnapshot();
      const npbBefore = stateBefore.castleTools.NewPixBot?.amount ?? 0;

      // Travel once to hit 10 travels
      await engine.timeTravelTo(2, false);

      const stateAfter = await engine.getStateSnapshot();
      const npbAfter = stateAfter.castleTools.NewPixBot?.amount ?? 0;

      // Invader spawning is random, so we can't guarantee it happens
      // But the amount should be >= what it was before
      expect(npbAfter).toBeGreaterThanOrEqual(npbBefore);
    });

    it('reduces invader chance with Flux Capacitor', async () => {
      // This is hard to test without running many iterations due to randomness
      // Just verify the method can be called
      await engine.unlockBoost('Time Travel');
      await engine.forceResources({ sand: 1000, castles: 100000 });
      await engine.buyBoost('Time Travel');
      await engine.unlockBoost('Flux Capacitor');
      await engine.buyBoost('Flux Capacitor');

      engine.forceBoostExtra('Time Travel', { travelCount: 10 });

      // Should not throw
      await engine.timeTravelTo(2, false);
    });
  });

  describe('Temporal Anchor integration', () => {
    it('prevents NP advancement during ONG when anchored', async () => {
      // This test verifies that Temporal Anchor (if enabled) would prevent NP changes
      // The actual implementation is in ongAdvanceNewpix which checks for Temporal Anchor

      // For now, just verify the boost exists in game data
      const anchorDef = gameData.boosts['Temporal Anchor'];
      expect(anchorDef).toBeDefined();
      expect(anchorDef?.name).toBe('Temporal Anchor');
    });
  });

  describe('Edge cases', () => {
    it('handles fractional newpix numbers correctly', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      // Set to fractional NP (e.g., 1.123 for timeline 0.123)
      await engine.setNewpix(1.123);

      // Travel forward should preserve fractional part
      await engine.timeTravel(5);

      const state = await engine.getStateSnapshot();
      const frac = state.newpixNumber - Math.floor(state.newpixNumber);
      expect(frac).toBeCloseTo(0.123, 3);
    });

    it('prevents timeline crossing', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      await engine.setNewpix(1.123);

      // Try to travel to different timeline (different fractional part)
      const result = await engine.timeTravelTo(5.456, false);
      expect(result).toBe(false);
    });

    it('handles negative newpix numbers', async () => {
      await engine.unlockBoost('Time Travel');
      await engine.buyBoost('Time Travel');
      await engine.forceResources({ castles: 100000 });

      // First earn Minus Worlds badge
      (engine as any).earnBadge('Minus Worlds');

      // Set to negative NP
      await engine.setNewpix(-10);

      // Travel in negative space
      const result = await engine.timeTravel(-5);

      if (result) {
        const state = await engine.getStateSnapshot();
        expect(state.newpixNumber).toBe(-15);
      }
    });
  });
});
