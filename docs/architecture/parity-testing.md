# Parity Testing Framework Architecture

## Overview

The parity testing framework enables automated comparison between the legacy Sandcastle Builder and a modern reimplementation. This ensures behavioral equivalence during the modernization process.

## Core Concept

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Test Fixtures  │────▶│  Test Runner │────▶│  Parity Report  │
│  (Save States)  │     │              │     │  (Differences)  │
└─────────────────┘     └──────┬───────┘     └─────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            ┌───────────────┐     ┌───────────────┐
            │ Legacy Engine │     │ Modern Engine │
            │  (Headless)   │     │  (TypeScript) │
            └───────────────┘     └───────────────┘
```

## Save State Format

Based on analysis of [persist.js](../persist.js), the save format uses:

### Serialization Structure
```
thread[0] = version
thread[1] = (empty)
thread[2] = startDate
thread[3] = Options
thread[4] = Gamenums (newpixNumber, beachClicks, ninjaStealth, etc.)
thread[5] = SandTools
thread[6] = CastleTools
thread[7] = Boosts (400+ items with unlocked, bought, power, countdown, etc.)
thread[8] = Badges
thread[9] = (unused)
thread[10] = OtherBadges (discoveries)
thread[11] = NPdata (dragon data per newpix)
```

### Delimiters
- `P` - Major section separator
- `S` - Item separator (semicolon equivalent)
- `C` - Property separator (comma equivalent)

### Encoding
- Base64 via `AllYourBase.SetUpUsTheBomb()` / `BelongToUs()`
- URL encoding via `escape()` / `unescape()`

## Test Fixture Types

### 1. Snapshot Fixtures
Pre-captured game states at various progression points:
- `early-game.json` - First few clicks, no tools
- `mid-game.json` - Basic tools, some boosts
- `glass-unlocked.json` - Glass production active
- `late-game.json` - Complex boost interactions
- `endgame.json` - Dragons, vacuum, advanced systems

### 2. Action Sequences
Recorded player actions to replay:
```json
{
  "name": "basic-clicking",
  "initialState": "early-game.json",
  "actions": [
    { "type": "click", "target": "beach", "count": 100 },
    { "type": "wait", "ticks": 60 },
    { "type": "buy", "target": "SandTool", "id": "Bucket" },
    { "type": "ong" }
  ],
  "expectedState": { /* partial state to verify */ }
}
```

### 3. Boost Interaction Tests
Focused tests for specific boost behaviors:
```json
{
  "name": "bigger-buckets-multiplier",
  "setup": {
    "boosts": { "Bigger Buckets": { "bought": 1 } },
    "tools": { "Bucket": 10 }
  },
  "action": { "type": "tick" },
  "assertions": [
    { "path": "sandRate", "operator": "equals", "value": "computed" }
  ]
}
```

## Engine Interfaces

Both engines must implement a common interface for testing:

```typescript
interface GameEngine {
  // State management
  loadState(serialized: string): void;
  exportState(): string;
  getState(): GameState;

  // Time simulation
  tick(count?: number): void;
  advanceToONG(): void;
  setNewpix(np: number): void;

  // Player actions
  clickBeach(count?: number): void;
  buyTool(type: 'sand' | 'castle', id: string, count?: number): void;
  buyBoost(id: string): void;
  toggleBoost(id: string): void;

  // Queries
  getSandRate(): number;
  getCastleRate(): number;
  getBoostState(id: string): BoostState;
  getBadgeState(id: string): boolean;
}

interface GameState {
  version: number;
  newpixNumber: number;
  sand: number;
  castles: number;
  sandTools: Record<string, ToolState>;
  castleTools: Record<string, ToolState>;
  boosts: Record<string, BoostState>;
  badges: Record<string, boolean>;
}
```

## Legacy Engine Wrapper

The legacy engine runs in a headless browser (Puppeteer/Playwright):

```typescript
class LegacyEngine implements GameEngine {
  private page: Page;

  async initialize() {
    // Load castle.html in headless browser
    // Inject test harness to expose Molpy object
  }

  async loadState(serialized: string) {
    await this.page.evaluate((save) => {
      Molpy.FromNeedlePulledThing(Molpy.BeanishToCuegish(save));
    }, serialized);
  }

  async tick(count = 1) {
    await this.page.evaluate((n) => {
      for (let i = 0; i < n; i++) Molpy.Loopist();
    }, count);
  }

