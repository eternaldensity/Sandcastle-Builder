# UI Track Scope

The headless engine is complete (all Phase 1–4 systems, save
round-trips green). It has no consumer: the legacy game still renders
through `castle.html` + jQuery-era DOM code, which is explicitly out of
scope to modify. This track builds the modern presentation layer.

## Non-goals

- No changes to legacy `*.html`/`*.js`/`*.css` (still the parity
  reference; still under the do-not-modify rule).
- No game-logic changes: the UI reads `GameStateSnapshot` and issues
  `TestAction`-shaped intents through `GameEngine`. If the UI needs a
  number the snapshot lacks, extend the snapshot — never reach into
  engine internals.
- No framework lock-in yet: phase 1 is framework-free view models so a
  later React/Vue/Svelte choice is unconstrained.

## Phases

1. **View models (this scaffold).** Pure functions
   `GameStateSnapshot -> view model` in `src/ui/`, tested in node with
   hand-built snapshots. No DOM.
2. **DOM renderer.** Render view models into a fresh page (separate
   `ui.html` entry, never touching `castle.html`). Verifiable with the
   existing Playwright harness against view-model assertions.
3. **Interactivity.** Wire clicks/purchases to engine actions; cover
   with parity-style fixtures (action in, snapshot out).
4. **Cutover.** `ui.html` becomes the played game; legacy page remains
   as the test oracle until parity-gaps.md G1–G4 close.

## Why this order

View models pin *what* is shown before anyone argues about *how*.
They are also the seam the parity framework already understands:
snapshots in, diffs out (see `parity-testing.md`, severity scale).
G12/G13 (Shopping UI state, Rob boost-by-ID mapping) are tracked here,
not in the engine.
