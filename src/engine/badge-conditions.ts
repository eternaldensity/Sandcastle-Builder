/**
 * Badge Condition System
 *
 * Defines conditions for automatic badge earning.
 * Each condition is checked at appropriate trigger points.
 *
 * Reference: Legacy badge earning logic in:
 * - data.js:649 (CheckBuyUnlocks - after tool purchases)
 * - castle.js:489 (CalcReportJudgeLevel - every mNP rate calculation)
 * - castle.js:341 (StealthClick - ninja stealth milestones)
 * - data.js:1240 (Click handlers - click count milestones)
 * - boosts.js:5100 (Rate thresholds - sand rate milestones)
 */

export type BadgeTrigger =
  | 'tool-purchase'
  | 'resource-change'
  | 'click'
  | 'stealth-click'
  | 'rate-update'
  | 'ong'
  | 'tick';

export interface BadgeCondition {
  badge: string;
  trigger: BadgeTrigger;
  check: (state: BadgeCheckState) => boolean;
}

export interface BadgeCheckState {
  // Resources
  sand: number;
  castles: number;
  glassChips: number;
  glassBlocks: number;

  // Tool counts
  sandToolsOwned: number;
  castleToolsOwned: number;
  totalToolsOwned: number;

  // Specific tool amounts
  toolAmounts: Record<string, number>;

  // Progress
  newpixNumber: number;
  beachClicks: number;
  totalCastlesBuilt: number;
  castlesSpent: number;
  ninjaStealth: number;
  ninjaFreeCount: number;

  // Rates
  sandPermNP: number;

  // Boost powers
  boostPowers: Record<string, number>;

  // Badges
  badges: Record<string, boolean>;

  // Meta
  badgesOwned: number;
  boostsOwned: number;
  discoveryCount: number;
  monumentCount: number;
  glassCeilingCount: number;
}

/**
 * All badge conditions.
 *
 * Categories:
 * - Click badges: Earned based on beach click count
 * - Tool count badges: Earned when owning X tools
 * - Resource badges: Earned when reaching resource thresholds
 * - Spending badges: Earned when spending total resources
 * - Ninja badges: Earned at ninja stealth milestones
 * - Sand rate badges: Earned when production rate hits thresholds
 * - Boost count badges: Earned when owning X boosts
 */
