


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
 * ShipmentOptimizer: Finds best shipment combinations
 * Strategy: Maximize packages -> Maximize weight -> Minimize max distance
 */
class ShipmentOptimizer { 
		/**
		 * Find the best shipment from remaining packages
		 * Constraints: Total weight <= capacity
		 * Strategy: Maximize count, then weight, then minimize distance
		 * 
		 * @param {Array} remaining - Remaining packages
		 * @param {number} capacity - Vehicle capacity
		 * @returns {Array} Selected packages for this shipment
		 */
 	static findBestShipment(remaining, capacity) {
		const n = remaining.length;
		let best = { mask: 0, count: 0, totalWeight: 0, maxDist: Infinity };

		// Enumerate all possible subsets (bitmask approach)

		for (let mask = 1; mask < (1 << n); mask++) {
			let weight = 0;
			let count = 0;
			let distance = 0;

      		// Calculate metrics for this subset
			for (let i = 0; i < n; i++) {
				if (mask & (1 << i)) {
				weight += remaining[i].weight;
				if (weight > capacity) {
					count = -1;
					break;
				}
				count++;
				distance = Math.max(distance, remaining[i].distance);
				}
			}

			if (count <= 0) continue;

			// Compare with best: more packages > heavier > shorter distance
			if (
				count > best.count ||
				(count === best.count && weight > best.totalWeight) ||
				(count === best.count && weight === best.totalWeight && distance < best.maxDist)
			) {
				best = { mask, count, totalWeight: weight, maxDist: distance };
			}
    	}

		// Handle edge cases
		if (best.count === 0) {
		// Try to fit at least one package
		for (let i = 0; i < n; i++) {
			if (remaining[i].weight <= capacity) {
			return [remaining[i]];
			}
		}
		return [];
		}

		// Build result
		const selected = [];
		for (let i = 0; i < n; i++) {
		if (best.mask & (1 << i)) {
			selected.push(remaining[i]);
		}
		}
    return selected;
  }

}

/**
 * DeliveryTimeCalculator: Computes delivery times
 */
class DeliveryTimeCalculator {
	/**
	 * Calculate delivery time for a package
	 * Formula: current_time + (distance / speed)
	 * 
	 * @param {number} currentTime - When vehicle is available
	 * @param {number} distance - Package delivery distance
	 * @param {number} maxSpeed - Vehicle speed in km/hr
	 * @returns {number} ETA rounded to 2 decimals
	 */
	static calculateETA(currentTime, distance, maxSpeed) {
		const eta = currentTime + (distance / maxSpeed);
		return Math.round(eta * 100) / 100;
	}

	/**
	 * Calculate vehicle return time
	 * Formula: current_time + 2 * (max_distance_in_shipment / speed)
	 * 
	 * @param {number} currentTime - When vehicle is available
	 * @param {number} maxDistance - Maximum distance in shipment
	 * @param {number} maxSpeed - Vehicle speed
	 * @returns {number} Time when vehicle returns
	 */
	static calculateReturnTime(currentTime, maxDistance, maxSpeed) {
		return currentTime + (2 * maxDistance / maxSpeed);
	}
}

