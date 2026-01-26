/**
 * Dragon System Implementation
 *
 * This module contains dragon and opponent definitions, along with
 * core dragon mechanics like breeding, fledging, and combat.
 *
 * Reference: dragons.js (legacy implementation)
 */

import type {
  DragonDefinition,
  DragonBreathType,
  DragonStatName,
  DragonLiningResource,
  DragonStatResources,
  OpponentDefinition,
  OpponentInstance,
  CombatResult,
  CombatStats,
  NPData,
  DragonQueenState,
  DragonHatchlingsState,
  DragonNestState,
  DragonSystemState,
  DragonOverallState,
} from '../types/game-data.js';

// =============================================================================
// Dragon Definitions
// =============================================================================

/**
 * All dragon species definitions.
 * Reference: dragons.js:50-194 (DefineDragons)
 */
export const DRAGON_DEFINITIONS: DragonDefinition[] = [
  {
    id: 0,
    name: 'Dragling',
    legs: 4,
    wings: 0,
    fly: 0,
    heads: 1,
    arms: 0,
    tails: 1,
    upgrade: { Diamonds: 100 },
    exp: '10K',
    desc: 'These small timid creatures hide in the shadows and under leaves keeping out of the way of fierce cats',
    digbase: 1,
    defbase: 1,
    colour: '#0f0',
  },
  {
    id: 1,
    name: 'DragonNewt',
    legs: 2,
    wings: 0,
    fly: 0,
    heads: 1,
    arms: 2,
    tails: 0,
    upgrade: { Diamonds: '1M' },
    exp: '1T',
    desc: 'These high spirited diminutive dragons stand nearly a Q tall and can wield weapons and spades. They mean well...',
    digbase: 100,
    defbase: 100,
    colour: '#08f',
  },
  {
    id: 2,
    name: 'Wyrm',
    legs: 0,
    wings: 2,
    fly: 1,
    heads: 1,
    arms: 0,
    tails: 1,
    upgrade: { Diamonds: '1G' },
    exp: '1E',
    desc: 'These are monstrous, limbless creatures, with a big bite.',
    digbase: 10000,
    defbase: 100000,
    colour: '#00f',
  },
  {
    id: 3,
    name: 'Wyvern',
    legs: 2,
    wings: 2,
    fly: 1,
    heads: 1,
    arms: 0,
    tails: 1,
    breath: ['fire'],
    upgrade: { Diamonds: '1T' },
    exp: '80Z',
    desc: 'These can fly. They fight and dig with their legs, some have a bad breath.',
    digbase: 1e6,
    defbase: 1e8,
    breathbase: 1,
    colour: '#80f',
  },
  {
    id: 4,
    name: 'Dragon',
    legs: 2,
    wings: 2,
    fly: 1,
    heads: 1,
    arms: 2,
    tails: 1,
    breath: ['fire', 'ice'],
    upgrade: { Diamonds: '1T', Princesses: 1 },
    exp: '160U',
    desc: 'Traditional Welsh Dragon',
    digbase: 1e8,
    defbase: 1e11,
    breathbase: 1e4,
    colour: '#f0f',
  },
  {
    id: 5,
    name: 'Noble Dragon',
    legs: 2,
    wings: 2,
    fly: 1,
    heads: 1,
    arms: 2,
    tails: 1,
    breath: ['fire', 'ice', 'poison'],
    magic: 1,
    upgrade: { Diamonds: '1T', Princesses: 1 },
    exp: '320H',
    desc: 'Very large magical dragon',
    digbase: 1e11,
    defbase: 1e14,
    breathbase: 1e9,
    colour: '#f00',
  },
  {
    id: 6,
    name: 'Imperial Dragon',
    legs: 4,
    wings: 2,
    fly: 1,
    heads: 3,
    arms: 6,
    tails: 3,
    breath: ['fire', 'ice', 'poison', 'special1'],
    magic: 2,
    upgrade: { Diamonds: '1T', Princesses: 1 },
    exp: '1T',
    desc: "These are the makers of legends, attacking with many heads in many ways. Mortals don't want to be in the same universe.",
    digbase: 1e15,
    defbase: 1e17,
    breathbase: 1e16,
    colour: '#800',
  },
  {
    id: 7,
    name: 'NogarDragoN',
    legs: 66,
    wings: 66,
    fly: 1,
    heads: 9,
    arms: 66,
    tails: 9,
    breath: ['fire', 'ice', 'poison', 'special1', 'special2'],
    magic: 3,
    upgrade: { Diamonds: '1T', Princesses: 1 },
    exp: '1T',
    desc: '!',
    digbase: 1e20,
    defbase: 1e20,
    breathbase: 1e25,
    colour: '#8F8',
  },
];

/**
 * Get dragon definition by ID.
 */
