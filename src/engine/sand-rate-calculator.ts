/**
 * Sand Rate Calculator
 *
 * Calculates per-tool sand production rates and global multipliers.
 * Reference: tools.js spmNP functions, boosts.js calculateSandRates
 */

export interface SandToolRateState {
  // Tool amounts
  buckets: number;
  cuegans: number;
  flags: number;
  ladders: number;
  bags: number;
  laPetite: number;
  trebuchets: number;
  scaffolds: number;
  waves: number;
  rivers: number;
  newPixBots: number;

  // Boost powers
  biggerBucketsPower: number;
  helpingHandPower: number;
  flagBearerPower: number;
  extensionLadderPower: number;

  // Boost ownership flags
  glassCeiling: number[];  // Array of owned glass ceilings (0-11)
  hugeBuckets: boolean;
  trebuchetPong: boolean;
  carrybot: boolean;
  buccaneer: boolean;
  flyingBuckets: boolean;
  megball: boolean;
  cooperation: boolean;
  stickbot: boolean;
  theForty: boolean;
  humanCannonball: boolean;
  magicMountain: boolean;
  standardbot: boolean;
  balancingAct: boolean;
  sbtf: boolean;
  flyTheFlag: boolean;
  ninjaClimber: boolean;
  levelUp: boolean;
  climbbot: boolean;
  brokenRung: boolean;
  upUpAndAway: boolean;
  embaggening: boolean;
  sandbag: boolean;
  luggagebot: boolean;
  bagPuns: boolean;
  airDrop: boolean;
  frenchbot: boolean;
  bacon: boolean;

  // For global multipliers
  ninjaStealth: number;
  badgesOwned: number;
  glassUse: number;  // Percentage of sand rate used by glass production

  // Global multiplier boosts
  molpies: boolean;
  grapevine: boolean;
  chirpies: boolean;
  facebugs: boolean;
  overcompensating: boolean;
  overcompensatingPower: number;
  blitzing: boolean;
  blitzingPower: number;
  bbc: boolean;
  bbcPower: number;
  rbBought: number;  // Redundant Boosts bought count for BBC
  hugo: boolean;
  npLength: number;  // For Overcompensating check
  wwbBought: number;  // WWB bought count for Glass Ceiling
  scaffoldAmount: number;  // For WWB Glass Ceiling calculation
}

/**
 * Calculate Glass Ceiling multiplier.
 * Reference: boosts.js:3424-3430
 */
