/**
 * Tests for CostEstimationService
 */
const CostEstimationService = require('../src/services/CostEstimationService');
const DeliveryCalculator = require('../src/services/DeliveryCalculator');
const OfferRegistry = require('../src/models/OfferRegistry');

describe('CostEstimationService', () => {
  let service;
  let calculator;
  let offerRegistry;

  beforeEach(() => {
    offerRegistry = new OfferRegistry();
    calculator = new DeliveryCalculator(offerRegistry);
    service = new CostEstimationService(offerRegistry, calculator);
  });

  test('should process single package', () => {
    const pkg = { id: 'PKG1', weight: 100, distance: 100, offerCode: 'OFR001' };
    const result = service.processPackage(pkg, 100);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('discount');
    expect(result).toHaveProperty('totalCost');
  });

  test('should process multiple packages', () => {
    const packages = [
      { id: 'PKG1', weight: 100, distance: 100, offerCode: 'OFR001' },
      { id: 'PKG2', weight: 150, distance: 100, offerCode: 'OFR002' }
    ];

    const results = service.processAllPackages(packages, 100);

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('PKG1');
    expect(results[1].id).toBe('PKG2');
  });
});

// Export for test runner
module.exports = {};
