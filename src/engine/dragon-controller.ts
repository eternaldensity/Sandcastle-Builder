/**
 * Dragon system controller: adapts engine state to the pure dragon
 * mechanics in dragon.ts.
 *
 * The engine owns the live DragonSystemState plus boosts/resources; the
 * functions here build the boost-state structs dragon.ts needs, invoke its
 * calculators, and apply results back through a narrow
 * DragonControllerAccess adapter (same pattern as beach-click.ts,
 * monty-haul.ts, and boost-shop.ts).
 *
 * Reference: dragons.js
 */

import {
  recalculateDragonSystem,
  processDragonDig as digDragons,
  dragonFledge,
  processCombatOutcome,
  generateRedundaKnight,
  calculateHideTime,
  checkDiggingNotification,
  type DragonBoostState,
  type DragonDiggingBoostState,
  type CombatBoostState,
  type DragonMultipliers,
  type DigType,
  type DigResult,
  type FledgeResult,
  type CombatOutcome,
} from './dragon.js';
import type {
  DragonSystemState,
  NPData,
  DragonQueenState,
  DragonHatchlingsState,
  DragonNestState,
  DragonOverallState,
  OpponentInstance,
  CombatStats,
} from '../types/game-data.js';

/**
 * Engine capabilities the dragon controller needs. Implemented by
 * ModernEngine closures so this module stays dependency-free.
 */
export interface DragonControllerAccess {
  /** Live reference to the engine's dragon system state. */
  dragons: DragonSystemState;
  getBoost(alias: string): { bought: number; power: number; isEnabled?: boolean } | undefined;
  getBoostPower(alias: string): number;
  hasBoost(alias: string): boolean;
  getNewpixNumber(): number;
  addResource(resource: string, amount: number): void;
  earnBadge(name: string): void;
  unlockBoost(alias: string): void;
}

// ---------------------------------------------------------------------------
// State accessors (thin views over DragonSystemState)
// ---------------------------------------------------------------------------

export function getDragonDataAtNP(
  dragons: DragonSystemState,
  np: number,
): NPData | undefined {
  return dragons.npData.get(np);
}

export function setDragonDataAtNP(
  dragons: DragonSystemState,
  np: number,
  data: NPData,
): void {
  dragons.npData.set(np, data);
  dragons.recalcNeeded = true;
}

export function removeDragonsAtNP(dragons: DragonSystemState, np: number): void {
  dragons.npData.delete(np);
  dragons.recalcNeeded = true;
}

export function getDragonQueenState(dragons: DragonSystemState): DragonQueenState {
  return { ...dragons.queen };
}

export function setDragonQueenLevel(dragons: DragonSystemState, level: number): void {
  dragons.queen.Level = level;
}

/**
 * Change Dragon Queen overall state.
 * Reference: dragons.js:1111-1117 (DragonsHide, ChangeState)
 *
 * @param state - 0=Digging, 1=Recovering, 2=Hiding, 3=Celebrating
 * @param countdown - Optional countdown in mNP for state to end
 */
export function setDragonOverallState(
  dragons: DragonSystemState,
  state: DragonOverallState,
  countdown?: number,
): void {
  dragons.queen.overallState = state;
  if (countdown !== undefined) {
    dragons.queen.countdown = countdown;
  }
}

export function getHatchlingsState(dragons: DragonSystemState): DragonHatchlingsState {
  return {
    clutches: [...dragons.hatchlings.clutches],
    properties: [...dragons.hatchlings.properties],
    diet: [...dragons.hatchlings.diet],
    maturity: [...dragons.hatchlings.maturity],
  };
}

export function getNestState(dragons: DragonSystemState): DragonNestState {
  return {
    lining: { ...dragons.nest.lining },
  };
}

export function isDragonRecalcNeeded(dragons: DragonSystemState): boolean {
  return dragons.recalcNeeded;
}

export function markDragonRecalcNeeded(dragons: DragonSystemState): void {
  dragons.recalcNeeded = true;
}

// ---------------------------------------------------------------------------
// Boost-state builders
// ---------------------------------------------------------------------------

/**
 * Build dragon boost state from current engine state.
 * This extracts all boost ownership/power values needed for dragon calculations.
 */
