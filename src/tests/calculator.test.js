const { compute } = require('../calculator');

describe('Calculator compute()', () => {
  test('addition (add) returns correct sum', () => {
    expect(compute('add', 2, 3)).toBe(5);
    expect(compute('+', 7, 8)).toBe(15);
  });

  test('subtraction (sub) returns correct difference', () => {
    expect(compute('sub', 10, 4)).toBe(6);
    expect(compute('-', 5, 9)).toBe(-4);
  });

  test('multiplication (mul) returns correct product', () => {
    expect(compute('mul', 45, 2)).toBe(90);
    expect(compute('*', 6, 7)).toBe(42);
  });

  test('division (div) returns correct quotient', () => {
    expect(compute('div', 20, 5)).toBe(4);
    expect(compute('/', 9, 3)).toBe(3);
  });

  test('division by zero throws error', () => {
    expect(() => compute('div', 5, 0)).toThrow(/Division by zero/);
    expect(() => compute('/', 1, 0)).toThrow(/Division by zero/);
  });

  test('unsupported operation throws', () => {
    expect(() => compute('pow', 2, 3)).toThrow(/Unsupported operation/);
  });

  test('works with float numbers', () => {
    expect(compute('add', 0.1, 0.2)).toBeCloseTo(0.30000000000000004);
    expect(compute('div', 1, 4)).toBeCloseTo(0.25);
  });
});
