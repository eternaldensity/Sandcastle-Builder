/**
 * Redundakitty System
 *
 * The redundakitty (referred to as "Redacted" in legacy code) is a clickable
 * element that spawns periodically and provides various rewards when clicked.
 *
 * Reference: castle.js:2179-2783
 */

export interface RedundakittyState {
  /** Total clicks across all game sessions */
  totalClicks: number;

  /** Current chain length (resets when kitty despawns) */
  chainCurrent: number;

  /** Maximum chain length ever achieved */
  chainMax: number;

  /** Countdown to next spawn (in mNP) */
  spawnCountdown: number;

  /** Countdown to despawn (in mNP) - 0 if not spawned */
  despawnCountdown: number;

  /** Whether kitty is currently visible/clickable */
  isActive: boolean;

  /** Number of recursive buttons visible (for Redunception) */
  recursionDepth: number;
}

export interface RedundakittyBoostState {
  /** Whether Kitnip boost is owned */
  kitnip: boolean;

  /** Whether Kitties Galore boost is owned */
  kittiesGalore: boolean;

  /** Whether RRSR boost is owned and unlocked (affects spawn timer) */
  rrsrUnlocked: boolean;

  /** Whether RRSR boost is bought (makes spawns very frequent) */
  rrsrBought: boolean;

  /** Whether DoRD boost is owned (enables DoRD rewards) */
  doRD: boolean;

  /** Whether Blast Furnace boost is owned */
  blastFurnace: boolean;

  /** Whether BKJ (Blitzing Kitten Juggler) boost is owned */
  bkj: boolean;

  /** Current BKJ power level */
  bkjPower: number;

  /** Whether Redunception boost is owned (enables recursive kitties) */
  redunception: boolean;

  /** Whether Logicat boost is owned (enables logic puzzles) */
  logicat: boolean;

  /** Whether SGC (Stay Good, Cat) boost is owned (longer despawn time) */
  sgc: boolean;

  /** Whether Double Department boost is owned (double DoRD rewards) */
  doubleDepartment: boolean;

  /** Whether Schizoblitz boost is owned (doubles blitzing speed) */
  schizoblitz: boolean;

  /** Whether Sea Mining boost is owned */
  seaMining: boolean;

  /** Whether Ventus Vehemens boost is enabled (slows spawns 4x) */
  ventusVehemensEnabled: boolean;
}

/**
 * Calculate the spawn time for the next redundakitty.
 *
 * Base spawn time is 200-290 mNP, modified by various boosts:
 * - Kitnip: reduces min by 80, spread by 20 → 120-210 mNP
 * - Kitties Galore: reduces min by 80, spread by 20 → 120-210 mNP
 * - Both Kitnip and Kitties Galore: → 40-90 mNP
 * - RRSR bought: reduces min by 30, spread by 20 (stacks with above)
 * - RRSR bought with all kitty boosts: → 10-40 mNP
 * - RRSR unlocked but not bought: multiplies final time by 12 → 2400-3240 mNP
 * - Ventus Vehemens enabled: multiplies final time by 4
 *
 * Reference: castle.js:2293-2302
 */
export function calculateKittySpawnTime(boostState: RedundakittyBoostState): number {
  let min = 200;
  let spread = 90;

  // Apply Kitnip and Kitties Galore reductions
  const kittyBoosts = (boostState.kitnip ? 1 : 0) + (boostState.kittiesGalore ? 1 : 0);
  min -= 80 * kittyBoosts;
  spread -= 20 * kittyBoosts;

  // Apply RRSR reduction
  if (boostState.rrsrBought) {
    min -= 30;
    spread -= 20;
  }

  const baseTime = min + Math.ceil(spread * Math.random());

  // Apply RRSR penalty if unlocked but not bought
  let multiplier = 1;
  if (boostState.rrsrUnlocked && !boostState.rrsrBought) {
    multiplier *= 12;
  }

  // Apply Ventus Vehemens penalty if enabled
  if (boostState.ventusVehemensEnabled) {
    multiplier *= 4;
  }

  return baseTime * multiplier;
}

/**
 * Calculate the despawn time (how long kitty stays visible).
 *
 * Base time is 24 mNP, modified by:
 * - Kitnip: +6 mNP
 * - SGC: +12 mNP
 *
 * Reference: castle.js:2279
 */
export function calculateKittyDespawnTime(boostState: RedundakittyBoostState): number {
  const base = 4; // Base multiplier
  const kitnipBonus = boostState.kitnip ? 1 : 0;
  const sgcBonus = boostState.sgc ? 2 : 0;

  return 6 * (base + kitnipBonus + sgcBonus);
}

/**
 * Reward types that can be given when clicking a redundakitty.
 */
export type RedundakittyRewardType = 'dord' | 'not-lucky' | 'blitzing' | 'blast-furnace' | 'kitten-reward';