export const badgeConditions: BadgeCondition[] = [
  // =============================================================================
  // Click badges (trigger: 'click')
  // Reference: data.js:1240+, badges.js click-based badges
  // =============================================================================
  { badge: 'Amazon Patent', trigger: 'click', check: s => s.beachClicks >= 1 },
  { badge: 'Click Ninja', trigger: 'click', check: s => s.beachClicks >= 1 },
  { badge: 'Oops', trigger: 'click', check: s => s.beachClicks >= 2 },
  { badge: 'Not So Redundant', trigger: 'click', check: s => s.beachClicks >= 2 },
  { badge: 'Just Starting', trigger: 'click', check: s => s.beachClicks >= 10 },
  { badge: 'Click Ninja Ninja', trigger: 'click', check: s => s.beachClicks >= 10 },
  { badge: "Don't Litter!", trigger: 'click', check: s => s.beachClicks >= 14 },
  { badge: 'Busy Clicking', trigger: 'click', check: s => s.beachClicks >= 100 },
  { badge: 'Y U NO BELIEVE ME?', trigger: 'click', check: s => s.beachClicks >= 128 },
  { badge: 'Beachcomber', trigger: 'click', check: s => s.beachClicks >= 256 },
  { badge: 'Beachwalker', trigger: 'click', check: s => s.beachClicks >= 512 },
  { badge: 'Click Storm', trigger: 'click', check: s => s.beachClicks >= 1000 },
  { badge: 'Beachranger', trigger: 'click', check: s => s.beachClicks >= 1024 },

  // =============================================================================
  // Tool count badges (trigger: 'tool-purchase')
  // Reference: data.js:649 CheckBuyUnlocks
  // =============================================================================
  { badge: 'Beachscaper', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 200 },
  { badge: 'Beachmover', trigger: 'tool-purchase', check: s => s.castleToolsOwned >= 100 },
  { badge: 'Beachomancer', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 1000 },
  { badge: 'Beachineer', trigger: 'tool-purchase', check: s => s.castleToolsOwned >= 500 },
  { badge: 'All Your Base', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 2101 },
  { badge: 'Look Before You Leap', trigger: 'tool-purchase', check: s => s.sandToolsOwned >= 3000 },
  { badge: 'Fully Armed and Operational Battlestation', trigger: 'tool-purchase', check: s => s.castleToolsOwned >= 4000 },
  { badge: 'WHAT', trigger: 'tool-purchase', check: s => s.sandToolsOwned > 9000 },

  // =============================================================================
  // Resource badges (trigger: 'resource-change')
  // Reference: data.js:649, badges.js resource thresholds
  // =============================================================================
  { badge: 'Pyramid of Giza', trigger: 'resource-change', check: s => s.glassBlocks >= 7016280 },
  { badge: 'Personal Computer', trigger: 'resource-change', check: s => s.glassChips >= 640000 },
  { badge: 'Great Wall of China', trigger: 'resource-change', check: s => s.glassBlocks >= 12e6 },
  { badge: 'Burj Khalifa', trigger: 'resource-change', check: s => s.glassBlocks >= 828 },

  // =============================================================================
  // Castle-building badges (trigger: 'resource-change')
  // Reference: boosts.js:7717-7749 (Castles.totalBuilt thresholds)
  // =============================================================================
  { badge: 'Rook', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 1 },
  { badge: 'Enough for Chess', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 4 },
  { badge: 'Fortified', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 40 },
  { badge: 'All Along the Watchtower', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 320 },
  { badge: 'Megopolis', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 1000 },
  { badge: 'Kingdom', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 100000 },
  { badge: 'Empire', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 10000000 },
  { badge: 'Reign of Terror', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 1e9 },
  { badge: 'Unreachable?', trigger: 'resource-change', check: s => s.totalCastlesBuilt >= 2e12 },

  // =============================================================================
  // Castle current-count badges (trigger: 'resource-change')
  // Reference: boosts.js:7745-7800 (Castles.power thresholds)
  // =============================================================================
  { badge: 'We Need a Bigger Beach', trigger: 'resource-change', check: s => s.castles >= 1000 },
  { badge: 'Castle Nation', trigger: 'resource-change', check: s => s.castles >= 1e6 },
  { badge: 'Castle Planet', trigger: 'resource-change', check: s => s.castles >= 1e9 },
  { badge: 'Castle Star', trigger: 'resource-change', check: s => s.castles >= 1e12 },
  { badge: 'Castle Galaxy', trigger: 'resource-change', check: s => s.castles >= 8.888e15 },
  { badge: 'People Eating Tasty Animals', trigger: 'resource-change', check: s => s.castles >= 1e15 },
  { badge: 'Y U NO RUN OUT OF SPACE?', trigger: 'resource-change', check: s => s.castles >= 1e24 },
  { badge: 'Dumpty', trigger: 'resource-change', check: s => s.castles >= 1e36 },
  { badge: 'This is a silly number', trigger: 'resource-change', check: s => s.castles >= 1e33 },
  { badge: 'To Da Choppah', trigger: 'resource-change', check: s => s.castles >= 1e39 },
  { badge: 'Toasters', trigger: 'resource-change', check: s => s.castles >= 1e42 },
  { badge: 'Dubya', trigger: 'resource-change', check: s => s.castles >= 1e45 },
  { badge: 'Rub a Dub Dub', trigger: 'resource-change', check: s => s.castles >= 1e90 },
  { badge: 'WWW', trigger: 'resource-change', check: s => s.castles >= 1e135 },
  { badge: 'Age of Empires', trigger: 'resource-change', check: s => s.castles >= 1e180 },
  { badge: 'Queue', trigger: 'resource-change', check: s => s.castles >= 1e48 },
  { badge: 'What Queue', trigger: 'resource-change', check: s => s.castles >= 1e93 },

  // Sand storage badges (trigger: 'resource-change')
  // Reference: boosts.js:7499-7530
  { badge: 'Storehouse', trigger: 'resource-change', check: s => s.sand >= 200 },
  { badge: 'Bigger Barn', trigger: 'resource-change', check: s => s.sand >= 500 },
  { badge: 'Warehouse', trigger: 'resource-change', check: s => s.sand >= 8000 },

  // =============================================================================
  // Spending badges (trigger: 'tool-purchase')
  // Reference: badges.js spending totals
  // =============================================================================
  { badge: 'Big Spender', trigger: 'tool-purchase', check: s => s.castlesSpent > 2e8 },
  { badge: 'Valued Customer', trigger: 'tool-purchase', check: s => s.castlesSpent > 8e12 },
  { badge: 'Frequent Shopper', trigger: 'tool-purchase', check: s => s.castlesSpent > 1e6 },

  // =============================================================================
  // Ninja stealth badges (trigger: 'stealth-click')
  // Reference: castle.js:341 StealthClick
  // =============================================================================
  { badge: 'Ninja Stealth', trigger: 'stealth-click', check: s => s.ninjaStealth >= 6 },
  { badge: 'Ninja Dedication', trigger: 'stealth-click', check: s => s.ninjaStealth >= 16 },
  { badge: 'Ninja Madness', trigger: 'stealth-click', check: s => s.ninjaStealth >= 26 },
  { badge: 'Ninja Omnipresence', trigger: 'stealth-click', check: s => s.ninjaStealth >= 36 },
  { badge: 'Ninja Transcendence', trigger: 'stealth-click', check: s => s.ninjaStealth >= 50 },

  // =============================================================================
  // Sand rate badges (trigger: 'rate-update')
  // Reference: boosts.js:5100+ rate threshold checks
  // =============================================================================
  { badge: 'Plain Potato Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 5000 },
  { badge: 'Crinkle Cut Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 20000 },
  { badge: 'BBQ Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 800000 },
  { badge: 'Corn Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 4e6 },
  { badge: 'Sour Cream and Onion Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 2e7 },
  { badge: 'Cinnamon Apple Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 1e8 },
  { badge: 'Salt and Vinegar Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 2e8 },
  { badge: 'Sweet Chili Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 3e9 },
  { badge: 'Banana Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 1e11 },
  { badge: 'Nuclear Fission Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 5e12 },
  { badge: 'Silicon Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 6e14 },
  { badge: 'Blue Poker Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 1e19 },

  // =============================================================================
  // Boost count badges (trigger: 'tool-purchase')
  // Reference: badges.js boost ownership
  // =============================================================================
  { badge: 'Better This Way', trigger: 'tool-purchase', check: s => s.boostsOwned >= 50 },
  { badge: 'Boosted', trigger: 'tool-purchase', check: s => s.boostsOwned >= 100 },
  { badge: 'Hyperboost', trigger: 'tool-purchase', check: s => s.boostsOwned >= 200 },

  // =============================================================================
  // Glass Ceiling badges (trigger: 'tool-purchase')
  // Reference: boosts.js:3413-3421
  // =============================================================================
  { badge: 'Ceiling Broken', trigger: 'tool-purchase', check: s => s.glassCeilingCount >= 10 },
  { badge: 'Ceiling Disintegrated', trigger: 'tool-purchase', check: s => s.glassCeilingCount >= 12 },

  // =============================================================================
  // Initial badges (trigger: 'tick')
  // Reference: castle.js:3445 - earned on first tick when no badges exist
  // =============================================================================
  { badge: 'Redundant Redundancy', trigger: 'tick', check: s => s.badgesOwned === 0 },

  // =============================================================================
  // Meta badges (trigger: 'tick' or 'ong')
  // NOTE: Badge Collector, Badge Hoarder, Badge Connoisseur are NOT in game-data.json
  // and cannot be serialized. Disabled until game-data extraction includes them.
  // =============================================================================

  // =============================================================================
  // NP-specific badges (trigger: 'ong')
  // Reference: castle.js various NP checks
  // =============================================================================
  { badge: 'Badge Not Found', trigger: 'ong', check: s => s.newpixNumber === 404 },
  { badge: 'Badge Found', trigger: 'ong', check: s => s.newpixNumber === -404 },
  { badge: 'War was beginning', trigger: 'ong', check: s => s.newpixNumber === 2101 },
  { badge: 'Below the Horizon', trigger: 'ong', check: s => s.newpixNumber < 0 },
  { badge: 'Absolute Zero', trigger: 'ong', check: s => s.newpixNumber === 0 },

  // =============================================================================
  // High tier tool count badges (trigger: 'tool-purchase')
  // Reference: data.js:744-756
  // =============================================================================
  { badge: 'Warhammer', trigger: 'tool-purchase', check: s => s.sandToolsOwned + s.castleToolsOwned >= 40000 },

  // =============================================================================
  // AC power badges (trigger: 'resource-change')
  // Reference: data.js:802-813, badges.js:848-900
  // AC = Automata Control boost (controls Factory Automation run count)
  // =============================================================================
  { badge: 'It Hertz', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 50 },
  { badge: 'Mains Power', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 230 },
  { badge: 'Microwave', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 1e9 },
  { badge: 'Ultraviolet', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 1e12 },
  { badge: 'X Rays', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 30e15 },
  { badge: 'Gamma Rays', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 10e18 },
  { badge: 'Planck Limit', trigger: 'resource-change', check: s => checkPlanckLimit(s) },

  // =============================================================================
  // Trebuchet badge (trigger: 'tool-purchase')
  // Reference: data.js:757
  // =============================================================================
  { badge: 'Flung', trigger: 'tool-purchase', check: s => (s.toolAmounts['Trebuchet'] ?? 0) >= 50 },

  // =============================================================================
  // Neat! badge - all tools equal (trigger: 'tool-purchase')
  // Reference: data.js:814-825
  // =============================================================================
  { badge: 'Neat!', trigger: 'tool-purchase', check: s => checkNeatBadge(s) },

  // =============================================================================
  // PC (Production Control) limit badge (trigger: 'resource-change')
  // Reference: badges.js:863-866, boosts.js:6151
  // =============================================================================
  { badge: 'Nope!', trigger: 'resource-change', check: s => checkPCLimit(s) },
];

/**
 * Check if all tools have equal amounts (for Neat! badge).
 * Reference: data.js:814-825
 */
function checkNeatBadge(s: BadgeCheckState): boolean {
  const buckets = s.toolAmounts['Bucket'] ?? 0;
  if (buckets <= 1000000) return false;

  // Format the bucket count as reference
  const formatted = formatToolAmount(buckets);

  // Check all tools have same formatted amount
  for (const [name, amount] of Object.entries(s.toolAmounts)) {
    if (formatToolAmount(amount) !== formatted) return false;
  }

  return true;
}

/**
 * Check if Automata Control is at Planck Limit (reached PC power limit).
 * AC can be increased up to PC (Production Control) power level.
 * Reference: badges.js:900, boosts.js:6122
 */
function checkPlanckLimit(s: BadgeCheckState): boolean {
  const acPower = s.boostPowers['AC'] ?? 0;
  const pcPower = s.boostPowers['PC'] ?? 0;

  // AC is at limit when it equals or exceeds PC power
  return acPower >= pcPower && pcPower > 0;
}

/**
 * Check if Production Control is at its limit.
 * PC limit is 5e51.
 * Reference: badges.js:863-866, boosts.js:6147-6151
 */
function checkPCLimit(s: BadgeCheckState): boolean {
  const pcPower = s.boostPowers['PC'] ?? 0;
  return pcPower > 5e51;
}

/**
 * Format tool amount for Neat! badge comparison (3 significant figures).
 * This mimics the legacy formatMolpy(amount, 3) function.
 */
function formatToolAmount(amount: number): string {
  if (amount === 0) return '0';
  if (amount < 1000) return amount.toString();

  // Get order of magnitude
  const exp = Math.floor(Math.log10(amount));
  const mantissa = amount / Math.pow(10, exp);

  // Round to 3 significant figures
  const rounded = Math.round(mantissa * 100) / 100;

  return `${rounded}e${exp}`;
}

/**
 * Get conditions for a specific trigger.
 */
export function getConditionsForTrigger(trigger: BadgeTrigger): BadgeCondition[] {
  return badgeConditions.filter(c => c.trigger === trigger);
}

/**
 * Get all unique badge names that have conditions.
 */
export function getConditionBadgeNames(): string[] {
  return Array.from(new Set(badgeConditions.map(c => c.badge)));
}

/**
 * Get condition for a specific badge.
 */
export function getConditionForBadge(badgeName: string): BadgeCondition | undefined {
  return badgeConditions.find(c => c.badge === badgeName);
}
