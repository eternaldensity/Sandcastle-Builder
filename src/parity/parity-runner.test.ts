/**
 * Tests for the ParityTestRunner
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LegacyEngine } from './legacy-engine.js';
import { ParityTestRunner, FixtureBuilder, compareStates } from './parity-runner.js';
import type { GameStateSnapshot } from './game-engine.js';

describe('compareStates', () => {
  it('should detect no differences for identical states', () => {
    const state: GameStateSnapshot = {
      version: 1,
      newpixNumber: 100,
      sand: 1000,
      castles: 50,
      glassChips: 0,
      glassBlocks: 0,
      beachClicks: 100,
      ninjaFreeCount: 0,
      ninjaStealth: 0,
      ninjad: false,
      sandTools: {},
      castleTools: {},
      boosts: {},
      badges: {},
    };

    const result = compareStates(state, state);
    expect(result.passed).toBe(true);
    expect(result.differences).toHaveLength(0);
  });

  it('should detect critical differences in resources', () => {
    const legacy: GameStateSnapshot = {
      version: 1,
      newpixNumber: 100,
      sand: 1000,
      castles: 50,
      glassChips: 0,
      glassBlocks: 0,
      beachClicks: 100,
      ninjaFreeCount: 0,
      ninjaStealth: 0,
      ninjad: false,
      sandTools: {},
      castleTools: {},
      boosts: {},
      badges: {},
    };

    const modern: GameStateSnapshot = {
      ...legacy,
      sand: 500, // Different sand amount
    };

    const result = compareStates(legacy, modern);
    expect(result.passed).toBe(false);
    expect(result.counts.critical).toBe(1);
    expect(result.differences[0].path).toBe('sand');
    expect(result.differences[0].severity).toBe('critical');
  });

  it('should respect tolerance for floating point numbers', () => {
    const legacy: GameStateSnapshot = {
      version: 1,
      newpixNumber: 100,
      sand: 1000.00001,
      castles: 50,
      glassChips: 0,
      glassBlocks: 0,
      beachClicks: 100,
      ninjaFreeCount: 0,
      ninjaStealth: 0,
      ninjad: false,
      sandTools: {},
      castleTools: {},
      boosts: {},
      badges: {},
    };

    const modern: GameStateSnapshot = {
      ...legacy,
      sand: 1000.00002,
    };

    // With default tolerance (0.0001), this should pass
    const result = compareStates(legacy, modern, 0.0001);
    expect(result.passed).toBe(true);
  });

  it('should detect differences in nested boost states', () => {
    const legacy: GameStateSnapshot = {
      version: 1,
      newpixNumber: 100,
      sand: 1000,
      castles: 50,
      glassChips: 0,
      glassBlocks: 0,
      beachClicks: 100,
      ninjaFreeCount: 0,
      ninjaStealth: 0,
      ninjad: false,
      sandTools: {},
      castleTools: {},
      boosts: {
        'TestBoost': { unlocked: 1, bought: 1, power: 10, countdown: 0 },
      },
      badges: {},
    };

    const modern: GameStateSnapshot = {
      ...legacy,
      boosts: {
        'TestBoost': { unlocked: 1, bought: 0, power: 10, countdown: 0 },
      },
    };

    const result = compareStates(legacy, modern);
    expect(result.passed).toBe(false);
    expect(result.counts.critical).toBe(1);
    expect(result.differences[0].path).toBe('boosts.TestBoost.bought');
  });

  it('should ignore specified paths', () => {
    const legacy: GameStateSnapshot = {
      version: 1,
      newpixNumber: 100,
      sand: 1000,
      castles: 50,
      glassChips: 0,
      glassBlocks: 0,
      beachClicks: 100,
      ninjaFreeCount: 0,
      ninjaStealth: 0,
      ninjad: false,
      sandTools: {},
      castleTools: {},
      boosts: {},
      badges: {},
    };

    const modern: GameStateSnapshot = {
      ...legacy,
      sand: 500, // Different
      version: 2, // Different
    };

    const result = compareStates(legacy, modern, 0.0001, ['sand', 'version']);
    expect(result.passed).toBe(true);
    expect(result.differences).toHaveLength(0);
  });
});

describe('FixtureBuilder', () => {
  it('should create beach clicking fixture', () => {
    const fixture = FixtureBuilder.beachClicking(100);
    expect(fixture.name).toBe('beach-clicking');
    expect(fixture.actions).toHaveLength(1);
    expect(fixture.actions[0]).toEqual({ type: 'click', target: 'beach', count: 100 });
  });

  it('should create tool purchase fixture', () => {
    const fixture = FixtureBuilder.toolPurchase('sand', 'Bucket', 5);
    expect(fixture.name).toBe('buy-Bucket');
    expect(fixture.actions).toHaveLength(2);
  });

  it('should create ONG transition fixture', () => {
    const fixture = FixtureBuilder.ongTransition();
    expect(fixture.name).toBe('ong-transition');
    expect(fixture.actions.some(a => a.type === 'ong')).toBe(true);
  });
});

describe('ParityTestRunner with Legacy Engine', () => {
  let engine: LegacyEngine;
  let runner: ParityTestRunner;

  beforeAll(async () => {
    engine = new LegacyEngine();
    runner = new ParityTestRunner(engine, null, { verbose: false });
    await runner.initialize();
  }, 60000);

  afterAll(async () => {
    await runner.dispose();
  });

  it('should capture baseline from beach clicking', async () => {
    const fixture = FixtureBuilder.beachClicking(50);
    const baseline = await runner.captureLegacyBaseline(fixture);

    expect(baseline).toBeDefined();
    expect(baseline.beachClicks).toBeGreaterThan(0);
    expect(baseline.sand).toBeGreaterThan(0);
  });

  it('should run fixture and return legacy state', async () => {
    const fixture = FixtureBuilder.beachClicking(20);
    const { legacyState, modernState, result } = await runner.runFixture(fixture);

    expect(legacyState).toBeDefined();
    expect(legacyState.sand).toBeGreaterThan(0);
    expect(modernState).toBeNull(); // No modern engine provided
    expect(result).toBeNull();
  });

  it('should run multiple fixtures', async () => {
    const fixtures = [
      FixtureBuilder.beachClicking(10, 'click-10'),
      FixtureBuilder.beachClicking(20, 'click-20'),
    ];

    const { passed, failed, results } = await runner.runFixtures(fixtures);

    expect(passed).toBe(2);
    expect(failed).toBe(0);
    expect(results).toHaveLength(2);
  });
});

describe('ParityTestRunner report generation', () => {
  it('should generate a markdown report', () => {
    const mockResults = [
      {
        fixture: { name: 'test-1', actions: [] },
        result: {
          passed: true,
          differences: [],
          counts: { critical: 0, important: 0, cosmetic: 0 },
        },
      },
      {
        fixture: { name: 'test-2', actions: [] },
        result: {
          passed: false,
          differences: [
            { path: 'sand', legacy: 100, modern: 50, severity: 'critical' as const },
          ],
          counts: { critical: 1, important: 0, cosmetic: 0 },
        },
      },
    ];

    const report = ParityTestRunner.generateReport(mockResults);

    expect(report).toContain('# Parity Test Report');
    expect(report).toContain('test-1 - PASSED');
    expect(report).toContain('test-2 - FAILED');
    expect(report).toContain('| sand |');
    expect(report).toContain('1 passed, 1 failed');
  });
});
