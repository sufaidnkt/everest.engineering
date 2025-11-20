/**
 * OutputFormatter : Utility class for formatting output
 */
class OutputFormatter {
  	/**
   	* Print header with custom header row
   	* @param {string} title - Title to display
   	* @param {string} headerRow - Column headers
   	* @param {number} width - Width for border
   	*/
	static printHeader(title, headerRow, width = 70) {
		console.log(`== ${title} ==`);
		console.log('═'.repeat(width));
		console.log(headerRow);
		console.log('─'.repeat(width));
	}

  	/**
	* Print result row with dynamic columns
	* @param {Array} values - Array of values to display
	*/
	static printResult(...values) {
		const formattedValues = values.map((value, index) => {
			return value.toString().padEnd(15, ' ');
		});
		console.log(formattedValues.join(' '));
	}

  	/**
   	* Print footer
   	*/
  	static printFooter(width = 75) {
		console.log('═'.repeat(width));
  	}

  	/**
   	* Print error message
   	*/
  	static printError(message) {
		console.error(`Error: ${message}`);
  	}
}

module.exports = OutputFormatter;
