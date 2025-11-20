/**
 * DeliveryCalculator service: Calculate delivery cost and  discounts
 */
class DeliveryCalculator {
  	constructor(offerRegistry) {
		this.offerRegistry = offerRegistry;
	}

  	/**
   	* Calculate delivery cost
   	* Formula: Base Cost + (Weight * 10) + (Distance * 5)
   	*
   	* @param {number} baseCost - Base delivery cost
   	* @param {number} weight - Package weight in kg
   	* @param {number} distance - Distance in km
   	* @returns {number} Total delivery cost
   	* @throws {Error} If inputs are negative
   	*/
  	calculateDeliveryCost(baseCost, weight, distance) {
		if (baseCost < 0 || weight < 0 || distance < 0) {
	  	throw new Error('Cost, weight, and distance must be non-negative');
		}
		// total cost = baseCost + (weight * 10) + (distance * 5)
		return Math.round(baseCost + weight * 10 + distance * 5);
  	}

  	/**
   	* Calculate discount based on offer criteria
   	*
   	* @param {string} offerCode - Offer code
   	* @param {number} weight - Package weight in kg
   	* @param {number} distance - Distance in km
   	* @param {number} deliveryCost - Calculated delivery cost
   	* @returns {number} Discount amount, `0` - no discount or invalid offer
   	*/
  	calculateDiscount(offerCode, weight, distance, deliveryCost) {
		if (!this.offerRegistry.isValidOffer(offerCode)) {
	  	return 0;
	}

	const offer = this.offerRegistry.getOffer(offerCode);
	const weightValid = weight >= offer.weightRange.min && weight <= offer.weightRange.max;
	const distanceValid = distance >= offer.distanceRange.min && distance <= offer.distanceRange.max;

	if (weightValid && distanceValid) {
		return Math.round((offer.percent / 100) * deliveryCost);
	}
	return 0;
  }
}

module.exports = DeliveryCalculator;
