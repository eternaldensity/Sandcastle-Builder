/**
 * Boost Unlock Conditions
 *
 * Defines unlock conditions for boosts that can be evaluated against game state.
 * These are extracted from the legacy CheckBuyUnlocks() function and boost definitions.
 *
 * The unlock system is designed to be data-driven where possible, with escape hatches
 * for complex conditions that require custom logic.
 */

/**
 * Types of unlock conditions
 */
export type UnlockConditionType =
  | 'tool-amount'      // Tool amount >= threshold
  | 'resource'         // Resource amount >= threshold
  | 'boost-power'      // Boost power >= threshold
  | 'boost-bought'     // Boost bought count >= threshold
  | 'badge-earned'     // Specific badge earned
  | 'badge-group-count' // Count of badges in group >= threshold
  | 'and'              // All sub-conditions must be true
  | 'or';              // Any sub-condition must be true

/**
 * Base unlock condition
 */
interface BaseUnlockCondition {
  type: UnlockConditionType;
}

/**
 * Tool amount condition: sandTool.amount >= threshold or castleTool.amount >= threshold
 */
export interface ToolAmountCondition extends BaseUnlockCondition {
  type: 'tool-amount';
  toolType: 'sand' | 'castle';
  toolName: string;
  threshold: number;
}

/**
 * Resource condition: resource >= threshold
 */
export interface ResourceCondition extends BaseUnlockCondition {
  type: 'resource';
  resource: 'sand' | 'castles' | 'glassChips' | 'glassBlocks' | 'goats' | 'bonemeal';
  threshold: number;
}

/**
 * Boost power condition: boost.power >= threshold
 */
export interface BoostPowerCondition extends BaseUnlockCondition {
  type: 'boost-power';
  boostAlias: string;
  threshold: number;
}

/**
 * Boost bought condition: boost.bought >= threshold
 */
export interface BoostBoughtCondition extends BaseUnlockCondition {
  type: 'boost-bought';
  boostAlias: string;
  threshold: number;
}

/**
 * Badge earned condition: badge has been earned
 */
export interface BadgeEarnedCondition extends BaseUnlockCondition {
  type: 'badge-earned';
  badgeName: string;
}

/**
 * Badge group count condition: earned badges in group >= threshold
 */
export interface BadgeGroupCountCondition extends BaseUnlockCondition {
  type: 'badge-group-count';
  group: string;
  threshold: number;
}

/**
 * AND condition: all sub-conditions must be true
 */
export interface AndCondition extends BaseUnlockCondition {
  type: 'and';
  conditions: UnlockCondition[];
}

/**
 * OR condition: any sub-condition must be true
 */
export interface OrCondition extends BaseUnlockCondition {
  type: 'or';
  conditions: UnlockCondition[];
}

/**
 * Union type for all unlock conditions
 */
export type UnlockCondition =
  | ToolAmountCondition
  | ResourceCondition
  | BoostPowerCondition
  | BoostBoughtCondition
  | BadgeEarnedCondition
  | BadgeGroupCountCondition
  | AndCondition
  | OrCondition;

/**
 * Unlock rule: maps a boost to its unlock condition
 */
export interface UnlockRule {
  boostAlias: string;
  condition: UnlockCondition;
}

/**
 * Helper functions to create unlock conditions
 */
export const Conditions = {
  toolAmount(toolType: 'sand' | 'castle', toolName: string, threshold: number): ToolAmountCondition {
    return { type: 'tool-amount', toolType, toolName, threshold };
  },

  resource(resource: ResourceCondition['resource'], threshold: number): ResourceCondition {
    return { type: 'resource', resource, threshold };
  },

  boostPower(boostAlias: string, threshold: number): BoostPowerCondition {
    return { type: 'boost-power', boostAlias, threshold };
  },

  boostBought(boostAlias: string, threshold: number): BoostBoughtCondition {
    return { type: 'boost-bought', boostAlias, threshold };
  },

  badgeEarned(badgeName: string): BadgeEarnedCondition {
    return { type: 'badge-earned', badgeName };
  },

  badgeGroupCount(group: string, threshold: number): BadgeGroupCountCondition {
    return { type: 'badge-group-count', group, threshold };
  },

  and(...conditions: UnlockCondition[]): AndCondition {
    return { type: 'and', conditions };
  },

  or(...conditions: UnlockCondition[]): OrCondition {
    return { type: 'or', conditions };
  },
};

