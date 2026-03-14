/**
 * Photo & Color Reaction System
 *
 * Implements the photo/inker/color reaction mechanics from castle.js:3461-3635.
 * Five color resources (Blueness, Otherness, Blackness, Whiteness, Grayness)
 * interact through generation, decay, reaction, crafting, and discovery chains.
 *
 * Reference: castle.js:3461-3635 (RunPhoto, getPhoto, decayPhoto, reactPhoto,
 * craftPhoto, RunFastPhoto, unlockPhoto)
 */

/** State for the photo system, stored as boost power values */
export interface PhotoColorState {
  blueness: number;
  otherness: number;
  blackness: number;
  whiteness: number;
  grayness: number;
}

/** Boost lookup function provided by the engine */
export interface PhotoBoostAccess {
  hasBoost(name: string): boolean;
  isEnabled(name: string): boolean;
  getLevel(name: string): number;
  getPower(name: string): number;
  setPower(name: string, value: number): void;
  addPower(name: string, amount: number): void;
  unlockBoost(name: string): void;
  earnBadge(name: string): void;
  papal(decree: string): number;
}

/**
 * Run the full photo system for one mNP tick.
 * Reference: castle.js:3461-3470
 */
export function runPhoto(colors: PhotoColorState, ctx: PhotoBoostAccess): void {
  getPhoto(colors, ctx, 0);
  craftPhoto(colors, ctx);
  const lost = decayPhoto(colors, ctx);
  if (ctx.hasBoost('Photoelectricity') && !ctx.isEnabled('NaP')) {
    runFastPhoto(lost, ctx);
  }
  unlockPhoto(colors, ctx);
}

/**
 * Generate photo colors (passive per-mNP or active per-click).
 * Reference: castle.js:3471-3507
 *
 * @param n - 0 for passive (per mNP), >0 for click-based generation
 * @param colorType - which color to generate (default 'blueness')
 */
export function getPhoto(
  colors: PhotoColorState,
  ctx: PhotoBoostAccess,
  n: number,
  colorType: keyof PhotoColorState = 'blueness'
): void {
  if (n === 0) {
    // Passive generation per mNP

    // Meteor: +10 Otherness per mNP
    if (ctx.hasBoost('Meteor')) {
      colors.otherness += 10;
    }

    // Hallowed Ground: +1 Grayness per mNP
    if (ctx.hasBoost('HallowedGround')) {
      colors.grayness += 1;
    }

    // Ocean Blue: +power Blueness per mNP (multiplied by bluhint)
    if (ctx.hasBoost('OceanBlue')) {
      let gain = ctx.getPower('OceanBlue');
      if (ctx.hasBoost('bluhint')) {
        gain *= ctx.getPower('bluhint');
      }
      colors.blueness += gain;
    }

    // pH: accumulate power and trigger RunFastPhoto when threshold reached
    if (ctx.hasBoost('pH')) {
      const phPower = ctx.getPower('pH');
      const threshold = ctx.hasBoost('pOH') ? 10 : 160000;
      ctx.setPower('pH', phPower + 1);
      if (ctx.getPower('pH') >= threshold) {
        ctx.setPower('pH', 0);
        runFastPhoto(25, ctx);
      }
    }

    // pInsanity: trigger RunFastPhoto(625) per mNP if enabled
    if (ctx.isEnabled('pInsanity')) {
      runFastPhoto(625, ctx);
    }
  } else {
    // Active generation (beach click)
    let gain = n;

    // Doubletap multiplier
    if (ctx.hasBoost('Doubletap')) {
      gain *= 2;
    }

    // bluhint multiplier
    if (ctx.hasBoost('bluhint')) {
      gain *= ctx.getPower('bluhint');
    }

    colors[colorType] += gain;
  }
}

/**
 * Decay colors in chain: Blueness ↔ Otherness.
 * Reference: castle.js:3508-3518
 *
 * Each color decays at 0.1% per mNP. Lost amount feeds the other color.
 * Improved Scaling boosts conversion efficiency from 66.67% to ~70%.
 *
 * @returns total lost amount (used for Photoelectricity)
 */
