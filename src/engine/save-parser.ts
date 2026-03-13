/**
 * SaveParser - Decodes legacy Sandcastle Builder save format
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
 */

import type {
  BoostState,
  ToolState,
  GameState,
  NPData,
} from '../types/game-data.js';

/** Delimiters used in save format */
const PIPE = 'P';
const SEMICOLON = 'S';
const COMMA = 'C';

/** Sand tool names in order */
const SAND_TOOL_NAMES = [
  'Bucket',
  'Cuegan',
  'Flag',
  'LaPetite',
  'Ladder',
  'Bag',
];

/** Castle tool names in order */
const CASTLE_TOOL_NAMES = [
  'Flag',
  'Trebuchet',
  'NewPixBot',
  'Scaffold',
  'Wave',
  'River',
];

/**
 * Default boost saveData structure
 * Format: [propertyName, defaultValue, type]
 */
const DEFAULT_BOOST_SAVE_DATA = [
  ['unlocked', 0, 'int'],
  ['bought', 0, 'float'],
  ['power', 0, 'float'],
  ['countdown', 0, 'float'],
] as const;

/**
 * Parsed raw save sections before full processing
 */
export interface RawSaveSections {
  version: number;
  startDate: number;
  options: string;
  gamenums: string;
  sandTools: string;
  castleTools: string;
  boosts: string;
  badges: string;
  otherBadges: string;
  npdata: string;
}

/**
 * Parse a save string into sections
 */
export function parseSaveSections(saveString: string): RawSaveSections {
  const sections = saveString.split(PIPE);

  return {
    version: parseFloat(sections[0]) || 0,
    startDate: parseInt(sections[2]) || 0,
    options: sections[3] || '',
    gamenums: sections[4] || '',
    sandTools: sections[5] || '',
    castleTools: sections[6] || '',
    boosts: sections[7] || '',
    badges: sections[8] || '',
    otherBadges: sections[10] || '',
    npdata: sections[11] || '',
  };
}

/**
 * Parse game numbers from gamenums section
 */
export function parseGamenums(
  thread: string,
  version: number
): Partial<GameState> {
  const pixels = thread.split(SEMICOLON);
  const state: Partial<GameState> = {
    redacted: {
      countup: 0,
      toggle: 0,
      location: 0,
      totalClicks: 0,
      chainCurrent: 0,
      chainMax: 0,
    },
    largestNPvisited: {},
  };

  // Modern format (v3.7+)
  if (version >= 3.7) {
    const np = parseFloat(pixels[0]) || 0;
    state.newpixNumber = np;
    state.beachClicks = parseInt(pixels[1]) || 0;
    state.ninjaFreeCount = parseInt(pixels[2]) || 0;
    state.ninjaStealth = parseInt(pixels[3]) || 0;
    state.ninjad = parseInt(pixels[4]) ? true : false;
    state.saveCount = parseInt(pixels[5]) || 0;
    state.loadCount = parseInt(pixels[6]) || 0;
    state.notifsReceived = parseInt(pixels[7]) || 0;
    state.npbONG = parseInt(pixels[8]) || 0;
    state.redacted!.countup = parseInt(pixels[9]) || 0;
    state.redacted!.toggle = parseInt(pixels[10]) || 0;
    state.redacted!.location = parseInt(pixels[11]) || 0;
    state.redacted!.totalClicks = parseInt(pixels[12]) || 0;
    state.redacted!.chainCurrent = parseFloat(pixels[13]) || 0;
    state.redacted!.chainMax = parseFloat(pixels[14]) || 0;
    state.lootPerPage = parseInt(pixels[15]) || 20;

    // Version 4.1+ has time field
    let offset = 0;
    if (version >= 4.1) {
      // pixels[16] is time (dayjs timestamp), skip it for now
      offset = 1;
    }

    state.largestNPvisited![0] =
      parseInt(pixels[16 + offset]) ||
      parseFloat(pixels[16 + offset]) ||
      Math.abs(np);
    // Additional fracParts would be parsed here if needed
  } else if (version >= 3.3332) {
    // Older v3.3332-3.7 format
    state.newpixNumber = parseInt(pixels[0]) || 0;
    state.beachClicks = parseInt(pixels[1]) || 0;
    state.ninjaFreeCount = parseInt(pixels[2]) || 0;
    state.ninjaStealth = parseInt(pixels[3]) || 0;
    state.ninjad = parseInt(pixels[4]) ? true : false;
    state.saveCount = parseInt(pixels[5]) || 0;
    state.loadCount = parseInt(pixels[6]) || 0;
    state.notifsReceived = parseInt(pixels[7]) || 0;
    state.npbONG = parseInt(pixels[8]) || 0;
    state.redacted!.countup = parseInt(pixels[9]) || 0;
    state.redacted!.toggle = parseInt(pixels[10]) || 0;
    state.redacted!.location = parseInt(pixels[11]) || 0;
    state.redacted!.totalClicks = parseInt(pixels[12]) || 0;
    state.redacted!.chainCurrent = parseFloat(pixels[14]) || 0;
    state.redacted!.chainMax = parseFloat(pixels[15]) || 0;
    state.lootPerPage = parseInt(pixels[16]) || 20;
    state.largestNPvisited![0] = parseInt(pixels[13]) || Math.abs(state.newpixNumber);
  }
  // Even older formats (<3.3332) had different layouts, but are rare

  return state;
}

