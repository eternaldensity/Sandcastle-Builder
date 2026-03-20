/**
 * Tests for AC (Automata Control) and PC (Production Control) badges.
 * Verifies that badge conditions trigger correctly when boost powers change.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BadgeChecker } from './badge-checker.js';
import { type BadgeCheckState } from './badge-conditions.js';

describe('AC and PC Badge Conditions', () => {
  let earnedBadges: string[];
  let checker: BadgeChecker;

  beforeEach(() => {
    earnedBadges = [];
    checker = new BadgeChecker((badge) => earnedBadges.push(badge));
  });

  it('earns It Hertz badge at AC >= 50', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { AC: 50 },
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).toContain('It Hertz');
  });

  it('earns Mains Power badge at AC >= 230', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { AC: 230 },
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).toContain('It Hertz');
    expect(newBadges).toContain('Mains Power');
  });

  it('earns high-tier AC badges', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { AC: 1e12 }, // 1T
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).toContain('It Hertz');
    expect(newBadges).toContain('Mains Power');
    expect(newBadges).toContain('Microwave'); // 1G
    expect(newBadges).toContain('Ultraviolet'); // 1T
  });

  it('earns Planck Limit badge when AC reaches PC power', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { AC: 1000, PC: 1000 },
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).toContain('Planck Limit');
  });

  it('does not earn Planck Limit if AC < PC', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { AC: 500, PC: 1000 },
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).not.toContain('Planck Limit');
  });

  it('earns Nope! badge when PC > 5e51', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { PC: 6e51 }, // Use significantly higher value
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).toContain('Nope!');
  });

  it('does not earn Nope! badge when PC <= 5e51', () => {
    const state: BadgeCheckState = {
      sand: 0,
      castles: 0,
      glassChips: 0,
      glassBlocks: 0,
      sandToolsOwned: 0,
      castleToolsOwned: 0,
      totalToolsOwned: 0,
      toolAmounts: {},
      beachClicks: 0,
      totalCastlesBuilt: 0,
      castlesSpent: 0,
      ninjaStealth: 0,
      ninjaFreeCount: 0,
      sandPermNP: 0,
      boostPowers: { PC: 5e51 },
      badges: {},
      badgesOwned: 0,
      boostsOwned: 0,
      discoveryCount: 0,
      monumentCount: 0,
      glassCeilingCount: 0,
    };

    const newBadges = checker.check('resource-change', state);
    expect(newBadges).not.toContain('Nope!');
  });
});