export function getDragonById(id: number): DragonDefinition | undefined {
  return DRAGON_DEFINITIONS[id];
}

/**
 * Get dragon definition by name.
 */
export function getDragonByName(name: string): DragonDefinition | undefined {
  return DRAGON_DEFINITIONS.find((d) => d.name === name);
}

/**
 * Generate description text for a dragon.
 * Reference: dragons.js:40-47
 */
export function getDragonDescription(dragon: DragonDefinition, hasLearnedToFly: boolean): string {
  let str = dragon.desc + '. They have: ';
  str += dragon.heads > 1 ? dragon.heads + ' heads, ' : '';
  str += (dragon.legs ? dragon.legs : 'No') + ' legs, ';
  str += (dragon.arms ? dragon.arms : 'No') + ' arms, ';
  str += (dragon.wings ? dragon.wings : 'No') + ' wings';
  str +=
    ' and ' + (dragon.tails === 0 ? 'no tail.' : dragon.tails === 1 ? 'a tail.' : dragon.tails + ' tails.');
  if (dragon.wings && !hasLearnedToFly) {
    str += ' However, they have not yet learnt how to fly.';
  }
  return str;
}

// =============================================================================
// Dragon Stat Properties
// =============================================================================

/**
 * Dragon stat names in order.
 * Reference: boosts.js:8094
 */
export const DRAGON_STATS: DragonStatName[] = [
  'offence',
  'defence',
  'digging',
  'breath',
  'magic1',
  'magic2',
  'magic3',
];

/**
 * Resources that affect each dragon stat via nest lining.
 * Reference: boosts.js:8095-8098
 */
export const DRAGON_STAT_RESOURCES: DragonStatResources[] = [
  { stat: 'offence', resources: ['Sand', 'Castles'] },
  { stat: 'defence', resources: ['GlassChips', 'GlassBlocks'] },
  { stat: 'digging', resources: ['Blackprints', 'FluxCrystals'] },
  { stat: 'breath', resources: ['Goats', 'Bonemeal'] },
  { stat: 'magic1', resources: ['Mustard', 'Vacuum'] },
  { stat: 'magic2', resources: ['Mustard', 'Vacuum'] },
  { stat: 'magic3', resources: ['Mustard', 'Vacuum'] },
];

// =============================================================================
// Opponent Definitions
// =============================================================================

/**
 * All opponent definitions for dragon combat.
 * Reference: dragons.js:297-402 (DefineOpponents)
 */
