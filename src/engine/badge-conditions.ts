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
  beachClicks: number;
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
  { badge: 'Not So Redundant', trigger: 'click', check: s => s.beachClicks >= 2 },
  { badge: 'Click Ninja Ninja', trigger: 'click', check: s => s.beachClicks >= 10 },
  { badge: "Don't Litter!", trigger: 'click', check: s => s.beachClicks >= 14 },
  { badge: 'Y U NO BELIEVE ME?', trigger: 'click', check: s => s.beachClicks >= 128 },
  { badge: 'Beachcomber', trigger: 'click', check: s => s.beachClicks >= 256 },
  { badge: 'Beachwalker', trigger: 'click', check: s => s.beachClicks >= 512 },
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
  { badge: 'Sour Cream and Onion Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 5e6 },
  { badge: 'Salt and Vinegar Chips', trigger: 'rate-update', check: s => s.sandPermNP >= 2e8 },

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
  // Meta badges (trigger: 'tick' or 'ong')
  // =============================================================================
  { badge: 'Badge Collector', trigger: 'tick', check: s => s.badgesOwned >= 10 },
  { badge: 'Badge Hoarder', trigger: 'tick', check: s => s.badgesOwned >= 50 },
  { badge: 'Badge Connoisseur', trigger: 'tick', check: s => s.badgesOwned >= 100 },

  // =============================================================================
  // High tier tool count badges (trigger: 'tool-purchase')
  // Reference: data.js:744-756
  // =============================================================================
  { badge: 'Warhammer', trigger: 'tool-purchase', check: s => s.sandToolsOwned + s.castleToolsOwned >= 40000 },

  // =============================================================================
  // AC power badges (trigger: 'resource-change')
  // Reference: data.js:802-813
  // =============================================================================
  { badge: 'Mains Power', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 230 },
  { badge: 'It Hertz', trigger: 'resource-change', check: s => (s.boostPowers['AC'] ?? 0) >= 50 },

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
