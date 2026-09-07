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
| G1 | Beach click base rate | ~~~0.22 with ninja penalty~~ — stale comment: no ninja penalty exists in legacy ClickBeach; base 1 + multipliers (boosts.js:7359-7391) is fully implemented and pinned (`calculateSandPerClick` base test + the suite's own legacy `sandPerClick == 1` assertion) | Simplified 1/click before multipliers (`engine-comparison` header) | critical |
| G2 | Boost auto-unlock on start | Implemented (`initialize` runs `checkAutoUnlocks`, data.js:649-826) — awaiting browser snapshot confirmation | `checkAutoUnlocks` exists — likely closed, unconfirmed | critical |
| G3 | Badge auto-earn on conditions | Implemented (`badgeChecker` on tick/click/ONG + earn cascades) — awaiting browser snapshot confirmation | `badgeChecker` exists — likely closed, unconfirmed | critical |
| G4 | Click multipliers | Complex boost modifiers (was issue #21) | Partially implemented | important |

G1–G4 date from the early `Parity Gap Summary` suite, which asserts
`critical > 0` — a placeholder-era premise. After the first green CI
browser run, that assertion should be revisited and this table updated.

## Open bugs (small, engine-side)

| # | Area | Gap | Refs |
|---|---|---|---|
| G5 | Sand→castles | ~~`Fractal Sandcastles` ignored~~ — fixed: fractal branch + `Fractals Forever`/`Getting Expensive` badges, covered by `beach-click.test.ts` | `src/engine/beach-click.ts` |
| G6 | Ninja Ritual | ~~Simplified grant~~ — fixed: CMNT×PR, Papal Goats, Zooman/Tortoise, worn-out branch, all threshold unlocks/badges; LA/Shutter branch still needs Maps/currentStory systems | `modern-engine.ts: ninjaRitual` |
| G7 | Boost lock prize | ~~Fixed 2000~~ — fixed: `LogiMult('2K')` via Logicat count, GlassBlocks make-space, Camera discovery, Blackprints payout; `CrateCount` display bookkeeping intentionally untracked (not in save codec) | `src/engine/boost-functions.ts` lockFunction |
| G8 | Sand Blaster cap | ~~Always `/3`~~ — fixed: Papal Fractal scaling, Blitzing/BKJ factor + `/5` cap; Furnace Crossfeed/Multitasking early branches still open (need Sand Refinery/Glass Chiller systems) | `modern-engine.ts: giveBlastFurnaceReward` |
| G9 | Castle spend totals | ~~Approximated~~ — fixed: running `Castles.spent` counter at every Spend-equivalent (tool/boost/time-travel purchases), persisted in saves, Big Spender badges read it; also fixed a latent gamenums off-by-one (parser assumed v4.1+ `gameTime` the writer never emits — now detected structurally) | `modern-engine.ts: totalCastlesSpent` |
| G10 | Shadow Feeder | ~~Simplified~~ — fixed: full feeder/coda branch tree in `runFastFactory` (ShadowStrike, feeder gain, Bonemeal, caged sync/priced-generate results, coda zooKeep, ritual triggers) + `calculatePokeBar`; caged outcomes are computed results for future engine application (PuzzleGens unmodeled) | `src/engine/auto-assembly.ts:201` |
| G11 | Save parser | ~~Increment-only walk~~ — fixed: faithful `nextLegalNP` (fracParts) on parse *and* serialize, so fractional dragon NPs survive round-trips | `src/engine/save-parser.ts:372` |

## Blocked on the UI track

| # | Area | Gap |
|---|---|---|
| G12 | Shopping Assistant | Auto-buy needs UI state (`shoppingItem`) — no headless equivalent |
| G13 | Rob auto-buy | Needs boost-by-ID mapping from the shop UI |

## Test methodology (not engine behavior)

| # | Issue |
|---|---|
| G14 | ~~Shared session~~ — fixed: each `engine-comparison` suite launches a fresh LegacyEngine; `legacy-engine.test.ts` already isolated per describe |, so legacy state accumulates between describes (`engine-comparison` header). Prefer a fresh context per suite so comparisons start from identical states. |
| G15 | `Parity Gap Summary` bakes in `expect(critical).toBeGreaterThan(0)`. Flip to `toBe(0)` (minus allow-listed intentional gaps) once G1–G4 are resolved. |

## Closed by live CI evidence

| # | Verdict |
|---|---|
| Unlock: Chromatic Heresy | **Fixed (UI-originated).** Legacy `gui.js repaintLoot` (via `repaintAll` on page load) unconditionally unlocks it, so every legacy session carries it. Mirrored in `initialize()` with a comment; the future UI track owns this behavior. |
| Unlock: Glass Ceiling 0 | **Fixed (eager cascade removed).** Legacy runs the ceiling cascade only from ceiling buy/lock functions; modern ran it at init *and* load. Removed both eager calls (buy/lock paths already cascade). |

## Closed by the first green CI run + H1 probe

| # | Verdict |
|---|---|
| G1 | **Closed (false alarm).** No ninja click penalty exists in legacy; base 1 + multipliers fully implemented and pinned. Live CI log shows legacy `sandPerClick: 1`. The `~0.22` note was stale. |
| G2/G3 | **Implemented, live-confirmed at start.** CI log: both engines start 1 unlocked / 0 bought / 4 badges (`Redundant Redundancy, Redundant, Notified, Not Ground Zero`). Exact startup-equality still rides the browser suites. |
| Badge over-earn | **Fixed.** `Not So Redundant` / `Don't Litter!` / `Y U NO BELIEVE ME?` were fired by *beach* clicks via duplicate declarative rules; legacy earns them on *kitty* totalClicks (castle.js:2409-2416), which the engine already implemented in `processKittyClickBadges`. Duplicate rules deleted; kitty thresholds now unit-tested. |
| Registry shape | **Fixed.** Extractor string decoding repaired (apostrophes/escapes), canonical dynamic badges appended (`Not So Redundant`, per-tool `Shop Failed`), 8 mangled keys corrected; invented badges (`Click Ninja`, `Click Ninja Ninja`, `Beachcomber`, `Beachwalker`, `Beachranger`) removed from conditions. Snapshot `undefined`-vs-`false` noise for these should clear on the next run. (`Have you noticed it's slower?`, `Dude, Where's my DeLorean?`, `//AR]-[AMMER`, per-tool `X Shop Failed`, ...), so snapshots show `undefined` vs `false`. Behaviorally inert (earn paths create on demand) but noisy; completing the extraction is its own stage. |

## Deliberate simplifications (keep)

- Mustard tools with `NaN` amounts; Doubletap recursion guard; backoff
  loop in glass-saw capacity — all match legacy edge-case handling.
- `donkey()` Rob/Shopping branches are explicit no-ops pending G12/G13,
  not silent stubs.
