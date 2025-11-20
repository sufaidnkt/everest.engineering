const DeliveryTimeCalculator = require('./DeliveryTimeCalculator');

/**
 * VehicleAllocator : Allocate vehicles and schedule shipments
 */
class VehicleAllocator {
  	constructor(numVehicles, maxSpeed, capacity) {
		this.numVehicles = numVehicles;
		this.maxSpeed = maxSpeed;
		this.capacity = capacity;
		this.availableTimes = Array(numVehicles).fill(0);
  }
	
  /**
	* Find next available vehicle - optimized with reduce()
	* @returns {Object} Vehicle index and current time
	*/
	findNextAvailableVehicle() {
		const { index, time } = this.availableTimes.reduce(
	  	(best, time, i) => time < best.time ? { index: i, time } : best,
	  	{ index: 0, time: this.availableTimes[0] }
		);

		return { index, currentTime: time };
	}

	/**
	* Dispatch a shipment to a vehicle
	* @param {Array} shipment - Packages in this shipment
	* @returns {Array} Dispatched shipment with delivery times
	*/
  	dispatchShipment(shipment) {
		const { index, currentTime } = this.findNextAvailableVehicle();
		const maxDistance = Math.max(...shipment.map(pkg => pkg.distance));
		const returnTime = DeliveryTimeCalculator.calculateReturnTime(currentTime,maxDistance,this.maxSpeed);

		// Update vehicle availability
		this.availableTimes[index] = returnTime;

		// Calculate ETA for each package and preserve all properties
		return shipment.map(pkg => ({
	  		...pkg,
	  		eta: DeliveryTimeCalculator.calculateETA(
			currentTime,
			pkg.distance,
			this.maxSpeed
	  	),
		}));
  	}
}

module.exports = VehicleAllocator;
