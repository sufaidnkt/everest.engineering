/**
 * OfferRegistry: Centralized offer management
 * Responsibility: Store and retrieve offer definitions
 */
class OfferRegistry {
  constructor() {
    this.offers = {
      OFR001: {
        percent: 10,
        distanceRange: { min: 0, max: 199 },
        weightRange: { min: 70, max: 200 }
      },
      OFR002: {
        percent: 7,
        distanceRange: { min: 50, max: 150 },
        weightRange: { min: 100, max: 250 }
      },
      OFR003: {
        percent: 5,
        distanceRange: { min: 50, max: 250 },
        weightRange: { min: 10, max: 150 }
      }
    };
  }

  /**
   * Get offer by code
   * @param {string} code - Offer code
   * @returns {Object|null} Offer object or null if not found
   */
  getOffer(code) {
    return this.offers[code] || null;
  }

  /**
   * Check if offer code is valid
   * @param {string} code - Offer code
   * @returns {boolean}
   */
  isValidOffer(code) {
    return code !== null && this.offers[code] !== undefined;
  }

  /**
   * Add or update an offer
   * @param {string} code - Offer code
   * @param {Object} offer - Offer definition
   */
  addOffer(code, offer) {
    this.offers[code] = offer;
  }
}

module.exports = OfferRegistry;