/**
 * Parse sand tools from sandTools section
 */
export function parseSandTools(thread: string): Record<string, ToolState> {
  const pixels = thread.split(SEMICOLON);
  const tools: Record<string, ToolState> = {};

  for (let i = 0; i < SAND_TOOL_NAMES.length; i++) {
    const name = SAND_TOOL_NAMES[i];
    if (pixels[i]) {
      const fields = pixels[i].split(COMMA);
      tools[name] = {
        amount: Math.max(0, parseFloat(fields[0]) || 0),
        bought: Math.max(0, parseFloat(fields[1]) || 0),
        totalSand: parseFloat(fields[2]) || 0,
        temp: parseFloat(fields[3]) || 0,
        totalGlass: parseFloat(fields[4]) || 0,
      };
    } else {
      tools[name] = {
        amount: 0,
        bought: 0,
        totalSand: 0,
        temp: 0,
        totalGlass: 0,
      };
    }
  }

  return tools;
}

/**
 * Parse castle tools from castleTools section
 */
export function parseCastleTools(
  thread: string,
  _version: number
): Record<string, ToolState> {
  const pixels = thread.split(SEMICOLON);
  const tools: Record<string, ToolState> = {};

  for (let i = 0; i < CASTLE_TOOL_NAMES.length; i++) {
    const name = CASTLE_TOOL_NAMES[i];
    if (pixels[i]) {
      const fields = pixels[i].split(COMMA);
      tools[name] = {
        amount: Math.max(0, parseFloat(fields[0]) || 0),
        bought: Math.max(0, parseFloat(fields[1]) || 0),
        totalCastlesBuilt: parseFloat(fields[2]) || 0,
        totalCastlesDestroyed: parseFloat(fields[3]) || 0,
        totalCastlesWasted: parseFloat(fields[4]) || 0,
        currentActive: parseFloat(fields[5]) || 0,
        temp: parseFloat(fields[6]) || 0,
        totalGlassBuilt: parseFloat(fields[7]) || 0,
        totalGlassDestroyed: parseFloat(fields[8]) || 0,
      };
    } else {
      tools[name] = {
        amount: 0,
        bought: 0,
        totalCastlesBuilt: 0,
        totalCastlesDestroyed: 0,
        totalCastlesWasted: 0,
        currentActive: 0,
        temp: 0,
        totalGlassBuilt: 0,
        totalGlassDestroyed: 0,
      };
    }
  }

  return tools;
}

/**
 * Parse a single boost's save data
 * Returns basic unlocked/bought/power/countdown plus any extra fields
 */
export function parseBoostState(savedValues: string[]): BoostState {
  // Default 4 fields: unlocked, bought, power, countdown
  return {
    unlocked: parseInt(savedValues[0]) || 0,
    bought: parseFloat(savedValues[1]) || 0,
    power: parseFloat(savedValues[2]) || 0,
    countdown: parseFloat(savedValues[3]) || 0,
  };
}