export const OPPONENT_DEFINITIONS: OpponentDefinition[] = [
  {
    id: 0,
    name: 'Serf',
    armed: ['stick', '-bare hands', 'turnip', '-bad words', 'bowl of dish water', '|hamply', 'fish head'],
    reward: { Copper: '1-10', Thing: 0.2 },
    exp: 1,
  },
  {
    id: 1,
    name: 'Peasant',
    armed: [
      'scythe',
      'pitchfork',
      'hammer',
      'knife',
      'club',
      'spade',
      'dung fork',
      'chair leg',
      'bone',
      'rock',
      'pun',
      '|wolfy',
    ],
    reward: { Copper: '10-1000', Thing: 0.25 },
    exp: '1K',
  },
  {
    id: 2,
    name: 'Page',
    armed: ['dagger', 'staff', 'nice cup of tea', 'stiletto', 'buckler', 'spear', 'crossbow', '-puns'],
    reward: { Silver: '1-100', Thing: 0.3 },
    exp: '1M',
  },
  {
    id: 3,
    name: 'Squire',
    armed: [
      'short sword',
      'side sword',
      'bow and arrows',
      'mace',
      'mandolin',
      'polearm',
      '!axe',
      'hammer',
      '|keyboard',
    ],
    reward: { Silver: '100-10000', Diamonds: 0.5, Thing: 0.35 },
    exp: '1G',
  },
  {
    id: 4,
    name: 'Knight',
    armed: ['long sword', '|arming sword', 'battle axe', 'morning star', 'lance'],
    reward: { Gold: '10-1000', Diamonds: '1-5', Thing: 0.4 },
    exp: '1T',
  },
  {
    id: 5,
    name: 'Baron',
    armed: ['bastard sword', 'flaming sword', 'hailstorm', 'tax demand'],
    reward: { Gold: '1K-1M', Diamonds: '1-50', Thing: 0.45 },
    exp: '1P',
  },
  {
    id: 6,
    name: 'Lord',
    armed: ['great sword', 'great axe', 'kazoo', 'court jester', 'fire hose'],
    reward: { Gold: '100K-1G', Princesses: 0.05, Diamonds: '50-50K', Thing: 0.5 },
    exp: '1E',
  },
  {
    id: 7,
    name: 'Duke',
    armed: ['+Duchess', 'horde of servants', '+gardeners', 'whip'],
    reward: { Gold: '1M-1T', Princesses: 0.5, Diamonds: '50K-60M', Thing: 0.55 },
    exp: '1Z',
  },
  {
    id: 8,
    name: 'Emperor',
    armed: [
      '+staff of office',
      'holy orb',
      '+Imperial Guard',
      '-Kamakazi Teddy Bears',
      '!ICBM',
      '+Storm Troopers',
      'Death Star',
    ],
    reward: { Gold: '10M-1E', Princesses: '1-10', Diamonds: '60M-80G', Thing: 0.6 },
    exp: '1Y',
  },
  {
    id: 9,
    name: 'Paladin',
    armed: ['+Dragon slaying sword', 'Holy hand grenade', 'lot of bad puns', '+Sword of the isles'],
    reward: { Gold: '100M-1Z', Princesses: '10-10K', Diamonds: '70G-100T', Thing: 0.65 },
    exp: '1U',
  },
  {
    id: 10,
    name: 'Hero',
    armed: ['+sword of sharpness', '-Eds Axe', '+Punsaw', 'Donut', '-both feet', 'pea shooter', '|fist of steel'],
    reward: { Gold: '1G-1Y', Princesses: '100-10M', Diamonds: '80T-120P', Thing: 0.7 },
    exp: '1F',
  },
  {
    id: 11,
    name: 'Demi-god',
    armed: ['pen (mightier than the sword)', 'cleaving axe', 'pitch fork', 'balloon'],
    reward: { Gold: '10G-1U', Princesses: '1K-10G', Diamonds: '90P-150E', Thing: 0.75 },
    exp: '1W',
  },
  {
    id: 12,
    name: 'Superhero',
    armed: ['-bare hands', 'turnip', 'bazooka', '+Imperial Dragon Banishing Sword', '+Great Cleaver'],
    reward: { Gold: '1T-1S', Princesses: '1M-10P', Diamonds: '100E-200Z', Thing: 0.8 },
    exp: '1GW',
  },
  {
    id: 13,
    name: 'God',
    armed: ['+staff of might', '+staff of command', '-dice', '|holy symbol', '|lightning strikes'],
    reward: { Gold: '10P-1F', Princesses: '1G-10Y', Diamonds: '120Z-500Y', Thing: 0.85 },
    exp: '1UW',
  },
  {
    id: 14,
    name: 'Pantheon of Gods',
    armed: ['-myths and legends', '!army', 'flock of unicorns', '-heresey', '503', '-logic', '-typos'],
    reward: { Gold: '10E-1W', Princesses: '1T-10L', Diamonds: '200Y-1S', Thing: 0.99 },
    exp: '1WW',
  },
];

/**
 * Get opponent definition by ID.
 */
export function getOpponentById(id: number): OpponentDefinition | undefined {
  return OPPONENT_DEFINITIONS[id];
}

/**
 * Get opponent definition by name.
 */
export function getOpponentByName(name: string): OpponentDefinition | undefined {
  return OPPONENT_DEFINITIONS.find((o) => o.name === name);
}

// =============================================================================
// Opponent Attack Text Generation
// =============================================================================

/**
 * Generate attack description text for an opponent.
 * Reference: dragons.js:208-237 (attackstxt)
 *
 * @param opponent - The opponent definition
 * @param instance - The combat instance
 * @param fromNP - Optional source NP if different from target
 */
export function getOpponentAttackText(
  opponent: OpponentDefinition,
  instance: OpponentInstance,
  fromNP?: number
): string {
  const n = instance.numb;
  let str = '' + (n && n > 1 ? formatNumber(n) : 'A') + ' ' + opponent.name;

  if (n > 1) {
    str += 's' + (fromNP !== undefined ? ' from NP' + fromNP : '') + ' each';
  } else if (fromNP !== undefined) {
    str += ' from NP' + fromNP;
  }

  str += instance.modifier > 1 ? ' defensively' : ' offensively';
  str += ' armed ';

  const weapon = randomChoice(opponent.armed);
  const first = weapon.charAt(0);
  const rest = weapon.substring(1);

  switch (first) {
    case '+':
      str += n && n > 1 ? 'by the ' : 'with the ';
      break;
    case '-':
      str += 'with ';
      break;
    case '!':
      str += 'with an ';
      break;
    case '|':
      str += 'with ' + (n && n > 1 ? 'their ' : ['his ', 'her '][instance.gender]);
      break;
    default:
      str += 'with a ' + first;
      break;
  }
  str += rest;

  return str;
}

// =============================================================================
// Combat Calculations
// =============================================================================

/**
 * Calculate opponent attack values [physical, magical].
 * Reference: dragons.js:239-242
 */
