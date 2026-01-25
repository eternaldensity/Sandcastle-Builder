/**
 * Tests for SaveParser
 */

import { describe, it, expect } from 'vitest';
import {
  parseSaveSections,
  parseGamenums,
  parseSandTools,
  parseCastleTools,
  parseBoostState,
  parseBoosts,
  parseBadges,
  parseOtherBadges,
  SaveParser,
} from './save-parser.js';

describe('SaveParser', () => {
  describe('parseSaveSections', () => {
    it('splits save string into sections', () => {
      const save = '4.12PPstartPoptsPgamenumsPsandPcastlePboostsPbadgesPPotherPnpdata';
      const sections = parseSaveSections(save);

      expect(sections.version).toBe(4.12);
      expect(sections.startDate).toBe(0); // parseInt returns 0 for non-numeric 'start'
      expect(sections.options).toBe('opts');
      expect(sections.gamenums).toBe('gamenums');
      expect(sections.sandTools).toBe('sand');
      expect(sections.castleTools).toBe('castle');
      expect(sections.boosts).toBe('boosts');
      expect(sections.badges).toBe('badges');
      expect(sections.otherBadges).toBe('other');
      expect(sections.npdata).toBe('npdata');
    });

    it('handles empty sections', () => {
      const save = '4.0PP1234PPPPPPPP';
      const sections = parseSaveSections(save);

      expect(sections.version).toBe(4.0);
      expect(sections.startDate).toBe(1234);
      expect(sections.gamenums).toBe('');
      expect(sections.boosts).toBe('');
    });
  });

  describe('parseGamenums', () => {
    it('parses v4.0+ format correctly', () => {
      // newpix;clicks;nfCount;nStealth;ninjad;saves;loads;notifs;npbONG;
      // redacted(countup;toggle;loc;clicks;chain;chainMax);lootPerPage;
      // largest[0]
      const thread = '100S50S10S5S1S3S2S100S0S0S0S0S0S0S0S20S100';
      const state = parseGamenums(thread, 4.0);

      expect(state.newpixNumber).toBe(100);
      expect(state.beachClicks).toBe(50);
      expect(state.ninjaFreeCount).toBe(10);
      expect(state.ninjaStealth).toBe(5);
      expect(state.ninjad).toBe(true);
      expect(state.saveCount).toBe(3);
      expect(state.loadCount).toBe(2);
      expect(state.lootPerPage).toBe(20);
      expect(state.largestNPvisited![0]).toBe(100);
    });

    it('handles v3.7 format', () => {
      const thread = '50S25S5S2S0S1S1S50S0S0S0S0S0S0S0S20S50';
      const state = parseGamenums(thread, 3.7);

      expect(state.newpixNumber).toBe(50);
      expect(state.beachClicks).toBe(25);
      expect(state.ninjad).toBe(false);
    });
  });

  describe('parseSandTools', () => {
    it('parses sand tool states', () => {
      // amount,bought,totalSand,temp,totalGlass for each tool
      const thread = '10C10C1000C0C0S5C5C500C0C0S0C0C0C0C0S0C0C0C0C0S0C0C0C0C0S0C0C0C0C0';
      const tools = parseSandTools(thread);

      expect(tools['Bucket'].amount).toBe(10);
      expect(tools['Bucket'].bought).toBe(10);
      expect(tools['Bucket'].totalSand).toBe(1000);
      expect(tools['Cuegan'].amount).toBe(5);
      expect(tools['Flag'].amount).toBe(0);
    });

    it('handles empty tool data', () => {
      const thread = '';
      const tools = parseSandTools(thread);

      expect(tools['Bucket'].amount).toBe(0);
      expect(tools['Bucket'].bought).toBe(0);
    });
  });

  describe('parseCastleTools', () => {
    it('parses castle tool states', () => {
      // amount,bought,built,destroyed,wasted,active,temp,glassBuilt,glassDestroyed
      const thread = '5C5C100C10C5C3C0C0C0S2C2C50C5C2C1C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0';
      const tools = parseCastleTools(thread, 4.0);

      expect(tools['Flag'].amount).toBe(5);
      expect(tools['Flag'].totalCastlesBuilt).toBe(100);
      expect(tools['Flag'].totalCastlesDestroyed).toBe(10);
      expect(tools['Flag'].currentActive).toBe(3);
      expect(tools['Trebuchet'].amount).toBe(2);
    });
  });

  describe('parseBoostState', () => {
    it('parses basic boost fields', () => {
      const fields = ['1', '1', '100', '0'];
      const state = parseBoostState(fields);

      expect(state.unlocked).toBe(1);
      expect(state.bought).toBe(1);
      expect(state.power).toBe(100);
      expect(state.countdown).toBe(0);
    });

    it('handles missing fields', () => {
      const fields = ['1', '1'];
      const state = parseBoostState(fields);

      expect(state.unlocked).toBe(1);
      expect(state.bought).toBe(1);
      expect(state.power).toBe(0);
      expect(state.countdown).toBe(0);
    });
  });

  describe('parseBoosts', () => {
    it('parses multiple boosts', () => {
      const thread = '1C1C0C0S1C1C100C0S0C0C0C0';
      const aliases = ['Boost1', 'Boost2', 'Boost3'];
      const boosts = parseBoosts(thread, aliases);

      expect(boosts['Boost1'].unlocked).toBe(1);
      expect(boosts['Boost1'].bought).toBe(1);
      expect(boosts['Boost2'].power).toBe(100);
      expect(boosts['Boost3'].bought).toBe(0);
    });
  });

  describe('parseBadges', () => {
    it('parses badge earned states', () => {
      const thread = '10110';
      const names = ['Badge1', 'Badge2', 'Badge3', 'Badge4', 'Badge5'];
      const badges = parseBadges(thread, names);

      expect(badges['Badge1']).toBe(true);
      expect(badges['Badge2']).toBe(false);
      expect(badges['Badge3']).toBe(true);
      expect(badges['Badge4']).toBe(true);
      expect(badges['Badge5']).toBe(false);
    });
  });

  describe('parseOtherBadges', () => {
    it('decodes hex-encoded badges', () => {
      // 'f' = 15 = 1111 in binary = all 4 badges earned
      // '0' = 0 = 0000 = no badges earned
      // '5' = 5 = 0101 = badges 0 and 2 earned
      const thread = 'f05';
      const names = [
        'B1', 'B2', 'B3', 'B4',  // 'f' -> all true
        'B5', 'B6', 'B7', 'B8',  // '0' -> all false
        'B9', 'B10', 'B11', 'B12', // '5' -> true,false,true,false
      ];
      const badges = parseOtherBadges(thread, names);

      expect(badges['B1']).toBe(true);
      expect(badges['B2']).toBe(true);
      expect(badges['B3']).toBe(true);
      expect(badges['B4']).toBe(true);
      expect(badges['B5']).toBe(false);
      expect(badges['B6']).toBe(false);
      expect(badges['B7']).toBe(false);
      expect(badges['B8']).toBe(false);
      expect(badges['B9']).toBe(true);
      expect(badges['B10']).toBe(false);
      expect(badges['B11']).toBe(true);
      expect(badges['B12']).toBe(false);
    });
  });

  describe('SaveParser class', () => {
    it('parses a complete save', () => {
      const boostAliases = ['Boost1', 'Boost2'];
      const regularBadgeNames = ['Badge1', 'Badge2'];
      const otherBadgeNames = ['Discov1', 'Discov2', 'Discov3', 'Discov4'];

      const parser = new SaveParser(
        boostAliases,
        regularBadgeNames,
        otherBadgeNames
      );

      // Construct a minimal valid save string
      // version PP startDate P opts P gamenums P sand P castle P boosts P badges PP other P npdata
      const gamenums = '10S5S0S0S0S0S0S0S0S0S0S0S0S0S0S20S10';
      const sand = '1C1C10C0C0S0C0C0C0C0S0C0C0C0C0S0C0C0C0C0S0C0C0C0C0S0C0C0C0C0';
      const castle = '0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0S0C0C0C0C0C0C0C0C0';
      const boosts = '1C1C0C0S0C0C0C0';
      const badges = '10';
      const other = 'f';

      const saveString = `4.0PP1234PoptionsP${gamenums}P${sand}P${castle}P${boosts}P${badges}PP${other}P`;
      const state = parser.parse(saveString);

      expect(state.version).toBe(4.0);
      expect(state.startDate).toBe(1234);
      expect(state.newpixNumber).toBe(10);
      expect(state.beachClicks).toBe(5);
      expect(state.sandTools['Bucket'].amount).toBe(1);
      expect(state.boosts['Boost1'].bought).toBe(1);
      expect(state.badges['Badge1'].earned).toBe(true);
      expect(state.badges['Badge2'].earned).toBe(false);
      expect(state.badges['Discov1'].earned).toBe(true);
    });
  });
});