class VehicleAllocator {
	constructor(numVehicles, maxSpeed, capacity) {
		this.numVehicles = numVehicles;
		this.maxSpeed = maxSpeed;
		this.capacity = capacity;
		this.availableTimes = Array(numVehicles).fill(0);
  	}
	findNextAvailableVehicle() {
		let vehicleIndex = 0;
		let earliestTime = this.availableTimes[0];

		for (let i = 1; i < this.numVehicles; i++) {
			if (this.availableTimes[i] < earliestTime) { // find vehicle with earliest available time
				earliestTime = this.availableTimes[i]; // update earliest time
				vehicleIndex = i; // update vehicle index for find next available
			}
		}

    	return { index: vehicleIndex, currentTime: earliestTime };
  	}
	/**
	 * Dispatch a shipment to a vehicle
	 * @param {Array} shipment - Packages in this shipment
	 */
	dispatchShipment(shipment) {
		const { index, currentTime } = this.findNextAvailableVehicle();
		const maxDistance = Math.max(...shipment.map(pkg => pkg.distance));
		const returnTime = DeliveryTimeCalculator.calculateReturnTime(currentTime, maxDistance, this.maxSpeed);

		// Update vehicle availability
		this.availableTimes[index] = returnTime;

		// Calculate ETA for each package and preserve all properties
		return shipment.map(pkg => {
			const eta = DeliveryTimeCalculator.calculateETA(currentTime, pkg.distance, this.maxSpeed);
			return {
				id: pkg.id,
				weight: pkg.weight,
				distance: pkg.distance,
				offerCode: pkg.offerCode,
				deliveryCost: pkg.deliveryCost,
				discount: pkg.discount,
				totalCost: pkg.totalCost,
				eta: eta,
			};
		});
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
   * Process a single package: calculate cost and discount
   */
  	processPackage(packageData, baseCost) {
		const { id, weight, distance, offerCode } = packageData;

		const deliveryCost = this.calculator.calculateDeliveryCost(baseCost, weight, distance);
		const discountAmount = this.calculator.calculateDiscount(offerCode, weight, distance, deliveryCost);

		return {
			...packageData,
			deliveryCost,
			discount: Math.round(discountAmount),
			totalCost: Math.round(deliveryCost - Math.round(discountAmount)),
		};
  	}
	scheduleDeliveries(packages, baseCharge, numVehicles, maxSpeed, capacity) {
		// calculate delivery for each package
		const processedPackages = packages.map(pkg => this.processPackage(pkg, baseCharge));

		let remaining = processedPackages.slice();
    	const scheduled = [];

		// schedule deliveries and allocate vehicles

    	const dispatcher = new VehicleAllocator(numVehicles, maxSpeed, capacity);

		const shipment = ShipmentOptimizer.findBestShipment(remaining, capacity);

		while (remaining.length > 0) {
      		const shipment = ShipmentOptimizer.findBestShipment(remaining, capacity);

			if (shipment.length === 0) {
				throw new Error('Unable to schedule remaining packages');
			}

			const dispatchedShipment = dispatcher.dispatchShipment(shipment);
			scheduled.push(...dispatchedShipment);

			// Remove scheduled packages from remaining
			const scheduledIds = new Set(shipment.map(pkg => pkg.id));
			remaining = remaining.filter(pkg => !scheduledIds.has(pkg.id));
    	}
		// Original order
		return scheduled.sort((a, b) => {
			const indexA = processedPackages.findIndex(p => p.id === a.id);
			const indexB = processedPackages.findIndex(p => p.id === b.id);
			return indexA - indexB;
    	});

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
		const id = parts[0];
		const weight = parseFloat(parts[1]);
		const distance = parseFloat(parts[2]);
		const offerCode = parts[3];
		if (isNaN(weight) || isNaN(distance)) {
			throw new Error('Weight and distance must be numbers');
		}
		if (weight < 0 || distance < 0) {
			throw new Error('Weight and distance must be non-negative');
		}
		
		return { id, weight, distance, offerCode };
	}

	static parseVehicleLine(line) {
    	const tokens = line.trim().split(/\s+/);

    	if (tokens.length !== 3) {
      		throw new Error(`Expected 3 fields in vehicle line, got ${tokens.length}`);
    	}

    	const [numVehicles, maxSpeed, capacity] = tokens.map(Number);

		if (isNaN(numVehicles) || isNaN(maxSpeed) || isNaN(capacity)) {
		throw new Error('Vehicle parameters must be numbers');
		}

		if (!Number.isInteger(numVehicles) || numVehicles <= 0) {
		throw new Error('Number of vehicles must be a positive integer');
		}

		if (maxSpeed <= 0 || capacity <= 0) {
		throw new Error('Max speed and capacity must be positive');
		}

    	return { numVehicles, maxSpeed, capacity };
  	}
}
class OutputFormatter {
  	static printHeader() {
		console.log('== Delivery Time Estimation System ==');
		console.log('═'.repeat(75));
		console.log('PKG_ID        DISCOUNT      TOTAL_COST      DELIVERY_TIME (hrs)');
		console.log('─'.repeat(75));
  	}
	static printPackageResult(packageId, discount, totalCost, eta) {
		const discountStr = discount.toString();
		console.log(`${packageId.padEnd(14)} ${discountStr.padEnd(14)} ${String(totalCost).padEnd(14)} ${eta.toFixed(2)}`);
	}
	static printFooter() {
		console.log('═'.repeat(75));
	}
	static printError(message) {
		console.error(` Error: ${message}`);
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
		const readline = require('readline');
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		let inputLines = [];
		console.log('Delivery Time Estimation Service');
		console.log('Input format:');
		console.log('  Line 1: base_cost number_of_packages');
		console.log('  Lines 2....n: pkg_id weight distance offer_code');
		console.log('  Line n+1: num_vehicles max_speed capacity');
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

			if (inputLines.length < totalPackages + 2) { // +2 for first line and vehicle line
				throw new Error(`Expected at least ${totalPackages + 2} lines, got ${inputLines.length}`);
			}
			
			// parse package lines
			const packages = [];
			for (let i = 1; i <= totalPackages; i++) {
				const pkgData = InputParser.parsePackageLine(inputLines[i]);
				packages.push(pkgData);
			}

			// parse vehicle configuration
			const { numVehicles, maxSpeed, capacity } = InputParser.parseVehicleLine(inputLines[totalPackages + 1]);

			// schedule deliveries
			const results = this.deliveryService.scheduleDeliveries(packages, baseCharge, numVehicles, maxSpeed, capacity);
			
			// Display results
			OutputFormatter.printHeader();
			results.forEach((result) => {
				OutputFormatter.printPackageResult(result.id, result.discount, result.totalCost, result.eta);
			});
			OutputFormatter.printFooter();
    

		} catch (error) {
			console.error('Error processing input:', error.message);
		}

	}

}

const app = new DeliveryServiceApp();
app.main();