/**
 * Parse all boosts from boosts section
 * @param thread - The boosts save string
 * @param boostAliases - Ordered list of boost aliases (from game data)
 */
export function parseBoosts(
  thread: string,
  boostAliases: string[]
): Record<string, BoostState> {
  const pixels = thread.split(SEMICOLON);
  const boosts: Record<string, BoostState> = {};

  for (let i = 0; i < boostAliases.length && i < pixels.length; i++) {
    const alias = boostAliases[i];
    if (pixels[i]) {
      const fields = pixels[i].split(COMMA);
      boosts[alias] = parseBoostState(fields);
    } else {
      boosts[alias] = {
        unlocked: 0,
        bought: 0,
        power: 0,
        countdown: 0,
      };
    }
  }

  return boosts;
}

/**
 * Parse regular badges (group='badges')
 * @param thread - Badge save string (single characters)
 * @param badgeNames - Ordered list of badge names
 */
export function parseBadges(
  thread: string,
  badgeNames: string[]
): Record<string, boolean> {
  const chars = thread.split('');
  const badges: Record<string, boolean> = {};

  for (let i = 0; i < badgeNames.length; i++) {
    badges[badgeNames[i]] = chars[i] === '1';
  }

  return badges;
}

/**
 * Convert hex digit to 4-bit array
 */
function fromOct(o: number): number[] {
  return [(o & 1) ? 1 : 0, (o & 2) ? 1 : 0, (o & 4) ? 1 : 0, (o & 8) ? 1 : 0];
}

/**
 * Parse other badges (discoveries, monuments, etc.)
 * Uses hex encoding with 4 badges per character
 * @param thread - Hex-encoded badge string
 * @param badgeNames - Ordered list of badge names starting from first non-regular badge
 */
export function parseOtherBadges(
  thread: string,
  badgeNames: string[]
): Record<string, boolean> {
  const chars = thread.split('');
  const badges: Record<string, boolean> = {};
  let badgeIndex = 0;

  for (const char of chars) {
    const bits = fromOct(parseInt(char || '0', 16));
    for (const bit of bits) {
      if (badgeIndex < badgeNames.length) {
        badges[badgeNames[badgeIndex]] = bit === 1;
        badgeIndex++;
      }
    }
  }

  // Fill remaining badges as not earned
  while (badgeIndex < badgeNames.length) {
    badges[badgeNames[badgeIndex]] = false;
    badgeIndex++;
  }

  return badges;
}

/**
 * Parse NP data (dragons) from npdata section
 */
export function parseNPData(
  thread: string,
  version: number
): Record<number, NPData> {
  if (!thread) return {};

  const pixels = thread.split(SEMICOLON);
  if (!pixels[0]) return {};

  const lowest = parseFloat(pixels.shift()!);
  const highest = parseFloat(pixels.shift()!);
  const npData: Record<number, NPData> = {};

  let lastFields: string[] = [];
  let np = lowest;

  // For v4+, use NextLegalNP logic (simplified here as incrementing)
  // For older versions, just increment by 1
  const nextNP = (current: number): number => {
    // Simplified: just increment. Full logic would handle fractional NPs.
    return current + 1;
  };

  while (np <= highest && pixels.length > 0) {
    const pixel = pixels.shift()!;

    if (pixel === '') {
      // Empty entry
      npData[np] = {
        dragonType: 0,
        amount: 0,
        defence: 0,
        attack: 0,
        dig: 0,
      };
    } else if (pixel === 'd') {
      // Duplicate of last
      const fields = lastFields;
      npData[np] = {
        dragonType: parseInt(fields[0]) || 0,
        amount: parseFloat(fields[1]) || 0,
        defence: parseFloat(fields[2]) || 0,
        attack: parseFloat(fields[3]) || 0,
        dig: parseFloat(fields[4]) || 0,
        breath: parseFloat(fields[5]) || 0,
        magic1: parseFloat(fields[6]) || 0,
        magic2: parseFloat(fields[7]) || 0,
        magic3: parseFloat(fields[8]) || 0,
      };
    } else {
      const fields = pixel.split(COMMA);
      lastFields = fields;
      npData[np] = {
        dragonType: parseInt(fields[0]) || 0,
        amount: parseFloat(fields[1]) || 0,
        defence: parseFloat(fields[2]) || 0,
        attack: parseFloat(fields[3]) || 0,
        dig: parseFloat(fields[4]) || 0,
        breath: parseFloat(fields[5]) || 0,
        magic1: parseFloat(fields[6]) || 0,
        magic2: parseFloat(fields[7]) || 0,
        magic3: parseFloat(fields[8]) || 0,
      };
    }

    np = version >= 4 ? nextNP(np) : np + 1;
  }

  return npData;
}

