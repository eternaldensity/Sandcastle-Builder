/**
 * Badge registry completeness.
 *
 * Pins the G-tests registry work: every statically-defined legacy badge
 * must resolve in game-data.json (the extractor once truncated
 * apostrophe/escape names and skipped loop-generated ones), and condition
 * rules must not reference badges legacy never defined.
 */

import { describe, it, expect } from 'vitest';
import gameData from '../data/game-data.json';
import { badgeConditions } from './badge-conditions.js';
import { RUNTIME_BADGES } from './save-parser.js';

// Badges the legacy extractor mangled (apostrophes/escapes) or skipped
// (loop-generated). Each must resolve exactly.
const REPAIRED_STATIC = [
  "And It Don't Stop",
  "Don't Litter!",
  "Dude, Where's my DeLorean?",
  "Have you noticed it's slower?",
  "That's gross",
  "Two Pots O' Gold",
  "What's the score?",
  '\\/\\/AR]-[AMMER',
  'Not So Redundant',
  'Bucket Shop Failed',
  'NewPixBot Shop Failed',
];

// Badges legacy never defined (modern inventions, since removed).
const INVENTED = [
  'Click Ninja',
  'Click Ninja Ninja',
  'Beachcomber',
  'Beachwalker',
  'Beachranger',
];

describe('badge registry', () => {
  it('resolves every repaired static badge in game-data', () => {
    const names = new Set(Object.keys(gameData.badges));
    for (const name of REPAIRED_STATIC) {
      expect(names.has(name), `missing badge: ${name}`).toBe(true);
    }
  });

  it('has no apostrophe-truncation fragments', () => {
    const names = Object.keys(gameData.badges);
    for (const name of names) {
      expect(name.endsWith('\\'), `fragment key: ${name}`).toBe(false);
    }
    for (const fragment of ['Not So ', 'Don', 'Have you noticed it', 'Dude, Where']) {
      expect(names, `fragment key present: ${fragment}`).not.toContain(fragment);
    }
  });

  it('conditions reference no invented badges', () => {
    const referenced = new Set(badgeConditions.map((c) => c.badge));
    for (const name of INVENTED) {
      expect(referenced, `invented condition: ${name}`).not.toContain(name);
    }
  });

  it('runtime list holds exactly the dynamic-but-real badges', () => {
    expect([...RUNTIME_BADGES].sort()).toEqual(
      ["Don't Litter!", 'Not So Redundant', 'Y U NO BELIEVE ME?'].sort(),
    );
  });
});

describe('boost extraction values', () => {
  it('keeps hand-verified values the extractor cannot reach', () => {
    // Polarizer.startPower lives in a nested def the one-level extractor
    // regex cannot see; snapshots depend on it (legacy power -1).
    const boosts = gameData.boosts as Record<string, { startPower?: number; startCountdown?: number }>;
    expect(boosts['Polarizer']?.startPower).toBe(-1);
  });

  it('starts Switching countdowns from defs (zeroed live at init)', () => {
    // Legacy constructor zeroes countdown; the def values apply on activation.
    const boosts = gameData.boosts as Record<string, { startPower?: number; startCountdown?: number }>;
    expect(boosts['Glass Furnace Switching']?.startCountdown).toBe(1500);
    expect(boosts['Glass Blower Switching']?.startCountdown).toBe(2500);
  });
});
