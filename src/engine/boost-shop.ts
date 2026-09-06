/**
 * Boost shop: affordability, purchase, toggle, lock, and permalock.
 *
 * The resource ledger itself (getResourceAmount/hasResource/
 * subtractResource/addResource/spendResource) stays in the engine: it is a
 * shared kernel used by tick, vacuum, flux, ONG, and other systems, not
 * shop-specific. Shop behavior here composes that kernel through a narrow
 * BoostShopAccess adapter the engine builds (same pattern as
 * beach-click.ts and monty-haul.ts).
 *
 * Reference: castle.js:1284-1320 (Molpy.Has/Spend), :1499-1520 (Boost.buy),
 * :1531-1542 (Boost.CalcPrice), Molpy.LockBoost
 */

import type { BoostDefinition } from '../types/game-data.js';
import { calculateBoostPrice, isPriceFree } from './price-calculator.js';

/**
 * Mutable boost state the shop reads and writes.
 */
export interface ShopBoostState {
  unlocked: number;
  bought: number;
  power: number;
  isEnabled?: boolean;
  permalock?: boolean;
}

/**
 * Engine capabilities the shop needs. Implemented by ModernEngine
 * closures so this module stays dependency-free.
 */
export interface BoostShopAccess {
  ensureInitialized(): void;
  getBoost(alias: string): ShopBoostState | undefined;
  getBoostDef(alias: string): BoostDefinition | undefined;
  getPriceFactor(): number;
  hasResource(resource: string, amount: number): boolean;
  spendShopPrice(price: Record<string, number>): void;
  checkAutoUnlocks(): void;
  runBuyFunction(alias: string): void;
  runLockFunction(alias: string): void;
  recalculateAfterPurchase(): void;
  recalculateAfterLock(): void;
}

/**
 * Check whether a price can be paid from current resources.
 * Reference: castle.js:1284-1293 (Molpy.Has with object)
 */
export function canAffordShopPrice(
  access: BoostShopAccess,
  price: Record<string, number>,
): boolean {
  for (const [resource, amount] of Object.entries(price)) {
    if (!access.hasResource(resource, amount)) {
      return false;
    }
  }
  return true;
}

/**
 * Whether a boost can currently be bought (unlocked, unbought, affordable).
 */
export async function isBoostAffordable(
  access: BoostShopAccess,
  alias: string,
): Promise<boolean> {
  access.ensureInitialized();

  const state = access.getBoost(alias);
  const def = access.getBoostDef(alias);

  if (!state || !def) return false;

  // Must be unlocked but not yet bought
  if (state.unlocked <= state.bought) return false;

  // Calculate price with priceFactor applied
  const realPrice = calculateBoostPrice(def.price, access.getPriceFactor());

  // Free boosts are always affordable
  if (isPriceFree(realPrice)) return true;

  // Check if we can afford the price
  return canAffordShopPrice(access, realPrice);
}

/**
 * Get the calculated price for a boost (after priceFactor).
 * Reference: castle.js:1531-1542 (Boost.CalcPrice)
 *
 * @returns Calculated price object, or empty if boost not found
 */
export function getBoostShopPrice(
  access: BoostShopAccess,
  alias: string,
): Record<string, number> {
  const def = access.getBoostDef(alias);
  if (!def) return {};

  return calculateBoostPrice(def.price, access.getPriceFactor());
}

/**
 * Buy/unlock a boost.
 * Applies priceFactor to boost price and checks affordability.
 * Reference: castle.js:1499-1520 (Boost.buy)
 */
export async function buyShopBoost(
  access: BoostShopAccess,
  alias: string,
): Promise<void> {
  access.ensureInitialized();

  const state = access.getBoost(alias);
  if (!state) return;

  const def = access.getBoostDef(alias);
  if (!def) return;

  // Check if unlocked but not bought
  if (state.unlocked > state.bought) {
    // Calculate price with priceFactor applied
    const realPrice = calculateBoostPrice(def.price, access.getPriceFactor());
    const isFree = isPriceFree(realPrice);

    // Check if we can afford it
    if (!isFree && !canAffordShopPrice(access, realPrice)) {
      return; // Can't afford
    }

    // Spend the resources
    if (!isFree) {
      access.spendShopPrice(realPrice);
    }

    state.bought++;
    access.checkAutoUnlocks();

    // Call boost's buyFunction if registered
    access.runBuyFunction(alias);

    // Recalculate rates after boost purchase
    access.recalculateAfterPurchase();
  }
}

/**
 * Toggle a boost on/off.
 */
export async function toggleShopBoost(
  access: BoostShopAccess,
  alias: string,
): Promise<void> {
  access.ensureInitialized();

  const state = access.getBoost(alias);
  const def = access.getBoostDef(alias);

  if (!state || !def || !def.isToggle) return;

  // Toggle isEnabled state
  state.isEnabled = !state.isEnabled;
}

/**
 * Lock a boost (reset bought and unlocked to 0).
 * Calls the boost's lockFunction if registered.
 * Reference: castle.js Molpy.LockBoost
 */
export function lockShopBoost(access: BoostShopAccess, alias: string): void {
  access.ensureInitialized();

  const state = access.getBoost(alias);
  if (!state) return;

  // Skip if already locked (prevents infinite recursion in cascade systems)
  if (state.unlocked === 0 && state.bought === 0) return;

  // Call boost's lockFunction before resetting state
  access.runLockFunction(alias);

  // Reset the boost state
  state.bought = 0;
  state.unlocked = 0;

  // Recalculate rates after lock
  access.recalculateAfterLock();
}

/**
 * Permalock a boost (prevents it from being unlocked again).
 */
export function permalockShopBoost(access: BoostShopAccess, alias: string): void {
  access.ensureInitialized();

  const state = access.getBoost(alias);
  if (state) {
    state.permalock = true;
  }
}
