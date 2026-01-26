/**
 * Badge Checker
 *
 * Checks badge conditions and triggers earning at appropriate points.
 * Maintains state of earned badges to avoid duplicate checks.
 *
 * Reference: Legacy badge earning scattered across:
 * - data.js CheckBuyUnlocks
 * - castle.js various functions
 * - boosts.js rate calculation
 */

import {
  BadgeTrigger,
  BadgeCheckState,
  getConditionsForTrigger,
} from './badge-conditions.js';

export class BadgeChecker {
  private earnedBadges: Set<string>;
  private onBadgeEarned: (badge: string) => void;

  constructor(onBadgeEarned: (badge: string) => void) {
    this.earnedBadges = new Set();
    this.onBadgeEarned = onBadgeEarned;
  }

  /**
   * Mark badges as already earned (e.g., when loading state).
   */
  setEarnedBadges(badges: string[]): void {
    this.earnedBadges = new Set(badges);
  }

  /**
   * Check conditions for a trigger and earn new badges.
   * Returns array of newly earned badge names.
   */
  check(trigger: BadgeTrigger, state: BadgeCheckState): string[] {
    const conditions = getConditionsForTrigger(trigger);
    const newBadges: string[] = [];

    for (const condition of conditions) {
      // Skip if already earned
      if (this.earnedBadges.has(condition.badge)) {
        continue;
      }

      // Check condition
      try {
        if (condition.check(state)) {
          this.earnedBadges.add(condition.badge);
          this.onBadgeEarned(condition.badge);
          newBadges.push(condition.badge);
        }
      } catch (error) {
        // Log error but don't stop checking other badges
        console.error(`Error checking badge condition for ${condition.badge}:`, error);
      }
    }

    return newBadges;
  }

  /**
   * Check if a badge is earned.
   */
  isEarned(badge: string): boolean {
    return this.earnedBadges.has(badge);
  }

  /**
   * Get count of earned badges.
   */
  getEarnedCount(): number {
    return this.earnedBadges.size;
  }

  /**
   * Get all earned badge names.
   */
  getEarnedBadges(): string[] {
    return Array.from(this.earnedBadges);
  }

  /**
   * Manually earn a badge (for special cases like discoveries).
   */
  manuallyEarn(badge: string): void {
    if (!this.earnedBadges.has(badge)) {
      this.earnedBadges.add(badge);
      this.onBadgeEarned(badge);
    }
  }

  /**
   * Remove a badge (for coma reset).
   */
  unearn(badge: string): void {
    this.earnedBadges.delete(badge);
  }

  /**
   * Clear all earned badges (for coma reset).
   */
  clearAll(): void {
    this.earnedBadges.clear();
  }
}
