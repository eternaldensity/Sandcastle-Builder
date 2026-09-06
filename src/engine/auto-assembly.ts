/**
 * Auto-Assembly & Blast Furnace (RunFastFactory)
 *
 * After Tool Factory produces glass tools each mNP, if Automata Assemble (AA)
 * is enabled, the system consumes tools to perform Blast Furnace runs and
 * secondary automation tasks (Mario/Logicat, Milo/Blackprints, Zoo Keep).
 *
 * Reference: boosts.js:5266-5313 (AA tool consumption)
 *            boosts.js:5315-5397 (RunFastFactory)
 *            boosts.js:5399-5409 (zooKeep)
 */

import { TF_ORDER } from './tool-factory.js';
import { parsePriceValue } from './price-calculator.js';

// =============================================================================
// AA Tool Consumption (boosts.js:5266-5313)
// =============================================================================

/**
 * State for AA tool consumption after Tool Factory production.
 */
export interface AAConsumptionState {
  /** acPower from TF production (0 if AA disabled) */
  acPower: number;

  /** Whether TF production used the fast path */
  usedFastPath: boolean;

  /** Number of mustard-converted tools */
  mustardTools: number;

  /** Whether Mustard Automation boost is bought */
  mustardAutomationBought: boolean;

  /** Amount of Mustard resource available */
  mustardAmount: number;

  /** Current tool amounts in TF_ORDER (12 entries) */
  toolAmounts: number[];

  /** Tool prices in TF_ORDER (12 entries) */
  toolPrices: number[];

  /** Current price factor */
  priceFactor: number;

  /** Flipside power (0 or 1) */
  flipsidePower: number;
}

/**
 * Result of AA tool consumption.
 */
export interface AAConsumptionResult {
  /** Number of times to run the fast factory */
  fastFactoryRuns: number;

  /** Number of tools consumed per tool type (0 if fast/mustard path) */
  toolsConsumed: number;

  /** Amount of mustard spent (20 if mustard path used) */
  mustardSpent: number;

  /** Updated tool amounts after consumption (only changed in regular path) */
  updatedToolAmounts: number[];
}

/**
 * Calculate AA tool consumption after Tool Factory production.
 *
 * Three paths:
 * 1. Mustard: if mustardTools > 0 and Mustard Automation bought, spend 20 Mustard
 * 2. Fast: if TF used fast path, skip tool consumption
 * 3. Regular: consume 1 of each tool per iteration, capped at min(acPower, 1000)
 *
 * Reference: boosts.js:5266-5313
 */
export function calculateAAConsumption(state: AAConsumptionState): AAConsumptionResult {
  const result: AAConsumptionResult = {
    fastFactoryRuns: 0,
    toolsConsumed: 0,
    mustardSpent: 0,
    updatedToolAmounts: [...state.toolAmounts],
  };

  if (state.acPower === 0) return result;

  // Mustard path: if mustard tools exist, try Mustard Automation
  if (state.mustardTools > 0) {
    if (state.mustardAutomationBought && state.mustardAmount >= 20) {
      result.fastFactoryRuns = state.acPower;
      result.mustardSpent = 20;
    }
    return result;
  }

  // Fast path: if TF used fast path, skip tool consumption
  if (state.usedFastPath) {
    result.fastFactoryRuns = state.acPower;
    return result;
  }

  // Regular path: find minimum tool amount, consume tools iteratively
  let minAmount = Infinity;
  for (let t = 0; t < TF_ORDER.length; t++) {
    minAmount = Math.min(state.toolAmounts[t], minAmount);
  }

  if (isFinite(minAmount)) {
    // Cap iterations at min(acPower, 1000)
    let iterations = Math.min(state.acPower, 1000);
    let times = 0;
    const amounts = [...state.toolAmounts];
    const fVal = state.flipsidePower;

    while (iterations-- > 0) {
      // Check all tools: must have amount > 0 AND (infinite price when fVal=0)
      let valid = true;
      for (let t = TF_ORDER.length - 1; t >= 0; t--) {
        if (
          (isFinite(state.priceFactor * state.toolPrices[t]) && !fVal) ||
          amounts[t] <= 0
        ) {
          valid = false;
          break;
        }
      }
      if (!valid) break;

      // Consume 1 of each tool
      for (let t = TF_ORDER.length - 1; t >= 0; t--) {
        amounts[t]--;
      }
      times++;
    }

    result.fastFactoryRuns = times;
    result.toolsConsumed = times;
    result.updatedToolAmounts = amounts;
  } else {
    // All tools are infinite — run acPower times directly
    result.fastFactoryRuns = state.acPower;
  }

  return result;
}

