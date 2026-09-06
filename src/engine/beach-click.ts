/**
 * Beach click helper systems.
 *
 * Self-contained per-click mechanics driven by the click orchestrator
 * (`ModernEngine.processBeachClick`): sand gain, tool-factory chips,
 * mustard, dragon quest, NP badges, ritual preservation, VJ + glass saw,
 * bag puns, spare tools, and temporal-rift slips, plus the sand-to-castles
 * auto-conversion. Stealth/ninja resolution stays in the engine: it is
 * shared with ONG processing, not click-specific.
 *
 * Reference: castle.js:151-306 (Molpy.ClickBeach)
 *
 * State lives in the engine; behavior here is functions over a narrow
 * BeachClickAccess adapter the engine builds from its own boosts,
 * resources, tools, and subsystems (same pattern as monty-haul.ts and
 * blackprints.ts).
 */

import type { BoostState, ToolState } from '../types/game-data.js';
import { calculateChipsPerClick, type ChipClickState } from './chip-generation.js';
import { calculateChipsPerBlock } from './price-calculator.js';

/**
 * Engine capabilities the beach-click helpers need. Implemented by
 * ModernEngine closures so this module stays dependency-free.
 */
export interface BeachClickAccess {
  hasBoost(alias: string): boolean;
  isBoostEnabled(alias: string): boolean;
  getBoost(alias: string): BoostState | undefined;
  boostEntries(): Iterable<[string, BoostState]>;
  getBoostPower(alias: string): number;
  doUnlockBoost(alias: string): void;
  earnBadge(name: string): void;
  /** Live reference to the engine's resource totals. */
  resources: { sand: number; castles: number; glassChips: number; glassBlocks: number };
  cachedSandPerClick: number;
  syncResourceBoosts(): void;
  /** Live reference to the engine's Fibonacci castle-build progress. */
  castleBuild: { prevCastleSand: number; nextCastleSand: number; totalBuilt: number };
  /** Badge check for 'resource-change' (castle building). */
  notifyResourceChange(): void;
  /** Badge check for 'click'. */
  notifyClick(): void;
  getBeachClicks(): number;
  getNewpixNumber(): number;
  mustardToolCount: number;
  countBoughtBoosts(): number;
  getDragonDigRate(): number;
  digDragonsBeach(): void;
  getAllToolNames(): string[];
  getToolState(name: string): ToolState | undefined;
  getFractalPower(): number;
  addFractalPower(amount: number): void;
  papal(decree: string): number;
  riftJump(): void;
}

/**
 * Auto-convert sand to castles using Fibonacci cost sequence.
 * Matches legacy Molpy.Boosts['Sand'].toCastles() behavior
 * (boosts.js Sand.toCastles).
 */
export function toCastles(access: BeachClickAccess): void {
  const builtBefore = access.castleBuild.totalBuilt;
  // Convert sand to castles while we have enough
  while (access.resources.sand >= access.castleBuild.nextCastleSand &&
         isFinite(access.resources.castles)) {
    // Fractal Sandcastles builds many castles per iteration instead of one.
    // Reference: boosts.js Sand.toCastles fractal branch.
    // (Legacy Castles.build also applies the castle globalMult; the modern
    // engine tracks no such multiplier, so amounts land unscaled as before.)
    let built: number;
    if (access.hasBoost('Fractal Sandcastles')) {
      const m = access.hasBoost('Fractal Fractals') ? 1.5 : 1.35;
      built = Math.floor(
        Math.pow(m, access.getFractalPower() * access.papal('Fractal')),
      );
      access.addFractalPower(1);
      if (access.getFractalPower() >= 60) {
        access.earnBadge('Fractals Forever');
      }
    } else {
      built = 1;
    }
    access.resources.castles += built;
    access.castleBuild.totalBuilt += built;

    // Spend sand
    access.resources.sand -= access.castleBuild.nextCastleSand;

    // Advance Fibonacci sequence for castle cost
    const currentCost = access.castleBuild.nextCastleSand;
    access.castleBuild.nextCastleSand = access.castleBuild.prevCastleSand + currentCost;
    access.castleBuild.prevCastleSand = currentCost;
    if (access.castleBuild.nextCastleSand > 80) {
      access.earnBadge('Getting Expensive');
    }

    // Safety check for infinite/invalid state
    if (!isFinite(access.resources.sand) || access.castleBuild.nextCastleSand <= 0) {
      access.castleBuild.nextCastleSand = 1;
      access.resources.castles = Infinity;
      break;
    }
  }

  access.syncResourceBoosts();

  // Check castle-building badges if any castles were built
  if (access.castleBuild.totalBuilt > builtBefore) {
    access.notifyResourceChange();
  }
}

/**
 * Sand click handler - adds sand per click.
 * Reference: boosts.js:7534-7541 (Sand.clickBeach)
 */
export function clickSandGain(access: BeachClickAccess): void {
  const sandGained = access.cachedSandPerClick;
  access.resources.sand += sandGained;
  access.syncResourceBoosts();
}