export function calculateOpponentAttack(opponent: OpponentDefinition, count: number, npLocation: number): [number, number] {
  const physical = (Math.pow(42, Math.exp(opponent.id / 2)) * count) / 1234;
  let magical = (Math.pow(777, Math.exp(opponent.id - 10)) * count) / 1764;

  // Pantheon of Gods gets location bonus
  if (opponent.name === 'Pantheon of Gods') {
    magical *= Math.pow(1.5, npLocation - 2100);
  }

  return [physical, magical];
}

/**
 * Parse experience string to number.
 * Reference: dragons.js:291-293
 */
export function parseExperience(exp: number | string): number {
  if (typeof exp === 'number') return exp;
  return demolpify(exp);
}

/**
 * Calculate blitz value affecting combat outcome.
 * Reference: dragons.js:1250-1254
 */
export function calculateBlitzValue(attack: number, defence: number): number {
  let ratio = Math.log10(attack / defence) * 0.11;
  ratio = Math.max(Math.min(ratio, 0.66), -0.66) || 0;
  return ratio;
}

/**
 * Find opponents for a given NP.
 * Reference: dragons.js:816-824
 */
export function findOpponents(
  fromNP: number,
  totalDragons: number,
  highestNPwithDragons: number,
  princessLevel: number
): OpponentInstance {
  const from = Math.floor(fromNP);
  const type = Math.min(Math.floor(from / 150), OPPONENT_DEFINITIONS.length - 1);

  let numb: number;
  if (totalDragons < 10 && highestNPwithDragons < 20) {
    numb = 1;
  } else {
    const baseNumb = (from - type * 150) / 30;
    const princessBonus =
      Math.floor(from / 150) < Math.floor((highestNPwithDragons + 1) / 150)
        ? Math.pow(princessLevel / Math.pow(100, type - 6), 1 / 3)
        : 0;
    numb = Math.floor((baseNumb + princessBonus) * Math.random() + 1);
  }

  return {
    from,
    type,
    numb,
    gender: Math.random() < 0.5 ? 0 : 1,
    modifier: Math.random() + 0.5,
  };
}

// =============================================================================
// Dragon State Initialization
// =============================================================================

/**
 * Create initial Dragon Queen state.
 */
export function createInitialQueenState(): DragonQueenState {
  return {
    Level: 0,
    overallState: 0,
    countdown: 0,
    totalfights: 0,
    breathfights: 0,
    finds: 0,
    totalloses: 0,
  };
}

/**
 * Create initial hatchlings state.
 */
export function createInitialHatchlingsState(): DragonHatchlingsState {
  return {
    clutches: [],
    properties: [],
    diet: [],
    maturity: [],
  };
}

/**
 * Create initial nest state with default lining.
 */
export function createInitialNestState(): DragonNestState {
  // Default: 50% Sand/Castles (offence), 50% GlassChips/Blocks (defence)
  const lining: Record<DragonLiningResource, number> = {
    Sand: 25,
    Castles: 25,
    GlassChips: 25,
    GlassBlocks: 25,
    Blackprints: 0,
    FluxCrystals: 0,
    Goats: 0,
    Bonemeal: 0,
    Mustard: 0,
    Vacuum: 0,
  };
  return { lining };
}

/**
 * Create initial dragon system state.
 */
export function createInitialDragonSystemState(): DragonSystemState {
  return {
    npData: new Map(),
    queen: createInitialQueenState(),
    hatchlings: createInitialHatchlingsState(),
    nest: createInitialNestState(),

    totalDragons: 0,
    totalNPsWithDragons: 0,
    highestNPwithDragons: 0,
    consecutiveNPsWithDragons: 0,

    digMultiplier: 10,
    attackMultiplier: 1,
    defenceMultiplier: 1,
    breathMultiplier: 1,
    luck: 0,
    hideMod: 0,

    digValue: 0,
    digRate: 0,
    digTime: 0,
    diggingFinds: {},
    recalcNeeded: true,
  };
}

/**
 * Calculate nest properties based on lining percentages.
 * Reference: boosts.js:8165-8211 (nestprops calculation)
 *
 * @param nest - The nest state with lining percentages
 * @returns Array of 7 stat values [offence, defence, digging, breath, magic1, magic2, magic3]
 */
export function calculateNestProperties(nest: DragonNestState): number[] {
  const props: number[] = [];

  for (const statRes of DRAGON_STAT_RESOURCES) {
    let value = 0;
    for (const resource of statRes.resources) {
      value += nest.lining[resource] || 0;
    }
    // Normalize to 0-1 range and add some base value
    props.push(value / 100 + 0.001);
  }

  return props;
}

/**
 * Maximum dragons allowed at a given NP.
 * Reference: dragons.js:675-678
 */