// =============================================================================
// RunFastFactory (boosts.js:5315-5397)
// =============================================================================

/**
 * State for RunFastFactory distribution.
 */
export interface FastFactoryState {
  /** Whether Mario boost is enabled */
  marioEnabled: boolean;

  /** Mario.bought (determines logicat reward level) */
  marioBought: number;

  /** QQ resource level (cost for Mario) */
  qqLevel: number;

  /** Whether AE (Automation Engine) boost is bought */
  aeBought: boolean;

  /** Whether CfB (Construction from Blackprints) boost is bought */
  cfbBought: boolean;

  /** Whether Milo boost is bought */
  miloBought: boolean;

  /** Current Milo.power accumulator */
  miloPower: number;

  /** Whether Rush Job boost is bought */
  rushJobBought: boolean;

  /** Whether ZK (Zoo Keep) boost is bought */
  zkBought: boolean;

  /** Current ZK.power accumulator */
  zkPower: number;

  /** Redacted.totalClicks (redundakitty total clicks) */
  redactedTotalClicks: number;

  /** Logicat.bought count */
  logicatBought: number;

  /** Whether LogiPuzzle boost is bought */
  logiPuzzleBought: boolean;

  /** LogiPuzzle level */
  logiPuzzleLevel: number;

  /** PokeBar threshold for zoo keep */
  pokeBarThreshold: number;

  /** Whether Shadow Feeder boost is bought */
  shadowFeederBought: boolean;

  /** Whether Shadow Feeder boost is enabled */
  shadowFeederEnabled: boolean;

  /** Shadow Feeder power (must be below PokeBar to feed) */
  shadowFeederPower: number;

  /** LogiPuzzle power (needs 100 for the feeder) */
  logiPuzzlePower: number;

  /** Whether ShadwDrgn boost is bought */
  shadwDrgnBought: boolean;

  /** Bonemeal power (feeder spends 5, coda spends 1WW) */
  bonemealPower: number;

  /** Whether Bananananas boost is enabled (caged-puzzle branches) */
  banananasEnabled: boolean;

  /** Whether the caged puzzle generator is active */
  cagedActive: boolean;

  /** Caged puzzle count */
  cagedPuzzles: number;

  /** Whether Shadow Ninja boost is bought (ritual trigger) */
  shadowNinjaBought: boolean;

  /** Ninja Ritual level (ritual trigger needs > 777) */
  ninjaRitualLevel: number;

  /** Whether the worn-out ritual badge is earned (coda trigger) */
  ritualWornOut: boolean;

  /** Whether castles are infinite (coda path) */
  castlesInfinite: boolean;

  /** Whether coda boost is bought */
  codaBought: boolean;

  /** Whether coda boost is enabled */
  codaEnabled: boolean;
}

/**
 * Result from RunFastFactory.
 */
export interface FastFactoryResult {
  /** Number of blast furnace runs */
  blastFurnaceRuns: number;

  /** QQ spent for Mario */
  qqSpent: number;

  /** Number of logicat reward batches from Mario */
  logicatRewardBatches: number;

  /** Blackprint construction runs (from CfB) */
  blackprintConstructionRuns: number;

  /** Mould work runs (from AE) */
  mouldWorkRuns: number;