/**
 * Full save parser - converts save string to GameState
 */
export class SaveParser {
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
   * Parse a complete save string into GameState
   */
  parse(saveString: string): GameState {
    const sections = parseSaveSections(saveString);
    const version = sections.version;

    const gamenums = parseGamenums(sections.gamenums, version);
    const sandTools = parseSandTools(sections.sandTools);
    const castleTools = parseCastleTools(sections.castleTools, version);
    const boosts = parseBoosts(sections.boosts, this.boostAliases);
    const regularBadges = parseBadges(sections.badges, this.regularBadgeNames);
    const otherBadges = parseOtherBadges(
      sections.otherBadges,
      this.otherBadgeNames
    );
    const npData = parseNPData(sections.npdata, version);

    // Merge badges
    const badges: Record<string, { earned: boolean }> = {};
    for (const [name, earned] of Object.entries(regularBadges)) {
      badges[name] = { earned };
    }
    for (const [name, earned] of Object.entries(otherBadges)) {
      badges[name] = { earned };
    }

    return {
      version,
      startDate: sections.startDate,
      newpixNumber: gamenums.newpixNumber || 1,
      beachClicks: gamenums.beachClicks || 0,
      ninjaFreeCount: gamenums.ninjaFreeCount || 0,
      ninjaStealth: gamenums.ninjaStealth || 0,
      ninjad: gamenums.ninjad || false,
      saveCount: gamenums.saveCount || 0,
      loadCount: gamenums.loadCount || 0,
      notifsReceived: gamenums.notifsReceived || 0,
      npbONG: gamenums.npbONG || 0,
      lootPerPage: gamenums.lootPerPage || 20,
      largestNPvisited: gamenums.largestNPvisited || { 0: 1 },
      redacted: gamenums.redacted || {
        countup: 0,
        toggle: 0,
        location: 0,
        totalClicks: 0,
        chainCurrent: 0,
        chainMax: 0,
      },
      boosts,
      badges,
      sandTools,
      castleTools,
      npData,
    };
  }
}

/**
 * Create a SaveParser from game data
 */
export function createSaveParser(gameData: {
  boostsById: Array<{ alias: string }>;
  badgesById: Array<{ name: string; group: string }>;
}): SaveParser {
  const boostAliases = gameData.boostsById.map((b) => b.alias);

  // Add virtual resource boosts that store Sand, Castles, GlassChips, GlassBlocks, TF
  // These are appended at the end to not break boost index compatibility
  const virtualResourceBoosts = ['Sand', 'Castles', 'GlassChips', 'GlassBlocks', 'TF'];
  const allBoostAliases = [...boostAliases, ...virtualResourceBoosts];

  const regularBadgeNames = gameData.badgesById
    .filter((b) => b.group === 'badges')
    .map((b) => b.name);
  const otherBadgeNames = gameData.badgesById
    .filter((b) => b.group !== 'badges')
    .map((b) => b.name);

  // Add runtime badges that are defined in badge-conditions but not in gameData
  // These are appended to preserve badge index compatibility with legacy saves
  const runtimeBadges = [
    'Click Ninja',
    'Click Ninja Ninja',
    'Not So Redundant',
    "Don't Litter!",
    'Beachcomber',
  ];
  const allRegularBadgeNames = [...regularBadgeNames, ...runtimeBadges];

  return new SaveParser(allBoostAliases, allRegularBadgeNames, otherBadgeNames);
}
