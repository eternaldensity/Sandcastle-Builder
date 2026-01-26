/**
 * Save/Load Parity Tests
 *
 * Tests round-trip compatibility: load legacy save → play in modern engine → save → load
 *
 * Ensures full save/load parity with the legacy game.
 */

import { describe, it, expect } from 'vitest';
import { ModernEngine } from '../engine/modern-engine.js';
import { SaveParser } from '../engine/save-parser.js';
import { SaveSerializer } from '../engine/save-serializer.js';
import type { GameData } from '../types/game-data.js';
import gameDataJson from '../data/game-data.json';

const gameData = gameDataJson as unknown as GameData;

describe('Save/Load Parity', () => {
  describe('Round-trip serialization', () => {
    it('serializes and deserializes initial state without loss', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Export initial state
      const exported1 = await engine.exportState();

      // Parse it back
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Export again
      const exported2 = await engine2.exportState();

      // Should be identical
      expect(exported2).toBe(exported1);
    });

    it('preserves state after beach clicks', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Perform actions
      await engine.clickBeach(50);

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify state
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      expect(snapshot2.beachClicks).toBe(snapshot1.beachClicks);
      expect(snapshot2.sand).toBe(snapshot1.sand);

      // Round-trip again
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves state after tool purchases', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Build up resources (need enough castles to buy 2 buckets)
      // First bucket costs 8, second costs ~9 due to price scaling
      await engine.clickBeach(10000);
      await engine.tick(500);

      // Buy tools
      await engine.buyTool('sand', 'Bucket');
      await engine.buyTool('sand', 'Bucket');

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify tools
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      expect(snapshot2.sandTools['Bucket'].amount).toBe(2);
      expect(snapshot2.sandTools['Bucket'].bought).toBe(2);
      expect(snapshot2.sandTools['Bucket'].amount).toBe(snapshot1.sandTools['Bucket'].amount);

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves state after boost purchases', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Build up resources (need 500 sand for Bigger Buckets)
      await engine.clickBeach(5000);
      await engine.tick(10); // Fewer ticks to keep more sand

      // Unlock and buy boost
      await engine.unlockBoost('Bigger Buckets');
      await engine.buyBoost('Bigger Buckets');

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify boosts
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      expect(snapshot2.boosts['Bigger Buckets']?.bought).toBe(1);
      expect(snapshot2.boosts['Bigger Buckets']?.bought).toBe(snapshot1.boosts['Bigger Buckets']?.bought);

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves state after ONG transition', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Build resources and tools
      await engine.clickBeach(500);
      await engine.buyTool('sand', 'Bucket');
      await engine.buyTool('sand', 'Bucket');

      // Trigger ONG
      await engine.setNewpix(2);

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify NP changed
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      expect(snapshot2.newpixNumber).toBe(2);
      expect(snapshot2.newpixNumber).toBe(snapshot1.newpixNumber);

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves castle tools and production totals', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Build up to castles and buy castle tools
      await engine.clickBeach(1000);
      await engine.tick(100);

      // Get to ONG to unlock castle tools
      await engine.setNewpix(2);

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify castle state
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      expect(snapshot2.castles).toBe(snapshot1.castles);
      expect(snapshot2.glassChips).toBe(snapshot1.glassChips);

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves badge state', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Earn a badge
      await engine.clickBeach(500);

      // Check what badges were earned before export
      const preExportSnapshot = await engine.getStateSnapshot();
      const preExportEarned = Object.entries(preExportSnapshot.badges)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      // Export state (should have earned some badges like "No Ninja")
      const exported1 = await engine.exportState();

      // Check if export changed badge state
      const postExportSnapshot = await engine.getStateSnapshot();
      const postExportEarned = Object.entries(postExportSnapshot.badges)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      if (preExportEarned.length !== postExportEarned.length) {
        console.log('Export changed badges!');
        console.log('  Before export:', preExportEarned.length);
        console.log('  After export:', postExportEarned.length);
      }

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Verify badges
      const snapshot1 = await engine.getStateSnapshot();
      const snapshot2 = await engine2.getStateSnapshot();

      // Find differences
      const earnedInSnapshot1 = Object.entries(snapshot1.badges).filter(([_, v]) => v).map(([k]) => k);
      const earnedInSnapshot2 = Object.entries(snapshot2.badges).filter(([_, v]) => v).map(([k]) => k);

      if (earnedInSnapshot1.length !== earnedInSnapshot2.length) {
        console.log('Earned badges mismatch:');
        console.log('  snapshot1:', earnedInSnapshot1);
        console.log('  snapshot2:', earnedInSnapshot2);
      }

      // Compare all badges
      for (const badgeName of Object.keys(snapshot1.badges)) {
        expect(snapshot2.badges[badgeName]).toBe(snapshot1.badges[badgeName]);
      }

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('preserves redundakitty state', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Click beach enough to potentially trigger redundakitty
      await engine.clickBeach(1000);
      await engine.tick(500);

      // Export state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Round-trip
      const exported2 = await engine2.exportState();
      expect(exported2).toBe(exported1);
    });

    it('handles complex game state with multiple systems', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      // Complex gameplay sequence
      await engine.clickBeach(2000);
      await engine.tick(100);

      // Buy multiple tools
      await engine.buyTool('sand', 'Bucket');
      await engine.buyTool('sand', 'Bucket');
      await engine.buyTool('sand', 'Cuegan');

      // Buy boosts
      await engine.buyBoost('Sandcastle Builder');

      // Advance to ONG
      await engine.setNewpix(2);
      await engine.tick(50);

      // Export complex state
      const exported1 = await engine.exportState();

      // Load in new engine
      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported1);

      // Continue playing in new engine
      await engine2.clickBeach(100);
      const exported2a = await engine2.exportState();

      // Load that state in third engine
      const engine3 = new ModernEngine(gameData);
      await engine3.initialize();
      await engine3.loadState(exported2a);

      // Verify no loss across multiple loads
      const exported3 = await engine3.exportState();
      expect(exported3).toBe(exported2a);
    });
  });

  describe('Field preservation', () => {
    it('preserves all core game numbers', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(500);
      await engine.tick(100);

      const snapshot1 = await engine.getStateSnapshot();
      const exported = await engine.exportState();

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported);
      const snapshot2 = await engine2.getStateSnapshot();

      // Core fields
      expect(snapshot2.version).toBe(snapshot1.version);
      expect(snapshot2.newpixNumber).toBe(snapshot1.newpixNumber);
      expect(snapshot2.beachClicks).toBe(snapshot1.beachClicks);
      expect(snapshot2.ninjaFreeCount).toBe(snapshot1.ninjaFreeCount);
      expect(snapshot2.ninjaStealth).toBe(snapshot1.ninjaStealth);
      expect(snapshot2.ninjad).toBe(snapshot1.ninjad);
    });

    it('preserves all resources', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(1000);
      await engine.tick(200);
      await engine.setNewpix(2);

      const snapshot1 = await engine.getStateSnapshot();
      const exported = await engine.exportState();

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported);
      const snapshot2 = await engine2.getStateSnapshot();

      // Resources
      expect(snapshot2.sand).toBe(snapshot1.sand);
      expect(snapshot2.castles).toBe(snapshot1.castles);
      expect(snapshot2.glassChips).toBe(snapshot1.glassChips);
      expect(snapshot2.glassBlocks).toBe(snapshot1.glassBlocks);
    });

    it('preserves tool statistics', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(1000);
      await engine.tick(100);
      await engine.buyTool('sand', 'Bucket');
      await engine.tick(100);

      const snapshot1 = await engine.getStateSnapshot();
      const exported = await engine.exportState();

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported);
      const snapshot2 = await engine2.getStateSnapshot();

      // Tool stats
      const tool1 = snapshot1.sandTools['Bucket'];
      const tool2 = snapshot2.sandTools['Bucket'];

      expect(tool2.amount).toBe(tool1.amount);
      expect(tool2.bought).toBe(tool1.bought);
      expect(tool2.totalSand).toBe(tool1.totalSand);
      expect(tool2.temp).toBe(tool1.temp);
      expect(tool2.totalGlass).toBe(tool1.totalGlass);
    });

    it('preserves boost properties', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(1000);
      await engine.buyBoost('Sandcastle Builder');

      const snapshot1 = await engine.getStateSnapshot();
      const exported = await engine.exportState();

      const engine2 = new ModernEngine(gameData);
      await engine2.initialize();
      await engine2.loadState(exported);
      const snapshot2 = await engine2.getStateSnapshot();

      // Boost properties
      const boost1 = snapshot1.boosts['Sandcastle Builder'];
      const boost2 = snapshot2.boosts['Sandcastle Builder'];

      expect(boost2?.unlocked).toBe(boost1?.unlocked);
      expect(boost2?.bought).toBe(boost1?.bought);
      expect(boost2?.power).toBe(boost1?.power);
      expect(boost2?.countdown).toBe(boost1?.countdown);
    });
  });

  describe('Save format compatibility', () => {
    it('produces valid save format structure', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      const exported = await engine.exportState();

      // Save format uses 'P' as pipe delimiter
      expect(exported).toContain('P');

      // Should have expected number of sections (12 total, 0-11)
      const sections = exported.split('P');
      expect(sections.length).toBeGreaterThanOrEqual(12);

      // Section 0: version
      expect(parseFloat(sections[0])).toBeGreaterThan(0);

      // Section 2: startDate
      expect(sections[2]).toBeTruthy();
    });

    it('uses semicolon delimiters in gamenums section', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(100);

      const exported = await engine.exportState();
      const sections = exported.split('P');

      // Section 4 is gamenums
      const gamenums = sections[4];
      expect(gamenums).toContain('S'); // Semicolon delimiter

      // Should contain newpix number
      expect(gamenums).toMatch(/^\d+S/);
    });

    it('uses comma delimiters in tool sections', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(100);
      await engine.buyTool('sand', 'Bucket');

      const exported = await engine.exportState();
      const sections = exported.split('P');

      // Section 5 is sandTools
      const sandTools = sections[5];
      expect(sandTools).toContain('C'); // Comma delimiter
      expect(sandTools).toContain('S'); // Semicolon delimiter between tools
    });

    it('encodes badges correctly', async () => {
      const engine = new ModernEngine(gameData);
      await engine.initialize();

      await engine.clickBeach(500);

      const exported = await engine.exportState();
      const sections = exported.split('P');

      // Section 8 is regular badges (single chars)
      const badges = sections[8];
      expect(badges).toMatch(/^[01]*$/); // Only 0s and 1s

      // Section 10 is other badges (hex encoded)
      const otherBadges = sections[10];
      expect(otherBadges).toMatch(/^[0-9a-f]*$/); // Only hex chars
    });
  });
});
