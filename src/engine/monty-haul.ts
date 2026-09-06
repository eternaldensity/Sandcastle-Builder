/**
 * Monty Haul Problem (MHP) minigame + goat rewards.
 *
 * A three-door game show: the player picks a door, the host reveals a goat,
 * then the player stays or switches. Wins pay castles, losses pay goats
 * (which gate Hall of Mirrors / Beret Guy unlocks).
 *
 * Reference: boosts.js:429-431 (unlockFunction), :439-470 (Molpy.Monty),
 * :472-498 (Molpy.RewardMonty), :488-498 (Molpy.GetYourGoat)
 *
 * State lives in MontyHaulState; behavior here is pure functions over that
 * state plus a narrow MontyGameAccess adapter the engine builds from its
 * own boosts/resources (same pattern as blackprints.ts).
 */

/**
 * Mutable MHP round state, owned by the engine.
 */
export interface MontyHaulState {
  doors: string[];
  /** Door hiding the prize. */
  prize: string;
  /** Player's current selection. */
  chosen: string;
  /** Revealed goat door. */
  goat: string;
  /** Whether a round is in progress. */
  active: boolean;
}

export function createInitialMontyHaulState(): MontyHaulState {
  return { doors: ['A', 'B', 'C'], prize: '', chosen: '', goat: '', active: false };
}

/**
 * Engine capabilities the MHP logic needs. Implemented by ModernEngine
 * closures so this module stays dependency-free.
 */
export interface MontyGameAccess {
  hasBoost(alias: string): boolean;
  isBoostEnabled(alias: string): boolean;
  hasGoatsBoost(): boolean;
  getCastles(): number;
  addCastles(amount: number): void;
  clearCastles(): void;
  getGlassChips(): number;
  addGlassChips(amount: number): void;
  getGoatPower(): number;
  addGoatPower(amount: number): void;
  getMHPPower(): number;
  setMHPPower(power: number): void;
  earnBadge(name: string): void;
  unlockBoost(alias: string): void;
}

export type MontyPickResult = {
  result: 'goat-revealed' | 'win' | 'lose';
  goatDoor?: string;
};

/**
 * Start an MHP round. Sets the prize door and marks the round active.
 * Reference: boosts.js:429-431 (unlockFunction)
 */
export function montyStartRound(
  state: MontyHaulState,
  mhpBought: boolean,
  random: () => number = Math.random,
): boolean {
  if (!mhpBought) return false;

  // Generate random prize door
  state.prize = state.doors[Math.floor(random() * 3)];
  state.goat = '';
  state.chosen = '';
  state.active = true;
  return true;
}

/**
 * Player selects a door in MHP. If first pick, reveals a goat door.
 * If second pick (after goat revealed), resolves the game.
 * Reference: boosts.js:439-466 (Molpy.Monty)
 */
export function montyPickDoor(
  state: MontyHaulState,
  access: MontyGameAccess,
  door: string,
  random: () => number = Math.random,
): MontyPickResult | null {
  if (!access.hasBoost('MHP') || !state.active) return null;

  state.chosen = door;

  if (state.goat) {
    // Second pick — if choosing revealed goat door, need Beret Guy
    if (door === state.goat && !access.hasBoost('BeretGuy')) {
      return null; // can't pick revealed goat without Beret Guy
    }
    // Resolve the game
    const won = door === state.prize;
    rewardMonty(access, won);
    state.active = false;
    // Lock MHP (increments power for price scaling)
    access.setMHPPower(access.getMHPPower() + 1);
    return { result: won ? 'win' : 'lose' };
  } else {
    // First pick — reveal a goat door
    const goatDoor = revealGoatDoor(state, random);
    if (!goatDoor) {
      // Edge case: player picked the prize on first try with specific goat logic
      // Legacy uses encoded MontyMethod with randomness
      const won = door === state.prize;
      rewardMonty(access, won);
      state.active = false;
      access.setMHPPower(access.getMHPPower() + 1);
      return { result: won ? 'win' : 'lose' };
    }
    state.goat = goatDoor;
    return { result: 'goat-revealed', goatDoor };
  }
}

/**
 * Find a door to reveal as goat (not the player's choice, not the prize).
 * Reference: boosts.js MontyMethod encoded logic
 */
function revealGoatDoor(state: MontyHaulState, random: () => number): string | null {
  const candidates = state.doors.filter(d => d !== state.chosen && d !== state.prize);
  if (candidates.length === 0) return null;
  // If player chose the prize, both others are goats — pick randomly
  return candidates[Math.floor(random() * candidates.length)];
}

/**
 * Distribute rewards for MHP win/loss.
 * Reference: boosts.js:472-486 (Molpy.RewardMonty)
 */
function rewardMonty(access: MontyGameAccess, won: boolean): void {
  if (won) {
    // Win: gain 50% of current castles
    const gain = Math.floor(access.getCastles() / 2);
    access.addCastles(gain);

    // Hall of Mirrors: gain 1/5 of glass chips
    if (access.isBoostEnabled('HoM')) {
      const chipGain = Math.floor(access.getGlassChips() / 5);
      access.addGlassChips(chipGain);
    }

    // Gruff: gain 3 goats on win
    if (access.hasBoost('Gruff')) {
      awardGoats(access, 3);
    }
  } else {
    // Lose: destroy all castles
    access.clearCastles();

    // Reduce MHP power for price scaling
    access.setMHPPower(Math.ceil(Math.floor(access.getMHPPower() / 1.8)));

    // Hall of Mirrors: lose 1/3 of glass chips
    if (access.isBoostEnabled('HoM')) {
      const chipLoss = Math.floor(access.getGlassChips() / 3);
      access.addGlassChips(-chipLoss);
    }

    // Always get 1 goat on loss
    awardGoats(access, 1);
  }
}

/**
 * Add goats and check unlock thresholds.
 * Reference: boosts.js:488-498 (Molpy.GetYourGoat)
 */
export function awardGoats(access: MontyGameAccess, n: number): void {
  if (!access.hasGoatsBoost()) return;

  access.addGoatPower(n);
  const power = access.getGoatPower();

  if (power >= 2) access.earnBadge('Second Edition');
  if (power >= 20) access.unlockBoost('HoM');
  if (power >= 200) access.unlockBoost('BeretGuy');
}

/**
 * Read MHP state for display/testing.
 */
export function readMontyState(state: MontyHaulState): {
  active: boolean;
  chosen: string;
  goatDoor: string;
  prize: string;
} {
  return {
    active: state.active,
    chosen: state.chosen,
    goatDoor: state.goat,
    prize: state.prize,
  };
}
