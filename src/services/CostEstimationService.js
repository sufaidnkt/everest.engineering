/**
 * CostEstimationService : Delivery cost estimation workflow
 */
class CostEstimationService {
  	constructor(offerRegistry, calculator) {
    	this.offerRegistry = offerRegistry;
   		this.calculator = calculator;
  	}

  	/**
	* Process a single package
	* @param {Object} packageData - Package data
	* @param {number} baseCost - Base delivery cost
	* @returns {Object} Result with discount and total cost
	*/
  	processPackage(packageData, baseCost) {
    	const { id, weight, distance, offerCode } = packageData;

		const deliveryCost = this.calculator.calculateDeliveryCost(baseCost,weight,distance);
		const discountAmount = this.calculator.calculateDiscount(offerCode,weight,distance,deliveryCost);

		return {
			id,
			discount: discountAmount,
			totalCost: deliveryCost - discountAmount
		};
  	}

  	/**
   	* Process all packages
   	* @param {Array} packages - Array of package data
   	* @param {number} baseCost - Base delivery cost
   	* @returns {Array} Results for all packages
   	*/
  	processAllPackages(packages, baseCost) {
    	return packages.map(pkg => this.processPackage(pkg, baseCost));
  	}
}

module.exports = CostEstimationService;
