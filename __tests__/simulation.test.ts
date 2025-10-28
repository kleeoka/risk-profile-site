/*
  simulation.test.ts
  - Tests the pure simulate function exported from /lib/simulate.ts
  - Comment: Confirms function projects positive growth for reasonable parameters.
*/
import { simulate } from '../lib/simulate';

describe('simulate helper', () => {
  test('projects growth over one year with monthly contributions', () => {
    const res = simulate(100, 100, 1, 0.12); // 12% annual
    expect(res.balance).toBeGreaterThan(100); // balance should be > initial
    expect(res.history.length).toBe(1); // 1 year -> history has one entry
  });
});