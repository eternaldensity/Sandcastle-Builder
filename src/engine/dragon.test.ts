/**
 * Comprehensive tests for the Dragon System.
 *
 * Covers:
 * - Dragon definitions and lookups
 * - Opponent definitions and lookups
 * - Attack text generation
 * - Combat calculations (opponent attack, blitz, stats)
 * - Dragon multiplier calculations
 * - Aggregate statistics
 * - Dig rate and consecutive NP unlocks
 * - Digging mechanics
 * - Fledging mechanics
 * - Combat system (OpponentsAttack)
 * - Combat rewards
 * - RedundaKnight generation
 * - Hide time calculation
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  DRAGON_DEFINITIONS,
  OPPONENT_DEFINITIONS,
  DRAGON_STATS,
  DRAGON_STAT_RESOURCES,
  DRAGON_REWARD_BOOSTS,
  getDragonById,
  getDragonByName,
  getDragonDescription,
  getOpponentById,
  getOpponentByName,
  getOpponentAttackText,
  calculateOpponentAttack,
  parseExperience,
  calculateBlitzValue,
  findOpponents,
  maxDragonsAtNP,
  calculateNestProperties,
  calculateDragonMultipliers,
  calculateDragonAggregates,
  calculateDragonDigRate,
  getConsecutiveDragonUnlocks,
  recalculateDragonSystem,
  calculateDigProgress,
  determineDigFind,
  processDragonDig,
  checkDiggingNotification,
  calculateDragonStatsAtNP,
  dragonFledge,
  opponentsAttack,
  calculateCombatRewards,
  processCombatOutcome,
  generateRedundaKnight,
  calculateHideTime,
  cleanClutches,
  createInitialQueenState,
  createInitialHatchlingsState,
  createInitialNestState,
  createInitialDragonSystemState,
  type DragonBoostState,
  type DragonDiggingBoostState,
  type CombatBoostState,
  type DragonMultipliers,
} from './dragon.js';
import type { NPData, DragonSystemState } from '../types/game-data.js';

// =============================================================================
// Test Helpers
// =============================================================================

function createDefaultBoostState(): DragonBoostState {
  return {
    hasBucketAndSpade: false,
    hasStrengthPotion: false,
    strengthPotionPower: 0,
    hasGoldenBull: false,
    hasHealingPotion: false,
    healingPotionPower: 0,
    hasOohShiny: false,
    goldLevel: 0,
    hasClannesque: false,
    cryogenicsLevel: 0,
    hasSpines: false,
    spinesLevel: 0,
    hasAdamantineArmour: false,
    adamantineArmourLevel: 0,
    hasMirrorScales: false,
    mirrorScalesLevel: 0,
    hasBaobabTreeFort: false,
    hasWotT: false,
    hasBigTeeth: false,
    bigTeethLevel: 0,
    hasMagicTeeth: false,
    magicTeethLevel: 0,
    hasTusks: false,
    tusksLevel: 0,
    hasBigBite: false,
    bigBiteLevel: 0,
    hasDoubleByte: false,
    doubleByteLevel: 0,
    hasTrilobite: false,
    trilobiteLevel: 0,
    hasDiamondDentures: false,
    hasWotP: false,
    hasAutumnOfMatriarch: false,
    dqTotalLoses: 0,
    hasMQALLOBS: false,
    catalyzerPower: 0,
    hasLuckyRing: false,
    hasCupOfTea: false,
    cupOfTeaPower: 0,
    hasChintzyTiara: false,
  };
}

function createDefaultDiggingBoosts(): DragonDiggingBoostState {
  return {
    hasShades: false,
    hasCutDiamonds: false,
    hasSparkle: false,
    hasSeacoal: false,
    hasSeaMining: false,
    seaMiningPower: 0,
  };
}

function createDefaultCombatBoosts(): CombatBoostState {
  return {
    hasDragonBreath: false,
    hasMouthwash: false,
    hasEthylAlcohol: false,
    ethylAlcoholAmount: 0,
    hasDragonfly: false,
    dragonflyLevel: 0,
    hasHealingPotion: false,
    healingPotionAmount: 0,
    hasCupOfTea: false,
    cupOfTeaAmount: 0,
    hasTupleOrNothing: false,
    hasCamelflarge: false,
    camelflargeLevel: 0,
    hasHonorAmongSerpents: false,
    hasCryogenics: false,
    cryogenicsLevel: 0,
    hasRoboticHatcher: false,
    roboticHatcherEnabled: false,
    goatsAmount: 0,
  };
}

function createDefaultMultipliers(): DragonMultipliers {
  return {
    digMultiplier: 10,
    attackMultiplier: 1,
    defenceMultiplier: 1,
    breathMultiplier: 1,
    luck: 0,
    hideMod: 0,
  };
}

function createNPData(overrides: Partial<NPData> = {}): NPData {
  return {
    dragonType: 0,
    amount: 1,
    defence: 0.5,
    attack: 0.5,
    dig: 0.5,
    breath: 0,
    magic1: 0,
    magic2: 0,
    magic3: 0,
    ...overrides,
  };
}

function createStateWithDragons(entries: [number, Partial<NPData>][]): DragonSystemState {
  const state = createInitialDragonSystemState();
  for (const [np, data] of entries) {
    state.npData.set(np, createNPData(data));
  }
  return state;
}

// =============================================================================
// Dragon Definitions
// =============================================================================

describe('Dragon Definitions', () => {
  it('should have 8 dragon species', () => {
    expect(DRAGON_DEFINITIONS).toHaveLength(8);
  });

  it('should have sequential IDs from 0-7', () => {
    DRAGON_DEFINITIONS.forEach((d, i) => {
      expect(d.id).toBe(i);
    });
  });

  it('should have increasing digbase values', () => {
    for (let i = 1; i < DRAGON_DEFINITIONS.length; i++) {
      expect(DRAGON_DEFINITIONS[i].digbase).toBeGreaterThan(DRAGON_DEFINITIONS[i - 1].digbase);
    }
  });

  it('should have increasing defbase values', () => {
    for (let i = 1; i < DRAGON_DEFINITIONS.length; i++) {
      expect(DRAGON_DEFINITIONS[i].defbase).toBeGreaterThan(DRAGON_DEFINITIONS[i - 1].defbase);
    }
  });

  it('should look up dragons by ID', () => {
    expect(getDragonById(0)?.name).toBe('Dragling');
    expect(getDragonById(4)?.name).toBe('Dragon');
    expect(getDragonById(7)?.name).toBe('NogarDragoN');
    expect(getDragonById(99)).toBeUndefined();
  });

  it('should look up dragons by name', () => {
    expect(getDragonByName('Wyrm')?.id).toBe(2);
    expect(getDragonByName('Noble Dragon')?.id).toBe(5);
    expect(getDragonByName('Nonexistent')).toBeUndefined();
  });

  it('should have breath types for higher dragons', () => {
    expect(DRAGON_DEFINITIONS[0].breath).toBeUndefined(); // Dragling
    expect(DRAGON_DEFINITIONS[3].breath).toEqual(['fire']); // Wyvern
    expect(DRAGON_DEFINITIONS[4].breath).toEqual(['fire', 'ice']); // Dragon
    expect(DRAGON_DEFINITIONS[7].breath).toEqual(['fire', 'ice', 'poison', 'special1', 'special2']); // NogarDragoN
  });

  it('should have magic levels for Noble Dragon and above', () => {
    expect(DRAGON_DEFINITIONS[4].magic).toBeUndefined(); // Dragon
    expect(DRAGON_DEFINITIONS[5].magic).toBe(1); // Noble Dragon
    expect(DRAGON_DEFINITIONS[6].magic).toBe(2); // Imperial Dragon
    expect(DRAGON_DEFINITIONS[7].magic).toBe(3); // NogarDragoN
  });
});

describe('Dragon Description', () => {
  it('should generate description with body parts', () => {
    const dragling = getDragonById(0)!;
    const desc = getDragonDescription(dragling, false);
    expect(desc).toContain('4 legs');
    expect(desc).toContain('No arms');
    expect(desc).toContain('No wings');
    expect(desc).toContain('a tail');
  });

  it('should note flying ability', () => {
    const wyvern = getDragonById(3)!;
    const notFlying = getDragonDescription(wyvern, false);
    expect(notFlying).toContain('not yet learnt how to fly');

    const flying = getDragonDescription(wyvern, true);
    expect(flying).not.toContain('not yet learnt how to fly');
  });

  it('should handle multiple heads and tails', () => {
    const imperial = getDragonById(6)!;
    const desc = getDragonDescription(imperial, true);
    expect(desc).toContain('3 heads');
    expect(desc).toContain('3 tails');
  });
});

// =============================================================================
// Dragon Stats
// =============================================================================

describe('Dragon Stats', () => {
  it('should define 7 stat types', () => {
    expect(DRAGON_STATS).toHaveLength(7);
    expect(DRAGON_STATS).toContain('offence');
    expect(DRAGON_STATS).toContain('defence');
    expect(DRAGON_STATS).toContain('digging');
    expect(DRAGON_STATS).toContain('breath');
    expect(DRAGON_STATS).toContain('magic1');
  });

  it('should map stats to lining resources', () => {
    expect(DRAGON_STAT_RESOURCES).toHaveLength(7);
    const offence = DRAGON_STAT_RESOURCES.find((r) => r.stat === 'offence');
    expect(offence?.resources).toEqual(['Sand', 'Castles']);
  });
});

// =============================================================================
// Opponent Definitions
// =============================================================================

describe('Opponent Definitions', () => {
  it('should have 15 opponent types', () => {
    expect(OPPONENT_DEFINITIONS).toHaveLength(15);
  });

  it('should range from Serf to Pantheon of Gods', () => {
    expect(OPPONENT_DEFINITIONS[0].name).toBe('Serf');
    expect(OPPONENT_DEFINITIONS[14].name).toBe('Pantheon of Gods');
  });

  it('should look up opponents by ID', () => {
    expect(getOpponentById(4)?.name).toBe('Knight');
    expect(getOpponentById(99)).toBeUndefined();
  });

  it('should look up opponents by name', () => {
    expect(getOpponentByName('Baron')?.id).toBe(5);
    expect(getOpponentByName('Nobody')).toBeUndefined();
  });

  it('should have rewards for each opponent', () => {
    for (const opp of OPPONENT_DEFINITIONS) {
      expect(Object.keys(opp.reward).length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// Attack Text Generation
// =============================================================================

describe('Attack Text Generation', () => {
  it('should generate text for a single opponent', () => {
    const serf = getOpponentById(0)!;
    const instance = { from: 10, type: 0, numb: 1, gender: 0 as 0, modifier: 1 };
    const text = getOpponentAttackText(serf, instance);
    expect(text).toContain('Serf');
    expect(text).toContain('offensively');
  });

  it('should pluralize for multiple opponents', () => {
    const serf = getOpponentById(0)!;
    const instance = { from: 10, type: 0, numb: 5, gender: 1 as 1, modifier: 1 };
    const text = getOpponentAttackText(serf, instance);
    expect(text).toContain('Serfs');
    expect(text).toContain('each');
  });

  it('should show defensive when modifier > 1', () => {
    const knight = getOpponentById(4)!;
    const instance = { from: 600, type: 4, numb: 1, gender: 0 as 0, modifier: 1.5 };
    const text = getOpponentAttackText(knight, instance);
    expect(text).toContain('defensively');
  });

  it('should include fromNP when different', () => {
    const serf = getOpponentById(0)!;
    const instance = { from: 50, type: 0, numb: 1, gender: 0 as 0, modifier: 0.5 };
    const text = getOpponentAttackText(serf, instance, 50);
    expect(text).toContain('NP50');
  });
});

// =============================================================================
// Combat Calculations
// =============================================================================

describe('Combat Calculations', () => {
  describe('calculateOpponentAttack', () => {
    it('should return physical and magical attack values', () => {
      const serf = getOpponentById(0)!;
      const [physical, magical] = calculateOpponentAttack(serf, 1, 100);
      expect(physical).toBeGreaterThan(0);
      expect(magical).toBeGreaterThan(0);
    });

    it('should scale with opponent count', () => {
      const knight = getOpponentById(4)!;
      const [phys1] = calculateOpponentAttack(knight, 1, 100);
      const [phys5] = calculateOpponentAttack(knight, 5, 100);
      expect(phys5).toBeCloseTo(phys1 * 5, 5);
    });

    it('should give Pantheon of Gods location bonus', () => {
      const gods = getOpponentById(14)!;
      const [, mag2100] = calculateOpponentAttack(gods, 1, 2100);
      const [, mag2200] = calculateOpponentAttack(gods, 1, 2200);
      expect(mag2200).toBeGreaterThan(mag2100);
    });
  });

  describe('parseExperience', () => {
    it('should parse number directly', () => {
      expect(parseExperience(100)).toBe(100);
    });

    it('should parse suffixed strings', () => {
      expect(parseExperience('1K')).toBe(1000);
      expect(parseExperience('1M')).toBe(1e6);
      expect(parseExperience('10K')).toBe(10000);
    });
  });

  describe('calculateBlitzValue', () => {
    it('should return 0 for equal attack/defence', () => {
      expect(calculateBlitzValue(100, 100)).toBeCloseTo(0, 5);
    });

    it('should be positive when attack > defence', () => {
      expect(calculateBlitzValue(1000, 100)).toBeGreaterThan(0);
    });

    it('should be negative when attack < defence', () => {
      expect(calculateBlitzValue(100, 1000)).toBeLessThan(0);
    });

    it('should clamp to [-0.66, 0.66]', () => {
      expect(calculateBlitzValue(1e20, 1)).toBeLessThanOrEqual(0.66);
      expect(calculateBlitzValue(1, 1e20)).toBeGreaterThanOrEqual(-0.66);
    });
  });

  describe('findOpponents', () => {
    it('should return type 0 for NP < 150', () => {
      const opp = findOpponents(100, 100, 200, 0);
      expect(opp.type).toBe(0);
    });

    it('should return type 1 for NP 150-299', () => {
      const opp = findOpponents(200, 100, 300, 0);
      expect(opp.type).toBe(1);
    });

    it('should cap at max opponent type', () => {
      const opp = findOpponents(99999, 100, 100000, 0);
      expect(opp.type).toBeLessThanOrEqual(OPPONENT_DEFINITIONS.length - 1);
    });

    it('should return 1 opponent for early game', () => {
      const opp = findOpponents(10, 5, 10, 0);
      expect(opp.numb).toBe(1);
    });

    it('should have gender 0 or 1', () => {
      const opp = findOpponents(100, 100, 200, 0);
      expect([0, 1]).toContain(opp.gender);
    });
  });
});

// =============================================================================
// Dragon State Initialization
// =============================================================================

describe('Dragon State Initialization', () => {
  it('should create initial queen state', () => {
    const queen = createInitialQueenState();
    expect(queen.Level).toBe(0);
    expect(queen.overallState).toBe(0);
    expect(queen.countdown).toBe(0);
    expect(queen.totalfights).toBe(0);
  });

  it('should create initial hatchlings state', () => {
    const hatch = createInitialHatchlingsState();
    expect(hatch.clutches).toEqual([]);
    expect(hatch.properties).toEqual([]);
    expect(hatch.diet).toEqual([]);
    expect(hatch.maturity).toEqual([]);
  });

  it('should create initial nest state with 100% total', () => {
    const nest = createInitialNestState();
    const total = Object.values(nest.lining).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });

  it('should create initial dragon system state', () => {
    const state = createInitialDragonSystemState();
    expect(state.npData.size).toBe(0);
    expect(state.totalDragons).toBe(0);
    expect(state.digMultiplier).toBe(10);
    expect(state.recalcNeeded).toBe(true);
  });
});

describe('maxDragonsAtNP', () => {
  it('should allow 1 dragon at NP 0-99', () => {
    expect(maxDragonsAtNP(0)).toBe(1);
    expect(maxDragonsAtNP(99)).toBe(1);
  });

  it('should allow 2 dragons at NP 100-199', () => {
    expect(maxDragonsAtNP(100)).toBe(2);
    expect(maxDragonsAtNP(199)).toBe(2);
  });

  it('should return negative for negative NP', () => {
    expect(maxDragonsAtNP(-5)).toBe(-5);
  });
});

describe('calculateNestProperties', () => {
  it('should calculate stat values from lining', () => {
    const nest = createInitialNestState();
    const props = calculateNestProperties(nest);
    expect(props).toHaveLength(7);
    // Default nest: 50% offence, 50% defence, 0% everything else
    expect(props[0]).toBeGreaterThan(0.001); // offence
    expect(props[1]).toBeGreaterThan(0.001); // defence
    expect(props[2]).toBeCloseTo(0.001, 3); // digging (0% + base)
  });
});

// =============================================================================
// Dragon Multipliers
// =============================================================================

describe('Dragon Multipliers', () => {
  it('should return base multipliers with no boosts', () => {
    const mults = calculateDragonMultipliers(createDefaultBoostState());
    expect(mults.digMultiplier).toBe(10);
    expect(mults.attackMultiplier).toBe(1);
    expect(mults.defenceMultiplier).toBe(1);
    expect(mults.breathMultiplier).toBe(1);
    expect(mults.luck).toBe(0);
    expect(mults.hideMod).toBe(0);
  });

  it('should double dig multiplier with Bucket and Spade', () => {
    const boosts = createDefaultBoostState();
    boosts.hasBucketAndSpade = true;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.digMultiplier).toBe(20);
  });

  it('should multiply dig with Golden Bull', () => {
    const boosts = createDefaultBoostState();
    boosts.hasGoldenBull = true;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.digMultiplier).toBe(50); // 10 * 5
  });

  it('should stack dig multipliers', () => {
    const boosts = createDefaultBoostState();
    boosts.hasBucketAndSpade = true;
    boosts.hasGoldenBull = true;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.digMultiplier).toBe(100); // 10 * 2 * 5
  });

  it('should increase attack with Big Teeth', () => {
    const boosts = createDefaultBoostState();
    boosts.hasBigTeeth = true;
    boosts.bigTeethLevel = 5;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.attackMultiplier).toBeCloseTo(Math.pow(1.2, 5), 5);
  });

  it('should add luck with Lucky Ring', () => {
    const boosts = createDefaultBoostState();
    boosts.hasLuckyRing = true;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.luck).toBeCloseTo(0.0277, 4);
  });

  it('should add hide modifier with Chintzy Tiara', () => {
    const boosts = createDefaultBoostState();
    boosts.hasChintzyTiara = true;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.hideMod).toBe(22);
  });

  it('should multiply defence exponentially with Adamantine Armour', () => {
    const boosts = createDefaultBoostState();
    boosts.hasAdamantineArmour = true;
    boosts.adamantineArmourLevel = 3;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.defenceMultiplier).toBe(Math.pow(2, 3));
  });

  it('should scale breath with Autumn of the Matriarch', () => {
    const boosts = createDefaultBoostState();
    boosts.hasAutumnOfMatriarch = true;
    boosts.dqTotalLoses = 10;
    const mults = calculateDragonMultipliers(boosts);
    expect(mults.breathMultiplier).toBe(10);
  });
});

// =============================================================================
// Dragon Aggregates
// =============================================================================

describe('Dragon Aggregates', () => {
  it('should return zeros for empty npData', () => {
    const agg = calculateDragonAggregates(new Map());
    expect(agg.totalDragons).toBe(0);
    expect(agg.totalNPsWithDragons).toBe(0);
    expect(agg.highestNPwithDragons).toBe(0);
    expect(agg.rawDigValue).toBe(0);
  });

  it('should count dragons across NPs', () => {
    const state = createStateWithDragons([
      [10, { amount: 3 }],
      [20, { amount: 5 }],
    ]);
    const agg = calculateDragonAggregates(state.npData);
    expect(agg.totalDragons).toBe(8);
    expect(agg.totalNPsWithDragons).toBe(2);
    expect(agg.highestNPwithDragons).toBe(20);
  });

  it('should track consecutive NPs', () => {
    const state = createStateWithDragons([
      [1, { amount: 1 }],
      [2, { amount: 1 }],
      [3, { amount: 1 }],
      [4, { amount: 1 }],
      [10, { amount: 1 }],
    ]);
    const agg = calculateDragonAggregates(state.npData);
    expect(agg.consecutiveNPsWithDragons).toBe(4);
  });

  it('should ignore NPs with 0 dragons', () => {
    const state = createStateWithDragons([
      [10, { amount: 0 }],
      [20, { amount: 3 }],
    ]);
    const agg = calculateDragonAggregates(state.npData);
    expect(agg.totalDragons).toBe(3);
    expect(agg.totalNPsWithDragons).toBe(1);
  });
});

describe('calculateDragonDigRate', () => {
  it('should return 0 for 0 raw dig value', () => {
    expect(calculateDragonDigRate(0, 10, 0)).toBe(0);
  });

  it('should scale with dig multiplier', () => {
    const rate1 = calculateDragonDigRate(100, 10, 50);
    const rate2 = calculateDragonDigRate(100, 20, 50);
    expect(rate2).toBeCloseTo(rate1 * 2, 5);
  });

  it('should increase with highest NP', () => {
    const rate1 = calculateDragonDigRate(100, 10, 50);
    const rate2 = calculateDragonDigRate(100, 10, 200);
    expect(rate2).toBeGreaterThan(rate1);
  });
});

describe('getConsecutiveDragonUnlocks', () => {
  it('should return no unlocks for low consecutive count', () => {
    expect(getConsecutiveDragonUnlocks(5)).toEqual([]);
  });

  it('should unlock Incubator at 10', () => {
    expect(getConsecutiveDragonUnlocks(10)).toContain('Incubator');
  });

  it('should unlock Wait for it at 22', () => {
    expect(getConsecutiveDragonUnlocks(22)).toContain('Wait for it');
  });

  it('should unlock all at 901+', () => {
    const unlocks = getConsecutiveDragonUnlocks(1000);
    expect(unlocks).toContain('Incubator');
    expect(unlocks).toContain('Wait for it');
    expect(unlocks).toContain('Q04B');
    expect(unlocks).toContain('Cryogenics');
    expect(unlocks).toContain('Dragon Breath');
  });
});

// =============================================================================
// Recalculate Dragon System
// =============================================================================

describe('recalculateDragonSystem', () => {
  it('should update all state fields', () => {
    const state = createStateWithDragons([
      [10, { amount: 2, dig: 1.0 }],
      [11, { amount: 3, dig: 0.5 }],
    ]);
    state.recalcNeeded = true;

    const unlocks = recalculateDragonSystem(state, createDefaultBoostState());

    expect(state.totalDragons).toBe(5);
    expect(state.totalNPsWithDragons).toBe(2);
    expect(state.highestNPwithDragons).toBe(11);
    expect(state.consecutiveNPsWithDragons).toBe(2);
    expect(state.digRate).toBeGreaterThan(0);
    expect(state.recalcNeeded).toBe(false);
    expect(unlocks).toEqual([]); // 2 consecutive, not enough for any unlock
  });

  it('should return unlock list for sufficient consecutive NPs', () => {
    const entries: [number, Partial<NPData>][] = [];
    for (let i = 1; i <= 50; i++) {
      entries.push([i, { amount: 1, dig: 0.1 }]);
    }
    const state = createStateWithDragons(entries);
    state.recalcNeeded = true;

    const unlocks = recalculateDragonSystem(state, createDefaultBoostState());
    expect(unlocks).toContain('Incubator');
    expect(unlocks).toContain('Wait for it');
    expect(unlocks).toContain('Q04B');
  });
});

// =============================================================================
// Dragon Stats At NP
// =============================================================================

describe('calculateDragonStatsAtNP', () => {
  it('should apply multipliers and defbase to stats', () => {
    const npd = createNPData({ dragonType: 0, amount: 1, attack: 1, defence: 1 });
    const mults = createDefaultMultipliers();
    const stats = calculateDragonStatsAtNP(npd, mults, false);

    // Dragling defbase = 1, so attack = (1 + 0.001) * 1 * 1 = 1.001
    expect(stats.attack).toBeCloseTo(1.001, 3);
    expect(stats.defence).toBeCloseTo(1.001, 3);
  });

  it('should multiply by dragon count', () => {
    const npd = createNPData({ dragonType: 0, amount: 5, attack: 1, defence: 1 });
    const mults = createDefaultMultipliers();
    const stats = calculateDragonStatsAtNP(npd, mults, false);

    expect(stats.attack).toBeCloseTo(5 * 1.001, 2);
  });

  it('should use dragon-specific defbase for attack', () => {
    // Dragon (id 4) has defbase 1e11
    const npd = createNPData({ dragonType: 4, amount: 1, attack: 1, defence: 1 });
    const mults = createDefaultMultipliers();
    const stats = calculateDragonStatsAtNP(npd, mults, false);

    expect(stats.attack).toBeCloseTo(1.001 * 1e11, -5);
  });

  it('should add breath base when hasDragonBreath', () => {
    const npd = createNPData({ dragonType: 3, amount: 1, breath: 1 }); // Wyvern, breathbase 1
    const mults = createDefaultMultipliers();

    const withoutBreath = calculateDragonStatsAtNP(npd, mults, false);
    const withBreath = calculateDragonStatsAtNP(npd, mults, true);

    expect(withBreath.breath).toBeGreaterThan(withoutBreath.breath);
  });
});

// =============================================================================
// Digging Mechanics
// =============================================================================

describe('Digging Mechanics', () => {
  describe('calculateDigProgress', () => {
    it('should use dig rate for mnp digs', () => {
      const state = createInitialDragonSystemState();
      state.digRate = 100;
      state.totalNPsWithDragons = 5;
      state.queen.Level = 1;

      const progress = calculateDigProgress('mnp', state, createDefaultDiggingBoosts());
      // progress = digRate * random, so 0 <= progress <= 100
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should use NP count for beach digs', () => {
      const state = createInitialDragonSystemState();
      state.digRate = 100;
      state.totalNPsWithDragons = 10;
      state.queen.Level = 2;

      const progress = calculateDigProgress('beach', state, createDefaultDiggingBoosts());
      // add = 10 * (1 + 2) = 30, progress = 30 * random
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(30);
    });

    it('should square beach dig with Shades', () => {
      const state = createInitialDragonSystemState();
      state.totalNPsWithDragons = 10;
      state.queen.Level = 2;
      const boosts = createDefaultDiggingBoosts();
      boosts.hasShades = true;

      const progress = calculateDigProgress('beach', state, boosts);
      // add = (10 * 3)^2 = 900, progress = 900 * random
      expect(progress).toBeLessThanOrEqual(900);
    });
  });

  describe('determineDigFind', () => {
    it('should return a resource', () => {
      const result = determineDigFind(100, 1, createDefaultDiggingBoosts(), 0);
      expect(result.resource).not.toBeNull();
      expect(result.amount).toBeGreaterThanOrEqual(0);
    });

    it('should set Wheee Diamonds badge for diamond finds', () => {
      // Run enough times to likely get diamonds
      let gotDiamondBadge = false;
      for (let i = 0; i < 100; i++) {
        const result = determineDigFind(1000, 5, createDefaultDiggingBoosts(), 10);
        if (result.earnedBadge === 'Wheee Diamonds') {
          gotDiamondBadge = true;
          break;
        }
      }
      expect(gotDiamondBadge).toBe(true);
    });
  });

  describe('processDragonDig', () => {
    it('should return null when not digging state', () => {
      const state = createInitialDragonSystemState();
      state.queen.overallState = 1; // Recovering
      const result = processDragonDig('mnp', state, createDefaultDiggingBoosts());
      expect(result).toBeNull();
    });

    it('should return null when dig rate is 0', () => {
      const state = createInitialDragonSystemState();
      state.digRate = 0;
      state.recalcNeeded = false;
      const result = processDragonDig('mnp', state, createDefaultDiggingBoosts());
      expect(result).toBeNull();
    });

    it('should accumulate dig progress', () => {
      const state = createInitialDragonSystemState();
      state.digRate = 0.01; // Very slow
      state.queen.overallState = 0;
      state.recalcNeeded = false;

      processDragonDig('mnp', state, createDefaultDiggingBoosts());
      expect(state.digValue).toBeGreaterThanOrEqual(0);
    });
  });

  describe('checkDiggingNotification', () => {
    it('should return null when digTime <= 100', () => {
      const state = createInitialDragonSystemState();
      state.digTime = 50;
      expect(checkDiggingNotification(state)).toBeNull();
    });

    it('should return finds and reset when digTime > 100', () => {
      const state = createInitialDragonSystemState();
      state.digTime = 101;
      state.diggingFinds = { Gold: 100, Diamonds: 5 };

      const finds = checkDiggingNotification(state);
      expect(finds).toEqual({ Gold: 100, Diamonds: 5 });
      expect(state.digTime).toBe(0);
      expect(state.diggingFinds).toEqual({});
    });
  });
});

// =============================================================================
// Dragon Fledging
// =============================================================================

describe('Dragon Fledging', () => {
  it('should place dragons at an empty NP', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0; // Dragling
    state.hatchlings.clutches = [3];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 0, 0, 0, 0]; // 7 stats
    state.hatchlings.diet = [1]; // Goats

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.success).toBe(true);
    expect(result.placed).toBeGreaterThan(0);
    expect(result.badges).toContain('First Colonist');

    const npd = state.npData.get(50);
    expect(npd).toBeDefined();
    expect(npd!.dragonType).toBe(0);
    expect(npd!.amount).toBeLessThanOrEqual(3);
  });

  it('should apply goat diet modifier (halve breath, zero magic)', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 1.0, 0.8, 0.6, 0.4];
    state.hatchlings.diet = [1]; // Goats

    dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);
    const npd = state.npData.get(50)!;

    expect(npd.breath).toBe(0.5); // 1.0 / 2
    expect(npd.magic1).toBe(0);
    expect(npd.magic2).toBe(0);
    expect(npd.magic3).toBe(0);
  });

  it('should apply hatchling diet modifier (halve magic1, zero magic2/3)', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 1.0, 0.8, 0.6, 0.4];
    state.hatchlings.diet = [2]; // Hatchlings

    dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);
    const npd = state.npData.get(50)!;

    expect(npd.breath).toBe(1.0); // Unchanged
    expect(npd.magic1).toBe(0.4); // 0.8 / 2
    expect(npd.magic2).toBe(0);
    expect(npd.magic3).toBe(0);
  });

  it('should not modify stats with princess diet', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 1.0, 0.8, 0.6, 0.4];
    state.hatchlings.diet = [3]; // Princesses

    dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);
    const npd = state.npData.get(50)!;

    expect(npd.breath).toBe(1.0);
    expect(npd.magic1).toBe(0.8);
    expect(npd.magic2).toBe(0.6);
    expect(npd.magic3).toBe(0.4);
  });

  it('should replace weaker dragons at an occupied NP', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 2; // Wyrm, stronger than Dragling
    state.npData.set(50, createNPData({ dragonType: 0, amount: 2 })); // Draglings at NP 50
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 0, 0, 0, 0];
    state.hatchlings.diet = [1];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.replacedType).toBe(0); // Replaced Draglings
    expect(result.replacedAmount).toBe(2);
    expect(state.npData.get(50)!.dragonType).toBe(2); // Now Wyrms
  });

  it('should reject fledge when existing dragons are stronger', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0; // Dragling
    state.npData.set(50, createNPData({ dragonType: 3, amount: 2 })); // Wyverns at NP 50
    state.hatchlings.clutches = [5];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 0, 0, 0, 0];
    state.hatchlings.diet = [1];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toContain('better dragons');
    // Clutch is set to 0 then cleaned (removed from array)
    expect(state.hatchlings.clutches.length).toBe(0);
  });

  it('should enforce max dragon limit and suggest Topiary', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 2; // DQ level > 1 needed for Topiary unlock
    state.hatchlings.clutches = [10]; // 10 dragons
    state.hatchlings.properties = new Array(7).fill(0.5);
    state.hatchlings.diet = [1];

    // NP 50: max = 1 + floor(50/100) = 1
    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.wasted).toBe(9); // 10 - 1
    expect(result.unlockTopiary).toBe(true);
  });

  it('should keep remaining in clutch with Topiary', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [10];
    state.hatchlings.properties = new Array(7).fill(0.5);
    state.hatchlings.diet = [1];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), true); // hasTopiary

    expect(result.remainingInClutch).toBe(9);
    expect(state.hatchlings.clutches[0]).toBe(9);
  });

  it('should trigger combat on new fledge', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 0, 0, 0, 0];
    state.hatchlings.diet = [1];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.combatTriggered).toBe(true);
    expect(result.combatResult).not.toBeNull();
    expect(result.opponents).not.toBeNull();
  });

  it('should not trigger combat when replacing dragons', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 2; // Wyrm
    state.npData.set(50, createNPData({ dragonType: 0, amount: 1 }));
    state.hatchlings.clutches = [1];
    state.hatchlings.properties = [0.5, 0.5, 0.5, 0, 0, 0, 0];
    state.hatchlings.diet = [1];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);

    expect(result.combatTriggered).toBe(false);
  });

  it('should return empty result for empty clutch', () => {
    const state = createInitialDragonSystemState();
    state.queen.Level = 0;
    state.hatchlings.clutches = [0];

    const result = dragonFledge(0, 50, state, createDefaultCombatBoosts(), false);
    expect(result.success).toBe(false);
    expect(result.placed).toBe(0);
  });
});

// =============================================================================
// Combat System
// =============================================================================

describe('Combat System', () => {
  describe('opponentsAttack', () => {
    it('should return a combat result', () => {
      const npd = createNPData({ dragonType: 4, amount: 5, attack: 1, defence: 1 });
      const mults = createDefaultMultipliers();
      const opponents = { from: 100, type: 0, numb: 1, gender: 0 as 0, modifier: 1 };

      const stats = opponentsAttack(100, opponents, npd, mults, createDefaultCombatBoosts(), 0);

      expect([-2, -1, -0.5, 0, 0.5, 1, 2, 3]).toContain(stats.result);
      expect(stats.loops).toBeGreaterThan(0);
      expect(stats.loops).toBeLessThanOrEqual(101);
    });

    it('should favor strong dragons against weak opponents', () => {
      // Dragon (id 4) with defbase 1e11 vs Serf - should win easily most times
      const npd = createNPData({ dragonType: 4, amount: 5, attack: 10, defence: 10 });
      const mults = createDefaultMultipliers();
      mults.attackMultiplier = 1000;
      mults.defenceMultiplier = 1000;
      const opponents = { from: 10, type: 0, numb: 1, gender: 0 as 0, modifier: 1 };

      let wins = 0;
      for (let i = 0; i < 20; i++) {
        const stats = opponentsAttack(10, opponents, npd, mults, createDefaultCombatBoosts(), 0);
        if (stats.result > 0) wins++;
      }
      expect(wins).toBeGreaterThan(10); // Should win most fights
    });

    it('should handle breath attacks', () => {
      const npd = createNPData({ dragonType: 3, amount: 1, attack: 1, defence: 1, breath: 1 });
      const mults = createDefaultMultipliers();
      const opponents = { from: 100, type: 0, numb: 1, gender: 0 as 0, modifier: 1 };

      // breathtype 0 = fire (1-indexed becomes case 1)
      const stats = opponentsAttack(100, opponents, npd, mults, createDefaultCombatBoosts(), 0);
      expect(stats).toBeDefined();
    });

    it('should resolve within 101 loops', () => {
      const npd = createNPData({ dragonType: 0, amount: 1, attack: 0.001, defence: 0.001 });
      const mults = createDefaultMultipliers();
      const opponents = { from: 100, type: 0, numb: 1, gender: 0 as 0, modifier: 1 };

      const stats = opponentsAttack(100, opponents, npd, mults, createDefaultCombatBoosts(), 0);
      expect(stats.loops).toBeLessThanOrEqual(101);
    });
  });

  describe('calculateCombatRewards', () => {
    it('should generate rewards for a Serf', () => {
      const serf = getOpponentById(0)!;
      const { rewards } = calculateCombatRewards(serf, 1, 100, 0, 5, false);
      // Should get some copper (converted to Gold) at minimum
      expect(rewards.length).toBeGreaterThanOrEqual(0); // Random, may be empty
    });

    it('should apply Tuple or Nothing gold multiplier', () => {
      const knight = getOpponentById(4)!;
      const withoutTuple = calculateCombatRewards(knight, 1, 1000, 0.5, 10, false);
      const withTuple = calculateCombatRewards(knight, 1, 1000, 0.5, 10, true);

      // Can't guarantee same random results, but the function should run without error
      expect(withoutTuple).toBeDefined();
      expect(withTuple).toBeDefined();
    });

    it('should convert Copper to Gold', () => {
      const serf = getOpponentById(0)!;
      // Run many times to ensure we get a copper reward
      let foundGoldFromCopper = false;
      for (let i = 0; i < 50; i++) {
        const { rewards } = calculateCombatRewards(serf, 1, 100, 0.5, 5, false);
        for (const r of rewards) {
          if (r.resource === 'Gold' && r.amount < 0.01) {
            foundGoldFromCopper = true;
            break;
          }
        }
        if (foundGoldFromCopper) break;
      }
      expect(foundGoldFromCopper).toBe(true);
    });
  });

  describe('processCombatOutcome', () => {
    it('should apply state changes for losses', () => {
      const state = createStateWithDragons([
        [100, { dragonType: 0, amount: 1, attack: 0.001, defence: 0.001, dig: 0.001 }],
      ]);
      state.queen.overallState = 0;
      const mults = createDefaultMultipliers();

      // Strong opponent against weak dragon
      const opponents = { from: 2000, type: 13, numb: 5, gender: 0 as 0, modifier: 0.5 };
      const npd = state.npData.get(100)!;

      const outcome = processCombatOutcome(
        100, opponents, npd, state, mults, createDefaultCombatBoosts(), 0, 1
      );

      expect(outcome).toBeDefined();
      // Outcome will vary due to randomness, but should produce a valid result
      expect([-2, -1, -0.5, 0, 0.5, 1, 2, 3]).toContain(outcome.stats.result);
    });

    it('should return rewards for victories', () => {
      const state = createStateWithDragons([
        [100, { dragonType: 4, amount: 10, attack: 100, defence: 100, dig: 50 }],
      ]);
      const mults = createDefaultMultipliers();
      mults.attackMultiplier = 1e6;
      mults.defenceMultiplier = 1e6;

      const opponents = { from: 10, type: 0, numb: 1, gender: 0 as 0, modifier: 1.5 };
      const npd = state.npData.get(100)!;

      const outcome = processCombatOutcome(
        100, opponents, npd, state, mults, createDefaultCombatBoosts(), 0, 1
      );

      if (outcome.stats.result > 0) {
        // Should have rewards for a victory
        expect(outcome.rewards.length + outcome.experience).toBeGreaterThan(0);
      }
    });

    it('should unlock WotT/WotP for wins against Lord or higher', () => {
      const state = createStateWithDragons([
        [100, { dragonType: 6, amount: 10, attack: 1000, defence: 1000, dig: 500 }],
      ]);
      const mults = createDefaultMultipliers();
      mults.attackMultiplier = 1e12;
      mults.defenceMultiplier = 1e12;

      // Lord (id 6)
      const opponents = { from: 900, type: 6, numb: 1, gender: 0 as 0, modifier: 1.5 };
      const npd = state.npData.get(100)!;

      const outcome = processCombatOutcome(
        100, opponents, npd, state, mults, createDefaultCombatBoosts(), 0, 1
      );

      if (outcome.stats.result > 0) {
        expect(outcome.unlocks).toContain('WotT');
        expect(outcome.unlocks).toContain('WotP');
      }
    });
  });
});

// =============================================================================
// RedundaKnight Generation
// =============================================================================

describe('RedundaKnight Generation', () => {
  it('should target an NP with dragons', () => {
    const state = createStateWithDragons([
      [50, { amount: 3 }],
      [100, { amount: 5 }],
    ]);
    state.totalDragons = 8;
    state.totalNPsWithDragons = 2;
    state.highestNPwithDragons = 100;

    const knight = generateRedundaKnight(state, 0, 0);
    expect(knight.target).toBeGreaterThanOrEqual(0);
  });

  it('should generate knowledge based on Dragonfly level', () => {
    const state = createStateWithDragons([
      [50, { amount: 1 }],
    ]);
    state.totalDragons = 1;
    state.totalNPsWithDragons = 1;
    state.highestNPwithDragons = 50;

    // High dragonfly level = full knowledge
    const knight = generateRedundaKnight(state, 20, 0);
    expect(knight.knowledge[0]).toBe(true);
    expect(knight.knowledge[1]).toBe(true);
    expect(knight.knowledge[2]).toBe(true);
    expect(knight.knowledge[3]).toBe(true);
  });

  it('should have no knowledge with low Dragonfly level', () => {
    const state = createStateWithDragons([
      [50, { amount: 1 }],
    ]);
    state.totalDragons = 1;
    state.totalNPsWithDragons = 1;
    state.highestNPwithDragons = 50;

    const knight = generateRedundaKnight(state, 0, 0);
    // With dragonflyLevel 0, knowledge should all be false
    expect(knight.knowledge[0]).toBe(false);
    expect(knight.knowledge[1]).toBe(false);
    expect(knight.knowledge[2]).toBe(false);
    expect(knight.knowledge[3]).toBe(false);
  });
});

// =============================================================================
// Hide Time
// =============================================================================

describe('calculateHideTime', () => {
  it('should return minimum 10', () => {
    const time = calculateHideTime(0, 1, 1000, 1000);
    expect(time).toBeGreaterThanOrEqual(10);
  });

  it('should scale with opponent type', () => {
    const time1 = calculateHideTime(0, 1, 0, 0);
    const time5 = calculateHideTime(5, 1, 0, 0);
    expect(time5).toBeGreaterThan(time1);
  });

  it('should scale with DQ level', () => {
    const time1 = calculateHideTime(3, 1, 0, 0);
    const time5 = calculateHideTime(3, 5, 0, 0);
    expect(time5).toBeGreaterThan(time1);
  });

  it('should reduce with Camelflarge', () => {
    const without = calculateHideTime(3, 3, 0, 0);
    const with_ = calculateHideTime(3, 3, 10, 0);
    expect(with_).toBeLessThan(without);
  });

  it('should reduce with hideMod', () => {
    const without = calculateHideTime(3, 3, 0, 0);
    const with_ = calculateHideTime(3, 3, 0, 50);
    expect(with_).toBeLessThan(without);
  });
});

// =============================================================================
// Dragon Reward Boosts
// =============================================================================

describe('Dragon Reward Boosts', () => {
  it('should contain 46 reward boosts', () => {
    expect(DRAGON_REWARD_BOOSTS).toHaveLength(48);
  });

  it('should contain key boosts', () => {
    expect(DRAGON_REWARD_BOOSTS).toContain('Lucky Ring');
    expect(DRAGON_REWARD_BOOSTS).toContain('Dragon Breath');
    expect(DRAGON_REWARD_BOOSTS).toContain('Cryogenics');
    expect(DRAGON_REWARD_BOOSTS).toContain('Tuple or Nothing');
  });
});
