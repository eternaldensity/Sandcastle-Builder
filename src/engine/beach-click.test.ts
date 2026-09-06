/**
 * Tests for beach-click helpers (pure functions over BeachClickAccess).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { BoostState } from '../types/game-data.js';
import { toCastles, type BeachClickAccess } from './beach-click.js';

function boost(bought = 0, power = 0): BoostState {
  return { unlocked: bought, bought, power, countdown: 0 };
}

describe('toCastles', () => {
  let resources: { sand: number; castles: number; glassChips: number; glassBlocks: number };
  let castleBuild: { prevCastleSand: number; nextCastleSand: number; totalBuilt: number };
  let boosts: Map<string, BoostState>;
  let badges: string[];
  let access: BeachClickAccess;

  beforeEach(() => {
    resources = { sand: 0, castles: 0, glassChips: 0, glassBlocks: 0 };
    castleBuild = { prevCastleSand: 1, nextCastleSand: 1, totalBuilt: 0 };
    boosts = new Map();
    badges = [];
    access = {
      hasBoost: (alias) => (boosts.get(alias)?.bought ?? 0) > 0,
      isBoostEnabled: () => false,
      getBoost: (alias) => boosts.get(alias),
      boostEntries: () => boosts.entries(),
      getBoostPower: (alias) => boosts.get(alias)?.power ?? 0,
      doUnlockBoost: () => undefined,
      earnBadge: (name) => { badges.push(name); },
      resources,
      cachedSandPerClick: 1,
      syncResourceBoosts: () => undefined,
      castleBuild,
      notifyResourceChange: () => undefined,
      notifyClick: () => undefined,
      getBeachClicks: () => 0,
      getNewpixNumber: () => 1,
      mustardToolCount: 0,
      countBoughtBoosts: () => 0,
      getDragonDigRate: () => 0,
      digDragonsBeach: () => undefined,
      getAllToolNames: () => [],
      getToolState: () => undefined,
      getFractalPower: () => boosts.get('Fractal Sandcastles')?.power ?? 0,
      addFractalPower: (amount) => { const f = boosts.get('Fractal Sandcastles'); if (f) f.power += amount; },
      papal: () => 1,
      riftJump: () => undefined,
    };
  });

  it('should build castles along the Fibonacci sequence without fractal', () => {
    resources.sand = 10;
    toCastles(access);
    // Costs 1, 2, 3 (4 sand left, next cost 5 unreachable)
    expect(resources.castles).toBe(3);
    expect(resources.sand).toBe(4);
    expect(castleBuild.totalBuilt).toBe(3);
    expect(castleBuild.nextCastleSand).toBe(5);
    expect(badges).not.toContain('Fractals Forever');
  });

  it('should build many castles per iteration with Fractal Sandcastles', () => {
    boosts.set('Fractal Sandcastles', boost(1, 10));
    resources.sand = 10;
    toCastles(access);
    // floor(1.35^10) + floor(1.35^11) + floor(1.35^12) = 20 + 27 + 36;
    // costs 1, 2, 3 as above (power compounds per build, as in legacy)
    expect(resources.castles).toBe(83);
    expect(castleBuild.totalBuilt).toBe(83);
    // Fractal power increments once per build
    expect(boosts.get('Fractal Sandcastles')?.power).toBe(13);
  });

  it('should use 1.5 base with Fractal Fractals', () => {
    boosts.set('Fractal Sandcastles', boost(1, 4));
    boosts.set('Fractal Fractals', boost(1, 0));
    resources.sand = 1;
    toCastles(access);
    // floor(1.5^4) = 5
    expect(resources.castles).toBe(5);
  });

  it('should earn Fractals Forever at fractal power 60', () => {
    boosts.set('Fractal Sandcastles', boost(1, 59));
    resources.sand = 1;
    toCastles(access);
    expect(badges).toContain('Fractals Forever');
  });

  it('should earn Getting Expensive when castle cost exceeds 80', () => {
    resources.sand = 1000;
    toCastles(access);
    expect(badges).toContain('Getting Expensive');
  });
});