export function decayPhoto(colors: PhotoColorState, ctx: PhotoBoostAccess): number {
  const decayRate = 0.001; // 0.1% per mNP
  const hasImprovedScaling = ctx.hasBoost('ImprovedScaling');
  const conversionRate = 2 / 3 + (hasImprovedScaling ? (0.9 - 2 / 3) : 0);

  // Blueness decay → feeds Otherness
  const bluelost = colors.blueness * decayRate;
  colors.blueness -= bluelost;
  colors.otherness += bluelost * conversionRate;

  // Otherness decay → feeds Blueness
  const otherlost = colors.otherness * decayRate;
  colors.otherness -= otherlost;
  colors.blueness += otherlost * conversionRate;

  return bluelost + otherlost;
}

/**
 * Color reaction: Blackness + Whiteness ↔ Grayness.
 * Reference: castle.js:3519-3544
 *
 * Forward reaction rate = (Blackness * Whiteness)^2
 * Backward rate uses Equilibrium Constant if enabled.
 * NaP disabled + Photoelectricity: reverses, consuming Grayness.
 */
export function reactPhoto(colors: PhotoColorState, ctx: PhotoBoostAccess): void {
  const frate = Math.pow(colors.blackness * colors.whiteness, 2);
  let brate = 0;

  if (ctx.isEnabled('EquilibriumConstant')) {
    brate = colors.grayness * ctx.getPower('EquilibriumConstant');
  }

  let dif = frate - brate;

  // Limit reaction to available reactants
  if (dif > 0) {
    // Forward: consume Blackness + Whiteness, produce Grayness
    dif = Math.min(dif, 2 * colors.blackness, colors.whiteness);
    colors.blackness -= dif / 2;
    colors.whiteness -= dif;
    colors.grayness += dif;
  } else if (dif < 0) {
    // Reverse: consume Grayness, produce Blackness + Whiteness
    const absDif = Math.abs(dif);
    const limited = Math.min(absDif, colors.grayness);
    colors.grayness -= limited;
    colors.blackness += limited / 2;
    colors.whiteness += limited;
  }

  // NaP disabled + Photoelectricity: consume 1/4 Grayness per mNP
  if (!ctx.isEnabled('NaP') && ctx.hasBoost('Photoelectricity')) {
    const grayLoss = colors.grayness / 4;
    colors.grayness -= grayLoss;
    colors.whiteness += grayLoss / 2;
    colors.blackness += grayLoss / 2;
  }
}

/**
 * Robotic Inker auto-crafting.
 * Reference: castle.js:3545-3562
 *
 * Crafts Argy squids: 50 Blueness + 50 Otherness → 1 Blackness.
 * Power bitmask controls which recipes are active.
 */
export function craftPhoto(colors: PhotoColorState, ctx: PhotoBoostAccess): void {
  if (!ctx.hasBoost('RoboticInker')) return;

  const inkerPower = ctx.getPower('RoboticInker');
  if (inkerPower <= 0) return;

  // Argy squid crafting: 50 Blueness + 50 Otherness → 1 Blackness
  if (ctx.hasBoost('Argy') && (inkerPower & 1)) {
    const maxSquids = Math.floor(Math.min(colors.blueness / 50, colors.otherness / 50));
    if (maxSquids > 0) {
      // Scale: 10^floor(log10(max(Blackness, 1)))
      const squidCount = Math.min(maxSquids, Math.pow(10, Math.floor(Math.log10(Math.max(colors.blackness, 1)))));
      colors.blueness -= squidCount * 50;
      colors.otherness -= squidCount * 50;
      colors.blackness += squidCount;
    }
  }

  // Polarizer dualization recipes (bit 1+)
  if (ctx.hasBoost('Polarizer') && (inkerPower & 2)) {
    // Basic: 5 Blackness → 1 Whiteness
    if (colors.blackness >= 5) {
      const converts = Math.floor(colors.blackness / 5);
      colors.blackness -= converts * 5;
      colors.whiteness += converts;
    }
  }
}

