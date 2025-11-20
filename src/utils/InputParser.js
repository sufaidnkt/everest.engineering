/**
 * InputParser : Parses input lines into structured data
 */
class InputParser {
  	/**
   	* Parse configuration line
   	* @param {string} line - Configuration line
   	* @returns {Object} Parsed config with baseCharge and totalPackages
   	* @throws {Error} If parsing fails
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

		if (baseCharge < 0 || totalPackages < 0) {
			throw new Error('Base charge and total packages must be non-negative');
		}

	return { baseCharge, totalPackages };
  }

	/**
	* Parse package line
	* @param {string} line - Package data line
	* @returns {Object} Parsed package with id, weight, distance, offerCode
	* @throws {Error} If parsing fails
	*/
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

  	/**
   	* Parse vehicle configuration line
   	* @param {string} line - Vehicle configuration line
   	* @returns {Object} Parsed vehicle config with numVehicles, maxSpeed, capacity
   	* @throws {Error} If parsing fails
   	*/
  	static parseVehicleLine(line) {
		const tokens = line.trim().split(/\s+/);

		if (tokens.length !== 3) {
	  		throw new Error(`Expected 3 fields in vehicle line, got ${tokens.length}`);
		}

		const numVehicles = parseInt(tokens[0], 10);
		const maxSpeed = parseFloat(tokens[1]);
		const capacity = parseFloat(tokens[2]);

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

module.exports = InputParser;
