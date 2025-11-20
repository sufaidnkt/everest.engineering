const ShipmentOptimizer = require('./ShipmentOptimizer');
const VehicleAllocator = require('./VehicleAllocator');

/**
 * DeliverySchedulingService: Vehicle scheduling and delivery time calculation workflow
 */
class DeliverySchedulingService {
	constructor(offerRegistry, calculator) {
		this.offerRegistry = offerRegistry;
		this.calculator = calculator;
	}

	/**
	 * Process a single package: calculate cost and discount
	 * @param {Object} packageData - All package details including id, weight, distance, offerCode
	 * @param {number} baseCost - Base delivery cost 
	 * @returns {Object} Package with calculated cost and discount
	 */
	processPackage(packageData, baseCost) {
		const { id, weight, distance, offerCode } = packageData;

		const deliveryCost = this.calculator.calculateDeliveryCost(
			baseCost,
			weight,
			distance
		);
		const discountAmount = this.calculator.calculateDiscount(
			offerCode,
			weight,
			distance,
			deliveryCost
		);

		return {
			...packageData,
			deliveryCost,
			discount: Math.round(discountAmount),
			totalCost: Math.round(deliveryCost - Math.round(discountAmount))
		};
	}

	/**
	 * Schedule deliveries with vehicle allocation
	 * @param {Array} packages - All packages list including weight, distance, offerCode
	 * @param {number} baseCharge - Base delivery cost
	 * @param {number} numVehicles - Number of vehicles
	 * @param {number} maxSpeed - maximum speed of vehicles
	 * @param {number} capacity - maximum capacity of vehicles
	 * @returns {Array} Scheduled packages with delivery times
	 */
	scheduleDeliveries(packages, baseCharge, numVehicles, maxSpeed, capacity) {
		// Calculate delivery cost and discount for each package
		const processedPackages = packages.map(pkg =>
			this.processPackage(pkg, baseCharge)
		);

		// Schedule deliveries using vehicle allocation
		const dispatcher = new VehicleAllocator(numVehicles, maxSpeed, capacity);
		const scheduled = [];
		let remaining = [...processedPackages];

		// Greedy allocation: repeatedly find best shipment and dispatch
		while (remaining.length > 0) {
			const shipment = ShipmentOptimizer.findBestShipment(remaining, capacity);

			if (shipment.length === 0) {
				throw new Error('Unable to schedule remaining packages');
			}

			const dispatchedShipment = dispatcher.dispatchShipment(shipment);
			scheduled.push(...dispatchedShipment);

			// Remove scheduled packages from remaining list
			const scheduledIds = new Set(shipment.map(pkg => pkg.id));
			remaining = remaining.filter(pkg => !scheduledIds.has(pkg.id));
		}

		// Return in original order .
		const originalIndexMap = new Map(processedPackages.map((pkg, i) => [pkg.id, i]));
		return scheduled.sort((a, b) => originalIndexMap.get(a.id) - originalIndexMap.get(b.id));
	}
}

module.exports = DeliverySchedulingService;