  // ... other methods
}
```

## Modern Engine

The modern engine is a pure TypeScript implementation:

```typescript
class ModernEngine implements GameEngine {
  private state: GameState;
  private systems: GameSystem[];

  loadState(serialized: string) {
    this.state = SaveParser.parse(serialized);
  }

  tick(count = 1) {
    for (let i = 0; i < count; i++) {
      for (const system of this.systems) {
        system.update(this.state);
      }
    }
  }

  // ... other methods
}
```

## Parity Test Runner

```typescript
class ParityTestRunner {
  private legacy: LegacyEngine;
  private modern: ModernEngine;

  async runFixture(fixture: TestFixture): Promise<ParityResult> {
    // Load same state into both engines
    await this.legacy.loadState(fixture.initialState);
    this.modern.loadState(fixture.initialState);

    // Execute actions
    for (const action of fixture.actions) {
      await this.executeAction(action);
    }

    // Compare states
    const legacyState = await this.legacy.getState();
    const modernState = this.modern.getState();

    return this.compareStates(legacyState, modernState);
  }

  private compareStates(legacy: GameState, modern: GameState): ParityResult {
    const differences: Difference[] = [];

    // Deep comparison with tolerance for floating point
    // Track which properties differ
    // Categorize by severity (critical vs cosmetic)

    return { passed: differences.length === 0, differences };
  }
}
```

## Difference Categories

### Critical (Must Match)
- Resource amounts (sand, castles, glass)
- Tool counts and production rates
- Boost unlock/purchase state
- Badge earned state
- Save/load round-trip integrity

### Important (Should Match)
- Calculated rates and multipliers
- Unlock thresholds
- Price calculations

### Cosmetic (May Differ)
- Notification text
- UI state (layout, visibility)
- Display formatting

## Continuous Integration

```yaml
# .github/workflows/parity.yml
name: Parity Tests

on: [push, pull_request]

jobs:
  parity:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Run parity tests
        run: npm run test:parity

      - name: Upload parity report
        uses: actions/upload-artifact@v4
        with:
          name: parity-report
          path: parity-report.html
```

## Test Discovery

Automatically find and run all parity tests:

```typescript
// Discover fixtures from fixtures/ directory
const fixtures = await glob('fixtures/**/*.json');

// Generate tests for each boost
const boosts = extractBoostNames('boosts.js');
for (const boost of boosts) {
  generateBoostParityTest(boost);
}

// Generate tests for each badge
const badges = extractBadgeNames('badges.js');
for (const badge of badges) {
  generateBadgeParityTest(badge);
}
```

## Reporting

The parity report shows:
1. **Summary**: Pass/fail counts by category
2. **Differences**: Detailed breakdown of each mismatch
3. **Coverage**: Which boosts/badges/mechanics are tested
4. **Trends**: Parity improvement over time

## Implementation Phases

### Phase 1: Infrastructure
- [ ] Set up Playwright for legacy engine
- [ ] Create GameEngine interface
- [ ] Implement LegacyEngine wrapper
- [ ] Build basic test runner

### Phase 2: Fixtures
- [ ] Export save states from real gameplay
- [ ] Create action sequence recorder
- [ ] Generate boost-specific test cases

### Phase 3: Modern Engine (parallel with reimplementation)
- [ ] Implement ModernEngine as features are built
- [ ] Add parity tests as each system is completed
- [ ] Track coverage metrics

### Phase 4: CI/CD
- [ ] Automated parity testing on every commit
- [ ] Regression detection
- [ ] Parity dashboard

## Key Insights from Legacy Code

From analyzing [persist.js](../persist.js):

1. **Version migrations**: The `UpgradeOldVersions()` function handles save format changes. Modern engine needs same migration logic for compatibility.

2. **Boost saveData**: Each boost defines its own save fields via `saveData` array with types: `int`, `float`, `string`, `object`, `array`.

3. **Compression tricks**:
   - Discoveries use hex-packed bitmask
   - NPdata uses `'d'` for "ditto" compression
   - Empty values omitted

4. **Critical state fields**:
   - `Molpy.newpixNumber` - Current game time
   - `Molpy.Boosts['Sand'].power` - Current sand
   - `Molpy.Boosts['Castles'].power` - Current castles
   - Tool amounts and totals
   - Boost unlocked/bought/power/countdown