export function maxDragonsAtNP(npNumber: number): number {
  if (npNumber < 0) return npNumber; // Negative NP = negative limit (no dragons)
  return 1 + Math.floor(npNumber / 100);
}

// =============================================================================
// Dragon Multiplier Recalculation
// =============================================================================

/**
 * Boost ownership state for dragon multiplier calculations.
 */
export interface DragonBoostState {
  // Digging multiplier boosts
  hasBucketAndSpade: boolean;
  hasStrengthPotion: boolean;
  strengthPotionPower: number;
  hasGoldenBull: boolean;

  // Defence multiplier boosts
  hasHealingPotion: boolean;
  healingPotionPower: number;
  hasOohShiny: boolean;
  goldLevel: number;
  hasClannesque: boolean;
  cryogenicsLevel: number;
  hasSpines: boolean;
  spinesLevel: number;
  hasAdamantineArmour: boolean;
  adamantineArmourLevel: number;
  hasMirrorScales: boolean;
  mirrorScalesLevel: number;
  hasBaobabTreeFort: boolean;
  hasWotT: boolean;

  // Attack multiplier boosts
  hasBigTeeth: boolean;
  bigTeethLevel: number;
  hasMagicTeeth: boolean;
  magicTeethLevel: number;
  hasTusks: boolean;
  tusksLevel: number;
  hasBigBite: boolean;
  bigBiteLevel: number;
  hasDoubleByte: boolean;
  doubleByteLevel: number;
  hasTrilobite: boolean;
  trilobiteLevel: number;
  hasDiamondDentures: boolean;
  hasWotP: boolean;

  // Breath multiplier boosts
  hasAutumnOfMatriarch: boolean;
  dqTotalLoses: number;
  hasMQALLOBS: boolean;
  catalyzerPower: number;

  // Luck boosts
  hasLuckyRing: boolean;
  hasCupOfTea: boolean;
  cupOfTeaPower: number;

  // Hide modifier
  hasChintzyTiara: boolean;
}

/**
 * Result of dragon multiplier recalculation.
 */
export interface DragonMultipliers {
  digMultiplier: number;
  attackMultiplier: number;
  defenceMultiplier: number;
  breathMultiplier: number;
  luck: number;
  hideMod: number;
}

/**
 * Calculate dragon multipliers from boost state.
 * Reference: dragons.js:467-506 (DragonDigRecalc multiplier section)
 */
export function calculateDragonMultipliers(boosts: DragonBoostState): DragonMultipliers {
  // Digging multiplier (base 10)
  let digMultiplier = 10;
  if (boosts.hasBucketAndSpade) digMultiplier *= 2;
  if (boosts.hasStrengthPotion && boosts.strengthPotionPower >= 2) {
    digMultiplier *= 2 + boosts.strengthPotionPower;
  }
  if (boosts.hasGoldenBull) digMultiplier *= 5;

  // Defence multiplier
  let defenceMultiplier = 1;
  if (boosts.hasHealingPotion && boosts.healingPotionPower >= 2) {
    defenceMultiplier *= 1.5 * (1 + boosts.healingPotionPower);
  }
  if (boosts.hasOohShiny && boosts.goldLevel > 0) {
    defenceMultiplier *= 1 + Math.log(boosts.goldLevel);
  }
  if (boosts.hasClannesque && boosts.cryogenicsLevel > 0) {
    defenceMultiplier *= 1 + Math.log(boosts.cryogenicsLevel);
  }
  if (boosts.hasSpines) {
    defenceMultiplier *= Math.pow(1.2, boosts.spinesLevel);
  }
  if (boosts.hasAdamantineArmour) {
    defenceMultiplier *= Math.pow(2, boosts.adamantineArmourLevel);
  }
  if (boosts.hasMirrorScales) {
    defenceMultiplier *= Math.pow(4, boosts.mirrorScalesLevel);
  }
  if (boosts.hasBaobabTreeFort) defenceMultiplier *= 4;
  if (boosts.hasWotT) defenceMultiplier *= 100;

  // Attack multiplier
  let attackMultiplier = 1;
  if (boosts.hasBigTeeth) {
    attackMultiplier *= Math.pow(1.2, boosts.bigTeethLevel);
  }
  if (boosts.hasMagicTeeth) {
    attackMultiplier *= Math.pow(10, boosts.magicTeethLevel);
  }
  if (boosts.hasTusks) {
    attackMultiplier *= Math.pow(2, boosts.tusksLevel);
  }
  if (boosts.hasBigBite) {
    attackMultiplier *= Math.pow(1.5, boosts.bigBiteLevel);
  }
  if (boosts.hasDoubleByte) {
    attackMultiplier *= Math.pow(2, boosts.doubleByteLevel);
  }
  if (boosts.hasTrilobite) {
    attackMultiplier *= Math.pow(4, boosts.trilobiteLevel);
  }
  if (boosts.hasDiamondDentures) attackMultiplier *= 2;
  if (boosts.hasWotP) attackMultiplier *= 100;

  // Breath multiplier
  let breathMultiplier = 1;
  if (boosts.hasAutumnOfMatriarch && boosts.dqTotalLoses > 0) {
    breathMultiplier *= boosts.dqTotalLoses;
  }
  if (boosts.hasMQALLOBS) breathMultiplier *= 10;
  if (boosts.catalyzerPower > 0) {
    breathMultiplier *= boosts.catalyzerPower;
  }

  // Luck
  let luck = 0;
  if (boosts.hasLuckyRing) luck += 0.0277;
  if (boosts.hasCupOfTea && boosts.cupOfTeaPower >= 2) {
    luck += 0.0005 * (1 + boosts.cupOfTeaPower);
  }

  // Hide modifier
  let hideMod = 0;
  if (boosts.hasChintzyTiara) hideMod += 22;

  return {
    digMultiplier,
    attackMultiplier,
    defenceMultiplier,
    breathMultiplier,
    luck,
    hideMod,
  };
}