export function buildDragonBoostState(access: DragonControllerAccess): DragonBoostState {
  const getBoost = (alias: string) => access.getBoost(alias);
  const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;
  const getLevel = (alias: string) => getBoost(alias)?.power ?? 0;

  return {
    // Digging multiplier boosts
    hasBucketAndSpade: hasBoost('Bucket and Spade'),
    hasStrengthPotion: hasBoost('Strength Potion'),
    strengthPotionPower: getLevel('Strength Potion'),
    hasGoldenBull: hasBoost('Golden Bull'),

    // Defence multiplier boosts
    hasHealingPotion: hasBoost('Healing Potion'),
    healingPotionPower: getLevel('Healing Potion'),
    hasOohShiny: hasBoost('Ooh, Shiny!'),
    goldLevel: getLevel('Gold'),
    hasClannesque: hasBoost('Clannesque'),
    cryogenicsLevel: getLevel('Cryogenics'),
    hasSpines: hasBoost('Spines'),
    spinesLevel: getLevel('Spines'),
    hasAdamantineArmour: hasBoost('Adamantine Armour'),
    adamantineArmourLevel: getLevel('Adamantine Armour'),
    hasMirrorScales: hasBoost('Mirror Scales'),
    mirrorScalesLevel: getLevel('Mirror Scales'),
    hasBaobabTreeFort: hasBoost('Baobab Tree Fort'),
    hasWotT: hasBoost('WotT'),

    // Attack multiplier boosts
    hasBigTeeth: hasBoost('Big Teeth'),
    bigTeethLevel: getLevel('Big Teeth'),
    hasMagicTeeth: hasBoost('Magic Teeth'),
    magicTeethLevel: getLevel('Magic Teeth'),
    hasTusks: hasBoost('Tusks'),
    tusksLevel: getLevel('Tusks'),
    hasBigBite: hasBoost('Big Bite'),
    bigBiteLevel: getLevel('Big Bite'),
    hasDoubleByte: hasBoost('Double Byte'),
    doubleByteLevel: getLevel('Double Byte'),
    hasTrilobite: hasBoost('Trilobite'),
    trilobiteLevel: getLevel('Trilobite'),
    hasDiamondDentures: hasBoost('Diamond Dentures'),
    hasWotP: hasBoost('WotP'),

    // Breath multiplier boosts
    hasAutumnOfMatriarch: hasBoost('Autumn of the Matriarch'),
    dqTotalLoses: access.dragons.queen.totalloses,
    hasMQALLOBS: hasBoost('MQALLOBS'),
    catalyzerPower: getLevel('Catalyzer'),

    // Luck boosts
    hasLuckyRing: hasBoost('Lucky Ring'),
    hasCupOfTea: hasBoost('Cup of Tea'),
    cupOfTeaPower: getLevel('Cup of Tea'),

    // Hide modifier
    hasChintzyTiara: hasBoost('Chintzy Tiara'),
  };
}

/**
 * Build digging boost state from current engine state.
 */
export function buildDragonDiggingBoostState(
  access: DragonControllerAccess,
): DragonDiggingBoostState {
  const getBoost = (alias: string) => access.getBoost(alias);
  const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;

  return {
    hasShades: hasBoost('Shades'),
    hasCutDiamonds: hasBoost('Cut Diamonds'),
    hasSparkle: hasBoost('Sparkle'),
    hasSeacoal: hasBoost('Seacoal'),
    hasSeaMining: hasBoost('Sea Mining'),
    seaMiningPower: getBoost('Sea Mining')?.power ?? 0,
  };
}

/**
 * Build combat boost state from current engine state.
 */
export function buildCombatBoostState(access: DragonControllerAccess): CombatBoostState {
  const getBoost = (alias: string) => access.getBoost(alias);
  const hasBoost = (alias: string) => (getBoost(alias)?.bought ?? 0) > 0;
  const getLevel = (alias: string) => getBoost(alias)?.power ?? 0;

  return {
    hasDragonBreath: hasBoost('Dragon Breath'),
    hasMouthwash: hasBoost('Mouthwash'),
    hasEthylAlcohol: hasBoost('Ethyl Alcohol'),
    ethylAlcoholAmount: getLevel('Ethyl Alcohol'),
    hasDragonfly: hasBoost('Dragonfly'),
    dragonflyLevel: getLevel('Dragonfly'),
    hasHealingPotion: hasBoost('Healing Potion'),
    healingPotionAmount: getLevel('Healing Potion'),
    hasCupOfTea: hasBoost('Cup of Tea'),
    cupOfTeaAmount: getLevel('Cup of Tea'),
    hasTupleOrNothing: hasBoost('Tuple or Nothing'),
    hasCamelflarge: hasBoost('Camelflarge'),
    camelflargeLevel: getLevel('Camelflarge'),
    hasHonorAmongSerpents: hasBoost('Honor Among Serpents'),
    hasCryogenics: hasBoost('Cryogenics'),
    cryogenicsLevel: getLevel('Cryogenics'),
    hasRoboticHatcher: hasBoost('Robotic Hatcher'),
    roboticHatcherEnabled: hasBoost('Robotic Hatcher') && (getBoost('Robotic Hatcher')?.isEnabled ?? true),
    goatsAmount: getLevel('Goats'),
  };
}

