# Parity Gap Triage

Known behavioral differences between the legacy game and the modern
engine, collected 2026-09-07 from code markers (`simplified`, `not
implemented yet`), the `Parity Gap Summary` suite, and review. Each gap
carries a verdict so future work knows what is intentional, what is an
open bug, and what still needs a browser run to decide.

Severity scale (see `src/parity/game-engine.ts`): **critical** (resources,
tools, boosts, badges), **important** (rates, countdowns, totals),
**cosmetic** (everything else).

The browser-backed comparison suites have not yet run green in CI (new
in `.github/workflows/ci.yml`). Gaps marked *needs-browser-run* must be
re-measured there before they are closed.

## Needs a browser run to decide

| # | Area | Legacy | Modern | Severity |
|---|---|---|---|---|
| G1 | Beach click base rate | ~0.22 sand/click with ninja penalty | Simplified 1/click before multipliers (`engine-comparison` header) | critical |
| G2 | Boost auto-unlock on start | Legacy unlocks on game start | `checkAutoUnlocks` exists — likely closed, unconfirmed | critical |
| G3 | Badge auto-earn on conditions | Legacy earns on conditions | `badgeChecker` exists — likely closed, unconfirmed | critical |
| G4 | Click multipliers | Complex boost modifiers (was issue #21) | Partially implemented | important |

G1–G4 date from the early `Parity Gap Summary` suite, which asserts
`critical > 0` — a placeholder-era premise. After the first green CI
browser run, that assertion should be revisited and this table updated.

## Open bugs (small, engine-side)

| # | Area | Gap | Refs |
|---|---|---|---|
| G5 | Sand→castles | ~~`Fractal Sandcastles` ignored~~ — fixed: fractal branch + `Fractals Forever`/`Getting Expensive` badges, covered by `beach-click.test.ts` | `src/engine/beach-click.ts` |
| G6 | Ninja Ritual | Goat grant simplified (`1 + level/5`); full formula at boosts.js:9115-9147 has more multipliers | `modern-engine.ts: ninjaRitual` |
| G7 | Boost lock prize | Fixed 2000 base; legacy scales via `LogiMult` | `src/engine/boost-functions.ts` lockFunction |
| G8 | Sand Blaster cap | Always `totalBuilt/3`; legacy uses `/5` with certain boosts | `modern-engine.ts: giveBlastFurnaceReward` |
| G9 | Castle spend totals | `castlesSpent` approximated from `bought` counts, no purchase history | `modern-engine.ts: buildBadgeCheckState` |
| G10 | Shadow Feeder | Auto-assembly conditions simplified | `src/engine/auto-assembly.ts:201` |
| G11 | Save parser | `NextLegalNP` fractional-NP logic simplified to increment | `src/engine/save-parser.ts:372` |

## Blocked on the UI track

| # | Area | Gap |
|---|---|---|
| G12 | Shopping Assistant | Auto-buy needs UI state (`shoppingItem`) — no headless equivalent |
| G13 | Rob auto-buy | Needs boost-by-ID mapping from the shop UI |

## Test methodology (not engine behavior)

| # | Issue |
|---|---|
| G14 | Browser suites reuse one browser session, so legacy state accumulates between describes (`engine-comparison` header). Prefer a fresh context per suite so comparisons start from identical states. |
| G15 | `Parity Gap Summary` bakes in `expect(critical).toBeGreaterThan(0)`. Flip to `toBe(0)` (minus allow-listed intentional gaps) once G1–G4 are resolved. |

## Deliberate simplifications (keep)

- Mustard tools with `NaN` amounts; Doubletap recursion guard; backoff
  loop in glass-saw capacity — all match legacy edge-case handling.
- `donkey()` Rob/Shopping branches are explicit no-ops pending G12/G13,
  not silent stubs.
