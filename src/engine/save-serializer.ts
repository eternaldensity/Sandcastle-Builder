/**
 * SaveSerializer - Encodes game state to legacy Sandcastle Builder save format
 *
 * The save format uses pipe-delimited (P) sections:
 * - [0]: version
 * - [1]: empty (reserved)
 * - [2]: startDate
 * - [3]: options
 * - [4]: gamenums (semicolon S delimited)
 * - [5]: sandTools (S delimited, comma C for fields)
 * - [6]: castleTools (S/C delimited)
 * - [7]: boosts (S delimited, C for fields)
 * - [8]: badges (single chars)
 * - [9]: unused
 * - [10]: otherBadges (hex encoded)
 * - [11]: npdata (dragons)
 *
 * Reference: persist.js ToNeedlePulledThing and related *ToString functions
 */

import type { BoostState, ToolState, GameData, NPData } from '../types/game-data.js';

/** Delimiters used in save format */
const PIPE = 'P';
const SEMICOLON = 'S';
const COMMA = 'C';

/** Sand tool names in order (must match save format) */
const SAND_TOOL_NAMES = [
  'Bucket',
  'Cuegan',
  'Flag',
  'LaPetite',
  'Ladder',
  'Bag',
];

/** Castle tool names in order (must match save format) */
const CASTLE_TOOL_NAMES = [
  'Flag',
  'Trebuchet',
  'NewPixBot',
  'Scaffold',
  'Wave',
  'River',
];

/**
 * Core game state for serialization
 */
export interface CoreGameState {
  version: number;
  startDate: number;
  newpixNumber: number;
  beachClicks: number;
  ninjaFreeCount: number;
  ninjaStealth: number;
  ninjad: boolean;
  saveCount: number;
  loadCount: number;
  notifsReceived: number;
  npbONG: number;
  lootPerPage: number;
  largestNPvisited: Record<number, number>;
  redacted: {
    countup: number;
    toggle: number;
    location: number;
    totalClicks: number;
    chainCurrent: number;
    chainMax: number;
  };
  /** Optional game time (dayjs timestamp) for v4.1+ */
  gameTime?: number;
}

/**
 * Serialize game numbers to string.
 * Reference: persist.js Molpy.GamenumsToString (v3.7+ format)
 *
 * Format: newpix;clicks;nfCount;nStealth;ninjad;saves;loads;notifs;npbONG;
 *         redacted(countup;toggle;loc;clicks;chain;chainMax);lootPerPage;time;largestNP[0];...fracParts
 */
export function gamenumsToString(state: CoreGameState): string {
  const s = SEMICOLON;

  // Build the gamenums string (v3.7+ format)
  let str = '';
  str += state.newpixNumber + s;
  str += state.beachClicks + s;
  str += state.ninjaFreeCount + s;
  str += state.ninjaStealth + s;
  str += (state.ninjad ? 1 : 0) + s;
  str += state.saveCount + s;
  str += state.loadCount + s;
  str += (state.notifsReceived ?? 0) + s;
  str += (state.npbONG ?? 0) + s;
  str += (state.redacted?.countup ?? 0) + s;
  str += (state.redacted?.toggle ?? 0) + s;
  str += (state.redacted?.location ?? 0) + s;
  str += (state.redacted?.totalClicks ?? 0) + s;
  str += (state.redacted?.chainCurrent ?? 0) + s;
  str += (state.redacted?.chainMax ?? 0) + s;
  str += (state.lootPerPage ?? 20) + s;

  // v4.1+ includes game time
  if (state.gameTime !== undefined) {
    str += state.gameTime + s;
  }

  // largestNPvisited[0]
  str += (state.largestNPvisited?.[0] ?? Math.abs(state.newpixNumber)) + s;

  // Additional fracParts would be added here for multi-story support
  // For now, we support the main story only

  return str;
}

/**
 * Serialize sand tools to string.
 * Reference: persist.js Molpy.SandToolsToString
 *
 * Format per tool: amount,bought,totalSand,temp,totalGlass;
 */
export function sandToolsToString(tools: Record<string, ToolState>): string {
  const s = SEMICOLON;
  const c = COMMA;
  let str = '';

  for (const name of SAND_TOOL_NAMES) {
    const tool = tools[name];
    if (tool) {
      str += tool.amount + c;
      str += tool.bought + c;
      str += (tool.totalSand ?? 0) + c;
      str += (tool.temp ?? 0) + c;
      str += (tool.totalGlass ?? 0);
    } else {
      str += '0' + c + '0' + c + '0' + c + '0' + c + '0';
    }
    str += s;
  }

  return str;
}