  /** Updated Milo power accumulator */
  updatedMiloPower: number;

  /** Blackprint pages generated by Milo */
  blackprintPages: number;

  /** Updated ZK power accumulator */
  updatedZKPower: number;

  /** Number of zoo visits (Panther Poke triggers) */
  zooVisits: number;

  /** ShadowStrike(1) happened (feeder and coda paths) */
  shadowStrike: boolean;

  /** Shadow Feeder power gained */
  shadowFeederGain: number;

  /** Bonemeal spent (5 feeder, 1WW coda) */
  bonemealSpent: number;

  /** The engine should call NinjaRitual() after applying */
  ninjaRitualTrigger: boolean;

  /** Sync caged puzzles to LogiPuzzle level (Bananananas branch) */
  cagedSyncPuzzles: boolean;

  /** Caged puzzles to generate, 0 for none (engine spends cagedGenerateCost if affordable) */
  cagedGeneratePuz: number;

  /** GlassBlocks cost of the caged generation */
  cagedGenerateCost: number;

  /** Coda path also runs zooKeep(left) */
  runZooKeep: boolean;
}

/**
 * Run the Fast Factory distribution algorithm.
 *
 * Distributes `times` across multiple systems:
 * 1. Mario (Logicat automation)
 * 2. AE (Automation Engine): CfB + Mould Work
 * 3. Blast Furnace
 * 4. Milo (Blackprint generation)
 * 5. Zoo Keep (Panther Poke)
 *
 * Note: Uses Math.random() for blast furnace and milo/zookeep distribution,
 * so results are non-deterministic. For deterministic testing, use the
 * overload that accepts a random number generator.
 *
 * Reference: boosts.js:5315-5397
 */
/**
 * PokeBar threshold: LogiPuzzle power needed for Panther Poke.
 * Reference: boosts.js:5964 (Molpy.PokeBar)
 */
export function calculatePokeBar(prLevel: number, cdspPower: number, acLevel: number): number {
  return Math.floor(
    4 +
      prLevel * (1 + cdspPower) * (cdspPower ? Math.max(1, Math.log(acLevel) - 10, 1) : 1),
  );
}

/**
 * Logicat multiplier: DeMolpify(s) x Logicat bought.
 * Reference: boosts.js:4192 (Molpy.LogiMult)
 */
function logiMult(state: FastFactoryState, s: string): number {
  return parsePriceValue(s) * state.logicatBought;
}

