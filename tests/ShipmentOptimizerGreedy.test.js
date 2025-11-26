/**
 * Tests for ShipmentOptimizer Greedy Algorithm
 */
const ShipmentOptimizer = require('../src/services/ShipmentOptimizer');

describe('ShipmentOptimizer - Greedy Algorithm', () => {
  test('should select packages greedily within capacity', () => {
    const packages = [
      { id: 'P1', weight: 50, distance: 100 },
      { id: 'P2', weight: 60, distance: 150 },
      { id: 'P3', weight: 40, distance: 200 }
    ];
    const result = ShipmentOptimizer.findBestShipmentGreedy(packages, 150);
    
    expect(result.length).toBeGreaterThan(0);
    const totalWeight = result.reduce((sum, pkg) => sum + pkg.weight, 0);
    expect(totalWeight).toBeLessThanOrEqual(150);
  });

  test('should handle empty package list', () => {
    const result = ShipmentOptimizer.findBestShipmentGreedy([], 200);
    expect(result).toEqual([]);
  });

  test('should respect capacity constraints', () => {
    const packages = [
      { id: 'P1', weight: 100, distance: 100 },
      { id: 'P2', weight: 100, distance: 150 }
    ];
    const result = ShipmentOptimizer.findBestShipmentGreedy(packages, 100);
    
    expect(result).toHaveLength(1);
  });

  test('should maximize package count', () => {
    const packages = [
      { id: 'P1', weight: 30, distance: 100 },
      { id: 'P2', weight: 70, distance: 150 },
      { id: 'P3', weight: 50, distance: 200 }
    ];
    const result = ShipmentOptimizer.findBestShipmentGreedy(packages, 120);
    
    // Should prioritize count: P1(30) + P3(50) = 80kg (2 packages)
    // Over P2(70) alone = 70kg (1 package)
    expect(result.length).toBe(2);
  });

  test('should select all packages if they fit', () => {
    const packages = [
      { id: 'P1', weight: 30, distance: 100 },
      { id: 'P2', weight: 40, distance: 150 },
      { id: 'P3', weight: 20, distance: 120 }
    ];
    const result = ShipmentOptimizer.findBestShipmentGreedy(packages, 200);
    
    expect(result).toHaveLength(3);
  });
});

module.exports = {};
