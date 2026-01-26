import { describe, it, expect } from 'vitest';
import {
  calculateNewPixBotRate,
  calculateTrebuchetRate,
  calculateScaffoldRate,
  calculateWaveRate,
  calculateRiverRate,
  calculateAllCastleToolRates,
  type CastleToolRateState,
} from './castle-rate-calculator.js';

const baseState: CastleToolRateState = {
  newPixBots: 0,
  trebuchets: 0,
  scaffolds: 0,
  waves: 0,
  rivers: 0,
  busyBot: false,
  robotEfficiency: false,
  robotEfficiencyPower: 0,
  recursivebot: false,
  halOKitty: false,
  halBoost: 0,
  springFling: false,
  trebuchetPong: false,
  trebuchetPongPower: 0,
  flingbot: false,
  variedAmmo: false,
  variedAmmoPower: 0,
  precisePlacement: false,
  levelUp: false,
  propbot: false,
  swell: false,
  surfbot: false,
  sbtf: false,
  sbtfPower: 0,
  smallbot: false,
};

describe('calculateNewPixBotRate', () => {
  it('returns 3.5 base rate', () => {
    expect(calculateNewPixBotRate(baseState)).toBe(3.5);
  });

  it('doubles with Busy Bot', () => {
    expect(calculateNewPixBotRate({ ...baseState, busyBot: true })).toBe(7.0);
  });

  it('multiplies by Robot Efficiency power', () => {
    expect(calculateNewPixBotRate({
      ...baseState,
      robotEfficiency: true,
      robotEfficiencyPower: 10,
    })).toBe(35);
  });

  it('caps Robot Efficiency at 1000', () => {
    expect(calculateNewPixBotRate({
      ...baseState,
      robotEfficiency: true,
      robotEfficiencyPower: 5000,
    })).toBe(3.5 * 1000);
  });

  it('multiplies by 4 with Recursivebot', () => {
    expect(calculateNewPixBotRate({
      ...baseState,
      recursivebot: true,
    })).toBe(14);
  });

  it('applies HAL-0-Kitty power multiplier', () => {
    const rate = calculateNewPixBotRate({
      ...baseState,
      halOKitty: true,
      halBoost: 10,
    });
    expect(rate).toBeCloseTo(3.5 * Math.pow(1.1, 10), 5);
  });

  it('caps HAL boost at 100', () => {
    const rate = calculateNewPixBotRate({
      ...baseState,
      halOKitty: true,
      halBoost: 500,
    });
    expect(rate).toBeCloseTo(3.5 * Math.pow(1.1, 100), 5);
  });

  it('stacks all NewPixBot boosts', () => {
    const rate = calculateNewPixBotRate({
      ...baseState,
      busyBot: true,              // ×2
      robotEfficiency: true,      // ×10
      robotEfficiencyPower: 10,
      recursivebot: true,         // ×4
      halOKitty: true,            // ×1.1^5
      halBoost: 5,
    });
    const expected = 3.5 * 2 * 10 * 4 * Math.pow(1.1, 5);
    expect(rate).toBeCloseTo(expected, 5);
  });
});

describe('calculateTrebuchetRate', () => {
  it('returns 6.25 base rate', () => {
    expect(calculateTrebuchetRate(baseState)).toBe(6.25);
  });

  it('multiplies by 1.5 with Spring Fling', () => {
    expect(calculateTrebuchetRate({
      ...baseState,
      springFling: true,
    })).toBe(9.375);
  });

  it('applies Trebuchet Pong power multiplier', () => {
    const rate = calculateTrebuchetRate({
      ...baseState,
      trebuchetPong: true,
      trebuchetPongPower: 5,
    });
    expect(rate).toBeCloseTo(6.25 * Math.pow(1.2, 5), 5);
  });

  it('multiplies by 4 with Flingbot', () => {
    expect(calculateTrebuchetRate({
      ...baseState,
      flingbot: true,
    })).toBe(25);
  });

  it('applies Varied Ammo bonus', () => {
    expect(calculateTrebuchetRate({
      ...baseState,
      variedAmmo: true,
      variedAmmoPower: 10,
    })).toBe(6.25 * 2); // 1 + 10 * 0.1 = 2
  });

  it('stacks all Trebuchet boosts', () => {
    const rate = calculateTrebuchetRate({
      ...baseState,
      springFling: true,          // ×1.5
      trebuchetPong: true,        // ×1.2^3
      trebuchetPongPower: 3,
      flingbot: true,             // ×4
      variedAmmo: true,           // ×1.5
      variedAmmoPower: 5,
    });
    const expected = 6.25 * 1.5 * Math.pow(1.2, 3) * 4 * 1.5;
    expect(rate).toBeCloseTo(expected, 5);
  });
});

