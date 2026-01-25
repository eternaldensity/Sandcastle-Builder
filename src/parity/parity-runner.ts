/**
 * ParityTestRunner - Compares game states between Legacy and Modern engines
 *
 * Runs the same test fixtures against both engines and reports differences.
 */

import type {
  GameEngine,
  GameStateSnapshot,
  TestAction,
  StateDifference,
  ParityResult,
} from './game-engine.js';

/**
 * Test fixture definition
 */
export interface TestFixture {
  /** Unique name for the test */
  name: string;

  /** Description of what this test verifies */
  description?: string;

  /** Initial save state to load (Base64 encoded) */
  initialState?: string;

  /** Actions to execute */
  actions: TestAction[];

  /** Paths to ignore in comparison */
  ignorePaths?: string[];

  /** Tolerance for numeric comparisons (default: 0.0001) */
  tolerance?: number;
}

/**
 * Configuration for the parity runner
 */
export interface ParityRunnerConfig {
  /** Default tolerance for floating point comparisons */
  tolerance: number;

  /** Paths to always ignore in comparisons */
  globalIgnorePaths: string[];

  /** Whether to log verbose output */
  verbose: boolean;
}

const DEFAULT_CONFIG: ParityRunnerConfig = {
  tolerance: 0.0001,
  globalIgnorePaths: [],
  verbose: false,
};

/**
 * Categorize a state difference by severity
 */
function categorizeDifference(path: string): 'critical' | 'important' | 'cosmetic' {
  // Critical: Core resources and progression
  const criticalPatterns = [
    /^sand$/,
    /^castles$/,
    /^glassChips$/,
    /^glassBlocks$/,
    /^newpixNumber$/,
    /^sandTools\.[^.]+\.amount$/,
    /^castleTools\.[^.]+\.amount$/,
    /^boosts\.[^.]+\.bought$/,
    /^boosts\.[^.]+\.unlocked$/,
    /^badges\./,
  ];

  for (const pattern of criticalPatterns) {
    if (pattern.test(path)) {
      return 'critical';
    }
  }

  // Important: Rates, multipliers, power values
  const importantPatterns = [
    /^boosts\.[^.]+\.power$/,
    /^boosts\.[^.]+\.countdown$/,
    /\.total/,
    /Rate$/,
  ];

  for (const pattern of importantPatterns) {
    if (pattern.test(path)) {
      return 'important';
    }
  }

  // Everything else is cosmetic
  return 'cosmetic';
}

/**
 * Deep compare two values and collect differences
 */
function deepCompare(
  legacy: unknown,
  modern: unknown,
  path: string,
  differences: StateDifference[],
  tolerance: number,
  ignorePaths: Set<string>
): void {
  // Check if path should be ignored
  if (ignorePaths.has(path)) {
    return;
  }

  // Handle null/undefined
  if (legacy === null || legacy === undefined) {
    if (modern !== null && modern !== undefined) {
      differences.push({
        path,
        legacy,
        modern,
        severity: categorizeDifference(path),
      });
    }
    return;
  }

  if (modern === null || modern === undefined) {
    differences.push({
      path,
      legacy,
      modern,
      severity: categorizeDifference(path),
    });
    return;
  }

  // Handle numbers with tolerance
  if (typeof legacy === 'number' && typeof modern === 'number') {
    if (Math.abs(legacy - modern) > tolerance) {
      differences.push({
        path,
        legacy,
        modern,
        severity: categorizeDifference(path),
      });
    }
    return;
  }

  // Handle booleans
  if (typeof legacy === 'boolean' && typeof modern === 'boolean') {
    if (legacy !== modern) {
      differences.push({
        path,
        legacy,
        modern,
        severity: categorizeDifference(path),
      });
    }
    return;
  }

  // Handle strings
  if (typeof legacy === 'string' && typeof modern === 'string') {
    if (legacy !== modern) {
      differences.push({
        path,
        legacy,
        modern,
        severity: categorizeDifference(path),
      });
    }
    return;
  }

  // Handle arrays
  if (Array.isArray(legacy) && Array.isArray(modern)) {
    const maxLen = Math.max(legacy.length, modern.length);
    for (let i = 0; i < maxLen; i++) {
      deepCompare(legacy[i], modern[i], `${path}[${i}]`, differences, tolerance, ignorePaths);
    }
    return;
  }

  // Handle objects
  if (typeof legacy === 'object' && typeof modern === 'object') {
    const allKeys = new Set([
      ...Object.keys(legacy as object),
      ...Object.keys(modern as object),
    ]);

    for (const key of allKeys) {
      deepCompare(
        (legacy as Record<string, unknown>)[key],
        (modern as Record<string, unknown>)[key],
        path ? `${path}.${key}` : key,
        differences,
        tolerance,
        ignorePaths
      );
    }
    return;
  }

  // Type mismatch
  if (typeof legacy !== typeof modern) {
    differences.push({
      path,
      legacy,
      modern,
      severity: categorizeDifference(path),
    });
  }
}

