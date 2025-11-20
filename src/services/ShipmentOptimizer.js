/**
 * ShipmentOptimizer: Finds best shipment combinations
 * Responsibility: Optimize package grouping for vehicles
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
		for (let mask = 1; mask < 1 << n; mask++) {
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
			(count === best.count &&
		  	weight === best.totalWeight &&
		  	distance < best.maxDist)
	  	) {
			best = { mask, count, totalWeight: weight, maxDist: distance };
	  	}
	}

	// Handle edge cases: try to fit at least one package
	if (best.count === 0) {
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

module.exports = ShipmentOptimizer;
