# Sandcastle Builder Development Guide

This is a modernization project for Sandcastle Builder, an incremental game based on xkcd's "Time" comic.

## Project Structure

```
├── *.js, *.html, *.css    # Legacy game (DO NOT MODIFY unless fixing bugs)
├── src/
│   ├── types/             # TypeScript type definitions
│   │   └── game-data.ts   # Types for boosts, badges, tools, game state
│   ├── data/              # Extracted game data
│   │   └── game-data.json # 341 boosts, 219 badges, 12 tools
│   └── parity/            # Parity testing framework
│       ├── game-engine.ts     # GameEngine interface
│       ├── legacy-engine.ts   # Playwright wrapper for legacy game
│       └── parity-runner.ts   # Test runner with state comparison
├── docs/
│   ├── architecture/      # Design documents
│   └── wiki/              # Scraped game wiki (19 pages)
```

## Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:parity   # Run parity tests with verbose output
npm run build         # Compile TypeScript
npm run typecheck     # Type check without emitting
```

## Parity Testing Framework

The parity testing framework enables comparison between legacy and modern implementations.

### Running Legacy Engine Tests

```typescript
import { LegacyEngine } from './src/parity/legacy-engine.js';

const engine = new LegacyEngine();
await engine.initialize();  // Launches headless browser with game

// Interact with the game
await engine.clickBeach(100);
await engine.tick(10);
await engine.buyTool('sand', 'Bucket');

// Get state for comparison
const state = await engine.getStateSnapshot();
console.log(state.sand, state.castles);

await engine.dispose();  // Clean up browser
```

### Creating Test Fixtures

```typescript
import { FixtureBuilder, ParityTestRunner } from './src/parity/parity-runner.js';

// Use built-in fixture builders
const fixture = FixtureBuilder.beachClicking(100);
const fixture = FixtureBuilder.toolPurchase('sand', 'Bucket', 5);
const fixture = FixtureBuilder.ongTransition();

// Or create custom fixtures
const custom = {
  name: 'my-test',
  actions: [
    { type: 'click', target: 'beach', count: 50 },
    { type: 'tick', count: 10 },
    { type: 'buy-tool', toolType: 'sand', toolName: 'Bucket' },
  ],
};
```

### Comparing States

```typescript
import { compareStates } from './src/parity/parity-runner.js';

const result = compareStates(legacyState, modernState, 0.0001, ['ignorePath']);
// result.passed - true if no critical differences
// result.differences - array of {path, legacy, modern, severity}
// result.counts - {critical, important, cosmetic}
```

### Severity Categories

- **Critical**: Resources (sand, castles, glass), tool amounts, boost bought/unlocked, badges
- **Important**: Power values, countdowns, rates, totals
- **Cosmetic**: Everything else

## Modernization Strategy

We use a **hybrid approach**:

1. **Extract data layer** - Done: game-data.json with typed schema
2. **Build modern engine** - Next: implement ModernEngine with parity tests
3. **Incremental verification** - Each feature verified against legacy before proceeding

### Key Legacy Code Locations

| Feature | File | Key Functions |
|---------|------|---------------|
| Game loop | castle.js:4050 | `Molpy.Loopist()` |
| Save/Load | persist.js | `ToNeedlePulledThing()`, `FromNeedlePulledThing()` |
| Beach clicks | castle.js | `Molpy.ClickBeach()` |
| Boosts | boosts.js | `Molpy.DefineBoosts()` |
| Tools | tools.js | `Molpy.DefineSandTools()`, `Molpy.DefineCastleTools()` |
| ONG | castle.js | `Molpy.ONG()` |

### Game Data Extraction

36% of boosts have dynamic calculations (functions in original code). These are flagged:
- `hasDynamicDescription`
- `hasDynamicStats`
- `hasDynamicPrice`
- `hasBuyFunction`, `hasLockFunction`, etc.

## Debugging

```bash
DEBUG=1 npm test  # Enable browser console output in tests
```

## Open Issues

Check current work items:
```bash
chainlink list
chainlink show <id>
```
