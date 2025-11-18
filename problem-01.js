'use strict';
const readline = require('readline');
/**
 * OfferRegistry: Centralized offer management
 */
class OfferRegistry {
	constructor() {
		this.offers = {
			OFR001: { percent: 10, distanceRange: { min: 0, max: 199 }, weightRange: { min: 70, max: 200 } },
			OFR002: { percent: 7, distanceRange: { min: 50, max: 150 }, weightRange: { min: 100, max: 250 } },
			OFR003: { percent: 5, distanceRange: { min: 50, max: 250 }, weightRange: { min: 10, max: 150 } },
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
}
/**
 * DeliveryCalculator: Calculates costs and discounts
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
	*/
	calculateDeliveryCost(baseCost, weight, distance) {
		if (baseCost < 0 || weight < 0 || distance < 0) { // validate inputs
			throw new Error('Cost, weight, and distance must be non-negative');
		}
		// calculate cost based on formula 
		// cost = baseCost + (weight * 10) + (distance * 5)
		return Math.round (baseCost + (weight * 10) + (distance * 5));
	}
	/**
	 * Calculate discount based on offer criteria
	 * 
	 * @param {string} offerCode - Offer code
	 * @param {number} weight - Package weight in kg
	 * @param {number} distance - Distance in km
	 * @param {number} deliveryCost - Pre-discount delivery cost
	 * @returns {number} Discount amount (0 if not applicable)
	 */
	calculateDiscount(offerCode, weight, distance, deliveryCost) {
		if (!this.offerRegistry.isValidOffer(offerCode)) {
			return 0;
		}

		const offer = this.offerRegistry.getOffer(offerCode);
		if (
			weight >= offer.weightRange.min && // check weight is greater than min
			weight <= offer.weightRange.max && // check weight is less than max
			distance >= offer.distanceRange.min && // check distance is greater than min
			distance <= offer.distanceRange.max // check distance is less than max
		) {
			return Math.round((offer.percent / 100) * deliveryCost); // calculate discount percentage
		}
		return 0;
	}

}

/**
 * DeliveryService: Orchestrates the entire delivery scheduling workflow
 */
class DeliveryService {
	constructor(offerRegistry, calculator) {
		this.offerRegistry = offerRegistry;
		this.calculator = calculator;
	}

	 /**
	* Process a single package
	* 
	* @param {Object} packageData - Package data
	* @param {number} baseCost - Base delivery cost
	* @returns {Object} Result with discount and total cost
	*/
  	processPackage(packageData, baseCost) {
		const { pkgId, weight, distance, offerCode } = packageData;
		const deliveryCost = this.calculator.calculateDeliveryCost(baseCost, weight, distance);
		const discountAmount = this.calculator.calculateDiscount(offerCode,weight,distance,deliveryCost);

		return {
      		id: pkgId,
			discount: discountAmount,
			totalCost: deliveryCost - discountAmount // total cost after discount
    	};


	}
	/**
	* Process all packages
	* 
	* @param {Array} packages - Array of package data
	* @param {number} baseCost - Base delivery cost
	* @returns {Array} Results for all packages
	*/
  	processAllPackages(packages, baseCost) {
		return packages.map(pkg => this.processPackage(pkg, baseCost));
  	}	
}

class InputParser {
	/**
   * Parse configuration line
   * @param {string} line - Configuration line
   * @returns {Object} Parsed config
   * @throws {Error} - If parsing fails
   */
	static parseFirstLine(line) {
		const parts = line.trim().split(' ');
		if (parts.length !== 2) {
			throw new Error('Invalid Input: Expected 2 values in the first line');
		}
		const baseCharge = parseFloat(parts[0]);
		const totalPackages = parseInt(parts[1], 10);
		if (isNaN(baseCharge) || isNaN(totalPackages)) {
			throw new Error('Base charge and total packages must be numbers');
		}
		return { baseCharge, totalPackages };
	}
	static parsePackageLine(line) {
		const parts = line.trim().split(' ');
		if (parts.length !== 4) {
			throw new Error('Invalid Input: Expected 4 values in package line');
		}
		const pkgId = parts[0];
		const weight = parseFloat(parts[1]);
		const distance = parseFloat(parts[2]);
		const offerCode = parts[3];
		if (isNaN(weight) || isNaN(distance)) {
			throw new Error('Weight and distance must be numbers');
		}
		if (weight < 0 || distance < 0) {
			throw new Error('Weight and distance must be non-negative');
		}
		
		return { pkgId, weight, distance, offerCode };
	}
}

/**
 * OutputFormatter: Formats and displays results
 * Responsibility: Output formatting and presentation
 */
class OutputFormatter {
	static printHeader() {
    	console.log('== Delivery Cost Estimation System == ');
    	console.log('═'.repeat(40)); 
    	console.log('PKG_ID        DISCOUNT      TOTAL_COST');
    	console.log('─'.repeat(40));
  	}

  	static printPackageResult(packageId, discount, totalCost) {
		const discountStr = discount > 0 ? `${discount}` : '0';
		console.log(`${packageId.padEnd(14)} ${discountStr.padEnd(13)} ${totalCost}`);
  }

  	static printFooter() {
    	console.log('═'.repeat(40));
  	}
}




/**
 * Main class to manage delivery services
 */
class  DeliveryServiceApp {
	constructor(){
		this.offerRegistry = new OfferRegistry();
		this.calculator = new DeliveryCalculator(this.offerRegistry);
		this.deliveryService = new DeliveryService(this.offerRegistry, this.calculator);

	}

	main() {

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		let inputLines = [];
		console.log('== Delivery Time Estimation Service == ');
		console.log('Input format:');
		console.log('  Line 1: base_cost number_of_packages');
		console.log('  Lines 2....n: pkg_id weight distance offer_code');
		console.log('(Press Ctrl+D when done)\n');
		
		rl.on('line', (line) => {
			if (line && line.trim().length > 0) { // Ignore empty lines
				inputLines.push(line.trim());
			}
		});

		rl.on('close', () => { // End of input
			this.processInput(inputLines);
		});

	}

	 /**
	* Process input lines and generate results
	* @param {Array<string>} inputLines - All input lines
	* @throws {Error} - If insufficient input is provided
	*/
	processInput(inputLines) {
		console.log('Processing input...');

		try {
			if (inputLines.length < 3) { // minimum 3 lines required 
				throw new Error('Insufficient input provided');
			}
			// first line base delivery cost and number of packages
			const { baseCharge, totalPackages } = InputParser.parseFirstLine(inputLines[0]);

			if (inputLines.length < totalPackages + 1) { // +1 for first line 
				throw new Error(`Expected at least ${totalPackages + 1} lines, got ${inputLines.length}`);
			}
			
			// parse package lines
			const packages = [];
			for (let i = 1; i <= totalPackages; i++) {
				const pkgData = InputParser.parsePackageLine(inputLines[i]);
				packages.push(pkgData);
			}
			
			// process packages 
			const results = this.deliveryService.processAllPackages(packages, baseCharge);

			// Display results with formatting 
			OutputFormatter.printHeader();
      			results.forEach((result) => {
        		OutputFormatter.printPackageResult(result.id, result.discount, result.totalCost);
      		});
      		OutputFormatter.printFooter();

		} catch (error) {
			console.error('Error processing input:', error.message);
		}

	}

}

const app = new DeliveryServiceApp();
app.main();