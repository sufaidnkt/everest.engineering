/**
 * Tests for DeliverySchedulingService
 */
const DeliverySchedulingService = require('../src/services/DeliverySchedulingService');
const DeliveryCalculator = require('../src/services/DeliveryCalculator');
const OfferRegistry = require('../src/models/OfferRegistry');

describe('DeliverySchedulingService', () => {
  let service;
  let calculator;
  let offerRegistry;

  beforeEach(() => {
    offerRegistry = new OfferRegistry();
    calculator = new DeliveryCalculator(offerRegistry);
    service = new DeliverySchedulingService(offerRegistry, calculator);
  });

  test('should process single package', () => {
    const pkg = { id: 'PKG1', weight: 100, distance: 100, offerCode: 'OFR001' };
    const result = service.processPackage(pkg, 100);

    expect(result).toHaveProperty('id', 'PKG1');
    expect(result).toHaveProperty('discount');
    expect(result).toHaveProperty('totalCost');
  });

  test('should schedule single package delivery', () => {
    const packages = [
      { id: 'PKG1', weight: 50, distance: 100, offerCode: 'OFR001' }
    ];

    const results = service.scheduleDeliveries(packages, 100, 1, 100, 200);

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('eta');
    expect(results[0]).toHaveProperty('id', 'PKG1');
  });

  test('should schedule multiple packages', () => {
    const packages = [
      { id: 'PKG1', weight: 50, distance: 100, offerCode: 'OFR001' },
      { id: 'PKG2', weight: 60, distance: 50, offerCode: 'OFR002' }
    ];

    const results = service.scheduleDeliveries(packages, 100, 2, 100, 300);

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('PKG1');
    expect(results[1].id).toBe('PKG2');
  });

  test('should handle empty package list', () => {
    const results = service.scheduleDeliveries([], 100, 1, 100, 200);
    expect(results).toEqual([]);
  });
});

// Export for test runner
module.exports = {};
