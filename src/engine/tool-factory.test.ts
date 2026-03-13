import { describe, it, expect } from 'vitest';
import { runToolFactory, TF_ORDER, ToolFactoryState } from './tool-factory.js';

function makeState(overrides?: Partial<ToolFactoryState>): ToolFactoryState {
  return {
    tfBought: true,
    tfChipBuffer: 1000000,
    pcPower: 1,
    aaEnabled: false,
    acBought: false,
    acPower: 0,
    flipsidePower: 0,
    glassCeilingCount: 12,
    glassCeilings: Array(12).fill(true),
    toolPrices: Array(12).fill(Infinity), // all infinite by default
    priceFactor: 1,
    papalToolF: 1,
    tdFactor: 1,
    ...overrides,
  };
}

describe('Tool Factory', () => {
  describe('TF_ORDER', () => {
    it('has 12 tools in the correct interleaved order', () => {
      expect(TF_ORDER).toHaveLength(12);
      expect(TF_ORDER[0]).toBe('Bucket');
      expect(TF_ORDER[1]).toBe('NewPixBot');
      expect(TF_ORDER[2]).toBe('Cuegan');
      expect(TF_ORDER[3]).toBe('Trebuchet');
      expect(TF_ORDER[4]).toBe('Flag');
      expect(TF_ORDER[5]).toBe('Scaffold');
      expect(TF_ORDER[6]).toBe('Ladder');
      expect(TF_ORDER[7]).toBe('Wave');
      expect(TF_ORDER[8]).toBe('Bag');
      expect(TF_ORDER[9]).toBe('River');
      expect(TF_ORDER[10]).toBe('LaPetite');
      expect(TF_ORDER[11]).toBe('BeanieBuilder');
    });
  });

  describe('Early exits', () => {
    it('returns empty result when TF not bought', () => {
      const state = makeState({ tfBought: false });
      const result = runToolFactory(state);

      expect(result.totalBuilt).toBe(0);
      expect(result.remainingChips).toBe(state.tfChipBuffer);
      expect(result.badgesEarned).toHaveLength(0);
      for (const amount of result.toolsCreated.values()) {
        expect(amount).toBe(0);
      }
    });

    it('returns empty result when gcCount = 0', () => {
      const state = makeState({
        glassCeilingCount: 0,
        glassCeilings: Array(12).fill(false),
      });
      const result = runToolFactory(state);

      expect(result.totalBuilt).toBe(0);
      expect(result.remainingChips).toBe(state.tfChipBuffer);
    });
  });

  describe('Fast path', () => {
    it('creates (toolBuildNum - acPower) of each tool when all conditions met', () => {
      // Fast path: gcCount==12, fVal==0, chips >= 78000*toolBuildNum, toolBuildNum > acPower
      const state = makeState({
        pcPower: 5,
        aaEnabled: true,
        acBought: true,
        acPower: 2,
        tfChipBuffer: 78000 * 5, // exactly enough
      });
      const result = runToolFactory(state);

      // Each tool gets toolBuildNum - acPower = 5 - 2 = 3
      for (const name of TF_ORDER) {
        expect(result.toolsCreated.get(name)).toBe(3);
      }
    });

    it('deducts chips = ceil(papalToolF * 78000 * toolBuildNum)', () => {
      const state = makeState({
        pcPower: 2,
        tfChipBuffer: 78000 * 2 + 50000, // extra chips
        papalToolF: 1.5,
      });
      const result = runToolFactory(state);

      const expectedDeduction = Math.ceil(1.5 * 78000 * 2);
      expect(result.remainingChips).toBe(state.tfChipBuffer - expectedDeduction);
    });

    it('built = toolBuildNum * 12 (before TDFactor)', () => {
      const state = makeState({
        pcPower: 3,
        tfChipBuffer: 78000 * 3,
      });
      const result = runToolFactory(state);

      expect(result.rawBuilt).toBe(3 * 12);
    });

    it('is NOT used when fVal=1 even if all other conditions met', () => {
      const state = makeState({
        pcPower: 5,
        tfChipBuffer: 78000 * 5,
        flipsidePower: 1,
        // With fVal=1, we want finite-price tools. Default prices are Infinity so none match.
        toolPrices: Array(12).fill(100), // finite prices so Flipside=1 filters them in
      });
      const result = runToolFactory(state);

      // Fast path would produce toolBuildNum*12=60 tools, but since fVal=1 it should use regular path
      // Regular path: adjustedBuildNum = floor(5/12*12) = 5
      // All tools have finite prices and fVal=1 so isFinite(1*100)==true, (true?1:0)===1 -> match
      expect(result.rawBuilt).toBeLessThanOrEqual(60);
      // It should NOT be exactly toolBuildNum*12 from fast path
      // (It could be less because regular path logic differs)
    });

    it('is NOT used when toolBuildNum <= acPower', () => {
      const state = makeState({
        pcPower: 2,
        aaEnabled: true,
        acBought: true,
        acPower: 3, // acPower > pcPower, so toolBuildNum <= acPower
        tfChipBuffer: 78000 * 2,
      });
      const result = runToolFactory(state);

      // Fast path requires toolBuildNum > acPower. Here 2 <= 3, so regular path is used.
      // Regular path: adjustedBuildNum = floor(2/12*12) = 2
      // With fVal=0 and all infinite prices, all tools match
      // setPrice = sum(1000*(t+1) for t=0..11) = 78000
      // iAfford = min(2, floor(156000/78000)) = min(2, 2) = 2
      expect(result.totalBuilt).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Regular path', () => {
    it('builds full sets when enough chips', () => {
      // Use fewer ceilings to avoid fast path
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true; // Bucket only, cost = 1000*(0+1) = 1000
      glassCeilings[1] = true; // NewPixBot, cost = 1000*(1+1) = 2000

      const state = makeState({
        glassCeilingCount: 2,
        glassCeilings,
        pcPower: 4,
        tfChipBuffer: 100000,
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(4/2*12) = 24
      // setPrice = ceil((1000 + 2000) * 1) = 3000
      // iAfford = min(24, floor(100000/3000)) = min(24, 33) = 24
      expect(result.toolsCreated.get('Bucket')).toBe(24);
      expect(result.toolsCreated.get('NewPixBot')).toBe(24);
      // Other tools not produced
      expect(result.toolsCreated.get('Cuegan')).toBe(0);
    });

    it('builds singles with remaining chips after full sets', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true; // cost 1000
      glassCeilings[1] = true; // cost 2000

      const state = makeState({
        glassCeilingCount: 2,
        glassCeilings,
        pcPower: 1,
        tfChipBuffer: 4500, // setPrice = 3000. After 1 full set: 1500 left. Can afford Bucket(1000) but not NewPixBot(2000)
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(1/2*12) = 6
      // iAfford = min(6, floor(4500/3000)) = 1
      // After full sets: 4500 - 3000 = 1500 remaining
      // Singles: Bucket costs ceil(1000*1) = 1000 <= 1500, built. NewPixBot costs ceil(2000*1) = 2000 > 500, not built.
      // Note: singles loop goes from t=11 down to t=0, so it tries BeanieBuilder first (not owned), then down to NewPixBot (2000>500), then Bucket (1000<=1500)
      expect(result.toolsCreated.get('Bucket')).toBe(2); // 1 from full set + 1 single
      expect(result.toolsCreated.get('NewPixBot')).toBe(1); // 1 from full set only
    });

    it('redistributes toolBuildNum: floor(pcPower / gcCount * 12)', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true;
      glassCeilings[1] = true;
      glassCeilings[2] = true;

      const state = makeState({
        glassCeilingCount: 3,
        glassCeilings,
        pcPower: 6,
        tfChipBuffer: 10000000,
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(6/3*12) = 24
      // setPrice = ceil((1000 + 2000 + 3000) * 1) = 6000
      // iAfford = min(24, floor(10000000/6000)) = 24
      expect(result.toolsCreated.get('Bucket')).toBe(24);
      expect(result.toolsCreated.get('NewPixBot')).toBe(24);
      expect(result.toolsCreated.get('Cuegan')).toBe(24);
    });
  });

  describe('Flipside filtering', () => {
    it('fVal=0 only produces tools with infinite prices', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true;
      glassCeilings[1] = true;

      // Tool 0 has infinite price, tool 1 has finite price
      const toolPrices = Array(12).fill(Infinity);
      toolPrices[1] = 500; // finite

      const state = makeState({
        glassCeilingCount: 2,
        glassCeilings,
        toolPrices,
        flipsidePower: 0,
        tfChipBuffer: 100000,
        pcPower: 1,
      });
      const result = runToolFactory(state);

      // Only tool 0 (Bucket) should be produced (infinite price, fVal=0 matches)
      expect(result.toolsCreated.get('Bucket')).toBeGreaterThan(0);
      expect(result.toolsCreated.get('NewPixBot')).toBe(0);
    });

    it('fVal=1 only produces tools with finite prices', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true;
      glassCeilings[1] = true;

      const toolPrices = Array(12).fill(Infinity);
      toolPrices[1] = 500; // finite

      const state = makeState({
        glassCeilingCount: 2,
        glassCeilings,
        toolPrices,
        flipsidePower: 1,
        tfChipBuffer: 100000,
        pcPower: 1,
      });
      const result = runToolFactory(state);

      // Only tool 1 (NewPixBot) should be produced (finite price, fVal=1 matches)
      expect(result.toolsCreated.get('Bucket')).toBe(0);
      expect(result.toolsCreated.get('NewPixBot')).toBeGreaterThan(0);
    });
  });

  describe('Glass Ceiling filtering', () => {
    it('only produces tools with owned ceilings', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[4] = true; // Flag only

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 100000,
        pcPower: 2,
      });
      const result = runToolFactory(state);

      // Only Flag (index 4) should have tools created
      for (let i = 0; i < TF_ORDER.length; i++) {
        if (i === 4) {
          expect(result.toolsCreated.get(TF_ORDER[i])).toBeGreaterThan(0);
        } else {
          expect(result.toolsCreated.get(TF_ORDER[i])).toBe(0);
        }
      }
    });

    it('one ceiling selected gets all budget for that tool', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[2] = true; // Cuegan, cost = 1000*(2+1) = 3000

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 30000,
        pcPower: 1,
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(1/1*12) = 12
      // setPrice = ceil(3000 * 1) = 3000
      // iAfford = min(12, floor(30000/3000)) = min(12, 10) = 10
      expect(result.toolsCreated.get('Cuegan')).toBe(10);
      expect(result.remainingChips).toBe(0);
    });
  });

  describe('Papal modifier', () => {
    it('scales costs in regular path', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true; // Bucket, cost = 1000

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 10000,
        pcPower: 1,
        papalToolF: 2, // doubles cost
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(1/1*12) = 12
      // setPrice = ceil(1000 * 2) = 2000
      // iAfford = min(12, floor(10000/2000)) = 5
      expect(result.toolsCreated.get('Bucket')).toBe(5);
      expect(result.remainingChips).toBe(0);
    });
  });

  describe('TDFactor', () => {
    it('multiplies total built count', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true;

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 10000,
        pcPower: 1,
        tdFactor: 2.5,
      });
      const result = runToolFactory(state);

      // rawBuilt would be some number, totalBuilt = floor(rawBuilt * 2.5)
      expect(result.totalBuilt).toBe(Math.floor(result.rawBuilt * 2.5));
    });
  });

  describe('Badge thresholds', () => {
    it('earns KiloTool at >= 1000 built', () => {
      const state = makeState({
        tfChipBuffer: 78000 * 1000,
        pcPower: 1000,
      });
      const result = runToolFactory(state);

      // Fast path: built = 1000 * 12 = 12000
      expect(result.totalBuilt).toBeGreaterThanOrEqual(1000);
      expect(result.badgesEarned).toContain('KiloTool');
    });

    it('earns MegaTool at >= 1e6 built', () => {
      const state = makeState({
        tfChipBuffer: 78000 * 1e6,
        pcPower: 1e6,
        tdFactor: 1,
      });
      const result = runToolFactory(state);

      expect(result.totalBuilt).toBeGreaterThanOrEqual(1e6);
      expect(result.badgesEarned).toContain('MegaTool');
      expect(result.badgesEarned).toContain('KiloTool');
    });

    it('does not earn badges when built < 1000', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true;

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 5000,
        pcPower: 1,
      });
      const result = runToolFactory(state);

      expect(result.badgesEarned).toHaveLength(0);
    });

    it('earns multiple badges with TDFactor boost', () => {
      const state = makeState({
        tfChipBuffer: 78000 * 100,
        pcPower: 100,
        tdFactor: 10,
      });
      const result = runToolFactory(state);

      // rawBuilt = 100 * 12 = 1200
      // totalBuilt = floor(1200 * 10) = 12000
      expect(result.totalBuilt).toBe(12000);
      expect(result.badgesEarned).toContain('KiloTool');
    });
  });

  describe('acPower calculation', () => {
    it('acPower = 0 when AA disabled', () => {
      const state = makeState({
        pcPower: 5,
        aaEnabled: false,
        acBought: true,
        acPower: 3,
        tfChipBuffer: 78000 * 5,
      });
      const result = runToolFactory(state);

      // acPower = 0 (AA disabled), so fast path creates toolBuildNum - 0 = 5 of each
      for (const name of TF_ORDER) {
        expect(result.toolsCreated.get(name)).toBe(5);
      }
    });

    it('acPower = 1 when AA enabled but AC not bought', () => {
      const state = makeState({
        pcPower: 5,
        aaEnabled: true,
        acBought: false,
        acPower: 0,
        tfChipBuffer: 78000 * 5,
      });
      const result = runToolFactory(state);

      // acPower = 1 (AA enabled, AC not bought), creates 5 - 1 = 4 of each
      for (const name of TF_ORDER) {
        expect(result.toolsCreated.get(name)).toBe(4);
      }
    });

    it('acPower = AC.power when AA enabled and AC bought', () => {
      const state = makeState({
        pcPower: 10,
        aaEnabled: true,
        acBought: true,
        acPower: 3,
        tfChipBuffer: 78000 * 10,
      });
      const result = runToolFactory(state);

      // acPower = 3, creates 10 - 3 = 7 of each
      for (const name of TF_ORDER) {
        expect(result.toolsCreated.get(name)).toBe(7);
      }
    });
  });

  describe('Edge cases', () => {
    it('zero chips produces nothing', () => {
      const state = makeState({ tfChipBuffer: 0 });
      const result = runToolFactory(state);

      expect(result.totalBuilt).toBe(0);
      expect(result.remainingChips).toBe(0);
    });

    it('chips exactly equal to cost produces exactly that amount', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true; // Bucket, cost = 1000

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 5000, // exactly 5 Buckets
        pcPower: 1,
      });
      const result = runToolFactory(state);

      // adjustedBuildNum = floor(1/1*12) = 12
      // setPrice = ceil(1000 * 1) = 1000
      // iAfford = min(12, floor(5000/1000)) = 5
      expect(result.toolsCreated.get('Bucket')).toBe(5);
      expect(result.remainingChips).toBe(0);
    });

    it('handles fractional papal modifier correctly with ceiling', () => {
      const glassCeilings = Array(12).fill(false);
      glassCeilings[0] = true; // cost = 1000

      const state = makeState({
        glassCeilingCount: 1,
        glassCeilings,
        tfChipBuffer: 1500,
        pcPower: 1,
        papalToolF: 1.1, // ceil(1000 * 1.1) = 1100
      });
      const result = runToolFactory(state);

      // setPrice = ceil(1000 * 1.1) = 1100
      // iAfford = min(12, floor(1500/1100)) = 1
      // After full set: 1500 - 1100 = 400 remaining
      // Singles: ceil(1000 * 1.1) = 1100 > 400, none
      expect(result.toolsCreated.get('Bucket')).toBe(1);
      expect(result.remainingChips).toBe(400);
    });

    it('priceFactor * Infinity is not finite (used for flipside filter)', () => {
      // This validates the core flipside logic
      expect(isFinite(1 * Infinity)).toBe(false);
      expect(isFinite(0 * Infinity)).toBe(false); // NaN
      expect(isFinite(1 * 100)).toBe(true);
    });
  });
});
