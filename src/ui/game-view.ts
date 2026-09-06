/**
 * Game view model (UI track, phase 1).
 *
 * Pure functions from `GameStateSnapshot` to render-ready summaries.
 * No DOM, no engine imports: the UI reads snapshots and issues intents
 * through `GameEngine`, so this module depends only on the snapshot type.
 * See `docs/architecture/ui-track-scope.md`.
 */

import type { GameStateSnapshot } from '../parity/game-engine.js';

/** Render-ready summary of the resource panel. */
export interface ResourcePanel {
  sand: number;
  castles: number;
  glassChips: number;
  glassBlocks: number;
  beachClicks: number;
  newpixNumber: number;
}

/** Render-ready summary of collection progress. */
export interface CollectionProgress {
  sandToolsOwned: number;
  castleToolsOwned: number;
  boostsUnlocked: number;
  boostsBought: number;
  badgesEarned: number;
}

/** Render-ready ninja status line. */
export interface NinjaStatus {
  ninjad: boolean;
  stealth: number;
  ninjaFreeCount: number;
}

export function resourcePanel(snapshot: GameStateSnapshot): ResourcePanel {
  return {
    sand: snapshot.sand,
    castles: snapshot.castles,
    glassChips: snapshot.glassChips,
    glassBlocks: snapshot.glassBlocks,
    beachClicks: snapshot.beachClicks,
    newpixNumber: snapshot.newpixNumber,
  };
}

export function collectionProgress(snapshot: GameStateSnapshot): CollectionProgress {
  const sandToolsOwned = Object.values(snapshot.sandTools).filter(t => t.amount > 0).length;
  const castleToolsOwned = Object.values(snapshot.castleTools).filter(t => t.amount > 0).length;
  const boosts = Object.values(snapshot.boosts);
  return {
    sandToolsOwned,
    castleToolsOwned,
    boostsUnlocked: boosts.filter(b => b.unlocked > 0).length,
    boostsBought: boosts.filter(b => b.bought > 0).length,
    badgesEarned: Object.values(snapshot.badges).filter(Boolean).length,
  };
}

export function ninjaStatus(snapshot: GameStateSnapshot): NinjaStatus {
  return {
    ninjad: snapshot.ninjad,
    stealth: snapshot.ninjaStealth,
    ninjaFreeCount: snapshot.ninjaFreeCount,
  };
}
