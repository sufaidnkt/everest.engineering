/**
 * Tests for DeliveryCalculator
 */
const DeliveryCalculator = require('../src/services/DeliveryCalculator');
const OfferRegistry = require('../src/models/OfferRegistry');

describe('DeliveryCalculator', () => {
  let calculator;
  let offerRegistry;

  beforeEach(() => {
    offerRegistry = new OfferRegistry();
    calculator = new DeliveryCalculator(offerRegistry);
  });

  test('should calculate delivery cost correctly', () => {
    const cost = calculator.calculateDeliveryCost(100, 5, 5);
    expect(cost).toBe(175); // 100 + (5*10) + (5*5)
  });

  test('should calculate discount for valid offer code', () => {
    const discount = calculator.calculateDiscount('OFR001', 100, 100, 700);
    expect(discount).toBe(70); // 10% of 700
  });

  test('should return 0 discount for invalid offer code', () => {
    const discount = calculator.calculateDiscount('INVALID', 100, 100, 700);
    expect(discount).toBe(0);
  });
});

// Export for test runner
module.exports = {};
