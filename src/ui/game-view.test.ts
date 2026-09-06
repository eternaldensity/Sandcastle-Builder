/**
 * Tests for the game view model (UI track, phase 1).
 *
 * Hand-built snapshots only: no engine, no DOM, no browser.
 */

import { describe, it, expect } from 'vitest';
import type { GameStateSnapshot } from '../parity/game-engine.js';
import { resourcePanel, collectionProgress, ninjaStatus } from './game-view.js';

function snapshot(overrides: Partial<GameStateSnapshot> = {}): GameStateSnapshot {
  return {
    version: 1,
    newpixNumber: 7,
    sand: 1500,
    castles: 42,
    glassChips: 3,
    glassBlocks: 0,
    beachClicks: 120,
    ninjaFreeCount: 2,
    ninjaStealth: 5,
    ninjad: true,
    sandTools: {
      Bucket: { amount: 3, bought: 3, temp: 0, totalSand: 900, totalGlass: 0 },
      Cuegan: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
    },
    castleTools: {
      Flag: { amount: 1, bought: 1, temp: 0 },
    },
    boosts: {
      Sand: { unlocked: 1, bought: 1, power: 1500, countdown: 0 },
      GlassChips: { unlocked: 1, bought: 0, power: 3, countdown: 0 },
    },
    badges: { 'Getting Started': true, Tycoon: false },
    ...overrides,
  };
}

describe('resourcePanel', () => {
  it('should project resource fields verbatim', () => {
    expect(resourcePanel(snapshot())).toEqual({
      sand: 1500,
      castles: 42,
      glassChips: 3,
      glassBlocks: 0,
      beachClicks: 120,
      newpixNumber: 7,
    });
  });
});

describe('collectionProgress', () => {
  it('should count owned tools, bought boosts, and earned badges', () => {
    expect(collectionProgress(snapshot())).toEqual({
      sandToolsOwned: 1,
      castleToolsOwned: 1,
      boostsUnlocked: 2,
      boostsBought: 1,
      badgesEarned: 1,
    });
  });

  it('should handle an empty collection', () => {
    const progress = collectionProgress(
      snapshot({ sandTools: {}, castleTools: {}, boosts: {}, badges: {} }),
    );
    expect(progress).toEqual({
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      boostsUnlocked: 0,
      boostsBought: 0,
      badgesEarned: 0,
    });
  });
});

describe('ninjaStatus', () => {
  it('should project ninja fields verbatim', () => {
    expect(ninjaStatus(snapshot())).toEqual({ ninjad: true, stealth: 5, ninjaFreeCount: 2 });
  });
});