/**
 * Tool-based unlock rules extracted from legacy CheckBuyUnlocks()
 * These are the most common early-game unlocks.
 */
export const toolUnlockRules: UnlockRule[] = [
  // Bucket unlocks
  { boostAlias: 'Bigger Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 1) },
  { boostAlias: 'Huge Buckets', condition: Conditions.toolAmount('sand', 'Bucket', 4) },
  { boostAlias: 'Carrybot', condition: Conditions.toolAmount('sand', 'Bucket', 14) },
  { boostAlias: 'Buccaneer', condition: Conditions.toolAmount('sand', 'Bucket', 30) },
  { boostAlias: 'Bucket Brigade', condition: Conditions.toolAmount('sand', 'Bucket', 50) },
  {
    boostAlias: 'Flying Buckets',
    condition: Conditions.and(
      Conditions.toolAmount('sand', 'Bucket', 100),
      Conditions.badgeEarned('Flung')
    ),
  },

  // Cuegan unlocks
  { boostAlias: 'Helping Hand', condition: Conditions.toolAmount('sand', 'Cuegan', 1) },
  { boostAlias: 'Cooperation', condition: Conditions.toolAmount('sand', 'Cuegan', 4) },
  { boostAlias: 'Megball', condition: Conditions.toolAmount('sand', 'Cuegan', 8) },
  { boostAlias: 'Stickbot', condition: Conditions.toolAmount('sand', 'Cuegan', 14) },
  { boostAlias: 'The Forty', condition: Conditions.toolAmount('sand', 'Cuegan', 40) },
  {
    boostAlias: 'Human Cannonball',
    condition: Conditions.and(
      Conditions.toolAmount('sand', 'Cuegan', 100),
      Conditions.badgeEarned('Flung')
    ),
  },

  // Flag unlocks
  { boostAlias: 'Flag Bearer', condition: Conditions.toolAmount('sand', 'Flag', 1) },
  { boostAlias: 'War Banner', condition: Conditions.toolAmount('sand', 'Flag', 2) },
  { boostAlias: 'Magic Mountain', condition: Conditions.toolAmount('sand', 'Flag', 6) },
  { boostAlias: 'Standardbot', condition: Conditions.toolAmount('sand', 'Flag', 14) },
  { boostAlias: 'Chequered Flag', condition: Conditions.toolAmount('sand', 'Flag', 25) },
  { boostAlias: 'Skull and Crossbones', condition: Conditions.toolAmount('sand', 'Flag', 40) },
  {
    boostAlias: 'Fly the Flag',
    condition: Conditions.and(
      Conditions.toolAmount('sand', 'Flag', 100),
      Conditions.badgeEarned('Flung')
    ),
  },

  // Ladder unlocks
  { boostAlias: 'Extension Ladder', condition: Conditions.toolAmount('sand', 'Ladder', 1) },
  { boostAlias: 'Climbbot', condition: Conditions.toolAmount('sand', 'Ladder', 14) },
  { boostAlias: 'Broken Rung', condition: Conditions.toolAmount('sand', 'Ladder', 25) },
  {
    boostAlias: 'Up Up and Away',
    condition: Conditions.and(
      Conditions.toolAmount('sand', 'Ladder', 100),
      Conditions.badgeEarned('Flung')
    ),
  },

  // Bag unlocks
  { boostAlias: 'Embaggening', condition: Conditions.toolAmount('sand', 'Bag', 2) },
  { boostAlias: 'Luggagebot', condition: Conditions.toolAmount('sand', 'Bag', 14) },
  { boostAlias: 'Bag Puns', condition: Conditions.toolAmount('sand', 'Bag', 30) },
  {
    boostAlias: 'Air Drop',
    condition: Conditions.and(
      Conditions.toolAmount('sand', 'Bag', 100),
      Conditions.badgeEarned('Flung')
    ),
  },

  // NewPixBot unlocks
  { boostAlias: 'Busy Bot', condition: Conditions.toolAmount('castle', 'NewPixBot', 3) },
  { boostAlias: 'Robot Efficiency', condition: Conditions.toolAmount('castle', 'NewPixBot', 8) },
  {
    boostAlias: 'Recursivebot',
    condition: Conditions.and(
      Conditions.toolAmount('castle', 'NewPixBot', 14),
      Conditions.boostBought('Robot Efficiency', 1)
    ),
  },
  { boostAlias: 'HAL-0-Kitty', condition: Conditions.toolAmount('castle', 'NewPixBot', 17) },
  {
    boostAlias: 'Factory Automation',
    condition: Conditions.and(
      Conditions.toolAmount('castle', 'NewPixBot', 22),
      Conditions.boostBought('DoRD', 1)
    ),
  },

  // Trebuchet unlocks
  { boostAlias: 'Spring Fling', condition: Conditions.toolAmount('castle', 'Trebuchet', 1) },
  { boostAlias: 'Trebuchet Pong', condition: Conditions.toolAmount('castle', 'Trebuchet', 2) },
  { boostAlias: 'Varied Ammo', condition: Conditions.toolAmount('castle', 'Trebuchet', 5) },
  { boostAlias: 'Flingbot', condition: Conditions.toolAmount('castle', 'Trebuchet', 14) },
  { boostAlias: 'Throw Your Toys', condition: Conditions.toolAmount('castle', 'Trebuchet', 20) },

  // Scaffold unlocks (requires ladder)
  {
    boostAlias: 'Precise Placement',
    condition: Conditions.and(
      Conditions.toolAmount('castle', 'Scaffold', 2),
      Conditions.toolAmount('sand', 'Ladder', 1)
    ),
  },
  {
    boostAlias: 'Level Up!',
    condition: Conditions.and(
      Conditions.toolAmount('castle', 'Scaffold', 4),
      Conditions.toolAmount('sand', 'Ladder', 1)
    ),
  },
  { boostAlias: 'Propbot', condition: Conditions.toolAmount('castle', 'Scaffold', 14) },
  { boostAlias: 'Balancing Act', condition: Conditions.toolAmount('castle', 'Scaffold', 20) },

  // Wave unlocks
  { boostAlias: 'Swell', condition: Conditions.toolAmount('castle', 'Wave', 2) },
  { boostAlias: 'Surfbot', condition: Conditions.toolAmount('castle', 'Wave', 14) },
  { boostAlias: 'SBTF', condition: Conditions.toolAmount('castle', 'Wave', 30) },

  // River unlocks
  { boostAlias: 'Smallbot', condition: Conditions.toolAmount('castle', 'River', 14) },

  // River + Bag combo unlock
  {
    boostAlias: 'Sandbag',
    condition: Conditions.and(
      Conditions.toolAmount('castle', 'River', 1),
      Conditions.toolAmount('sand', 'Bag', 1)
    ),
  },

  // LaPetite unlocks
  { boostAlias: 'Frenchbot', condition: Conditions.toolAmount('sand', 'LaPetite', 1001) },
];

/**
 * Resource-based unlock rules
 */
export const resourceUnlockRules: UnlockRule[] = [
  // Goat unlocks (Goats is a special resource tracked in boost power)
  { boostAlias: 'HoM', condition: Conditions.boostPower('Goats', 20) },
  { boostAlias: 'Beret Guy', condition: Conditions.boostPower('Goats', 200) },
];

/**
 * Badge-based unlock rules
 */
export const badgeUnlockRules: UnlockRule[] = [
  { boostAlias: 'Seacoal', condition: Conditions.badgeGroupCount('diamm', 3) },
  {
    boostAlias: 'Glaciation',
    condition: Conditions.and(
      Conditions.badgeGroupCount('diamm', 5),
      Conditions.boostBought('Robotic Feeder', 1)
    ),
  },
  { boostAlias: 'Dragong', condition: Conditions.badgeGroupCount('diamm', 10) },
  { boostAlias: 'Diamond Recycling', condition: Conditions.badgeGroupCount('diamm', 13) },
  { boostAlias: 'ClawsDeck', condition: Conditions.badgeGroupCount('diamm', 16) },
  { boostAlias: 'Annilment', condition: Conditions.badgeGroupCount('diamm', 19) },
];

/**
 * Glass ceiling unlock rules (power-based)
 */
export const ceilingUnlockRules: UnlockRule[] = [
  { boostAlias: 'The Fading', condition: Conditions.boostPower('Glass Ceiling', 1024) },
  { boostAlias: 'Temporal Anchor', condition: Conditions.boostPower('Glass Ceiling', 1e6) },
  { boostAlias: 'Panthers Dream', condition: Conditions.boostPower('Glass Ceiling', 1e9) },
];

/**
 * Boost-ownership / badge-count / misc unlock rules
 * Reference: data.js:723-800
 */
export const miscUnlockRules: UnlockRule[] = [
  // Fractal Sandcastles: auto-unlock + auto-buy when Fractals Forever badge earned
  // Reference: data.js:723-730
  { boostAlias: 'Fractal Sandcastles', condition: Conditions.badgeEarned('Fractals Forever') },

  // Chateau: unlocked when Unreachable? badge earned
  // Reference: data.js:731
  { boostAlias: 'Chateau', condition: Conditions.badgeEarned('Unreachable?') },

  // Ch*rpies: unlocked at 69 badges owned
  // Reference: data.js:740-742
  // Note: uses total badges owned, approximated via badge group count
  // This is a special case - handled in checkAutoUnlocks with custom logic

  // favs: unlocked at 100 boosts owned
  // Reference: data.js:750
  // Note: requires boostsOwned count - handled in checkAutoUnlocks with custom logic

  // Glass Jaw: Ninja Builder bought + GlassBlocks.power > 10
  // Reference: data.js:758
  {
    boostAlias: 'Glass Jaw',
    condition: Conditions.and(
      Conditions.boostBought('Ninja Builder', 1),
      Conditions.boostPower('GlassBlocks', 11)
    ),
  },

  // Sand Tool Multi-Buy: SandToolsOwned >= 123
  // Reference: data.js:767
  // Note: uses total sand tools owned - handled in checkAutoUnlocks with custom logic

  // Castle Tool Multi-Buy: CastleToolsOwned >= 234
  // Reference: data.js:768
  // Note: uses total castle tools owned - handled in checkAutoUnlocks with custom logic

  // Memories Revisited: >10 discoveries + DeLorean badge
  // Reference: data.js:774-776
  {
    boostAlias: 'Memories Revisited',
    condition: Conditions.and(
      Conditions.badgeGroupCount('discov', 11),
      Conditions.badgeEarned("Dude, Where's my DeLorean?")
    ),
  },

  // Stealth Cam: >100 discoveries
  // Reference: data.js:781-783
  { boostAlias: 'Stealth Cam', condition: Conditions.badgeGroupCount('discov', 101) },

  // Mind Glow: >10 sand monuments + Memories Revisited
  // Reference: data.js:784-786
  {
    boostAlias: 'Mind Glow',
    condition: Conditions.and(
      Conditions.badgeGroupCount('monums', 11),
      Conditions.boostBought('Memories Revisited', 1)
    ),
  },

  // Memory Singer: >10 glass monuments + Memories Revisited
  // Reference: data.js:787-789
  {
    boostAlias: 'Memory Singer',
    condition: Conditions.and(
      Conditions.badgeGroupCount('monumg', 11),
      Conditions.boostBought('Memories Revisited', 1)
    ),
  },

  // Seaish Glass Chips: Sand Purifier power > threshold
  // Reference: data.js:795
  { boostAlias: 'Seaish Glass Chips', condition: Conditions.boostPower('Sand Purifier', 501) },

  // Seaish Glass Blocks: Glass Extruder power > threshold
  // Reference: data.js:796
  { boostAlias: 'Seaish Glass Blocks', condition: Conditions.boostPower('Glass Extruder', 501) },

  // Rob: AC power >= 500
  // Reference: data.js:814
  { boostAlias: 'Rob', condition: Conditions.boostPower('AC', 500) },

  // Discovery Detector: >5 discoveries + discov1 badge earned
  // Reference: data.js:800
  {
    boostAlias: 'Discovery Detector',
    condition: Conditions.and(
      Conditions.badgeGroupCount('discov', 6),
      Conditions.badgeEarned('discov1')
    ),
  },

  // AD (Auto-Destroyer): unlocked when TF (Tool Factory) is bought
  // Reference: data.js:801
  { boostAlias: 'AD', condition: Conditions.boostBought('TF', 1) },
];

/**
 * All unlock rules combined
 */
export const allUnlockRules: UnlockRule[] = [
  ...toolUnlockRules,
  ...resourceUnlockRules,
  ...badgeUnlockRules,
  ...ceilingUnlockRules,
  ...miscUnlockRules,
];