export function runFastFactory(
  times: number,
  state: FastFactoryState,
  rng: () => number = Math.random
): FastFactoryResult {
  const result: FastFactoryResult = {
    blastFurnaceRuns: 0,
    qqSpent: 0,
    logicatRewardBatches: 0,
    blackprintConstructionRuns: 0,
    mouldWorkRuns: 0,
    updatedMiloPower: state.miloPower,
    blackprintPages: 0,
    updatedZKPower: state.zkPower,
    zooVisits: 0,
    shadowStrike: false,
    shadowFeederGain: 0,
    bonemealSpent: 0,
    ninjaRitualTrigger: false,
    cagedSyncPuzzles: false,
    cagedGeneratePuz: 0,
    cagedGenerateCost: 0,
    runZooKeep: false,
  };

  if (times <= 0) return result;

  // 1. Mario: Logicat automation (boosts.js:5317-5329)
  if (state.marioEnabled) {
    const l = state.marioBought;
    const cost = l * (l + 1) / 2;
    if (state.qqLevel >= cost) {
      result.qqSpent = cost;
      // 25 batches + remainder
      result.logicatRewardBatches = 26; // 25 floor batches + 1 remainder
    }
  }

  let left = times;

  // 2. AE: Automation Engine (boosts.js:5331-5336)
  if (state.aeBought) {
    if (state.cfbBought) {
      result.blackprintConstructionRuns = left;
    }
    result.mouldWorkRuns = left;
  }

  // 3. Blast Furnace (boosts.js:5339-5343)
  if (times > 0) {
    const furn = Math.floor((times + rng() * 3) / 2);
    result.blastFurnaceRuns = furn;
    left = times - furn;
  }

  // 4. Milo: Blackprint generation (boosts.js:5345-5356)
  if (left > 7 && state.miloBought) {
    const s = 0; // Legacy has this commented out: Math.sin(...)
    const draft = rng() * (1 + 2 * s) * (left - 7);
    let miloPower = state.miloPower + draft * (state.rushJobBought ? 5 : 1);
    left -= draft;
    const pages = Math.floor(miloPower / 100);
    miloPower -= 100 * pages;
    result.updatedMiloPower = miloPower;
    result.blackprintPages = pages;
  }

  // 5. Zoo Keep: Panther Poke (boosts.js:5357-5395, 5399-5409)
  if (
    left > 10 &&
    state.redactedTotalClicks > 2500 &&
    state.zkBought &&
    state.logicatBought >= 4 &&
    state.logiPuzzleBought
  ) {
    if (state.logiPuzzleLevel >= state.pokeBarThreshold) {
      const pokeBar = state.pokeBarThreshold;
      if (
        state.shadowFeederBought &&
        state.shadowFeederEnabled &&
        state.logiPuzzlePower >= 100 &&
        state.shadwDrgnBought &&
        state.shadowFeederPower < pokeBar &&
        state.bonemealPower >= 5
      ) {
        result.bonemealSpent = 5;
        if (
          state.banananasEnabled &&
          state.cagedActive &&
          state.cagedPuzzles < state.logiPuzzleLevel
        ) {
          // Sync caged puzzles; engine zeroes LogiPuzzle on apply
          result.cagedSyncPuzzles = true;
        } else if (state.banananasEnabled && !state.cagedActive) {
          // Priced generation; engine spends the cost if affordable
          const puz = Math.floor((state.logiPuzzleLevel - 1) / 10) * 10;
          result.cagedGeneratePuz = puz;
          result.cagedGenerateCost = (100 + logiMult(state, '25')) * puz;
        } else {
          result.shadowStrike = true;
          result.shadowFeederGain = 1;
          if (
            state.shadowNinjaBought &&
            state.ninjaRitualLevel > 777 &&
            !state.marioEnabled &&
            Math.log(state.ninjaRitualLevel) * rng() > 5
          ) {
            result.ninjaRitualTrigger = true;
          }
        }
      } else if (
        state.codaBought &&
        state.codaEnabled &&
        !state.shadowFeederEnabled &&
        state.castlesInfinite &&
        state.bonemealPower >= parsePriceValue('1WW')
      ) {
        result.shadowStrike = true;
        result.runZooKeep = true;
        if (state.ritualWornOut && !state.marioEnabled) {
          result.ninjaRitualTrigger = true;
        }
        result.bonemealSpent = parsePriceValue('1WW');
      } else {
        const zooResult = calculateZooKeep(left, state.zkPower, rng);
        result.updatedZKPower = zooResult.updatedPower;
        result.zooVisits = zooResult.zooVisits;
      }
    }
  }

  return result;
}

// =============================================================================
// Zoo Keep (boosts.js:5399-5409)
// =============================================================================

/**
 * State and result for zoo keep calculation.
 */
interface ZooKeepResult {
  updatedPower: number;
  zooVisits: number;
}

/**
 * Calculate zoo keep poke accumulation.
 *
 * Accumulates random poke value into ZK.power, converts every 1000 into
 * a Panther Poke buy (zoo visit).
 *
 * Reference: boosts.js:5399-5409
 */
export function calculateZooKeep(
  left: number,
  zkPower: number,
  rng: () => number = Math.random
): ZooKeepResult {
  const poke = rng() * (left - 10);
  let power = zkPower + poke;
  if (power < 0) power = 0;
  const zooVisits = Math.floor(power / 1000);
  power -= zooVisits * 1000;

  return {
    updatedPower: power,
    zooVisits,
  };
}
