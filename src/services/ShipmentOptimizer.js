/**
 * ShipmentOptimizer: Finds best shipment combinations
 * Responsibility: Optimize package grouping for vehicles
 * Strategy: Maximize packages -> Maximize weight -> Minimize max distance
 */
class ShipmentOptimizer {
  	/**
	* Greedy algorithm to find shipment
	* Strategy: Maximize count → Maximize weight → Minimize distance
	* Time Complexity: O(n^2)
	* Note: Fast but may not find optimal solution
	*
	* @param {Array} remaining - Remaining packages
	* @param {number} capacity - Vehicle capacity
	* @returns {Array} Selected packages for this shipment
	*/
  	static findBestShipmentGreedy(remaining, capacity) {
		if (remaining.length === 0) return [];

		// Strategy: Maximize package count first
		// Sort by weight ascending to fit more packages
		const sorted = [...remaining].sort((a, b) => a.weight - b.weight);

		const selected = [];
		let totalWeight = 0;

		// Greedily select lighter packages to maximize count
		for (const pkg of sorted) {
			if (totalWeight + pkg.weight <= capacity) {
				selected.push(pkg);
				totalWeight += pkg.weight;
			}
		}

		// Fallback: if no packages selected, try to fit the single lightest package
		if (selected.length === 0 && sorted[0].weight <= capacity) {
			return [sorted[0]];
		}

		return selected;
	}

  	/**
	* Find the best shipment from remaining packages (Bitmask approach)
	* Constraints: Total weight <= capacity
	* Strategy: Maximize count, then weight, then minimize distance
	* Time Complexity: O(2^n × n)
	* Note: Optimal solution but slower for large datasets
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