/**
 * Build dragon multipliers from current state.
 */
export function buildDragonMultipliers(access: DragonControllerAccess): DragonMultipliers {
  return {
    digMultiplier: access.dragons.digMultiplier,
    attackMultiplier: access.dragons.attackMultiplier,
    defenceMultiplier: access.dragons.defenceMultiplier,
    breathMultiplier: access.dragons.breathMultiplier,
    luck: access.dragons.luck,
    hideMod: access.dragons.hideMod,
  };
}

// ---------------------------------------------------------------------------
// Orchestrators
// ---------------------------------------------------------------------------

/**
 * Recalculate dragon system if needed.
 * Reference: dragons.js:467-550 (DragonDigRecalc)
 *
 * @returns Array of boost aliases to unlock (based on consecutive NPs)
 */
export function recalculateDragons(access: DragonControllerAccess): string[] {
  if (!access.dragons.recalcNeeded) {
    return [];
  }

  const boostState = buildDragonBoostState(access);
  const unlocks = recalculateDragonSystem(access.dragons, boostState);

  // Unlock boosts based on consecutive NPs with dragons
  for (const alias of unlocks) {
    access.unlockBoost(alias);
  }

  return unlocks;
}

/**
 * Process dragon digging for mNP tick or beach click.
 * Reference: dragons.js:552-651
 *
 * @param type - 'mnp' for tick-based digging, 'beach' for beach click
 * @returns Dig result if something was found, null otherwise
 */
export function processDragonDigging(
  access: DragonControllerAccess,
  type: DigType,
): DigResult | null {
  // Ensure dragon state is up to date
  if (access.dragons.recalcNeeded) {
    recalculateDragons(access);
  }

  const boosts = buildDragonDiggingBoostState(access);
  const result = digDragons(type, access.dragons, boosts);

  if (result) {
    // Add resources
    if (result.resource && result.amount > 0) {
      access.addResource(result.resource, result.amount);
    }

    // Earn badges
    if (result.earnedBadge) {
      access.earnBadge(result.earnedBadge);
    }

    // First find badge
    if (result.resource) {
      access.earnBadge('Found Something!');
    }

    // Unlock Beach Dragon
    if (result.unlockBeachDragon) {
      access.unlockBoost('Beach Dragon');
    }

    // Handle Sea Mining power increment
    if (type === 'beach' && boosts.hasSeaMining && boosts.seaMiningPower > 0) {
      const seaMiningBoost = access.getBoost('Sea Mining');
      if (seaMiningBoost) {
        seaMiningBoost.power++;
      }
    }
  }

  // Check for notification batch
  const finds = checkDiggingNotification(access.dragons);
  if (finds) {
    // In a real implementation, this would trigger a notification
    // For now, we just clear the finds (already done in checkDiggingNotification)
  }

  return result;
}

/**
 * Fledge a clutch of dragons at the current NP.
 * Reference: dragons.js:680-785 (DragonFledge)
 *
 * @param clutchIndex - Index of the clutch to fledge
 * @returns Fledge result
 */
export function fledgeDragonClutch(
  access: DragonControllerAccess,
  clutchIndex: number,
): FledgeResult {
  // Ensure dragon state is up to date
  if (access.dragons.recalcNeeded) {
    recalculateDragons(access);
  }

  const combatBoosts = buildCombatBoostState(access);
  const hasTopiary = access.hasBoost('Topiary');

  const result = dragonFledge(
    clutchIndex,
    access.getNewpixNumber(),
    access.dragons,
    combatBoosts,
    hasTopiary,
  );

  // Apply badges
  for (const badge of result.badges) {
    access.earnBadge(badge);
  }

  // Apply unlocks
  for (const unlock of result.unlocks) {
    access.unlockBoost(unlock);
  }

  // Unlock Topiary
  if (result.unlockTopiary) {
    access.unlockBoost('Topiary');
  }

  // Apply combat outcome state changes
  if (result.combatResult && result.combatResult.result !== 0) {
    applyCombatStateChanges(access, result.combatResult, result.opponents!);
  }

  // Recalculate dragon aggregates
  recalculateDragons(access);

  // Post-fledge unlocks
  if (access.dragons.totalNPsWithDragons > 11) {
    access.unlockBoost('Dragon Overview');
  }
  if (access.dragons.totalNPsWithDragons > 111 && access.hasBoost('Dragon Overview')) {
    access.unlockBoost('Woolly Jumper');
  }

  return result;
}