/**
 * Compare two game state snapshots
 */
export function compareStates(
  legacy: GameStateSnapshot,
  modern: GameStateSnapshot,
  tolerance = 0.0001,
  ignorePaths: string[] = []
): ParityResult {
  const differences: StateDifference[] = [];
  const ignoreSet = new Set(ignorePaths);

  deepCompare(legacy, modern, '', differences, tolerance, ignoreSet);

  const counts = {
    critical: 0,
    important: 0,
    cosmetic: 0,
  };

  for (const diff of differences) {
    counts[diff.severity]++;
  }

  return {
    passed: counts.critical === 0,
    differences,
    counts,
  };
}

/**
 * ParityTestRunner executes fixtures against both engines and compares results
 */
export class ParityTestRunner {
  private legacyEngine: GameEngine;
  private modernEngine: GameEngine | null;
  private config: ParityRunnerConfig;

  constructor(
    legacyEngine: GameEngine,
    modernEngine: GameEngine | null = null,
    config: Partial<ParityRunnerConfig> = {}
  ) {
    this.legacyEngine = legacyEngine;
    this.modernEngine = modernEngine;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize both engines
   */
  async initialize(): Promise<void> {
    await this.legacyEngine.initialize();
    if (this.modernEngine) {
      await this.modernEngine.initialize();
    }
  }

  /**
   * Clean up both engines
   */
  async dispose(): Promise<void> {
    await this.legacyEngine.dispose();
    if (this.modernEngine) {
      await this.modernEngine.dispose();
    }
  }

  /**
   * Run a single fixture and return the parity result.
   * If no modern engine is provided, returns only the legacy state.
   */
  async runFixture(fixture: TestFixture): Promise<{
    legacyState: GameStateSnapshot;
    modernState: GameStateSnapshot | null;
    result: ParityResult | null;
  }> {
    if (this.config.verbose) {
      console.log(`Running fixture: ${fixture.name}`);
    }

    // Load initial state if provided
    if (fixture.initialState) {
      await this.legacyEngine.loadState(fixture.initialState);
      if (this.modernEngine) {
        await this.modernEngine.loadState(fixture.initialState);
      }
    }

    // Execute actions on both engines
    for (const action of fixture.actions) {
      if (this.config.verbose) {
        console.log(`  Action: ${action.type}`);
      }

      await this.legacyEngine.executeAction(action);
      if (this.modernEngine) {
        await this.modernEngine.executeAction(action);
      }
    }

    // Get final states
    const legacyState = await this.legacyEngine.getStateSnapshot();
    const modernState = this.modernEngine
      ? await this.modernEngine.getStateSnapshot()
      : null;

    // Compare if we have both states
    const result = modernState
      ? compareStates(
          legacyState,
          modernState,
          fixture.tolerance ?? this.config.tolerance,
          [...this.config.globalIgnorePaths, ...(fixture.ignorePaths ?? [])]
        )
      : null;

    return { legacyState, modernState, result };
  }

  /**
   * Run multiple fixtures and aggregate results
   */
  async runFixtures(fixtures: TestFixture[]): Promise<{
    passed: number;
    failed: number;
    results: Array<{
      fixture: TestFixture;
      legacyState: GameStateSnapshot;
      modernState: GameStateSnapshot | null;
      result: ParityResult | null;
    }>;
  }> {
    let passed = 0;
    let failed = 0;
    const results: Array<{
      fixture: TestFixture;
      legacyState: GameStateSnapshot;
      modernState: GameStateSnapshot | null;
      result: ParityResult | null;
    }> = [];

    for (const fixture of fixtures) {
      const { legacyState, modernState, result } = await this.runFixture(fixture);

      results.push({ fixture, legacyState, modernState, result });

      if (result === null || result.passed) {
        passed++;
      } else {
        failed++;
      }
    }

    return { passed, failed, results };
  }

  /**
   * Run a fixture that only tests the legacy engine (for baseline capture)
   */
  async captureLegacyBaseline(fixture: TestFixture): Promise<GameStateSnapshot> {
    if (fixture.initialState) {
      await this.legacyEngine.loadState(fixture.initialState);
    }

    for (const action of fixture.actions) {
      await this.legacyEngine.executeAction(action);
    }

    return await this.legacyEngine.getStateSnapshot();
  }

  /**
   * Generate a report of parity test results
   */
  static generateReport(results: Array<{
    fixture: TestFixture;
    result: ParityResult | null;
  }>): string {
    const lines: string[] = [];
    lines.push('# Parity Test Report');
    lines.push('');

    let totalPassed = 0;
    let totalFailed = 0;

    for (const { fixture, result } of results) {
      if (result === null) {
        lines.push(`## ${fixture.name} - SKIPPED (no modern engine)`);
        continue;
      }

      const status = result.passed ? 'PASSED' : 'FAILED';
      if (result.passed) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      lines.push(`## ${fixture.name} - ${status}`);

      if (fixture.description) {
        lines.push(`*${fixture.description}*`);
      }

      lines.push('');
      lines.push(`- Critical: ${result.counts.critical}`);
      lines.push(`- Important: ${result.counts.important}`);
      lines.push(`- Cosmetic: ${result.counts.cosmetic}`);
      lines.push('');

      if (result.differences.length > 0) {
        lines.push('### Differences');
        lines.push('');
        lines.push('| Path | Legacy | Modern | Severity |');
        lines.push('|------|--------|--------|----------|');

        for (const diff of result.differences.slice(0, 50)) {
          const legacyStr = JSON.stringify(diff.legacy).slice(0, 30);
          const modernStr = JSON.stringify(diff.modern).slice(0, 30);
          lines.push(`| ${diff.path} | ${legacyStr} | ${modernStr} | ${diff.severity} |`);
        }

        if (result.differences.length > 50) {
          lines.push(`| ... and ${result.differences.length - 50} more | | | |`);
        }
      }

      lines.push('');
    }

    lines.push('---');
    lines.push(`**Total: ${totalPassed} passed, ${totalFailed} failed**`);

    return lines.join('\n');
  }
}

/**
 * Utility to create common test fixtures
 */
export const FixtureBuilder = {
  /**
   * Create a fixture for testing beach clicking
   */
  beachClicking(clicks: number, name = 'beach-clicking'): TestFixture {
    return {
      name,
      description: `Click beach ${clicks} times and verify sand accumulation`,
      actions: [{ type: 'click', target: 'beach', count: clicks }],
    };
  },

  /**
   * Create a fixture for testing tool purchases
   */
  toolPurchase(
    toolType: 'sand' | 'castle',
    toolName: string,
    count = 1,
    name?: string
  ): TestFixture {
    return {
      name: name ?? `buy-${toolName}`,
      description: `Buy ${count} ${toolName}(s)`,
      actions: [
        // First accumulate resources
        { type: 'click', target: 'beach', count: 1000 },
        { type: 'buy-tool', toolType, toolName, count },
      ],
    };
  },

  /**
   * Create a fixture for testing boost purchases
   */
  boostPurchase(boostAlias: string, name?: string): TestFixture {
    return {
      name: name ?? `buy-${boostAlias}`,
      description: `Unlock and buy ${boostAlias}`,
      actions: [
        // Accumulate resources first
        { type: 'click', target: 'beach', count: 10000 },
        { type: 'tick', count: 100 },
        { type: 'buy-boost', boostAlias },
      ],
    };
  },

  /**
   * Create a fixture for testing ONG transitions
   */
  ongTransition(name = 'ong-transition'): TestFixture {
    return {
      name,
      description: 'Test ONG (newpix) transition',
      actions: [
        { type: 'click', target: 'beach', count: 100 },
        { type: 'tick', count: 10 },
        { type: 'ong' },
        { type: 'tick', count: 10 },
      ],
    };
  },

  /**
   * Create a fixture from a saved game state
   */
  fromSave(saveState: string, actions: TestAction[], name: string): TestFixture {
    return {
      name,
      initialState: saveState,
      actions,
    };
  },
};
