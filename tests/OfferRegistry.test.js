/**
 * Tests for OfferRegistry Singleton Pattern
 */
const OfferRegistry = require('../src/models/OfferRegistry');

describe('OfferRegistry - Singleton Pattern', () => {
  // Clear singleton for each test
  beforeEach(() => {
    delete OfferRegistry.instance;
  });

  test('should return same instance across multiple instantiations', () => {
    const registry1 = new OfferRegistry();
    const registry2 = new OfferRegistry();

    expect(registry1).toBe(registry2);
  });

  test('should share offer state across instances', () => {
    const registry1 = new OfferRegistry();
    const registry2 = new OfferRegistry();

    // Verify both see initial offers
    expect(registry1.isValidOffer('OFR001')).toBe(true);
    expect(registry2.isValidOffer('OFR001')).toBe(true);

    // Remove offer via registry1
    registry1.removeOffer('OFR001');

    // registry2 should also see it's removed
    expect(registry2.isValidOffer('OFR001')).toBe(false);
  });

  test('should allow adding offers visible to all instances', () => {
    const registry1 = new OfferRegistry();
    const registry2 = new OfferRegistry();

    const newOffer = {
      percent: 15,
      distanceRange: { min: 0, max: 100 },
      weightRange: { min: 50, max: 200 }
    };

    registry1.addOffer('OFR999', newOffer);

    expect(registry2.isValidOffer('OFR999')).toBe(true);
    expect(registry2.getOffer('OFR999')).toEqual(newOffer);
  });

  test('should remove offer successfully', () => {
    const registry = new OfferRegistry();

    expect(registry.isValidOffer('OFR002')).toBe(true);
    const removed = registry.removeOffer('OFR002');

    expect(removed).toBe(true);
    expect(registry.isValidOffer('OFR002')).toBe(false);
  });

  test('should return false when removing non-existent offer', () => {
    const registry = new OfferRegistry();

    const removed = registry.removeOffer('OFR999');

    expect(removed).toBe(false);
  });

  test('should get all offers', () => {
    const registry = new OfferRegistry();

    const allOffers = registry.getAllOffers();

    expect(allOffers).toHaveProperty('OFR001');
    expect(allOffers).toHaveProperty('OFR002');
    expect(allOffers).toHaveProperty('OFR003');
  });
});

module.exports = {};
