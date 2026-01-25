/**
 * Modern Engine Module
 *
 * Exports the modern TypeScript implementation of Sandcastle Builder.
 */

export { SaveParser, createSaveParser } from './save-parser.js';
export {
  parseSaveSections,
  parseGamenums,
  parseSandTools,
  parseCastleTools,
  parseBoostState,
  parseBoosts,
  parseBadges,
  parseOtherBadges,
  parseNPData,
} from './save-parser.js';
export type { RawSaveSections } from './save-parser.js';

export { ModernEngine, createModernEngine } from './modern-engine.js';

export {
  UnlockChecker,
  evaluateCondition,
  checkUnlockRules,
  type UnlockCheckState,
  type UnlockCheckResult,
} from './unlock-checker.js';

export {
  Conditions,
  allUnlockRules,
  toolUnlockRules,
  resourceUnlockRules,
  badgeUnlockRules,
  ceilingUnlockRules,
  type UnlockCondition,
  type UnlockRule,
  type UnlockConditionType,
} from './unlock-conditions.js';
