/**
 * Tool Factory Core Production (RunToolFactory)
 *
 * The Tool Factory converts Glass Chips (stored in TF.Level) into Glass Tools each mNP.
 * It iterates through tools in a specific interleaved sand/castle order, filtering by
 * Glass Ceiling ownership and Flipside settings, and produces tools based on available chips.
 *
 * Reference: boosts.js:5175-5313
 */

/**
 * Tool order for Tool Factory production (MakeTFOrder).
 * Interleaved sand/castle tools, indexed 0-11.
 */
export const TF_ORDER: readonly string[] = [
  'Bucket',        // 0 - sand tool
  'NewPixBot',     // 1 - castle tool
  'Cuegan',        // 2 - sand tool
  'Trebuchet',     // 3 - castle tool
  'Flag',          // 4 - sand tool
  'Scaffold',      // 5 - castle tool
  'Ladder',        // 6 - sand tool
  'Wave',          // 7 - castle tool
  'Bag',           // 8 - sand tool
  'River',         // 9 - castle tool
  'LaPetite',      // 10 - sand tool
  'BeanieBuilder', // 11 - castle tool
];

/**
 * State required for Tool Factory production calculations.
 */
export interface ToolFactoryState {
  /** Whether the Tool Factory boost is bought */
  tfBought: boolean;

  /** Glass Chips available for production (TF.Level) */
  tfChipBuffer: number;

  /** Production Copies power - copies per tool type per mNP (PC.power, default 1) */
  pcPower: number;

  /** Whether Adaptive Automation is enabled */
  aaEnabled: boolean;

  /** Whether Autoclicker (AC) is bought */
  acBought: boolean;

  /** Autoclicker power level */
  acPower: number;

  /** Flipside power (0 = build infinite-price tools, 1 = build finite-price tools) */
  flipsidePower: number;

  /** Number of Glass Ceilings owned (0-12) */
  glassCeilingCount: number;

  /** Which glass ceilings are owned, indexed 0-11 */
  glassCeilings: boolean[];

  /** Tool prices indexed by TF_ORDER position */
  toolPrices: number[];

  /** Price factor multiplier (used with Flipside filter) */
  priceFactor: number;

  /** Papal('ToolF') multiplier for costs */
  papalToolF: number;

  /** TDFactor() multiplier for built count */
  tdFactor: number;
}

/**
 * Result from running the Tool Factory.
 */
export interface ToolFactoryResult {
  /** Map of tool name to number of copies created */
  toolsCreated: Map<string, number>;

  /** Remaining chips after production */
  remainingChips: number;

  /** Total tools built (after TDFactor) */
  totalBuilt: number;

  /** Total tools built before TDFactor */
  rawBuilt: number;

  /** Badges earned from this production run */
  badgesEarned: string[];
}

/** Badge thresholds for tool production */
const TOOL_BADGES: readonly [number, string][] = [
  [1000, 'KiloTool'],
  [1e6, 'MegaTool'],
  [1e9, 'GigaTool'],
  [1e12, 'TeraTool'],
  [1e15, 'PetaTool'],
  [1e24, 'YottaTool'],
  [1e42, 'WololoTool'],
  [1e84, 'WololoWololoTool'],
];

/**
 * Check whether a tool at the given index should be produced given
 * the Flipside filter and Glass Ceiling ownership.
 */
function shouldProduceTool(
  index: number,
  toolPrice: number,
  priceFactor: number,
  fVal: number,
  glassCeilings: boolean[]
): boolean {
  if (!glassCeilings[index]) {
    return false;
  }
  // Legacy: isFinite(priceFactor * tool.price) == fVal
  // JS == coerces boolean to number: true==1, false==0
  const finiteCheck = isFinite(priceFactor * toolPrice);
  return (finiteCheck ? 1 : 0) === fVal;
}

/**
 * Run the Tool Factory production algorithm.
 *
 * Converts Glass Chips into Glass Tools following the legacy RunToolFactory logic.
 *
 * Reference: boosts.js:5175-5313
 */
export function runToolFactory(state: ToolFactoryState): ToolFactoryResult {
  const toolsCreated = new Map<string, number>();
  const badgesEarned: string[] = [];

  // Initialize all tools to 0
  for (const name of TF_ORDER) {
    toolsCreated.set(name, 0);
  }

  // Early exit: TF not bought or no ceilings
  if (!state.tfBought || state.glassCeilingCount === 0) {
    return {
      toolsCreated,
      remainingChips: state.tfChipBuffer,
      totalBuilt: 0,
      rawBuilt: 0,
      badgesEarned,
    };
  }

  let tfChipBuffer = state.tfChipBuffer;
  const toolBuildNum = state.pcPower;
  const fVal = state.flipsidePower;
  const gcCount = state.glassCeilingCount;

  // Calculate acPower: AA enabled ? (AC bought ? AC.power : 1) : 0
  const acPower = state.aaEnabled ? (state.acBought ? state.acPower : 1) : 0;

  let built = 0;

  // Fast path: all 12 ceilings, Flipside off, enough chips, toolBuildNum > acPower
  if (
    gcCount === 12 &&
    fVal === 0 &&
    tfChipBuffer >= 78000 * toolBuildNum &&
    toolBuildNum > acPower
  ) {
    const createAmount = toolBuildNum - acPower;
    for (let t = TF_ORDER.length - 1; t >= 0; t--) {
      toolsCreated.set(TF_ORDER[t], createAmount);
    }
    tfChipBuffer -= Math.ceil(state.papalToolF * 78000 * toolBuildNum);
    built = toolBuildNum * 12;
  } else {
    // Regular path
    const adjustedBuildNum = Math.floor(toolBuildNum / gcCount * 12);

    // Calculate set price: sum of costs for all eligible tools
    let setPrice = 0;
    for (let t = TF_ORDER.length - 1; t >= 0; t--) {
      if (tfChipBuffer === 0) break;
      if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
        const cost = 1000 * (t + 1);
        setPrice += cost;
      }
    }
    setPrice = Math.ceil(setPrice * state.papalToolF);

    // Avoid division by zero
    const iAfford = setPrice > 0
      ? Math.min(adjustedBuildNum, Math.floor(tfChipBuffer / setPrice))
      : 0;

    // Build full sets
    if (iAfford > 0) {
      for (let t = TF_ORDER.length - 1; t >= 0; t--) {
        if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
          toolsCreated.set(TF_ORDER[t], (toolsCreated.get(TF_ORDER[t]) ?? 0) + iAfford);
          built += iAfford;
        }
      }
      tfChipBuffer -= setPrice * iAfford;
    }

    // Build singles with remaining chips
    if (iAfford < adjustedBuildNum) {
      for (let t = TF_ORDER.length - 1; t >= 0; t--) {
        if (shouldProduceTool(t, state.toolPrices[t], state.priceFactor, fVal, state.glassCeilings)) {
          const cost = Math.ceil(1000 * (t + 1) * state.papalToolF);
          if (tfChipBuffer >= cost) {
            tfChipBuffer -= cost;
            built++;
            toolsCreated.set(TF_ORDER[t], (toolsCreated.get(TF_ORDER[t]) ?? 0) + 1);
          }
        }
      }
    }
  }

  // Post-production: apply TDFactor and check badges
  const rawBuilt = built;
  if (built > 0) {
    built = Math.floor(built * state.tdFactor);

    for (const [threshold, badge] of TOOL_BADGES) {
      if (built >= threshold) {
        badgesEarned.push(badge);
      }
    }
  }

  return {
    toolsCreated,
    remainingChips: tfChipBuffer,
    totalBuilt: built,
    rawBuilt,
    badgesEarned,
  };
}
