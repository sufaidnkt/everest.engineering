/**
 * Tests for InputParser
 */
const InputParser = require('../src/utils/InputParser');

describe('InputParser', () => {
  test('should parse valid first line', () => {
    const result = InputParser.parseFirstLine('100 3');
    expect(result).toEqual({ baseCharge: 100, totalPackages: 3 });
  });

  test('should throw error for invalid first line', () => {
    expect(() => InputParser.parseFirstLine('100')).toThrow();
  });

  test('should parse valid package line', () => {
    const result = InputParser.parsePackageLine('PKG1 10 100 OFR001');
    expect(result).toEqual({
      id: 'PKG1',
      weight: 10,
      distance: 100,
      offerCode: 'OFR001'
    });
  });

  test('should throw error for invalid package line', () => {
    expect(() => InputParser.parsePackageLine('PKG1 10 100')).toThrow();
  });

  test('should parse valid vehicle line', () => {
    const result = InputParser.parseVehicleLine('2 70 200');
    expect(result).toEqual({
      numVehicles: 2,
      maxSpeed: 70,
      capacity: 200
    });
  });

  test('should throw error for invalid vehicle line', () => {
    expect(() => InputParser.parseVehicleLine('2 70')).toThrow();
  });
});

// Export for test runner
module.exports = {};