export function calculateGlassCeilingMult(
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
 * Calculate BBC (Big Bonus Counter?) multiplier.
 * Reference: boosts.js:3352-3359
 */
export function calculateBBCMult(bbcPower: number, rbBought: number): number {
  if (bbcPower <= 0) return 1;
  return 20 * Math.pow(200, rbBought);
}

/**
 * Calculate Bucket sand production rate.
 * Reference: tools.js:9-21
 */
export function calculateBucketRate(state: SandToolRateState): number {
  let baseRate = 0.1 + state.biggerBucketsPower * 0.1;
  let mult = 1;

  if (state.glassCeiling.includes(0)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.hugeBuckets) mult *= 2;
  if (state.trebuchetPong && state.trebuchets > 0) {
    mult *= Math.pow(1.5, Math.min(Math.floor(state.trebuchets / 2), 2000));
  }
  if (state.carrybot) mult *= 4;
  if (state.buccaneer) mult *= 2;
  if (state.flyingBuckets && state.trebuchets > 0) {
    mult *= state.trebuchets;
  }

  return mult * baseRate;
}

/**
 * Calculate Cuegan sand production rate.
 * Reference: tools.js:42-56
 */
export function calculateCueganRate(state: SandToolRateState): number {
  let baseRate = 0.6 + state.helpingHandPower * 0.2;
  let mult = 1;

  if (state.glassCeiling.includes(2)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.megball) mult *= 2;
  if (state.cooperation && state.buckets > 0) {
    mult *= Math.pow(1.05, Math.min(Math.floor(state.buckets / 2), 8000));
  }
  if (state.stickbot) mult *= 4;
  if (state.theForty) mult *= 40;
  if (state.humanCannonball && state.trebuchets > 0) {
    mult *= 2 * state.trebuchets;
  }

  return baseRate * mult;
}

/**
 * Calculate Flag sand production rate.
 * Reference: tools.js:77-98
 */
export function calculateFlagRate(state: SandToolRateState): number {
  let baseRate = 8 + state.flagBearerPower * 2;
  let mult = 1;

  if (state.glassCeiling.includes(4)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.magicMountain) mult *= 2.5;
  if (state.standardbot) mult *= 4;
  if (state.balancingAct && state.scaffolds > 0) {
    mult *= Math.pow(1.05, Math.min(state.scaffolds, 2000));
  }
  if (state.flyTheFlag && state.trebuchets > 0) {
    mult *= 10 * state.trebuchets;
  }
  // SBTF wave parity logic is complex, defer for now

  return baseRate * mult;
}

/**
 * Calculate Ladder sand production rate.
 * Reference: tools.js:118-147
 */
export function calculateLadderRate(state: SandToolRateState): number {
  let baseRate = 54 + state.extensionLadderPower * 18;
  let mult = 1;

  if (state.ninjaClimber && state.ninjaStealth > 0) {
    mult *= state.ninjaStealth;
  }
  if (state.glassCeiling.includes(6)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.levelUp) mult *= 2;
  if (state.climbbot) mult *= 4;
  if (state.brokenRung) {
    const minTools = Math.min(
      state.buckets, state.cuegans, state.flags,
      state.ladders, state.bags, state.laPetite
    );
    if (minTools > 0) mult *= minTools;
  }
  if (state.upUpAndAway && state.trebuchets > 0) {
    mult *= 10 * state.trebuchets;
  }

  return baseRate * mult;
}

/**
 * Calculate Bag sand production rate.
 * Reference: tools.js:166-180
 */
export function calculateBagRate(state: SandToolRateState): number {
  const baseRate = 600;
  let mult = 1;

  if (state.glassCeiling.includes(8)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.embaggening && state.cuegans > 14) {
    mult *= Math.pow(1.02, Math.min(state.cuegans - 14, 8000));
  }
  if (state.sandbag && state.rivers > 0) {
    mult *= Math.pow(1.05, Math.min(state.rivers, 2000));
  }
  if (state.luggagebot) mult *= 4;
  if (state.bagPuns) mult *= 2;
  if (state.airDrop) mult *= 5;

  return baseRate * mult;
}

/**
 * Calculate LaPetite sand production rate.
 * Reference: tools.js:199-211
 */
export function calculateLaPetiteRate(state: SandToolRateState): number {
  const baseRate = 2e137;
  let mult = 1;

  if (state.glassCeiling.includes(10)) {
    mult *= calculateGlassCeilingMult(state.glassCeiling, state.wwbBought, state.scaffoldAmount);
  }
  if (state.frenchbot) mult *= 1e42;
  if (state.bacon && state.newPixBots > 0) {
    mult *= Math.pow(1.03, state.newPixBots);
  }

  return mult * baseRate;
}

/**
 * Calculate per-tool rates for all sand tools.
 */
export function calculateAllSandToolRates(state: SandToolRateState): Record<string, number> {
  return {
    Bucket: calculateBucketRate(state),
    Cuegan: calculateCueganRate(state),
    Flag: calculateFlagRate(state),
    Ladder: calculateLadderRate(state),
    Bag: calculateBagRate(state),
    LaPetite: calculateLaPetiteRate(state),
  };
}

/**
 * Calculate global sand rate multiplier.
 * Reference: boosts.js:7394-7451
 */
export function calculateGlobalSandMultiplier(state: SandToolRateState): number {
  let multiplier = 1;

  // Badge-based multipliers (additive)
  if (state.molpies) multiplier += 0.01 * state.badgesOwned;
  if (state.grapevine) multiplier += 0.02 * state.badgesOwned;
  if (state.chirpies) multiplier += 0.05 * state.badgesOwned;
  if (state.facebugs) multiplier += 0.1 * state.badgesOwned;

  // Overcompensating (only in longpix)
  if (state.overcompensating && state.npLength > 1800) {
    multiplier += state.overcompensatingPower;
  }

  // Blitzing (multiplicative)
  if (state.blitzing && state.blitzingPower > 0) {
    multiplier *= state.blitzingPower / 100;
  }

  // BBC (multiplicative)
  if (state.bbc && state.bbcPower > 0) {
    multiplier *= calculateBBCMult(state.bbcPower, state.rbBought);
  }

  // Glass usage penalty (multiplicative)
  if (state.glassUse > 0) {
    multiplier *= Math.max(0, (100 - state.glassUse) / 100);
  }

  // Hugo (multiplicative)
  if (state.hugo) multiplier *= 1.1;

  return multiplier;
}

/**
 * Calculate the click-applicable global multiplier.
 *
 * This is the subset of the full global multiplier that applies to sand-per-click.
 * Only includes: Molpies, Grapevine, Ch*rpies, Blitzing.
 * Does NOT include: Facebugs, Overcompensating, BBC, glass use, Hugo
 * (those only apply to sand-per-mNP rate).
 *
 * Reference: boosts.js:7422-7449 (calculateSandRates builds multiplier,
 * passes it to calculateSandPerClick at line 7449)
 */
export function calculateClickGlobalMultiplier(state: SandToolRateState): number {
  let multiplier = 1;
  if (state.molpies) multiplier += 0.01 * state.badgesOwned;
  if (state.grapevine) multiplier += 0.02 * state.badgesOwned;
  if (state.chirpies) multiplier += 0.05 * state.badgesOwned;
  if (state.blitzing && state.blitzingPower > 0) {
    multiplier *= state.blitzingPower / 100;
  }
  return multiplier;
}

/**
 * Calculate total sand production rate.
 */
export function calculateTotalSandRate(state: SandToolRateState): number {
  const rates = calculateAllSandToolRates(state);

  let sandPermNP = 0;
  sandPermNP += state.buckets * rates.Bucket;
  sandPermNP += state.cuegans * rates.Cuegan;
  sandPermNP += state.flags * rates.Flag;
  sandPermNP += state.ladders * rates.Ladder;
  sandPermNP += state.bags * rates.Bag;
  sandPermNP += state.laPetite * rates.LaPetite;

  const globalMult = calculateGlobalSandMultiplier(state);

  return sandPermNP * globalMult;
}
