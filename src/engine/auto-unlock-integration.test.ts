/**
 * Auto-Unlock Integration Tests
 *
 * Tests that verify boost auto-unlocking works correctly during gameplay.
 * These tests validate Plan 14 implementation by checking that boosts
 * unlock automatically when conditions are met.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernEngine } from './modern-engine.js';
import type { GameData } from '../types/game-data.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gameDataPath = path.resolve(__dirname, '../data/game-data.json');
const gameData: GameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf-8'));

describe('Auto-Unlock Integration', () => {
  let engine: ModernEngine;

  beforeEach(async () => {
    engine = new ModernEngine(gameData);
    await engine.initialize();
  });

  describe('Tool-based unlocks', () => {
    it('unlocks Bigger Buckets when buying first Bucket', async () => {
      // Check initial state - should be locked
      const initialState = await engine.getBoostState('Bigger Buckets');
      expect(initialState.unlocked).toBe(0);

      // Give resources and buy a Bucket
      engine.getResourcesForTesting().castles = 100;
      await engine.buyTool('sand', 'Bucket', 1);

      // Verify Bigger Buckets auto-unlocked
      const unlockedState = await engine.getBoostState('Bigger Buckets');
      expect(unlockedState.unlocked).toBe(1);
    });

    it('unlocks multiple bucket boosts as count increases', async () => {
      // Give enough castles for 4 buckets
      engine.getResourcesForTesting().castles = 10000;

      // Buy 1 bucket - should unlock Bigger Buckets
      await engine.buyTool('sand', 'Bucket', 1);
      expect((await engine.getBoostState('Bigger Buckets')).unlocked).toBe(1);
      expect((await engine.getBoostState('Huge Buckets')).unlocked).toBe(0);

      // Buy 3 more (total 4) - should unlock Huge Buckets
      await engine.buyTool('sand', 'Bucket', 3);
      expect((await engine.getBoostState('Huge Buckets')).unlocked).toBe(1);
    });

    it('unlocks Helping Hand when buying first Cuegan', async () => {
      engine.getResourcesForTesting().castles = 1000;
      await engine.buyTool('sand', 'Cuegan', 1);

      const state = await engine.getBoostState('Helping Hand');
      expect(state.unlocked).toBe(1);
    });

    it('unlocks Flag Bearer when buying first Flag', async () => {
      engine.getResourcesForTesting().castles = 10000;
      await engine.buyTool('sand', 'Flag', 1);

      const state = await engine.getBoostState('Flag Bearer');
      expect(state.unlocked).toBe(1);
    });

    it('unlocks Busy Bot when buying 3 NewPixBots', async () => {
      engine.getResourcesForTesting().castles = 1e10;
      await engine.buyTool('castle', 'NewPixBot', 3);

      const state = await engine.getBoostState('Busy Bot');
      expect(state.unlocked).toBe(1);
    });

    it('unlocks Spring Fling when buying first Trebuchet', async () => {
      engine.getResourcesForTesting().castles = 1e10;
      await engine.buyTool('castle', 'Trebuchet', 1);

      const state = await engine.getBoostState('Spring Fling');
      expect(state.unlocked).toBe(1);
    });
  });

  describe('Compound unlock conditions', () => {
    it('requires multiple conditions to be met', async () => {
      // Buy 100 buckets (without Flung badge)
      engine.getResourcesForTesting().castles = 1e20;
      await engine.buyTool('sand', 'Bucket', 100);

      // Should not unlock yet (missing Flung badge)
      expect((await engine.getBoostState('Flying Buckets')).unlocked).toBe(0);

      // Earn Flung badge (requires 50 Trebuchets)
      await engine.buyTool('castle', 'Trebuchet', 50);
      await engine.checkUnlocksForTesting();

      // Now Flying Buckets should unlock
      expect((await engine.getBoostState('Flying Buckets')).unlocked).toBe(1);
    });

    it('unlocks Precise Placement when Scaffold >= 2 AND Ladder >= 1', async () => {
      engine.getResourcesForTesting().castles = 1e15;

      // Buy ladder first
      await engine.buyTool('sand', 'Ladder', 1);
      expect((await engine.getBoostState('Precise Placement')).unlocked).toBe(0);

      // Buy 2 scaffolds - should now unlock
      await engine.buyTool('castle', 'Scaffold', 2);
      expect((await engine.getBoostState('Precise Placement')).unlocked).toBe(1);
    });

    it('unlocks Sandbag when River >= 1 AND Bag >= 1', async () => {
      engine.getResourcesForTesting().castles = 1e15;

      // Buy bag first
      await engine.buyTool('sand', 'Bag', 1);
      expect((await engine.getBoostState('Sandbag')).unlocked).toBe(0);

      // Buy river - should unlock
      await engine.buyTool('castle', 'River', 1);
      expect((await engine.getBoostState('Sandbag')).unlocked).toBe(1);
    });
  });

  describe('Auto-unlock trigger points', () => {
    it('checks unlocks on initialization', async () => {
      // Create a fresh engine - no boosts should be unlocked initially
      const freshEngine = new ModernEngine(gameData);
      await freshEngine.initialize();

      // In a fresh game with no tools, no tool-based boosts should unlock
      const biggerBuckets = await freshEngine.getBoostState('Bigger Buckets');
      expect(biggerBuckets.unlocked).toBe(0);
    });

    it('checks unlocks after tool purchase', async () => {
      // This is tested above, but explicitly verify the trigger
      engine.getResourcesForTesting().castles = 100;

      const before = await engine.getBoostState('Bigger Buckets');
      expect(before.unlocked).toBe(0);

      await engine.buyTool('sand', 'Bucket', 1);

      const after = await engine.getBoostState('Bigger Buckets');
      expect(after.unlocked).toBe(1);
    });

    it('preserves unlocked state across operations', async () => {
      // Setup game state with tools
      engine.getResourcesForTesting().castles = 10000;
      await engine.buyTool('sand', 'Bucket', 5);

      // Verify unlocks happened
      expect((await engine.getBoostState('Bigger Buckets')).unlocked).toBe(1);
      expect((await engine.getBoostState('Huge Buckets')).unlocked).toBe(1);

      // Buy more tools - unlocked state should persist
      await engine.buyTool('sand', 'Cuegan', 1);

      // Original unlocks should still be present
      expect((await engine.getBoostState('Bigger Buckets')).unlocked).toBe(1);
      expect((await engine.getBoostState('Huge Buckets')).unlocked).toBe(1);
      // And new unlock from Cuegan purchase
      expect((await engine.getBoostState('Helping Hand')).unlocked).toBe(1);
    });
  });
});
