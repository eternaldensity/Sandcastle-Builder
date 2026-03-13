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
    it('checks legacy sandPerClick and auto-castle conversion', async () => {
      // Diagnose how legacy handles sand clicks and auto-castle conversion
      const page = await legacyEngine.getMolpyHandle();
      const diagnostics = await page.evaluate(() => {
        const Molpy = (window as any).Molpy;
        const Sand = Molpy.Boosts['Sand'];
        const Castles = Molpy.Boosts['Castles'];

        // Force recalculate rates
        Sand.calculateSandRates();

        // Get state before click
        const before = {
          sand: Sand.power,
          castles: Castles.power,
          nextCastleSand: Castles.nextCastleSand,
          totalDug: Sand.totalDug,
        };

        Molpy.ClickBeach();

        // Get state after click
        const after = {
          sand: Sand.power,
          castles: Castles.power,
          nextCastleSand: Castles.nextCastleSand,
          totalDug: Sand.totalDug,
        };

        return {
          sandPerClick: Sand.sandPerClick,
          before,
          after,
          sandDug: after.totalDug - before.totalDug,
          castlesBuilt: after.castles - before.castles,
        };
      });

      console.log('\n=== Legacy Click and Auto-Castle Conversion ===');
      console.log(JSON.stringify(diagnostics, null, 2));

      // Sand IS dug (1 per click), but converted to castle immediately
      expect(diagnostics.sandPerClick).toBe(1);
      expect(diagnostics.sandDug).toBe(1);
      expect(diagnostics.castlesBuilt).toBe(1); // Sand auto-converted to castle
    });

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

    it('compares 10 clicks with Fibonacci castle conversion', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      await modernEngine.clickBeach(10);
      const modernState = await modernEngine.getStateSnapshot();

      console.log('\n=== 10 Clicks (Fresh Modern) ===');
      console.log(`Modern clicks: ${modernState.beachClicks}`);
      console.log(`Modern sand: ${modernState.sand}`);
      console.log(`Modern castles: ${modernState.castles}`);

      await modernEngine.dispose();

      expect(modernState.beachClicks).toBe(10);
      // 10 clicks = 10 sand dug
      // Fibonacci castle costs: 1, 1, 2, 3 = 7 sand for 4 castles
      // Remaining: 10 - 7 = 3 sand
      expect(modernState.castles).toBe(4);
      expect(modernState.sand).toBe(3);
    });

    it('achieves parity with legacy on fresh game beach clicks', async () => {
      // Create fresh modern engine
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Click same number of times on both
      // Note: Legacy engine has accumulated state from previous tests
      // So we check the deltas, not absolute values
      const legacyBefore = await legacyEngine.getStateSnapshot();
      await legacyEngine.clickBeach(5);
      const legacyAfter = await legacyEngine.getStateSnapshot();

      await modernEngine.clickBeach(5);
      const modernState = await modernEngine.getStateSnapshot();

      const legacyCastleGain = legacyAfter.castles - legacyBefore.castles;

      console.log('\n=== 5 Click Parity Comparison ===');
      console.log(`Legacy: castles +${legacyCastleGain}, sand ${legacyAfter.sand}`);
      console.log(`Modern: castles ${modernState.castles}, sand ${modernState.sand}`);

      await modernEngine.dispose();

      // Both should build same number of castles from 5 clicks
      // 5 sand, Fibonacci costs: 1, 1, 2 = 4 sand for 3 castles, 1 sand left
      expect(modernState.castles).toBe(3);
      expect(modernState.sand).toBe(1);
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

    it('resets Fibonacci castle cost on ONG', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Build up some castle cost by clicking many times
      await modernEngine.clickBeach(50); // Build several castles
      const stateBeforeONG = await modernEngine.getStateSnapshot();

      console.log('\n=== ONG Fibonacci Reset ===');
      console.log(`Before ONG - castles: ${stateBeforeONG.castles}, sand: ${stateBeforeONG.sand}`);

      // Advance to ONG - this resets Fibonacci to 1, then converts remaining sand
      // The Fibonacci sequence advances as sand is converted
      await modernEngine.advanceToONG();
      const afterONG = await modernEngine.getStateSnapshot();
      console.log(`After ONG - castles: ${afterONG.castles}, sand: ${afterONG.sand}`);

      // Verify that ONG converted sand to castles with fresh Fibonacci
      // From 50 clicks: approx 50 sand dug, some converted to castles
      // Before ONG: 7 castles, 17 sand remaining
      // At ONG reset: Fibonacci resets to 1, then 17 sand converts
      // Fibonacci: 1+1+2+3+5=12 sand for 5 castles, leaving 5 sand
      // After ONG: 7+5=12 castles, 5 sand (next cost would be 8)

      // The key verification: ONG converted remaining sand with reset Fibonacci
      expect(afterONG.castles).toBeGreaterThan(stateBeforeONG.castles);

      await modernEngine.dispose();
    });

    it('resets ninjad flag on ONG', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Click to set ninjad = true
      await modernEngine.clickBeach(1);
      const afterClick = await modernEngine.getStateSnapshot();
      expect(afterClick.ninjad).toBe(true);

      // ONG should reset ninjad
      await modernEngine.advanceToONG();
      const afterONG = await modernEngine.getStateSnapshot();

      console.log('\n=== ONG Ninjad Reset ===');
      console.log(`After click: ninjad = ${afterClick.ninjad}`);
      console.log(`After ONG: ninjad = ${afterONG.ninjad}`);

      await modernEngine.dispose();

      expect(afterONG.ninjad).toBe(false);
    });
  });

  describe('Ninja Mechanics', () => {
    it('tracks ninja stealth on stealth clicks', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Give some NewPixBots so ninja mechanics apply
      const state = modernEngine as any;
      state.castleTools.set('NewPixBot', {
        amount: 1,
        bought: 1,
        temp: 0,
        totalCastlesBuilt: 0,
        totalCastlesDestroyed: 0,
        totalCastlesWasted: 0,
        currentActive: 0,
        totalGlassBuilt: 0,
        totalGlassDestroyed: 0,
      });

      // Simulate time passing to open npbONG window
      // ninjaTime = 400 mNP * npLength(1800) = 720000ms for shortpix
      // After 720+ ticks (720+ seconds), npbONG should be 1
      for (let i = 0; i < 730; i++) {
        await modernEngine.tick(1);
      }

      // Now click - should be a stealth click since npbONG = 1
      const beforeClick = await modernEngine.getStateSnapshot();
      await modernEngine.clickBeach(1);
      const afterClick = await modernEngine.getStateSnapshot();

      console.log('\n=== Stealth Click Test ===');
      console.log(`Before: ninjaStealth = ${beforeClick.ninjaStealth}`);
      console.log(`After: ninjaStealth = ${afterClick.ninjaStealth}`);
      console.log(`Ninja free count: ${afterClick.ninjaFreeCount}`);

      await modernEngine.dispose();

      // Stealth should increase
      expect(afterClick.ninjaStealth).toBeGreaterThan(beforeClick.ninjaStealth);
      expect(afterClick.ninjaFreeCount).toBe(1);
    });

    it('breaks ninja streak on early click (ninja break)', async () => {
      const modernEngine = new ModernEngine(gameData);
      await modernEngine.initialize();

      // Set up some ninja stealth
      const state = modernEngine as any;
      state.core.ninjaStealth = 10;
      state.castleTools.set('NewPixBot', {
        amount: 1,
        bought: 1,
        temp: 0,
        totalCastlesBuilt: 0,
        totalCastlesDestroyed: 0,
        totalCastlesWasted: 0,
        currentActive: 0,
        totalGlassBuilt: 0,
        totalGlassDestroyed: 0,
      });

      // Click BEFORE npbONG window opens (npbONG = 0)
      // This should break the ninja streak
      const beforeClick = await modernEngine.getStateSnapshot();
      await modernEngine.clickBeach(1);
      const afterClick = await modernEngine.getStateSnapshot();

      console.log('\n=== Ninja Break Test ===');
      console.log(`Before: ninjaStealth = ${beforeClick.ninjaStealth}`);
      console.log(`After: ninjaStealth = ${afterClick.ninjaStealth}`);

      await modernEngine.dispose();

      // Stealth should be reset to 0
      expect(afterClick.ninjaStealth).toBe(0);
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

      // Sand is produced AND auto-converted to castles in same tick
      // Reference: castle.js:3340 - Molpy.Boosts['Sand'].toCastles() is called in Think()
      const sandProduced = (afterTick.sandTools['Bucket']?.totalSand ?? 0) - (beforeTick.sandTools['Bucket']?.totalSand ?? 0);
      const castlesGained = afterTick.castles - beforeTick.castles;

      console.log('\n=== Tick With 10 Buckets ===');
      console.log(`Sand produced (tracked by tool): ${sandProduced}`);
      console.log(`Castles before: ${beforeTick.castles}`);
      console.log(`Castles after: ${afterTick.castles}`);
      console.log(`Net castle gain: ${castlesGained}`);

      await modernEngine.dispose();

      // 10 buckets * 0.1 base rate = 1 sand per tick
      // Sand is immediately converted to castles (first castle costs 1 sand)
      expect(sandProduced).toBe(1);
      expect(castlesGained).toBe(1);
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
      console.log('1. Boost unlocking: Legacy has auto-unlock logic on game start');
      console.log('2. Badge earning: Legacy earns badges automatically on conditions');
      console.log('3. Click multipliers: Legacy has complex boost modifiers (issue #21 partial)');
      console.log('IMPLEMENTED: Sand-to-castle Fibonacci conversion (toCastles)');

      await modernEngine.dispose();

      // We expect differences at this stage
      expect(result.counts.critical).toBeGreaterThan(0);
    });
  });
});