/**
 * Determine which reward to give when clicking a redundakitty.
 *
 * Priority order:
 * 1. DoRD (12.5% chance if DoRD owned)
 * 2. Blast Furnace (25% chance if DoRD not triggered and Blast Furnace owned)
 * 3. 50/50 split between Not Lucky and Blitzing
 *    - If sand is infinite, use Blast Furnace instead of Blitzing
 *
 * Reference: castle.js:2786-2830
 */
export function determineRewardType(
  boostState: RedundakittyBoostState,
  isSandInfinite: boolean
): RedundakittyRewardType {
  // 12.5% chance for DoRD if owned
  if (boostState.doRD && Math.random() < 0.125) {
    return 'dord';
  }

  // 25% chance for Blast Furnace if DoRD didn't trigger and Blast Furnace owned
  if (boostState.blastFurnace && Math.random() < 0.25) {
    return 'blast-furnace';
  }

  // 50/50 split between Not Lucky and Blitzing
  if (Math.random() < 0.5) {
    return 'not-lucky';
  } else {
    // If sand is infinite, fall back to Blast Furnace
    if (isSandInfinite) {
      return 'blast-furnace';
    }
    return 'blitzing';
  }
}

/**
 * Calculate Blitzing reward parameters.
 *
 * Blitzing provides a temporary sand rate multiplier.
 * - Base speed: 800%
 * - Base duration: 23 mNP
 * - BKJ adds 20% per power level
 * - Schizoblitz doubles the speed
 * - Current Blitzing countdown adds to duration (half value)
 *
 * Reference: castle.js:3024-3049
 */
export interface BlitzingReward {
  /** Speed multiplier (percentage) */
  speed: number;

  /** Duration in mNP */
  duration: number;
}

export function calculateBlitzingReward(
  boostState: RedundakittyBoostState,
  currentBlitzingSpeed: number,
  currentBlitzingCountdown: number
): BlitzingReward {
  let speed = 800;
  let duration = 23;

  // Add BKJ bonus
  if (boostState.bkj) {
    speed += boostState.bkjPower * 20;
  }

  // Apply Schizoblitz doubling
  if (boostState.schizoblitz) {
    speed *= 2;
  }

  // Add current Blitzing bonus
  if (currentBlitzingSpeed > 0) {
    speed += currentBlitzingSpeed;
    duration += Math.floor(currentBlitzingCountdown / 2);
  }

  return { speed, duration };
}

/**
 * Calculate Not Lucky reward (castle bonus).
 *
 * The Not Lucky reward gives castles based on:
 * - Tool amounts (exponential scaling)
 * - Boosts and badges owned
 * - Total kitty clicks
 * - Various multiplier boosts (BKJ, Fractal Sandcastles, etc.)
 *
 * Reference: castle.js:2873-3004
 */
export interface NotLuckyReward {
  /** Number of castles to award */
  castles: number;
}

export function calculateNotLuckyReward(
  sandToolAmounts: Record<string, number>,
  castleToolAmounts: Record<string, number>,
  boostsOwned: number,
  badgesOwned: number,
  kittyTotalClicks: number,
  bkjPower: number,
  hasBKJ: boolean,
  hasBlitzing: boolean,
  blitzingPower: number,
  hasFractalSandcastles: boolean,
  fractalPower: number,
  castlesTotalBuilt: number
): NotLuckyReward {
  let bonus = 0;
  let items = 0;

  // Calculate tool bonus (exponential scaling)
  let sandToolIndex = 0;
  for (const [, amount] of Object.entries(sandToolAmounts)) {
    bonus += amount * Math.pow(3.5, sandToolIndex + 1);
    items += amount;
    sandToolIndex++;
  }

  let castleToolIndex = 0;
  for (const [, amount] of Object.entries(castleToolAmounts)) {
    bonus += amount * Math.pow(2.5, castleToolIndex + 1);
    items += amount;
    castleToolIndex++;
  }

  // Add boosts and badges
  const bb = boostsOwned + badgesOwned;
  bonus += bb;
  items += bb;

  // Add kitty clicks bonus
  bonus += kittyTotalClicks * 10;

  // Apply BKJ multiplier
  if (hasBKJ) {
    bonus *= (1 + 0.2 * bkjPower);
    if (hasBlitzing) {
      bonus *= Math.min(2, (blitzingPower - 800) / 200);
    }
  }

  // Apply Fractal Sandcastles multiplier with nerf cap
  if (hasFractalSandcastles) {
    bonus *= Math.ceil((fractalPower + 1) / 10);
    // Nerf: cap at totalBuilt / 50
    bonus = Math.min(bonus, castlesTotalBuilt / 50);
  }

  return {
    castles: Math.floor(bonus)
  };
}
