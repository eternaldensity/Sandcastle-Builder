import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';
import gameData from '../data/game-data.json';
import { getDiscovery, hasDiscovery, getAllDiscoveryNPs } from '../data/discoveries.js';

describe('Discovery System', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(gameData as unknown as GameData);
    await engine.initialize();
  });

  describe('Discovery Data', () => {
    it('has 700 total discoveries', () => {
      const allNPs = getAllDiscoveryNPs();
      expect(allNPs.length).toBe(700);
    });

    it('has discovery for NP 1 (In the Beginning)', () => {
      const discovery = getDiscovery(1);
      expect(discovery).toBeDefined();
      expect(discovery?.name).toBe('In the Beginning');
      expect(discovery?.desc).toBe('the first time we saw Megan and Cueball sitting by the sea');
    });

    it('has discovery for NP 2440 (METEOR!)', () => {
      const discovery = getDiscovery(2440);
      expect(discovery).toBeDefined();
      expect(discovery?.name).toBe('METEOR!');
      expect(discovery?.desc).toBe("Wow, it's a meteor!");
    });

    it('has no discovery for NP 2 (no special frame)', () => {
      expect(hasDiscovery(2)).toBe(false);
      expect(getDiscovery(2)).toBeUndefined();
    });

    it('supports decimal NP values (T1i storyline)', () => {
      const discovery = getDiscovery(11.1);
      expect(discovery).toBeDefined();
      expect(discovery?.name).toBe('A wild Beanie appears!');
    });

    it('supports negative NP values for Time Travel', () => {
      const discovery = getDiscovery(-1);
      expect(discovery).toBeDefined();
      expect(discovery?.np).toBe(1);
      expect(discovery?.name).toBe('In the Beginning');
    });
  });

  describe('Discovery Earning', () => {
    it('earns discovery when advancing to NewPix with discovery', async () => {
      // Start at NP 15 (no discovery), advance to NP 16 (has discovery "Dip")
      await engine.setNewpix(15);

      // Advance to NP 16
      await engine.advanceToONG();

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(16);
      expect(state.badges['discov16']).toBe(true);
    });

    it('does not earn discovery twice', async () => {
      // Earn discovery for NP 16
      await engine.setNewpix(15);
      await engine.advanceToONG();

      let state = await engine.getStateSnapshot();
      expect(state.badges['discov16']).toBe(true);

      // Go back to NP 15
      await engine.setNewpix(15);

      // Advance to NP 16 again
      await engine.advanceToONG();

      state = await engine.getStateSnapshot();
      // Should still have the badge (and only once)
      expect(state.badges['discov16']).toBe(true);
    });

    it('earns multiple discoveries as NP advances', async () => {
      await engine.setNewpix(15);

      // Advance to NP 16 (has discovery "Dip")
      await engine.advanceToONG();

      let state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(16);
      expect(state.badges['discov16']).toBe(true);

      // Advance to NP 17 (no discovery)
      await engine.advanceToONG();

      state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(17);
      expect(state.badges['discov17']).toBeUndefined();

      // Advance to NP 25 (has discovery "Start of Construction")
      for (let i = 0; i < 8; i++) {
        await engine.advanceToONG();
      }

      state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(25);
      expect(state.badges['discov25']).toBe(true);
    });

    it('does not earn discovery for NP without one', async () => {
      // NP 2 has no discovery
      await engine.setNewpix(1);
      await engine.advanceToONG();

      const state = await engine.getStateSnapshot();
      expect(state.newpixNumber).toBe(2);
      expect(state.badges['discov2']).toBeUndefined();
    });

    it('handles negative NP discoveries (Time Travel)', async () => {
      // In negative NPs, ONG moves more negative: -15 -> -16
      // Let's use -15 -> -16, and check if NP 16 has a discovery (it does: "Dip")
      await engine.setNewpix(-15);

      await engine.advanceToONG();

      const state = await engine.getStateSnapshot();
      // We moved from -15 to -16
      expect(state.newpixNumber).toBe(-16);
      // Should have earned discov-16 (same discovery as NP 16, but accessed via -16)
      expect(state.badges['discov-16']).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles NP 0 (Chronocenter)', async () => {
      const discovery = getDiscovery(0);
      expect(discovery).toBeDefined();
      expect(discovery?.name).toBe('Chronocenter');
    });

    it('handles decimal NP values (T1i storyline)', async () => {
      // These are special fractional newpix from alternate timeline
      expect(hasDiscovery(11.1)).toBe(true);
      expect(hasDiscovery(90.1)).toBe(true);
      expect(hasDiscovery(1222.1)).toBe(true);
    });

    it('handles very high NP values', async () => {
      const discovery = getDiscovery(3089);
      expect(discovery).toBeDefined();
      expect(discovery?.name).toBe('The End');
      expect(discovery?.desc).toBe('Sob sob cry, bring on the ice cream');
    });
  });
});
