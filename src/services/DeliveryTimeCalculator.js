/**
 * DeliveryTimeCalculator: Computes delivery times
 * Responsibility: Calculate ETAs and vehicle return times
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
		const eta = currentTime + distance / maxSpeed;
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
		return currentTime + (2 * maxDistance) / maxSpeed;
	}
}

module.exports = DeliveryTimeCalculator;
