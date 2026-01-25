/**
 * Tests for SaveSerializer
 */

import { describe, it, expect } from 'vitest';
import {
  gamenumsToString,
  sandToolsToString,
  castleToolsToString,
  boostsToString,
  badgesToString,
  otherBadgesToString,
  npDataToString,
  SaveSerializer,
  type CoreGameState,
} from './save-serializer.js';
import {
  parseGamenums,
  parseSandTools,
  parseCastleTools,
  parseBoosts,
  parseBadges,
  parseOtherBadges,
  parseNPData,
} from './save-parser.js';
import type { ToolState, BoostState, NPData } from '../types/game-data.js';

describe('SaveSerializer', () => {
  describe('gamenumsToString', () => {
    it('serializes core game state', () => {
      const state: CoreGameState = {
        version: 4.12,
        startDate: 1234567890,
        newpixNumber: 100,
        beachClicks: 50,
        ninjaFreeCount: 10,
        ninjaStealth: 5,
        ninjad: true,
        saveCount: 3,
        loadCount: 2,
        notifsReceived: 100,
        npbONG: 0,
        lootPerPage: 20,
        largestNPvisited: { 0: 100 },
        redacted: {
          countup: 1,
          toggle: 2,
          location: 3,
          totalClicks: 50,
          chainCurrent: 10,
          chainMax: 15,
        },
      };

      const result = gamenumsToString(state);

      // Should contain semicolon-delimited values
      expect(result).toContain('S');
      expect(result).toMatch(/^100S/); // Starts with newpixNumber
      expect(result).toContain('50S'); // beachClicks
      expect(result).toContain('10S'); // ninjaFreeCount
    });

    it('round-trips through parser', () => {
      const original: CoreGameState = {
        version: 4.0,
        startDate: 1234567890,
        newpixNumber: 42,
        beachClicks: 100,
        ninjaFreeCount: 5,
        ninjaStealth: 3,
        ninjad: false,
        saveCount: 10,
        loadCount: 5,
        notifsReceived: 50,
        npbONG: 1,
        lootPerPage: 30,
        largestNPvisited: { 0: 42 },
        redacted: {
          countup: 0,
          toggle: 0,
          location: 0,
          totalClicks: 25,
          chainCurrent: 5,
          chainMax: 10,
        },
      };

      const serialized = gamenumsToString(original);
      const parsed = parseGamenums(serialized, 4.0);

      expect(parsed.newpixNumber).toBe(42);
      expect(parsed.beachClicks).toBe(100);
      expect(parsed.ninjaFreeCount).toBe(5);
      expect(parsed.ninjaStealth).toBe(3);
      expect(parsed.ninjad).toBe(false);
      expect(parsed.saveCount).toBe(10);
      expect(parsed.loadCount).toBe(5);
      expect(parsed.lootPerPage).toBe(30);
      expect(parsed.redacted?.totalClicks).toBe(25);
      expect(parsed.redacted?.chainCurrent).toBe(5);
      expect(parsed.redacted?.chainMax).toBe(10);
    });
  });

  describe('sandToolsToString', () => {
    it('serializes sand tools', () => {
      const tools: Record<string, ToolState> = {
        Bucket: { amount: 10, bought: 10, temp: 0, totalSand: 1000, totalGlass: 0 },
        Cuegan: { amount: 5, bought: 5, temp: 0, totalSand: 500, totalGlass: 0 },
        Flag: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        LaPetite: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        Ladder: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        Bag: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
      };

      const result = sandToolsToString(tools);

      expect(result).toContain('10C10C1000C0C0S'); // Bucket
      expect(result).toContain('5C5C500C0C0S'); // Cuegan
    });

    it('round-trips through parser', () => {
      const original: Record<string, ToolState> = {
        Bucket: { amount: 15, bought: 15, temp: 2, totalSand: 5000, totalGlass: 100 },
        Cuegan: { amount: 8, bought: 10, temp: 0, totalSand: 2000, totalGlass: 50 },
        Flag: { amount: 3, bought: 3, temp: 1, totalSand: 800, totalGlass: 20 },
        LaPetite: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        Ladder: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        Bag: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
      };

      const serialized = sandToolsToString(original);
      const parsed = parseSandTools(serialized);

      expect(parsed['Bucket'].amount).toBe(15);
      expect(parsed['Bucket'].bought).toBe(15);
      expect(parsed['Bucket'].temp).toBe(2);
      expect(parsed['Bucket'].totalSand).toBe(5000);
      expect(parsed['Bucket'].totalGlass).toBe(100);
      expect(parsed['Cuegan'].amount).toBe(8);
      expect(parsed['Flag'].amount).toBe(3);
    });
  });

  describe('castleToolsToString', () => {
    it('serializes castle tools', () => {
      const tools: Record<string, ToolState> = {
        Flag: { amount: 5, bought: 5, temp: 0, totalCastlesBuilt: 100, totalCastlesDestroyed: 10, totalCastlesWasted: 5, currentActive: 3, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        Trebuchet: { amount: 2, bought: 2, temp: 0, totalCastlesBuilt: 50, totalCastlesDestroyed: 5, totalCastlesWasted: 2, currentActive: 1, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        NewPixBot: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        Scaffold: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        Wave: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        River: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
      };

      const result = castleToolsToString(tools);

      expect(result).toContain('5C5C100C10C5C3C0C0C0S'); // Flag
      expect(result).toContain('2C2C50C5C2C1C0C0C0S'); // Trebuchet
    });

    it('round-trips through parser', () => {
      const original: Record<string, ToolState> = {
        Flag: { amount: 10, bought: 12, temp: 1, totalCastlesBuilt: 500, totalCastlesDestroyed: 50, totalCastlesWasted: 25, currentActive: 8, totalGlassBuilt: 100, totalGlassDestroyed: 10 },
        Trebuchet: { amount: 3, bought: 3, temp: 0, totalCastlesBuilt: 150, totalCastlesDestroyed: 15, totalCastlesWasted: 5, currentActive: 2, totalGlassBuilt: 30, totalGlassDestroyed: 3 },
        NewPixBot: { amount: 1, bought: 1, temp: 0, totalCastlesBuilt: 200, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 1, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        Scaffold: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        Wave: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        River: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
      };

      const serialized = castleToolsToString(original);
      const parsed = parseCastleTools(serialized, 4.0);

      expect(parsed['Flag'].amount).toBe(10);
      expect(parsed['Flag'].totalCastlesBuilt).toBe(500);
      expect(parsed['Flag'].currentActive).toBe(8);
      expect(parsed['Flag'].totalGlassBuilt).toBe(100);
      expect(parsed['Trebuchet'].amount).toBe(3);
      expect(parsed['NewPixBot'].totalCastlesBuilt).toBe(200);
    });
  });

  describe('boostsToString', () => {
    it('serializes boosts', () => {
      const boosts: Record<string, BoostState> = {
        Boost1: { unlocked: 1, bought: 1, power: 100, countdown: 0 },
        Boost2: { unlocked: 1, bought: 0, power: 0, countdown: 0 },
        Boost3: { unlocked: 0, bought: 0, power: 50, countdown: 10 },
      };
      const aliases = ['Boost1', 'Boost2', 'Boost3'];

      const result = boostsToString(boosts, aliases);

      expect(result).toBe('1C1C100C0S1C0C0C0S0C0C50C10S');
    });

    it('round-trips through parser', () => {
      const original: Record<string, BoostState> = {
        Sand: { unlocked: 1, bought: 1, power: 5000, countdown: 0 },
        Castles: { unlocked: 1, bought: 1, power: 200, countdown: 0 },
        TestBoost: { unlocked: 1, bought: 0, power: 0, countdown: 100 },
      };
      const aliases = ['Sand', 'Castles', 'TestBoost'];

      const serialized = boostsToString(original, aliases);
      const parsed = parseBoosts(serialized, aliases);

      expect(parsed['Sand'].unlocked).toBe(1);
      expect(parsed['Sand'].bought).toBe(1);
      expect(parsed['Sand'].power).toBe(5000);
      expect(parsed['Castles'].power).toBe(200);
      expect(parsed['TestBoost'].countdown).toBe(100);
    });
  });

  describe('badgesToString', () => {
    it('serializes badges as single chars', () => {
      const badges: Record<string, boolean> = {
        Badge1: true,
        Badge2: false,
        Badge3: true,
        Badge4: true,
        Badge5: false,
      };
      const names = ['Badge1', 'Badge2', 'Badge3', 'Badge4', 'Badge5'];

      const result = badgesToString(badges, names);

      expect(result).toBe('10110');
    });

    it('round-trips through parser', () => {
      const original: Record<string, boolean> = {
        'No Ninja': true,
        'Click Ninja': true,
        'Ninja Stealth': false,
        'Castle Price Rollback': true,
      };
      const names = ['No Ninja', 'Click Ninja', 'Ninja Stealth', 'Castle Price Rollback'];

      const serialized = badgesToString(original, names);
      const parsed = parseBadges(serialized, names);

      expect(parsed['No Ninja']).toBe(true);
      expect(parsed['Click Ninja']).toBe(true);
      expect(parsed['Ninja Stealth']).toBe(false);
      expect(parsed['Castle Price Rollback']).toBe(true);
    });
  });

  describe('otherBadgesToString', () => {
    it('encodes badges in hex', () => {
      // 4 badges = 1 hex digit
      // 1111 = f, 0000 = 0, 0101 = 5
      const badges: Record<string, boolean> = {
        B1: true, B2: true, B3: true, B4: true,  // f
        B5: false, B6: false, B7: false, B8: false,  // 0
        B9: true, B10: false, B11: true, B12: false,  // 5
      };
      const names = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12'];

      const result = otherBadgesToString(badges, names);

      expect(result).toBe('f05');
    });

    it('round-trips through parser', () => {
      const original: Record<string, boolean> = {
        D1: true, D2: false, D3: true, D4: false,  // 5
        D5: false, D6: true, D7: false, D8: true,  // a
        D9: true, D10: true, D11: false, D12: false,  // 3
      };
      const names = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'];

      const serialized = otherBadgesToString(original, names);
      const parsed = parseOtherBadges(serialized, names);

      expect(parsed['D1']).toBe(true);
      expect(parsed['D2']).toBe(false);
      expect(parsed['D3']).toBe(true);
      expect(parsed['D5']).toBe(false);
      expect(parsed['D6']).toBe(true);
      expect(parsed['D9']).toBe(true);
      expect(parsed['D10']).toBe(true);
      expect(parsed['D11']).toBe(false);
    });
  });

  describe('npDataToString', () => {
    it('returns empty string for no dragons', () => {
      const result = npDataToString({});
      expect(result).toBe('');
    });

    it('returns empty string for empty dragon data', () => {
      const npData: Record<number, NPData> = {
        10: { dragonType: 0, amount: 0, defence: 0, attack: 0, dig: 0 },
      };
      const result = npDataToString(npData);
      expect(result).toBe('');
    });

    it('serializes dragon data', () => {
      const npData: Record<number, NPData> = {
        5: { dragonType: 1, amount: 10, defence: 5, attack: 3, dig: 2 },
        6: { dragonType: 1, amount: 10, defence: 5, attack: 3, dig: 2 }, // duplicate
        7: { dragonType: 2, amount: 20, defence: 10, attack: 6, dig: 4 },
      };

      const result = npDataToString(npData);

      expect(result).toContain('5S7'); // lowest;highest
      expect(result).toContain('1C10C5C3C2'); // dragon data
      expect(result).toContain('Sd'); // duplicate marker
    });

    it('round-trips through parser', () => {
      const original: Record<number, NPData> = {
        10: { dragonType: 1, amount: 100, defence: 50, attack: 30, dig: 20, breath: 5, magic1: 2 },
        11: { dragonType: 2, amount: 200, defence: 100, attack: 60, dig: 40 },
        12: { dragonType: 2, amount: 200, defence: 100, attack: 60, dig: 40 }, // duplicate
      };

      const serialized = npDataToString(original);
      const parsed = parseNPData(serialized, 4.0);

      expect(parsed[10]?.dragonType).toBe(1);
      expect(parsed[10]?.amount).toBe(100);
      expect(parsed[10]?.breath).toBe(5);
      expect(parsed[10]?.magic1).toBe(2);
      expect(parsed[11]?.dragonType).toBe(2);
      expect(parsed[12]?.amount).toBe(200); // duplicate handled
    });
  });

  describe('SaveSerializer class', () => {
    it('serializes complete game state', () => {
      const serializer = new SaveSerializer(
        ['Boost1', 'Boost2'],
        ['Badge1', 'Badge2'],
        ['Discov1', 'Discov2', 'Discov3', 'Discov4']
      );

      const state = {
        core: {
          version: 4.12,
          startDate: 1234567890,
          newpixNumber: 50,
          beachClicks: 100,
          ninjaFreeCount: 5,
          ninjaStealth: 3,
          ninjad: false,
          saveCount: 10,
          loadCount: 5,
          notifsReceived: 20,
          npbONG: 0,
          lootPerPage: 20,
          largestNPvisited: { 0: 50 },
          redacted: {
            countup: 0,
            toggle: 0,
            location: 0,
            totalClicks: 0,
            chainCurrent: 0,
            chainMax: 0,
          },
        },
        sandTools: {
          Bucket: { amount: 10, bought: 10, temp: 0, totalSand: 1000, totalGlass: 0 },
          Cuegan: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
          Flag: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
          LaPetite: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
          Ladder: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
          Bag: { amount: 0, bought: 0, temp: 0, totalSand: 0, totalGlass: 0 },
        },
        castleTools: {
          Flag: { amount: 5, bought: 5, temp: 0, totalCastlesBuilt: 100, totalCastlesDestroyed: 10, totalCastlesWasted: 5, currentActive: 3, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
          Trebuchet: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
          NewPixBot: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
          Scaffold: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
          Wave: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
          River: { amount: 0, bought: 0, temp: 0, totalCastlesBuilt: 0, totalCastlesDestroyed: 0, totalCastlesWasted: 0, currentActive: 0, totalGlassBuilt: 0, totalGlassDestroyed: 0 },
        },
        boosts: {
          Boost1: { unlocked: 1, bought: 1, power: 100, countdown: 0 },
          Boost2: { unlocked: 0, bought: 0, power: 0, countdown: 0 },
        },
        badges: {
          Badge1: true,
          Badge2: false,
          Discov1: true,
          Discov2: true,
          Discov3: false,
          Discov4: false,
        },
        npData: {},
      };

      const result = serializer.serialize(state);

      // Check structure: version PP startDate P options P gamenums P sand P castle P boosts P badges PP other P npdata
      const sections = result.split('P');
      expect(sections[0]).toBe('4.12'); // version
      expect(sections[1]).toBe(''); // reserved
      expect(sections[2]).toBe('1234567890'); // startDate
      expect(sections[4]).toContain('50S'); // gamenums contains newpixNumber
      expect(sections[5]).toContain('10C10C1000'); // sand tools
      expect(sections[6]).toContain('5C5C100'); // castle tools
      expect(sections[7]).toContain('1C1C100C0'); // boosts
      expect(sections[8]).toBe('10'); // regular badges
      expect(sections[10]).toBe('3'); // other badges (1100 = 3)
    });
  });
});