/**
 * Result of dragon aggregate calculation.
 */
export interface DragonAggregates {
  totalDragons: number;
  totalNPsWithDragons: number;
  highestNPwithDragons: number;
  consecutiveNPsWithDragons: number;
  rawDigValue: number;
}

/**
 * Calculate aggregate dragon statistics from NPData.
 * Reference: dragons.js:510-537
 */
export function calculateDragonAggregates(npData: Map<number, NPData>): DragonAggregates {
  let totalDragons = 0;
  let totalNPsWithDragons = 0;
  let highestNPwithDragons = 0;
  let consecutiveNPsWithDragons = 0;
  let rawDigValue = 0;

  let runLength = 0;
  let lastNP = 0;

  // Sort NP keys for consecutive calculation
  const npKeys = Array.from(npData.keys()).sort((a, b) => a - b);

  for (const np of npKeys) {
    const data = npData.get(np);
    if (data && data.amount > 0) {
      // Get dragon definition for digbase
      const dragon = getDragonById(data.dragonType);
      const digbase = dragon?.digbase ?? 1;

      rawDigValue += data.amount * data.dig * digbase;
      totalNPsWithDragons++;
      totalDragons += data.amount;

      if (np > highestNPwithDragons) {
        highestNPwithDragons = np;
      }

      // Track consecutive NPs
      runLength++;
      if (lastNP + 1 === np) {
        if (runLength > consecutiveNPsWithDragons) {
          consecutiveNPsWithDragons = runLength;
        }
      } else {
        runLength = 1;
      }
      lastNP = np;
    } else {
      lastNP = 0;
      runLength = 0;
    }
  }

  // Add small base value if any dragons exist
  if (totalDragons > 0) {
    rawDigValue += 0.001;
  }

  return {
    totalDragons,
    totalNPsWithDragons,
    highestNPwithDragons,
    consecutiveNPsWithDragons,
    rawDigValue,
  };
}

/**
 * Calculate final dig rate from multipliers and aggregates.
 * Reference: dragons.js:539-540
 */
export function calculateDragonDigRate(
  rawDigValue: number,
  digMultiplier: number,
  highestNPwithDragons: number
): number {
  // Apply location-based multiplier
  const locationMultiplier = Math.exp(1 + highestNPwithDragons / 365) / Math.E;
  return rawDigValue * digMultiplier * locationMultiplier;
}

/**
 * Get boosts to unlock based on consecutive NPs with dragons.
 * Reference: dragons.js:542-546
 */
export function getConsecutiveDragonUnlocks(consecutive: number): string[] {
  const unlocks: string[] = [];
  if (consecutive >= 10) unlocks.push('Incubator');
  if (consecutive >= 22) unlocks.push('Wait for it');
  if (consecutive >= 48) unlocks.push('Q04B');
  if (consecutive >= 99) unlocks.push('Cryogenics');
  if (consecutive >= 901) unlocks.push('Dragon Breath');
  return unlocks;
}

/**
 * Perform full dragon system recalculation.
 * Updates the dragon system state with recalculated values.
 * Reference: dragons.js:467-550
 */
