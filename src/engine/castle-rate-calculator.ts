/**
 * Castle Tool Production Rate Calculator
 *
 * Calculates production rates for castle tools (NewPixBot, Trebuchet, Scaffold, Wave, River).
 * Each tool has a base rate and multipliers from various boosts.
 *
 * Reference: Legacy tools.js castle tool rate calculations
 */

/**
 * State needed to calculate castle tool rates.
 * Contains tool amounts and boost states that affect production.
 */
export interface CastleToolRateState {
  // Tool amounts
  newPixBots: number;
  trebuchets: number;
  scaffolds: number;
  waves: number;
  rivers: number;

  // Glass Ceiling support
  glassCeilings: number[];  // Array of owned glass ceiling indices (0-11)
  wwbBought: number;        // WWB boost bought level
  scaffoldAmount: number;   // Number of scaffolds for WWB calculation

  // NewPixBot boost multipliers
  busyBot: boolean;
  robotEfficiency: boolean;
  robotEfficiencyPower: number;
  recursivebot: boolean;
  halOKitty: boolean;
  halBoost: number;

  // Trebuchet boost multipliers
  springFling: boolean;
  trebuchetPong: boolean;
  trebuchetPongPower: number;
  flingbot: boolean;
  variedAmmo: boolean;
  variedAmmoPower: number;

  // Scaffold boost multipliers
  precisePlacement: boolean;
  levelUp: boolean;
  propbot: boolean;

  // Wave boost multipliers
  swell: boolean;
  surfbot: boolean;
  sbtf: boolean;
  sbtfPower: number;

  // River boost multipliers
  smallbot: boolean;
}

/**
 * All castle tool rates calculated together.
 */
export interface CastleToolRates {
  NewPixBot: number;
  Trebuchet: number;
  Scaffold: number;
  Wave: number;
  River: number;
}

/**
 * Calculate Glass Ceiling multiplier for castle tools.
 * Reference: boosts.js:3424-3430
 *
 * Glass Ceiling indices for castle tools:
 * - 1: NewPixBot
 * - 3: Trebuchet
 * - 5: Scaffold
 * - 7: Wave
 * - 9: River
 */
function calculateGlassCeilingMult(
  glassCeilings: number[],
  wwbBought: number,
  scaffoldAmount: number
): number {
  const ceilingCount = glassCeilings.length;
  if (ceilingCount === 0) return 1;

  let acPower = 33;
  if (wwbBought > 0) {
    acPower *= Math.pow(2, wwbBought - 5) * scaffoldAmount;
  }

  return Math.pow(acPower, ceilingCount);
}

/**
 * Calculate NewPixBot production rate.
 * Reference: tools.js:260-290
 *
 * Base rate: 3.5 castles per mNP
 * Multipliers:
 * - Glass Ceiling 1: ×GlassCeilingMult()
 * - Busy Bot: ×2
 * - Robot Efficiency: ×power (capped at 1000)
 * - Recursivebot: ×4
 * - HAL-0-Kitty: ×1.1^min(halBoost, 100)
 */
export function calculateNewPixBotRate(state: CastleToolRateState): number {
  const baseRate = 3.5;
  let mult = 1;

  // Glass Ceiling 1 (NewPixBot castles)
  if (state.glassCeilings.includes(1)) {
    mult *= calculateGlassCeilingMult(state.glassCeilings, state.wwbBought, state.scaffoldAmount);
  }

  if (state.busyBot) {
    mult *= 2;
  }

  if (state.robotEfficiency) {
    // Robot Efficiency power is capped at 1000
    mult *= Math.min(state.robotEfficiencyPower, 1000);
  }

  if (state.recursivebot) {
    mult *= 4;
  }

  if (state.halOKitty) {
    // HAL boost is capped at 100
    mult *= Math.pow(1.1, Math.min(state.halBoost, 100));
  }

  return baseRate * mult;
}

