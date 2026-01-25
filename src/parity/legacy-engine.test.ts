/**
 * Tests for the LegacyEngine wrapper
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LegacyEngine } from './legacy-engine.js';

describe('LegacyEngine', () => {
  let engine: LegacyEngine;

  beforeAll(async () => {
    engine = new LegacyEngine();
    await engine.initialize();
  }, 60000); // Allow 60s for browser launch

  afterAll(async () => {
    await engine.dispose();
  });

  it('should initialize and load the game', async () => {
    const state = await engine.getStateSnapshot();
    expect(state).toBeDefined();
    expect(state.version).toBeGreaterThan(0);
    expect(state.newpixNumber).toBeGreaterThanOrEqual(1);
  });

  it('should have sand and castles boosts', async () => {
    const sandState = await engine.getBoostState('Sand');
    const castlesState = await engine.getBoostState('Castles');

    expect(sandState).toBeDefined();
    expect(castlesState).toBeDefined();
  });

  it('should accumulate sand on beach clicks', async () => {
    const beforeState = await engine.getStateSnapshot();
    const beforeSand = beforeState.sand;

    await engine.clickBeach(10);

    const afterState = await engine.getStateSnapshot();
    expect(afterState.sand).toBeGreaterThan(beforeSand);
    expect(afterState.beachClicks).toBeGreaterThan(beforeState.beachClicks);
  });

  it('should execute tick without errors', async () => {
    await expect(engine.tick(5)).resolves.not.toThrow();
  });

  it('should export and import state', async () => {
    // Get current state
    const beforeState = await engine.getStateSnapshot();

    // Export
    const exported = await engine.exportState();
    expect(exported).toBeTruthy();
    expect(typeof exported).toBe('string');

    // Make some changes
    await engine.clickBeach(100);

    // Re-import the old state
    await engine.loadState(exported);

    // Verify state was restored
    const afterState = await engine.getStateSnapshot();
    // Note: Some values may differ slightly due to timing, but core values should match
    expect(afterState.beachClicks).toBe(beforeState.beachClicks);
  });

  it('should be able to get sand rate', async () => {
    const rate = await engine.getSandRate();
    expect(typeof rate).toBe('number');
  });
});

describe('ParityRunner with LegacyEngine', () => {
  let engine: LegacyEngine;

  beforeAll(async () => {
    engine = new LegacyEngine();
    await engine.initialize();
  }, 60000);

  afterAll(async () => {
    await engine.dispose();
  });

  it('should execute test actions', async () => {
    await engine.executeAction({ type: 'click', target: 'beach', count: 5 });
    await engine.executeAction({ type: 'tick', count: 2 });

    const state = await engine.getStateSnapshot();
    expect(state.beachClicks).toBeGreaterThan(0);
  });
});