/**
 * Serialize castle tools to string.
 * Reference: persist.js Molpy.CastleToolsToString
 *
 * Format per tool: amount,bought,built,destroyed,wasted,active,temp,glassBuilt,glassDestroyed;
 */
export function castleToolsToString(tools: Record<string, ToolState>): string {
  const s = SEMICOLON;
  const c = COMMA;
  let str = '';

  for (const name of CASTLE_TOOL_NAMES) {
    const tool = tools[name];
    if (tool) {
      str += tool.amount + c;
      str += tool.bought + c;
      str += (tool.totalCastlesBuilt ?? 0) + c;
      str += (tool.totalCastlesDestroyed ?? 0) + c;
      str += (tool.totalCastlesWasted ?? 0) + c;
      str += (tool.currentActive ?? 0) + c;
      str += (tool.temp ?? 0) + c;
      str += (tool.totalGlassBuilt ?? 0) + c;
      str += (tool.totalGlassDestroyed ?? 0);
    } else {
      str += '0' + c + '0' + c + '0' + c + '0' + c + '0' + c + '0' + c + '0' + c + '0' + c + '0';
    }
    str += s;
  }

  return str;
}

/**
 * Serialize boosts to string.
 * Reference: persist.js Molpy.BoostsToString
 *
 * Each boost stores: unlocked,bought,power,countdown[,extra fields based on saveData];
 *
 * Note: The legacy format supports complex saveData with arrays and objects,
 * but for now we serialize the standard 4 fields. Extended saveData support
 * would require the boost definitions to include their saveData structure.
 */
export function boostsToString(
  boosts: Record<string, BoostState>,
  boostAliases: string[]
): string {
  const s = SEMICOLON;
  const c = COMMA;
  let str = '';

  for (const alias of boostAliases) {
    const boost = boosts[alias];
    if (boost) {
      str += boost.unlocked + c;
      str += boost.bought + c;
      str += boost.power + c;
      str += boost.countdown;

      // Extended save data would be serialized here if present
      // For now, we handle the standard 4 fields
    } else {
      str += '0' + c + '0' + c + '0' + c + '0';
    }
    str += s;
  }

  return str;
}

/**
 * Serialize regular badges (group='badges') to string.
 * Reference: persist.js Molpy.BadgesToString
 *
 * Format: single chars (0/1) concatenated, one per badge in order
 */
export function badgesToString(
  badges: Record<string, boolean>,
  badgeNames: string[]
): string {
  let str = '';

  for (const name of badgeNames) {
    str += badges[name] ? '1' : '0';
  }

  return str;
}

/**
 * Convert 4-bit array to hex digit.
 * Inverse of fromOct in save-parser.ts
 */
function toOct(bits: number[]): number {
  return (bits[0] ? 1 : 0) |
         (bits[1] ? 2 : 0) |
         (bits[2] ? 4 : 0) |
         (bits[3] ? 8 : 0);
}

/**
 * Serialize other badges (discoveries, monuments, etc.) to string.
 * Reference: persist.js Molpy.OtherBadgesToString
 *
 * Format: hex encoding with 4 badges per character
 * Each hex digit represents earned state of 4 consecutive badges
 */
export function otherBadgesToString(
  badges: Record<string, boolean>,
  badgeNames: string[]
): string {
  let str = '';
  let idx = 0;

  while (idx < badgeNames.length) {
    // Collect 4 badges per hex digit
    const bits: number[] = [];
    for (let i = 0; i < 4; i++) {
      const name = badgeNames[idx + i];
      bits.push(name && badges[name] ? 1 : 0);
    }

    // Convert to hex digit
    str += toOct(bits).toString(16);
    idx += 4;
  }

  return str;
}

/**
 * Serialize NP data (dragons) to string.
 * Reference: persist.js Molpy.NPdataToString
 *
 * Format: lowest;highest;[dragonData per NP separated by S]
 * Dragon data: type,amount,defence,attack,dig[,breath,magic1,magic2,magic3]
 * 'd' indicates duplicate of previous NP
 *
 * Returns empty string if no dragons exist.
 */
