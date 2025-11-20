/**
 * Tests for DeliveryTimeCalculator
 */
const DeliveryTimeCalculator = require('../src/services/DeliveryTimeCalculator');

describe('DeliveryTimeCalculator', () => {
  test('should calculate ETA correctly', () => {
    const eta = DeliveryTimeCalculator.calculateETA(0, 100, 100);
    expect(eta).toBe(1);
  });

  test('should calculate return time correctly', () => {
    const returnTime = DeliveryTimeCalculator.calculateReturnTime(0, 100, 100);
    expect(returnTime).toBe(2);
  });
});

module.exports = {};
