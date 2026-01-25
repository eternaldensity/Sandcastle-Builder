/**
 * Engine Comparison Tests
 *
 * Runs identical action sequences on both LegacyEngine and ModernEngine
 * to identify parity gaps and validate the modern implementation.
 *
 * Key findings from initial tests:
 * - Legacy game starts with some boosts unlocked and badges earned
 * - Beach click yields ~0.22 sand in legacy (base rate with ninja penalty)
 * - Modern engine uses simplified 1 sand per click
 * - State accumulates in legacy engine between tests (browser session)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LegacyEngine } from './legacy-engine.js';
import { ModernEngine } from '../engine/modern-engine.js';
import { compareStates } from './parity-runner.js';
import type { GameData } from '../types/game-data.js';
import type { GameStateSnapshot, TestAction } from './game-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load game data
const gameDataPath = path.resolve(__dirname, '../data/game-data.json');
const gameData: GameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf-8'));

/**
 * Run actions on an engine and return final state
 */
async function runActions(
  engine: { executeAction: (a: TestAction) => Promise<void>; getStateSnapshot: () => Promise<GameStateSnapshot> },
  actions: TestAction[]
): Promise<GameStateSnapshot> {
  for (const action of actions) {
    await engine.executeAction(action);
  }
  return engine.getStateSnapshot();
}