/**
 * Tool Factory click handler - loads glass chips per click.
 * Reference: boosts.js:5117-5126 (TF.clickBeach)
 */
export function clickToolFactoryChips(access: BeachClickAccess): void {
  if (!access.hasBoost('TF')) return;

  const chipState: ChipClickState = {
    sandIsInfinite: !isFinite(access.resources.sand),
    bgBought: access.hasBoost('BG'),
    gmBought: access.hasBoost('GM'),
    boneClickerBought: access.hasBoost('Bone Clicker'),
    bonemealLevel: access.getBoostPower('Bonemeal'),
    boostsOwned: access.countBoughtBoosts(),
    loadedPermNP: access.getBoostPower('TF'),
  };

  const chips = calculateChipsPerClick(chipState);
  if (chips > 0) {
    const tf = access.getBoost('TF');
    if (tf) {
      tf.power += chips;
    }
  }
}

/**
 * Mustard click handler - adds mustard from NaN tools.
 * Reference: boosts.js:7987-7992 (Mustard.clickBeach)
 */
export function clickMustard(access: BeachClickAccess): void {
  if (!access.hasBoost('Mustard') || access.mustardToolCount === 0) return;
  const mustard = access.getBoost('Mustard');
  if (mustard) {
    mustard.power += access.mustardToolCount;
  }
}

/**
 * Dragon Quest click handler - triggers dragon digging on click.
 * Reference: boosts.js:8281-8285 (DQ.clickBeach)
 */
export function clickDragonQuest(access: BeachClickAccess): void {
  const dq = access.getBoost('DQ');
  if (!dq || !dq.bought) return;
  if (!access.hasBoost('BeachDragon')) return;
  if (access.getDragonDigRate() <= 0) return;
  access.digDragonsBeach();
}

/**
 * Check NP-specific click achievements.
 * Reference: castle.js:463-468 (Molpy.HandleClickNP)
 */
export function handleClickNPBadges(access: BeachClickAccess): void {
  const np = access.getNewpixNumber();
  if (np === 404) access.earnBadge('Badge Not Found');
  if (np === -404) access.earnBadge('Badge Found');
  if (np === 2101) access.earnBadge('War was beginning.');
}

/**
 * Check click count achievements.
 * Reference: castle.js:167 (Molpy.CheckClickAchievements)
 */
export function checkClickAchievements(access: BeachClickAccess): void {
  // Badge checks based on total beach clicks
  access.notifyClick();
}

/**
 * Handle Ritual Sacrifice/Rift to preserve ninja ritual streak on stealth click.
 * Reference: castle.js:172-191
 *
 * On stealth click, if Ninja Ritual power >= 25, spend 5 goats (Ritual Sacrifice)
 * or flux crystals (Ritual Rift) to preserve the ritual. Otherwise reset to 0.
 */
export function handleRitualPreservation(access: BeachClickAccess): void {
  const ninjaRitual = access.getBoost('Ninja Ritual');
  if (!ninjaRitual || ninjaRitual.bought <= 0) return;

  let saveRitual = false;

  // Ritual Sacrifice: spend 5 goats (power 25-100)
  const ritualSacrifice = access.getBoost('RitualSacrifice');
  if (ritualSacrifice && access.isBoostEnabled('RitualSacrifice') &&
      ninjaRitual.power >= 25 && ninjaRitual.power < 101) {
    const goats = access.getBoost('Goats');
    if (goats && goats.power >= 5) {
      goats.power -= 5;
      saveRitual = true;
    }
  }

  // Ritual Rift: spend floor(ritual_power/10) flux crystals
  const ritualRift = access.getBoost('RitualRift');
  if (ritualRift && access.isBoostEnabled('RitualRift') && !saveRitual) {
    const cost = Math.floor(ninjaRitual.power / 10);
    const fluxCrystals = access.getBoost('FluxCrystals');
    if (fluxCrystals && fluxCrystals.power >= cost) {
      fluxCrystals.power -= cost;
      saveRitual = true;
    }
  }

  if (!saveRitual) {
    ninjaRitual.power = 0;
  }
}

/**
 * VJ (Vaulting Jackhammer) click processing.
 * Every Nth click (N=100, or 20 with Short Saw) triggers VJ reward.
 * Reference: castle.js:222-279
 */
export function processVJClick(access: BeachClickAccess): void {
  const vj = access.getBoost('VJ');
  if (!vj || !vj.bought) return;

  const sawmod = access.hasBoost('ShortSaw') ? 20 : 100;
  if (access.getBeachClicks() % sawmod !== 0) return;

  // Build castles as reward
  const reward = getVJReward(access);
  access.resources.castles += reward;
  vj.power++;

  // Glass Saw processing (castle.js:234-277)
  processGlassSaw(access);
}

/**
 * Get VJ reward amount.
 * Reference: boosts.js VJ.getReward
 */