/**
 * Calculate Trebuchet production rate.
 * Reference: tools.js:310-340
 *
 * Base rate: 6.25 castles per mNP
 * Multipliers:
 * - Glass Ceiling 3: ×GlassCeilingMult()
 * - Spring Fling: ×1.5
 * - Trebuchet Pong: ×1.2^power
 * - Flingbot: ×4
 * - Varied Ammo: ×(1 + power × 0.1)
 */
export function calculateTrebuchetRate(state: CastleToolRateState): number {
  const baseRate = 6.25;
  let mult = 1;

  // Glass Ceiling 3 (Trebuchet castles)
  if (state.glassCeilings.includes(3)) {
    mult *= calculateGlassCeilingMult(state.glassCeilings, state.wwbBought, state.scaffoldAmount);
  }

  if (state.springFling) {
    mult *= 1.5;
  }

  if (state.trebuchetPong) {
    mult *= Math.pow(1.2, state.trebuchetPongPower);
  }

  if (state.flingbot) {
    mult *= 4;
  }

  if (state.variedAmmo) {
    // Varied Ammo adds 10% per power level
    mult *= (1 + state.variedAmmoPower * 0.1);
  }

  return baseRate * mult;
}

/**
 * Calculate Scaffold production rate.
 * Reference: tools.js:360-385
 *
 * Base rate: 15.63 castles per mNP
 * Multipliers:
 * - Glass Ceiling 5: ×GlassCeilingMult()
 * - Precise Placement: ×1.5
 * - Level Up!: ×2
 * - Propbot: ×4
 */
export function calculateScaffoldRate(state: CastleToolRateState): number {
  const baseRate = 15.63;
  let mult = 1;

  // Glass Ceiling 5 (Scaffold castles)
  if (state.glassCeilings.includes(5)) {
    mult *= calculateGlassCeilingMult(state.glassCeilings, state.wwbBought, state.scaffoldAmount);
  }

  if (state.precisePlacement) {
    mult *= 1.5;
  }

  if (state.levelUp) {
    mult *= 2;
  }

  if (state.propbot) {
    mult *= 4;
  }

  return baseRate * mult;
}

/**
 * Calculate Wave production rate.
 * Reference: tools.js:405-430
 *
 * Base rate: 39.06 castles per mNP
 * Multipliers:
 * - Glass Ceiling 7: ×GlassCeilingMult()
 * - Swell: ×2
 * - Surfbot: ×4
 * - SBTF: ×power
 */
export function calculateWaveRate(state: CastleToolRateState): number {
  const baseRate = 39.06;
  let mult = 1;

  // Glass Ceiling 7 (Wave castles)
  if (state.glassCeilings.includes(7)) {
    mult *= calculateGlassCeilingMult(state.glassCeilings, state.wwbBought, state.scaffoldAmount);
  }

  if (state.swell) {
    mult *= 2;
  }

  if (state.surfbot) {
    mult *= 4;
  }

  if (state.sbtf) {
    // SBTF multiplies by its power directly
    mult *= state.sbtfPower;
  }

  return baseRate * mult;
}

/**
 * Calculate River production rate.
 * Reference: tools.js:450-475
 *
 * Base rate: 97.66 castles per mNP
 * Multipliers:
 * - Glass Ceiling 9: ×GlassCeilingMult()
 * - Smallbot: ×4
 */
export function calculateRiverRate(state: CastleToolRateState): number {
  const baseRate = 97.66;
  let mult = 1;

  // Glass Ceiling 9 (River castles)
  if (state.glassCeilings.includes(9)) {
    mult *= calculateGlassCeilingMult(state.glassCeilings, state.wwbBought, state.scaffoldAmount);
  }

  if (state.smallbot) {
    mult *= 4;
  }

  return baseRate * mult;
}

/**
 * Calculate all castle tool rates at once.
 * This is the main function to use for getting all rates.
 */
export function calculateAllCastleToolRates(state: CastleToolRateState): CastleToolRates {
  return {
    NewPixBot: calculateNewPixBotRate(state),
    Trebuchet: calculateTrebuchetRate(state),
    Scaffold: calculateScaffoldRate(state),
    Wave: calculateWaveRate(state),
    River: calculateRiverRate(state),
  };
}
