/**
 * Tests for ShipmentOptimizer
 */
const ShipmentOptimizer = require('../src/services/ShipmentOptimizer');

describe('ShipmentOptimizer', () => {
  test('should select package within capacity', () => {
    const packages = [{ id: 'P1', weight: 50, distance: 100 }];
    const result = ShipmentOptimizer.findBestShipment(packages, 200);
    expect(result).toEqual(packages);
  });

  test('should respect capacity constraints', () => {
    const packages = [
      { id: 'P1', weight: 100, distance: 100 },
      { id: 'P2', weight: 100, distance: 150 }
    ];
    const result = ShipmentOptimizer.findBestShipment(packages, 100);
    expect(result).toHaveLength(1);
  });

  test('should handle empty package list', () => {
    const packages = [];
    const result = ShipmentOptimizer.findBestShipment(packages, 200);
    expect(result).toEqual([]);
  });
});

// Export for test runner
module.exports = {};
