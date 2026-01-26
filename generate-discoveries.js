const fs = require('fs');
const discoveries = require('./discoveries-extracted.json');

const header = `/**
 * Discovery Definitions
 *
 * Contains all discoveries from the xkcd "Time" comic storyline.
 * Each discovery corresponds to a specific NewPix (frame) number.
 *
 * Discovery badges create 4 related badges per NP:
 * - discov{np}: The discovery itself (earned when visiting the NP)
 * - monums{np}: Sand Monument (created via Sand Mould Maker + Filler)
 * - monumg{np}: Glass Monument (created via Glass Mould Maker + Filler)
 * - diamm{np}: Diamond Masterpiece (purchased with diamonds)
 *
 * @see badges.js:1288-2450 for original definitions
 */

export interface DiscoveryDef {
  /** NewPix number (can be decimal for T1i storyline, e.g., 11.1) */
  np: number;
  /** Display name of the discovery */
  name: string;
  /** Description of what happened at this NewPix */
  desc: string;
}

/**
 * All discoveries from the Time comic.
 * Total: ${discoveries.length} discoveries
 * - Main storyline (integer NP values)
 * - T1i alternate storyline (decimal NP values like 11.1)
 * - Special (NP 0 "Chronocenter")
 */
export const discoveries: readonly DiscoveryDef[] = ${JSON.stringify(discoveries, null, 2)} as const;

/**
 * Get discovery for a specific NewPix number.
 * Supports both integer and decimal NP values.
 */
export function getDiscovery(np: number): DiscoveryDef | undefined {
  // Handle both positive and negative NP (for Time Travel)
  const absNp = Math.abs(np);
  return discoveries.find((d) => d.np === absNp);
}

/**
 * Check if a discovery exists for the given NewPix.
 */
export function hasDiscovery(np: number): boolean {
  return getDiscovery(np) !== undefined;
}

/**
 * Get all discovery NP numbers (useful for generating badge aliases).
 */
export function getAllDiscoveryNPs(): readonly number[] {
  return discoveries.map((d) => d.np);
}

/**
 * Get count of all discoveries.
 */
export function getDiscoveryCount(): number {
  return discoveries.length;
}
`;

fs.writeFileSync('src/data/discoveries.ts', header);
console.log(`Generated src/data/discoveries.ts with ${discoveries.length} discoveries`);