/**
 * Photoelectricity discovery mechanism.
 * Reference: castle.js:3563-3605
 *
 * Accumulates sqrt(times) power. Every 5 power = 1 discovery attempt.
 * Each discovery randomly selects from photo-tagged boosts.
 */
export function runFastPhoto(times: number, ctx: PhotoBoostAccess): void {
  if (!ctx.hasBoost('Photoelectricity')) return;

  const current = ctx.getPower('Photoelectricity');
  const newPower = current + Math.sqrt(times);
  ctx.setPower('Photoelectricity', newPower);

  // Every 5 accumulated power = 1 discovery
  const discoveries = Math.floor(newPower / 5);
  if (discoveries > 0) {
    ctx.setPower('Photoelectricity', newPower - discoveries * 5);
    // Discovery attempts are handled by the engine (needs boost catalog access)
    // We signal via a well-known boost to let the engine process discoveries
    const peDiscover = ctx.getPower('PhotoelectricityDiscover');
    ctx.setPower('PhotoelectricityDiscover', peDiscover + discoveries);
  }
}

/**
 * Progressive unlock thresholds for color boosts.
 * Reference: castle.js:3607-3635
 */
export function unlockPhoto(colors: PhotoColorState, ctx: PhotoBoostAccess): void {
  // Any Blueness → unlock color boosts
  if (colors.blueness > 0) {
    ctx.unlockBoost('Blueness');
  }

  // Any Otherness → unlock chain
  if (colors.otherness > 0) {
    ctx.unlockBoost('Otherness');
    ctx.unlockBoost('Blueness');
    ctx.unlockBoost('Blackness');
    ctx.unlockBoost('Whiteness');
    ctx.unlockBoost('Grayness');
  }

  // Any Blackness → unlock + badge
  if (colors.blackness > 0) {
    ctx.unlockBoost('Blackness');
    ctx.earnBadge('Argy Bee');
  }

  // Any Whiteness → unlock
  if (colors.whiteness > 0) {
    ctx.unlockBoost('Whiteness');
  }

  // Any Grayness → unlock + Equilibrium Constant
  if (colors.grayness > 0) {
    ctx.unlockBoost('Grayness');
    ctx.unlockBoost('EquilibriumConstant');
  }

  // Otherness thresholds
  if (colors.otherness >= 15) ctx.unlockBoost('Argy');
  if (colors.otherness >= 25) ctx.unlockBoost('bluhint');
  if (colors.otherness >= 50) ctx.unlockBoost('ImprovedScaling');
  if (colors.otherness >= 300) ctx.unlockBoost('Meteor');

  // Blueness thresholds
  if (colors.blueness >= 300) ctx.unlockBoost('OceanBlue');

  // Blackness thresholds
  if (colors.blackness >= 5) ctx.unlockBoost('Polarizer');
  if (colors.blackness >= 50 && ctx.hasBoost('Polarizer')) {
    ctx.unlockBoost('RoboticInker');
  }

  // Whiteness thresholds
  if (colors.whiteness >= 1) ctx.unlockBoost('NaP');
  if (colors.whiteness >= 3) ctx.unlockBoost('HallowedGround');
  if (colors.whiteness >= 10) {
    ctx.unlockBoost('Photoelectricity');
    ctx.earnBadge('UnDuoNonUnium');
  }

  // All five colors
  if (colors.blueness > 0 && colors.otherness > 0 && colors.blackness > 0 &&
      colors.whiteness > 0 && colors.grayness > 0) {
    ctx.earnBadge('Colorrific');
  }

  // Grayness milestone
  if (colors.grayness >= 1000) {
    ctx.earnBadge('Wish I could breathe');
  }
}

/**
 * Create initial color state (all zeros).
 */
export function createInitialColorState(): PhotoColorState {
  return { blueness: 0, otherness: 0, blackness: 0, whiteness: 0, grayness: 0 };
}
