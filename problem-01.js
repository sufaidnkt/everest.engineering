'use strict';
const readline = require('readline');
const OfferRegistry = require('./src/models/OfferRegistry');
const DeliveryCalculator = require('./src/services/DeliveryCalculator');
const InputParser = require('./src/utils/InputParser');
const OutputFormatter = require('./src/utils/OutputFormatter');
const CostEstimationService = require('./src/services/CostEstimationService');

/**
 * DeliveryServiceApp entry point for Delivery Cost Estimation
 */
class DeliveryServiceApp {
  	constructor() {
		this.offerRegistry = new OfferRegistry();
		this.calculator = new DeliveryCalculator(this.offerRegistry);
		this.service = new CostEstimationService(this.offerRegistry, this.calculator);
  	}
	// Main function or entrypoint
  	main() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

    	let inputLines = [];

		console.log('== Delivery Cost Estimation Service ==');
		console.log('Input format:');
		console.log('  Line 1: base_cost number_of_packages');
		console.log('  Lines 2....n: pkg_id weight distance offer_code');
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
			if (inputLines.length < 2) { // minimum of 2 lines : base charge and packages
				throw new Error('Insufficient input provided');
			}

			// first line base delivery cost and number of packages
			const { baseCharge, totalPackages } = InputParser.parseFirstLine(
				inputLines[0]
			);

			if (inputLines.length < totalPackages + 1) {
				throw new Error(`Expected at least ${totalPackages + 1} lines, got ${inputLines.length}`);
			}

			// parse package lines
      		const packages = inputLines.slice(1, totalPackages + 1).map(line => InputParser.parsePackageLine(line));

			// process cost estimation
      		const results = this.service.processAllPackages(packages, baseCharge);

      		// Display results
      		OutputFormatter.printHeader(
      			'Delivery Cost Estimation System',
      			'PKG_ID        DISCOUNT      TOTAL_COST'
      		);
      		results.forEach(result => {
				OutputFormatter.printResult(
					result.id,
					result.discount,
					result.totalCost,
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