export function recalculateDragonSystem(
  state: DragonSystemState,
  boosts: DragonBoostState
): string[] {
  // Calculate multipliers from boost state
  const multipliers = calculateDragonMultipliers(boosts);
  state.digMultiplier = multipliers.digMultiplier;
  state.attackMultiplier = multipliers.attackMultiplier;
  state.defenceMultiplier = multipliers.defenceMultiplier;
  state.breathMultiplier = multipliers.breathMultiplier;
  state.luck = multipliers.luck;
  state.hideMod = multipliers.hideMod;

  // Calculate aggregate statistics
  const aggregates = calculateDragonAggregates(state.npData);
  state.totalDragons = aggregates.totalDragons;
  state.totalNPsWithDragons = aggregates.totalNPsWithDragons;
  state.highestNPwithDragons = aggregates.highestNPwithDragons;
  state.consecutiveNPsWithDragons = aggregates.consecutiveNPsWithDragons;

  // Calculate final dig rate
  state.digRate = calculateDragonDigRate(
    aggregates.rawDigValue,
    state.digMultiplier,
    state.highestNPwithDragons
  );

  // Mark recalculation complete
  state.recalcNeeded = false;

  // Return boosts to unlock
  return getConsecutiveDragonUnlocks(state.consecutiveNPsWithDragons);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Simple number formatter (placeholder - should use actual Molpify).
 */
function formatNumber(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

/**
 * Parse number string with suffix (placeholder - should use actual DeMolpify).
 */
function demolpify(s: string): number {
  const suffixes: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    G: 1e9,
    T: 1e12,
    P: 1e15,
    E: 1e18,
    Z: 1e21,
    Y: 1e24,
    U: 1e27,
    F: 1e30,
    W: 1e33,
    S: 1e36,
    L: 1e39,
    H: 1e42,
    GW: 1e36,
    UW: 1e60,
    WW: 1e66,
  };

  // Check for compound suffixes first (GW, UW, WW)
  for (const [suffix, mult] of Object.entries(suffixes)) {
    if (s.endsWith(suffix)) {
      const num = parseFloat(s.slice(0, -suffix.length));
      return num * mult;
    }
  }

  return parseFloat(s);
}

/**
 * Random choice from array.
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =============================================================================
// Exports for Dragon Reward Items
// =============================================================================

/**
 * List of boost aliases that can be found as dragon rewards.
 * Reference: dragons.js:653-671 (Molpy.FindThings and DragonRewardOptions)
 * These are boosts with a 'draglvl' property that can be unlocked via digging.
 */
export const DRAGON_REWARD_BOOSTS: string[] = [
  'Lucky Ring',
  'Cup of Tea',
  'Healing Potion',
  'Strength Potion',
  'Bucket and Spade',
  'Golden Bull',
  'Ooh, Shiny!',
  'Big Teeth',
  'Tusks',
  'Big Bite',
  'Double Byte',
  'Trilobite',
  'Spines',
  'Cut Diamonds',
  'Sparkle',
  'Camelflarge',
  'Adamantine Armour',
  'Mirror Scales',
  'Diamond Dentures',
  'Baobab Tree Fort',
  'Incubator',
  'Wait for it',
  'Magic Teeth',
  'Mouthwash',
  'Ethyl Alcohol',
  'Topiary',
  'Robotic Hatcher',
  'Seacoal',
  'Sea Mining',
  'Tuple or Nothing',
  'Shades',
  'Dragonfly',
  'Dragon Breath',
  'Beach Dragon',
  'Dragon Overview',
  'Woolly Jumper',
  'Chintzy Tiara',
  'Clannesque',
  'Autumn of the Matriarch',
  'Honor Among Serpents',
  'WotT',
  'WotP',
  'MQALLOBS',
  'Catalyzer',
  'Annilment',
  'Ventus Vehemens',
  'Cryogenics',
  'Q04B',
];

// =============================================================================
// Dragon Digging
// =============================================================================

/**
 * Type of dig action.
 */
export type DigType = 'mnp' | 'beach';

/**
 * Result of a single dig action.
 */
export interface DigResult {
  /** Resource found */
  resource: 'Gold' | 'Coal' | 'Diamonds' | null;

  /** Amount found */
  amount: number;

  /** Whether this triggered a badge */
  earnedBadge: string | null;

  /** Whether to unlock Beach Dragon */
  unlockBeachDragon: boolean;
}

/**
 * Boost state for digging calculations.
 */
export interface DragonDiggingBoostState {
  hasShades: boolean;
  hasCutDiamonds: boolean;
  hasSparkle: boolean;
  hasSeacoal: boolean;
  hasSeaMining: boolean;
  seaMiningPower: number;
}

/**
 * Calculate dig progress for a single dig action.
 * Reference: dragons.js:588-593
 *
 * @param type - Type of dig (mnp or beach)
 * @param state - Dragon system state
 * @param boosts - Digging boost state
 * @returns Amount added to digValue
 */
export function calculateDigProgress(
  type: DigType,
  state: DragonSystemState,
  boosts: DragonDiggingBoostState
): number {
  let add: number;

  if (type === 'beach') {
    // Beach click uses different formula
    add = state.totalNPsWithDragons * (1 + state.queen.Level);
    if (boosts.hasShades) {
      add = add * add;
    }
  } else {
    // Normal mNP dig uses dig rate
    add = state.digRate;
  }

  // Add randomness
  return add * Math.random();
}

/**
 * Determine what was found from digging.
 * Reference: dragons.js:601-616
 *
 * @param finds - Number of finds (floor of digValue)
 * @param dqLevel - Dragon Queen level
 * @param boosts - Digging boost state
 * @param consecutiveNPs - Consecutive NPs with dragons
 * @returns Dig result
 */
export function determineDigFind(
  finds: number,
  dqLevel: number,
  boosts: DragonDiggingBoostState,
  consecutiveNPs: number
): DigResult {
  let resource: 'Gold' | 'Coal' | 'Diamonds' | null = null;
  let amount = 0;
  let earnedBadge: string | null = null;

  // 50% chance for coins, or high chance based on find count
  if (Math.random() < 0.5 || Math.random() < 0.99 / Math.log(finds + 0.7)) {
    // Find Gold (as copper/silver fractional gold)
    resource = 'Gold';
    amount = finds / 1000000;
  } else if (dqLevel > 1 && Math.random() < dqLevel / 999) {
    // Find Coal (rare, requires DQ level > 1)
    resource = 'Coal';
    amount = Math.max(Math.floor(Math.log(finds) - 1000), 1);
  } else {
    // Find Diamonds
    resource = 'Diamonds';
    amount = boosts.hasCutDiamonds
      ? Math.max(finds / 222222, Math.log(finds))
      : Math.log(finds);

    if (boosts.hasSparkle) {
      amount *= Math.pow(1.01, consecutiveNPs);
    }

    amount = Math.max(Math.floor(amount), 1);
    earnedBadge = 'Wheee Diamonds';
  }

  return {
    resource,
    amount,
    earnedBadge,
    unlockBeachDragon: false, // Set by caller after tracking finds
  };
}

/**
 * Process a dragon dig action.
 * Reference: dragons.js:552-651
 *
 * @param type - Type of dig (mnp or beach)
 * @param state - Dragon system state (mutated)
 * @param boosts - Digging boost state
 * @returns Dig result or null if no find
 */
export function processDragonDig(
  type: DigType,
  state: DragonSystemState,
  boosts: DragonDiggingBoostState
): DigResult | null {
  // Check if digging is possible
  if (state.digRate === 0 && !state.recalcNeeded) {
    return null;
  }
  if (state.queen.overallState !== 0) {
    // Dragons are recovering/hiding/celebrating, not digging
    return null;
  }

  // Add progress
  const progress = calculateDigProgress(type, state, boosts);
  state.digValue += progress;

  // Check if we found anything
  if (state.digValue < 1) {
    return null;
  }

  // Calculate finds
  const finds = Math.max(Math.floor(state.digValue), 1);
  state.digValue -= finds;

  // Determine what was found
  const result = determineDigFind(
    finds,
    state.queen.Level,
    boosts,
    state.consecutiveNPsWithDragons
  );

  // Track finds
  if (result.resource) {
    state.queen.finds++;

    // Accumulate in digging finds for batched notification
    if (state.diggingFinds[result.resource]) {
      state.diggingFinds[result.resource] += result.amount;
    } else {
      state.diggingFinds[result.resource] = result.amount;
    }

    // Check for Beach Dragon unlock
    if (state.queen.finds > 20) {
      result.unlockBeachDragon = true;
    }
  }

  // Handle Seacoal bonus for beach clicks
  if (type === 'beach' && boosts.hasSeacoal) {
    if (state.diggingFinds['Coal']) {
      state.diggingFinds['Coal'] += 1;
    } else {
      state.diggingFinds['Coal'] = 1;
    }
  }

  // Handle Sea Mining bonus for beach clicks
  if (type === 'beach' && boosts.hasSeaMining && boosts.seaMiningPower > 0) {
    if (state.diggingFinds['Coal']) {
      state.diggingFinds['Coal'] += boosts.seaMiningPower;
    } else {
      state.diggingFinds['Coal'] = boosts.seaMiningPower;
    }
  }

  // Increment dig time counter
  state.digTime++;

  return result;
}

/**
 * Check if it's time to clear and report digging finds.
 * Reference: dragons.js:555-585
 *
 * @param state - Dragon system state
 * @returns The finds to report, or null if not time yet
 */
export function checkDiggingNotification(
  state: DragonSystemState
): Record<string, number> | null {
  if (state.digTime <= 100) {
    return null;
  }

  // Time to report
  const finds = { ...state.diggingFinds };
  state.digTime = 0;
  state.diggingFinds = {};

  return Object.keys(finds).length > 0 ? finds : null;
}