export function npDataToString(npData: Record<number, NPData>): string {
  const s = SEMICOLON;
  const c = COMMA;

  // Find range with actual dragon data
  const npKeys = Object.keys(npData)
    .map(Number)
    .filter((np) => {
      const data = npData[np];
      return data && data.amount > 0;
    })
    .sort((a, b) => a - b);

  if (npKeys.length === 0) {
    return '';
  }

  const lowest = npKeys[0];
  const highest = npKeys[npKeys.length - 1];

  let str = lowest + s + highest;
  let lastNP = '';

  for (let np = lowest; np <= highest; np++) {
    str += s;
    const dd = npData[np];

    if (dd && dd.amount > 0) {
      // Build the NP data string
      let thisNP = dd.dragonType + c + dd.amount + c + dd.defence + c + dd.attack + c + dd.dig;

      // Add optional fields only if present
      if (dd.breath || dd.magic1 || dd.magic2 || dd.magic3) {
        thisNP += c + (dd.breath || 0);
      }
      if (dd.magic1 || dd.magic2 || dd.magic3) {
        thisNP += c + (dd.magic1 || 0);
      }
      if (dd.magic2 || dd.magic3) {
        thisNP += c + (dd.magic2 || 0);
      }
      if (dd.magic3) {
        thisNP += c + (dd.magic3 || 0);
      }

      // Use 'd' for duplicate
      if (thisNP === lastNP) {
        str += 'd';
      } else {
        str += thisNP;
        lastNP = thisNP;
      }
    }
    // Empty NPs get no content after the semicolon
  }

  return str;
}

/**
 * Options to string (placeholder for now).
 * Reference: persist.js Molpy.OptionsToString
 *
 * Full options serialization is complex and includes many UI settings.
 * For game state preservation, the essential options are included.
 */
export function optionsToString(_options?: Record<string, unknown>): string {
  // Options serialization is deferred - return empty for now
  // This is acceptable because options are UI-related and don't affect game logic
  return '';
}

/**
 * Complete save state for serialization
 */
export interface SaveState {
  core: CoreGameState;
  sandTools: Record<string, ToolState>;
  castleTools: Record<string, ToolState>;
  boosts: Record<string, BoostState>;
  badges: Record<string, boolean>;
  npData?: Record<number, NPData>;
  options?: Record<string, unknown>;
}

/**
 * SaveSerializer - Full save serialization class
 */
export class SaveSerializer {
  private boostAliases: string[];
  private regularBadgeNames: string[];
  private otherBadgeNames: string[];

  constructor(
    boostAliases: string[],
    regularBadgeNames: string[],
    otherBadgeNames: string[]
  ) {
    this.boostAliases = boostAliases;
    this.regularBadgeNames = regularBadgeNames;
    this.otherBadgeNames = otherBadgeNames;
  }

  /**
   * Serialize complete game state to save string.
   * Reference: persist.js Molpy.ToNeedlePulledThing
   *
   * Returns the raw save string (not base64 encoded).
   * For cookie/export, the result should be encoded with CuegishToBeanish.
   */
  serialize(state: SaveState): string {
    const p = PIPE;

    // Build sections array
    const sections: string[] = [];

    // Section 0: version
    sections.push(String(state.core.version));

    // Section 1: empty (reserved)
    sections.push('');

    // Section 2: startDate
    sections.push(String(state.core.startDate));

    // Section 3: options
    sections.push(optionsToString(state.options));

    // Section 4: gamenums
    sections.push(gamenumsToString(state.core));

    // Section 5: sandTools
    sections.push(sandToolsToString(state.sandTools));

    // Section 6: castleTools
    sections.push(castleToolsToString(state.castleTools));

    // Section 7: boosts
    sections.push(boostsToString(state.boosts, this.boostAliases));

    // Section 8: badges
    sections.push(badgesToString(state.badges, this.regularBadgeNames));

    // Section 9: unused
    sections.push('');

    // Section 10: otherBadges
    sections.push(otherBadgesToString(state.badges, this.otherBadgeNames));

    // Section 11: npdata
    sections.push(npDataToString(state.npData ?? {}));

    return sections.join(p);
  }
}

/**
 * Create a SaveSerializer from game data.
 */
export function createSaveSerializer(gameData: {
  boostsById: Array<{ alias: string }>;
  badgesById: Array<{ name: string; group: string }>;
}): SaveSerializer {
  const boostAliases = gameData.boostsById.map((b) => b.alias);
  const regularBadgeNames = gameData.badgesById
    .filter((b) => b.group === 'badges')
    .map((b) => b.name);
  const otherBadgeNames = gameData.badgesById
    .filter((b) => b.group !== 'badges')
    .map((b) => b.name);

  return new SaveSerializer(boostAliases, regularBadgeNames, otherBadgeNames);
}