describe('Engine Comparison', () => {
  let legacyEngine: LegacyEngine;

  beforeAll(async () => {
    legacyEngine = new LegacyEngine();
    await legacyEngine.initialize();
  }, 60000);

  afterAll(async () => {
    await legacyEngine.dispose();
  });

  describe('Initial State Analysis', () => {
    it('captures legacy initial state for reference', async () => {
      const legacyState = await legacyEngine.getStateSnapshot();

      console.log('\n=== Legacy Initial State ===');
      console.log(`Version: ${legacyState.version}`);
      console.log(`NewpixNumber: ${legacyState.newpixNumber}`);
      console.log(`Sand: ${legacyState.sand}`);
      console.log(`Castles: ${legacyState.castles}`);
      console.log(`Beach Clicks: ${legacyState.beachClicks}`);

      // Count unlocked boosts and earned badges
      let unlockedBoosts = 0;
      let boughtBoosts = 0;
      for (const [, state] of Object.entries(legacyState.boosts)) {
        if (state.unlocked > 0) unlockedBoosts++;
        if (state.bought > 0) boughtBoosts++;
      }

      let earnedBadges = 0;
      for (const [, earned] of Object.entries(legacyState.badges)) {
        if (earned) earnedBadges++;
      }

      console.log(`Unlocked boosts: ${unlockedBoosts}`);
      console.log(`Bought boosts: ${boughtBoosts}`);
      console.log(`Earned badges: ${earnedBadges}`);

      // Log some specific boosts for reference
      console.log('\nSample boosts:');
      console.log(`  Sand.power: ${legacyState.boosts['Sand']?.power}`);
      console.log(`  Castles.power: ${legacyState.boosts['Castles']?.power}`);

      expect(legacyState.newpixNumber).toBeGreaterThanOrEqual(1);
    });

    it('captures modern initial state for reference', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      const modernState = await modernEngine.getStateSnapshot();

      console.log('\n=== Modern Initial State ===');
      console.log(`Version: ${modernState.version}`);
      console.log(`NewpixNumber: ${modernState.newpixNumber}`);
      console.log(`Sand: ${modernState.sand}`);
      console.log(`Castles: ${modernState.castles}`);
      console.log(`Beach Clicks: ${modernState.beachClicks}`);

      // Count boosts
      let boostCount = 0;
      for (const [,] of Object.entries(modernState.boosts)) {
        boostCount++;
      }
      console.log(`Total boosts in state: ${boostCount}`);

      await modernEngine.dispose();

      expect(modernState.newpixNumber).toBe(1);
      expect(modernState.sand).toBe(0);
    });
  });

  describe('Beach Click Comparison', () => {
    it('compares single click behavior', async () => {
      // Get legacy state before and after a click
      const legacyBefore = await legacyEngine.getStateSnapshot();
      await legacyEngine.clickBeach(1);
      const legacyAfter = await legacyEngine.getStateSnapshot();

      const legacySandGain = legacyAfter.sand - legacyBefore.sand;
      const legacyClickGain = legacyAfter.beachClicks - legacyBefore.beachClicks;

      // Fresh modern engine
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      const modernBefore = await modernEngine.getStateSnapshot();
      await modernEngine.clickBeach(1);
      const modernAfter = await modernEngine.getStateSnapshot();

      const modernSandGain = modernAfter.sand - modernBefore.sand;
      const modernClickGain = modernAfter.beachClicks - modernBefore.beachClicks;

      console.log('\n=== Single Click Comparison ===');
      console.log(`Legacy: +${legacySandGain} sand, +${legacyClickGain} clicks`);
      console.log(`Modern: +${modernSandGain} sand, +${modernClickGain} clicks`);

      await modernEngine.dispose();

      // Both should increment clicks by 1
      expect(legacyClickGain).toBe(1);
      expect(modernClickGain).toBe(1);

      // Log the sand difference for future implementation
      console.log(`Sand per click ratio (legacy/modern): ${legacySandGain / modernSandGain}`);
    });

    it('compares 10 clicks on fresh modern engine', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      await modernEngine.clickBeach(10);
      const modernState = await modernEngine.getStateSnapshot();

      console.log('\n=== 10 Clicks (Fresh Modern) ===');
      console.log(`Modern clicks: ${modernState.beachClicks}`);
      console.log(`Modern sand: ${modernState.sand}`);

      await modernEngine.dispose();

      expect(modernState.beachClicks).toBe(10);
      expect(modernState.sand).toBe(10); // 1 sand per click in modern
    });
  });

  describe('ONG Transition Comparison', () => {
    it('compares newpix increment', async () => {
      const legacyBefore = await legacyEngine.getStateSnapshot();
      await legacyEngine.advanceToONG();
      const legacyAfter = await legacyEngine.getStateSnapshot();

      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      const modernBefore = await modernEngine.getStateSnapshot();
      await modernEngine.advanceToONG();
      const modernAfter = await modernEngine.getStateSnapshot();

      console.log('\n=== ONG Transition ===');
      console.log(`Legacy: ${legacyBefore.newpixNumber} -> ${legacyAfter.newpixNumber}`);
      console.log(`Modern: ${modernBefore.newpixNumber} -> ${modernAfter.newpixNumber}`);

      await modernEngine.dispose();

      // Both should increment by 1
      expect(legacyAfter.newpixNumber).toBe(legacyBefore.newpixNumber + 1);
      expect(modernAfter.newpixNumber).toBe(modernBefore.newpixNumber + 1);
    });
  });

  describe('Tick Processing Comparison', () => {
    it('compares tick with tools present', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Give modern engine some buckets
      modernEngine.setSandToolAmount('Bucket', 10);

      const beforeTick = await modernEngine.getStateSnapshot();
      await modernEngine.tick(1);
      const afterTick = await modernEngine.getStateSnapshot();

      const sandProduced = afterTick.sand - beforeTick.sand;

      console.log('\n=== Tick With 10 Buckets ===');
      console.log(`Sand before: ${beforeTick.sand}`);
      console.log(`Sand after: ${afterTick.sand}`);
      console.log(`Sand produced per tick: ${sandProduced}`);

      await modernEngine.dispose();

      // 10 buckets * 0.1 base rate = 1 sand per tick
      expect(sandProduced).toBe(1);
    });
  });

  describe('Parity Gap Summary', () => {
    it('documents known parity gaps', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Run same actions on both
      const actions: TestAction[] = [
        { type: 'click', target: 'beach', count: 5 },
      ];

      // Note: Legacy state already has accumulated state from previous tests
      const legacyStateBefore = await legacyEngine.getStateSnapshot();
      for (const action of actions) {
        await legacyEngine.executeAction(action);
      }
      const legacyState = await legacyEngine.getStateSnapshot();

      for (const action of actions) {
        await modernEngine.executeAction(action);
      }
      const modernState = await modernEngine.getStateSnapshot();

      // Compare specific fields
      const result = compareStates(legacyState, modernState, 0.0001, [
        // Ignore fields that we know differ
        'version', // Different version tracking
      ]);

      console.log('\n=== Parity Gap Summary ===');
      console.log(`Critical differences: ${result.counts.critical}`);
      console.log(`Important differences: ${result.counts.important}`);
      console.log(`Cosmetic differences: ${result.counts.cosmetic}`);

      // Document key gaps
      console.log('\nKey parity gaps to address:');
      console.log('1. Sand per click: Legacy uses complex formula with ninja/boost modifiers');
      console.log('2. Boost unlocking: Legacy has auto-unlock logic on game start');
      console.log('3. Badge earning: Legacy earns badges automatically on conditions');
      console.log('4. Castle building: Legacy auto-converts sand to castles');

      await modernEngine.dispose();

      // We expect differences at this stage
      expect(result.counts.critical).toBeGreaterThan(0);
    });
  });
});
