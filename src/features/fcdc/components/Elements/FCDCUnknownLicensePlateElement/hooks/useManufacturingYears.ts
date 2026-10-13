export function useManufacturingYears(
	minYear: number,
	maxYear = new Date().getFullYear(),
) {
	if (minYear > maxYear) return [];
	return Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
		label: String(maxYear - i),
		value: String(maxYear - i),
	}));
}