export function getVJReward(access: BeachClickAccess): number {
  const vj = access.getBoost('VJ');
  if (!vj) return 1;
  // Base reward scales with VJ power
  return Math.max(1, vj.power);
}

/**
 * Glass Saw processing during VJ click.
 * Converts TF chips to glass blocks.
 * Reference: castle.js:234-277
 */
export function processGlassSaw(access: BeachClickAccess): void {
  if (!access.hasBoost('GlassSaw')) return;
  const glassSaw = access.getBoost('GlassSaw');
  if (!glassSaw || glassSaw.power <= 0) {
    if (glassSaw && !glassSaw.power) glassSaw.power = 1;
    return;
  }

  const tf = access.getBoost('TF');
  if (!tf) return;

  const chipsPerBlock = getChipsPerBlock(access);
  if (chipsPerBlock <= 0) return;

  const glassCeilingCount = getGlassCeilingCount(access);
  const p = glassSaw.power;
  const absMaxGlass = glassCeilingCount * 10000000 * p;
  let maxGlass = Math.min(absMaxGlass, Math.floor(tf.power / chipsPerBlock));

  const glassBlocks = access.getBoost('GlassBlocks');
  if (!glassBlocks) return;

  // Buzz Saw with Stretchable Block Storage
  if (access.hasBoost('BuzzSaw') && access.isBoostEnabled('StretchableBlockStorage')) {
    maxGlass = Math.max(maxGlass, 0) || 0;
  } else {
    // Normal capacity check
    const capacity = glassBlocks.bought * 50;
    maxGlass = Math.min(maxGlass, capacity - glassBlocks.power);
    maxGlass = Math.max(maxGlass, 0) || 0;

    // Backoff loop to ensure we don't exceed capacity
    let backoff = 1;
    while (glassBlocks.power + maxGlass > capacity) {
      maxGlass -= backoff;
      backoff *= 2;
    }
  }

  if (!isFinite(maxGlass)) {
    access.earnBadge('Infinite Saw');
  }

  if (!isFinite(glassBlocks.power)) {
    access.doUnlockBoost('BuzzSaw');
  }

  // Add glass blocks with Papal multiplier
  const papalMult = access.papal('GlassSaw');
  access.resources.glassBlocks += Math.floor(maxGlass * papalMult);

  // Spend TF chips
  tf.power -= maxGlass * chipsPerBlock;

  // Power growth based on available TF
  if (tf.power >= absMaxGlass * chipsPerBlock * 10) {
    glassSaw.power = p * (10 + 5 * (access.hasBoost('BuzzSaw') ? 1 : 0));
  } else if (tf.power >= absMaxGlass * chipsPerBlock * 2) {
    glassSaw.power = p * (2 + (access.hasBoost('BuzzSaw') ? 1 : 0));
  }
}

/**
 * Get chips per block conversion rate.
 */
export function getChipsPerBlock(access: BeachClickAccess): number {
  return calculateChipsPerBlock(
    access.hasBoost('RuthlessEfficiency'),
    access.isBoostEnabled('GlassTrolling')
  );
}

/**
 * Get count of Glass Ceiling boosts owned.
 */
export function getGlassCeilingCount(access: BeachClickAccess): number {
  let count = 0;
  for (const [name, state] of access.boostEntries()) {
    if (name.startsWith('GlassCeiling') && state.bought > 0) count++;
  }
  return count;
}

/**
 * Bag Puns progression - every 20 clicks, increment power.
 * Eventually unlocks VJ at power > 100.
 * Reference: castle.js:280-286
 */
export function processBagPuns(access: BeachClickAccess): void {
  const bagPuns = access.getBoost('Bag Puns');
  if (!bagPuns || !bagPuns.bought) return;

  // Only if VJ not yet bought
  const vj = access.getBoost('VJ');
  if (vj && vj.bought) return;

  if (access.getBeachClicks() % 20 === 0) {
    bagPuns.power++;
    if (bagPuns.power > 100) {
      access.doUnlockBoost('VJ');
    }
  }
}

/**
 * Create a random tool from tfOrder on click (Spare Tools boost).
 * Reference: castle.js:288-291
 */
export function createRandomTool(
  access: BeachClickAccess,
  random: () => number = Math.random,
): void {
  // Pick a random tool from all tools
  const allTools = access.getAllToolNames();
  if (allTools.length === 0) return;

  const toolName = allTools[Math.floor(random() * allTools.length)];

  const tool = access.getToolState(toolName);
  if (tool) {
    tool.amount++;
    tool.temp++;
  }
}

/**
 * Check for accidental temporal rift slip on click.
 * Reference: castle.js:297-300
 */
export function checkTemporalRiftClick(
  access: BeachClickAccess,
  random: () => number = Math.random,
): void {
  const temporalRift = access.getBoost('TemporalRift');
  if (!temporalRift || !temporalRift.bought) return;
  if (temporalRift.countdown >= 5) return;

  // 50% chance of slipping through
  if (random() < 0.5) {
    access.riftJump();
  }
}
