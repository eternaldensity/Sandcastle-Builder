/**
 * Boost Unlock Checker
 *
 * Evaluates unlock conditions against game state and triggers unlocks.
 * This implements the auto-unlock logic that runs when game state changes.
 */

import type { BoostState, ToolState } from '../types/game-data.js';
import type {
  UnlockCondition,
  UnlockRule,
  ToolAmountCondition,
  ResourceCondition,
  BoostPowerCondition,
  BoostBoughtCondition,
  BadgeEarnedCondition,
  BadgeGroupCountCondition,
  AndCondition,
  OrCondition,
} from './unlock-conditions.js';

/**
 * Game state interface for unlock checking
 * This is a minimal interface to decouple from the full engine state
 */
export interface UnlockCheckState {
  sandTools: Map<string, { amount: number }> | Record<string, { amount: number }>;
  castleTools: Map<string, { amount: number }> | Record<string, { amount: number }>;
  boosts: Map<string, BoostState> | Record<string, BoostState>;
  badges: Map<string, boolean> | Record<string, boolean>;
  resources: {
    sand: number;
    castles: number;
    glassChips: number;
    glassBlocks: number;
  };
  badgeGroupCounts?: Record<string, number>;
}

/**
 * Helper to get value from Map or Record
 */
function getValue<T>(source: Map<string, T> | Record<string, T>, key: string): T | undefined {
  if (source instanceof Map) {
    return source.get(key);
  }
  return source[key];
}

/**
 * Evaluate a single unlock condition against game state
 */
export function evaluateCondition(condition: UnlockCondition, state: UnlockCheckState): boolean {
  switch (condition.type) {
    case 'tool-amount':
      return evaluateToolAmount(condition, state);

    case 'resource':
      return evaluateResource(condition, state);

    case 'boost-power':
      return evaluateBoostPower(condition, state);

    case 'boost-bought':
      return evaluateBoostBought(condition, state);

    case 'badge-earned':
      return evaluateBadgeEarned(condition, state);

    case 'badge-group-count':
      return evaluateBadgeGroupCount(condition, state);

    case 'and':
      return evaluateAnd(condition, state);

    case 'or':
      return evaluateOr(condition, state);

    default: {
      const _exhaustive: never = condition;
      return false;
    }
  }
}

function evaluateToolAmount(condition: ToolAmountCondition, state: UnlockCheckState): boolean {
  const tools = condition.toolType === 'sand' ? state.sandTools : state.castleTools;
  const tool = getValue(tools, condition.toolName);
  if (!tool) return false;
  return tool.amount >= condition.threshold;
}

function evaluateResource(condition: ResourceCondition, state: UnlockCheckState): boolean {
  switch (condition.resource) {
    case 'sand':
      return state.resources.sand >= condition.threshold;
    case 'castles':
      return state.resources.castles >= condition.threshold;
    case 'glassChips':
      return state.resources.glassChips >= condition.threshold;
    case 'glassBlocks':
      return state.resources.glassBlocks >= condition.threshold;
    case 'goats':
    case 'bonemeal': {
      // These are stored as boost power in legacy
      const boost = getValue(state.boosts, condition.resource === 'goats' ? 'Goats' : 'Bonemeal');
      return boost ? boost.power >= condition.threshold : false;
    }
    default:
      return false;
  }
}

function evaluateBoostPower(condition: BoostPowerCondition, state: UnlockCheckState): boolean {
  const boost = getValue(state.boosts, condition.boostAlias);
  if (!boost) return false;
  return boost.power >= condition.threshold;
}

function evaluateBoostBought(condition: BoostBoughtCondition, state: UnlockCheckState): boolean {
  const boost = getValue(state.boosts, condition.boostAlias);
  if (!boost) return false;
  return boost.bought >= condition.threshold;
}

function evaluateBadgeEarned(condition: BadgeEarnedCondition, state: UnlockCheckState): boolean {
  const earned = getValue(state.badges, condition.badgeName);
  return earned === true;
}

function evaluateBadgeGroupCount(condition: BadgeGroupCountCondition, state: UnlockCheckState): boolean {
  if (!state.badgeGroupCounts) return false;
  const count = state.badgeGroupCounts[condition.group] ?? 0;
  return count >= condition.threshold;
}

function evaluateAnd(condition: AndCondition, state: UnlockCheckState): boolean {
  return condition.conditions.every(c => evaluateCondition(c, state));
}

function evaluateOr(condition: OrCondition, state: UnlockCheckState): boolean {
  return condition.conditions.some(c => evaluateCondition(c, state));
}

/**
 * Result of checking unlock rules
 */
export interface UnlockCheckResult {
  /** Boosts that should be unlocked */
  toUnlock: string[];
  /** Boosts that were already unlocked */
  alreadyUnlocked: string[];
  /** Boosts whose conditions are not met */
  notReady: string[];
}

/**
 * Check which boosts should be unlocked based on current state
 */
export function checkUnlockRules(
  rules: UnlockRule[],
  state: UnlockCheckState
): UnlockCheckResult {
  const result: UnlockCheckResult = {
    toUnlock: [],
    alreadyUnlocked: [],
    notReady: [],
  };

  for (const rule of rules) {
    const boost = getValue(state.boosts, rule.boostAlias);

    // Skip if boost doesn't exist in game data
    if (!boost) continue;

    // Check if already unlocked
    if (boost.unlocked > 0) {
      result.alreadyUnlocked.push(rule.boostAlias);
      continue;
    }

    // Evaluate condition
    if (evaluateCondition(rule.condition, state)) {
      result.toUnlock.push(rule.boostAlias);
    } else {
      result.notReady.push(rule.boostAlias);
    }
  }

  return result;
}

/**
 * Unlock checker class for integration with ModernEngine
 */
export class UnlockChecker {
  private rules: UnlockRule[];

  constructor(rules: UnlockRule[]) {
    this.rules = rules;
  }

  /**
   * Check and return boosts that should be unlocked
   */
  check(state: UnlockCheckState): string[] {
    const result = checkUnlockRules(this.rules, state);
    return result.toUnlock;
  }

  /**
   * Add additional rules
   */
  addRules(rules: UnlockRule[]): void {
    this.rules.push(...rules);
  }

  /**
   * Get all rules
   */
  getRules(): readonly UnlockRule[] {
    return this.rules;
  }
}
