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
npm run typecheck     # Type check without emitting (REQUIRED before committing)
npm run build         # Compile TypeScript to dist/
npm test              # Run all tests (REQUIRED before committing)
npm run test:watch    # Watch mode for test-driven development
npm run test:parity   # Run parity tests with verbose output
```

## Development Workflow

**CRITICAL: Always verify TypeScript compilation and tests before considering work complete.**

### Required Steps for Every Change

1. **Write Code** - Make your changes to TypeScript files in `src/`

2. **Type Check** - MANDATORY before proceeding
   ```bash
   npm run typecheck
   ```
   - **Zero errors required** - fix all TypeScript errors before moving on
   - Common issues:
     - Type mismatches (use proper types, not `any`)
     - Missing imports or incorrect import paths
     - Union type narrowing (use type assertions when needed)

3. **Run Tests** - MANDATORY before considering work complete
   ```bash
   npm test
   ```
   - **All tests must pass** - investigate and fix any failures
   - If tests fail due to your changes, update either:
     - The implementation (if behavior is wrong)
     - The tests (if expectations need updating)
   - Never skip testing - broken tests indicate broken code

4. **Fix Issues Immediately**
   - **DO NOT** defer TypeScript errors or test failures
   - **DO NOT** assume "tests are probably broken anyway"
   - **DO** investigate and fix the root cause
   - **DO** ask for help if stuck, but don't skip verification

### When Tests Fail

If `npm test` fails:

1. **Read the error messages** - vitest provides detailed failure information
2. **Check recent changes** - what did you modify that could cause this?
3. **Run specific test file** to isolate the issue:
   ```bash
   npx vitest run src/path/to/failing.test.ts
   ```
4. **Fix TypeScript errors first** - many test failures are due to compilation errors
5. **Update tests if needed** - if implementation changed correctly, update test expectations

### Common Issues

**"No test suite found"** - Usually indicates:
- TypeScript compilation errors preventing test file import
- Missing dependencies or incorrect imports
- Check `npm run typecheck` output first

**Type errors in tests** - Often caused by:
- Union types in interfaces (e.g., `Map | Record`) - use type assertions
- Generic type inference issues - add explicit type parameters
- Missing type imports - import types from source files

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

We use a **hybrid approach** with strict verification at each step:

1. **Extract data layer** - Done: game-data.json with typed schema
2. **Build modern engine** - In progress: implement ModernEngine with parity tests
3. **Incremental verification** - Each feature MUST:
   - Pass TypeScript type checking (`npm run typecheck`)
   - Pass all existing tests (`npm test`)
   - Include new tests for new functionality
   - Be verified against legacy behavior when applicable

**No code is considered complete without:**
- ✅ Zero TypeScript errors
- ✅ All tests passing (454 tests as of 2026-01-26)
- ✅ New functionality tested

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

## Testing Infrastructure

### Current Status
- **454 tests** passing across 13 test files
- **Vitest 3.0.0** - DO NOT upgrade to 4.x (has "No test suite found" bug)
- **TypeScript ESNext + Bundler** module resolution
- **DOM types enabled** for Playwright browser testing

### Test Organization
- `src/utils/*.test.ts` - Utility function tests (base64, number formatting)
- `src/engine/*.test.ts` - Core engine tests (parsers, calculators, unlock logic)
- `src/parity/*.test.ts` - Legacy vs modern comparison tests

### Debugging

```bash
DEBUG=1 npm test                           # Enable browser console output in tests
npx vitest run src/path/to/file.test.ts   # Run specific test file
npx vitest run --reporter=verbose          # Detailed test output
npm run typecheck 2>&1 | grep "error TS"   # List all TypeScript errors
```

### Known Issues
- **Vitest 4.x incompatibility** - causes "No test suite found" error, stay on 3.0.0
- **Union type issues** - Map/Record unions in UnlockCheckState require type assertions in tests
- **DOM globals** - `window` object requires DOM lib in tsconfig.json for Playwright code

## Open Issues

Check current work items:
```bash
chainlink list
chainlink show <id>
```