describe('calculateScaffoldRate', () => {
  it('returns 15.63 base rate', () => {
    expect(calculateScaffoldRate(baseState)).toBe(15.63);
  });

  it('multiplies by 1.5 with Precise Placement', () => {
    expect(calculateScaffoldRate({
      ...baseState,
      precisePlacement: true,
    })).toBe(23.445);
  });

  it('doubles with Level Up!', () => {
    expect(calculateScaffoldRate({
      ...baseState,
      levelUp: true,
    })).toBe(31.26);
  });

  it('multiplies by 4 with Propbot', () => {
    expect(calculateScaffoldRate({
      ...baseState,
      propbot: true,
    })).toBe(62.52);
  });

  it('stacks all Scaffold boosts', () => {
    const rate = calculateScaffoldRate({
      ...baseState,
      precisePlacement: true,  // ×1.5
      levelUp: true,           // ×2
      propbot: true,           // ×4
    });
    expect(rate).toBeCloseTo(15.63 * 1.5 * 2 * 4, 5);
  });
});

describe('calculateWaveRate', () => {
  it('returns 39.06 base rate', () => {
    expect(calculateWaveRate(baseState)).toBe(39.06);
  });

  it('doubles with Swell', () => {
    expect(calculateWaveRate({
      ...baseState,
      swell: true,
    })).toBe(78.12);
  });

  it('multiplies by 4 with Surfbot', () => {
    expect(calculateWaveRate({
      ...baseState,
      surfbot: true,
    })).toBe(156.24);
  });

  it('multiplies by SBTF power', () => {
    expect(calculateWaveRate({
      ...baseState,
      sbtf: true,
      sbtfPower: 5,
    })).toBe(195.3);
  });

  it('stacks all Wave boosts', () => {
    const rate = calculateWaveRate({
      ...baseState,
      swell: true,      // ×2
      surfbot: true,    // ×4
      sbtf: true,       // ×3
      sbtfPower: 3,
    });
    expect(rate).toBeCloseTo(39.06 * 2 * 4 * 3, 5);
  });
});

describe('calculateRiverRate', () => {
  it('returns 97.66 base rate', () => {
    expect(calculateRiverRate(baseState)).toBe(97.66);
  });

  it('multiplies by 4 with Smallbot', () => {
    expect(calculateRiverRate({
      ...baseState,
      smallbot: true,
    })).toBe(390.64);
  });
});

describe('calculateAllCastleToolRates', () => {
  it('calculates all rates with base state', () => {
    const rates = calculateAllCastleToolRates(baseState);
    expect(rates).toEqual({
      NewPixBot: 3.5,
      Trebuchet: 6.25,
      Scaffold: 15.63,
      Wave: 39.06,
      River: 97.66,
    });
  });

  it('calculates all rates with mixed boosts', () => {
    const rates = calculateAllCastleToolRates({
      ...baseState,
      busyBot: true,
      robotEfficiency: true,
      robotEfficiencyPower: 2,
      springFling: true,
      precisePlacement: true,
      swell: true,
      smallbot: true,
    });

    expect(rates.NewPixBot).toBeCloseTo(3.5 * 2 * 2, 5);
    expect(rates.Trebuchet).toBeCloseTo(6.25 * 1.5, 5);
    expect(rates.Scaffold).toBeCloseTo(15.63 * 1.5, 5);
    expect(rates.Wave).toBeCloseTo(39.06 * 2, 5);
    expect(rates.River).toBeCloseTo(97.66 * 4, 5);
  });

  it('handles maximum boost stacking', () => {
    const rates = calculateAllCastleToolRates({
      ...baseState,
      busyBot: true,
      robotEfficiency: true,
      robotEfficiencyPower: 100,
      recursivebot: true,
      halOKitty: true,
      halBoost: 50,
      springFling: true,
      trebuchetPong: true,
      trebuchetPongPower: 10,
      flingbot: true,
      variedAmmo: true,
      variedAmmoPower: 20,
      precisePlacement: true,
      levelUp: true,
      propbot: true,
      swell: true,
      surfbot: true,
      sbtf: true,
      sbtfPower: 10,
      smallbot: true,
    });

    // Verify each tool rate is correctly calculated with all boosts
    expect(rates.NewPixBot).toBeCloseTo(3.5 * 2 * 100 * 4 * Math.pow(1.1, 50), 3);
    expect(rates.Trebuchet).toBeCloseTo(6.25 * 1.5 * Math.pow(1.2, 10) * 4 * 3, 3);
    expect(rates.Scaffold).toBeCloseTo(15.63 * 1.5 * 2 * 4, 3);
    expect(rates.Wave).toBeCloseTo(39.06 * 2 * 4 * 10, 3);
    expect(rates.River).toBeCloseTo(97.66 * 4, 3);
  });
});
