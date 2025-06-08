/**
 * Formats a percentage value from the standard format to a localized format
 * @param value - The percentage value (can be a number or a string)
 * @param options - Optional formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
	value: number | string,
	options: {
		decimalPlaces?: number;
		useDotNotation?: boolean;
	} = {}
): string => {
	// Normalize the input to a number
	const numValue = typeof value === "string" ? parseFloat(value) : value;

	// Default to 2 decimal places if not specified
	const decimalPlaces = options.decimalPlaces ?? 2;

	// Format the percentage
	const formattedValue = numValue
		.toFixed(decimalPlaces)
		.replace(".", options.useDotNotation ? "." : ",");

	return `${formattedValue}%`;
};
