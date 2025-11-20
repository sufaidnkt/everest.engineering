'use strict';
const readline = require('readline');
const OfferRegistry = require('./src/models/OfferRegistry');
const DeliveryCalculator = require('./src/services/DeliveryCalculator');
const InputParser = require('./src/utils/InputParser');
const OutputFormatter = require('./src/utils/OutputFormatter');
const DeliverySchedulingService = require('./src/services/DeliverySchedulingService');

/**
 * DeliveryServiceApp entry point for Delivery Cost, Time and vehicle allocation
 */
class DeliveryServiceApp {
  	constructor() {
		this.offerRegistry = new OfferRegistry();
		this.calculator = new DeliveryCalculator(this.offerRegistry);
		this.service = new DeliverySchedulingService(this.offerRegistry, this.calculator);
  	}
	// Main function or entrypoint
  	main() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

    	let inputLines = [];

		console.log('== Delivery Time Estimation Service ==');
		console.log('Input format:');
		console.log('  Line 1: base_cost number_of_packages');
		console.log('  Lines 2....n: pkg_id weight distance offer_code');
		console.log('  Line n+1: num_vehicles max_speed capacity');
		console.log('(Press Ctrl+D when done)\n');

		rl.on('line', line => {
			const trimmed = line.trim(); // ignore empty lines
			if (trimmed) {
				inputLines.push(trimmed);
			}
		});

		rl.on('close', () => { // Ctrl+D : end of input
			this.processInput(inputLines);
		});
  	}

	/**
   	* Process input lines and generate results
   	* @param {Array<string>} inputLines - All input lines
   	*/
  	processInput(inputLines) {
    	console.log('Processing input...\n');

    	try {
			if (inputLines.length < 3) { // minimum of 3 lines : base charge, total packages and vehicle config
				throw new Error('Insufficient input provided');
			}

			// first line base delivery cost and number of packages
			const { baseCharge, totalPackages } = InputParser.parseFirstLine(
				inputLines[0]
			);

			if (inputLines.length < totalPackages + 2) {
				throw new Error(`Expected at least ${totalPackages + 2} lines, got ${inputLines.length}`);
			}

			// parse package lines
      		const packages = inputLines.slice(1, totalPackages + 1).map(line => InputParser.parsePackageLine(line));

			// parse vehicle configuration
      		const { numVehicles, maxSpeed, capacity } = InputParser.parseVehicleLine(
        		inputLines[totalPackages + 1]
      		);

			// schedule deliveries
      		const results = this.service.scheduleDeliveries(packages,baseCharge,numVehicles,maxSpeed,capacity);

      		// Display results
      		OutputFormatter.printHeader(
      			'Delivery Time Estimation System',
      			'PKG_ID        DISCOUNT      TOTAL_COST      DELIVERY_TIME (hrs)'
      		);
      		results.forEach(result => {
				OutputFormatter.printResult(
					result.id,
					result.discount,
					result.totalCost,
					result.eta,
				);
      		});
      		OutputFormatter.printFooter(75);
    	} catch (error) {
      		OutputFormatter.printError(error.message);
      		process.exit(1);
    	}
  	}
}

const app = new DeliveryServiceApp();
app.main();