/**
 * Run combat at a specific NP against opponents.
 * Reference: dragons.js:827-1066 (OpponentsAttack)
 *
 * @param where - NP where combat occurs
 * @param opponents - Opponent instance
 * @param breathtype - Breath attack type index (0=none)
 * @param fighttype - 0=fledge, 1=RedundaKnight attack
 * @returns Combat outcome
 */
export function runDragonCombat(
  access: DragonControllerAccess,
  where: number,
  opponents: OpponentInstance,
  breathtype: number,
  fighttype: number,
): CombatOutcome | null {
  const npd = access.dragons.npData.get(where);
  if (!npd || npd.amount <= 0) return null;

  // Ensure dragon state is up to date
  if (access.dragons.recalcNeeded) {
    recalculateDragons(access);
  }

  const multipliers = buildDragonMultipliers(access);
  const combatBoosts = buildCombatBoostState(access);

  const outcome = processCombatOutcome(
    where, opponents, npd, access.dragons, multipliers, combatBoosts, breathtype, fighttype,
  );

  applyCombatOutcome(access, outcome);
  return outcome;
}

/**
 * Apply combat outcome to engine state (rewards, state changes, etc).
 */
export function applyCombatOutcome(
  access: DragonControllerAccess,
  outcome: CombatOutcome,
): void {
  // Apply rewards
  for (const reward of outcome.rewards) {
    if (reward.resource !== 'Thing') {
      access.addResource(reward.resource, reward.amount);
    }
  }

  // Apply experience
  if (outcome.experience > 0) {
    access.addResource('exp', outcome.experience);
  }

  // Apply state changes
  if (outcome.stateChange !== null) {
    access.dragons.queen.overallState = outcome.stateChange;
    if (outcome.countdown > 0) {
      access.dragons.queen.countdown = outcome.countdown;
    }
  }

  // Apply badges
  for (const badge of outcome.badges) {
    access.earnBadge(badge);
  }

  // Apply unlocks
  for (const unlock of outcome.unlocks) {
    access.unlockBoost(unlock);
  }

  access.dragons.recalcNeeded = true;
}

/**
 * Apply combat state changes from a fledge combat result.
 */
export function applyCombatStateChanges(
  access: DragonControllerAccess,
  stats: CombatStats,
  opponents: OpponentInstance,
): void {
  void opponents;
  // State changes from combat are handled within dragonFledge -> opponentsAttack
  // The npd.amount is already mutated by opponentsAttack
  // We just need to apply recovery state if needed
  if (stats.recoveryTime > 0) {
    access.dragons.queen.overallState = 1; // Recovering
    access.dragons.queen.countdown = stats.recoveryTime;
  }
  if (stats.result === 3 && access.dragons.queen.overallState !== 0) {
    access.dragons.queen.overallState = 0; // Back to digging on easy victory
  }
}

/**
 * Generate and execute a RedundaKnight attack.
 * Reference: dragons.js:1068-1101
 *
 * @param breathtype - Breath type to use in response
 * @returns Combat outcome, or null if no dragons to attack
 */
export function handleRedundaKnightAttack(
  access: DragonControllerAccess,
  breathtype: number,
): CombatOutcome | null {
  if (access.dragons.totalDragons === 0) return null;

  const princessLevel = access.getBoostPower('Princesses');
  const dragonflyLevel = access.getBoostPower('Dragonfly');

  const knight = generateRedundaKnight(access.dragons, dragonflyLevel, princessLevel);
  return runDragonCombat(access, knight.target, knight, breathtype, 1);
}

/**
 * Make dragons hide from opponents.
 * Reference: dragons.js:1111-1117 (DragonsHide)
 *
 * @param opponentType - Type of opponent being hidden from
 */
export function hideDragonsFromOpponents(
  access: DragonControllerAccess,
  opponentType: number,
): void {
  const camelflargeLevel = access.getBoostPower('Camelflarge');
  const hideTime = calculateHideTime(
    opponentType,
    access.dragons.queen.Level,
    camelflargeLevel,
    access.dragons.hideMod,
  );

  access.dragons.queen.overallState = 2; // Hiding
  access.dragons.queen.countdown = hideTime;
}
