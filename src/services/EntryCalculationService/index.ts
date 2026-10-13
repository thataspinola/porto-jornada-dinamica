import type { EntryCalculationInput, EntryCalculationResult } from "./types";
export function entryCalculation({
	vehiclePrice,
	entry,
}: EntryCalculationInput): EntryCalculationResult {
	if (
		!Number.isFinite(vehiclePrice) ||
		!Number.isFinite(entry) ||
		vehiclePrice <= 0 ||
		entry < 0 ||
		entry > vehiclePrice
	)
		throw new RangeError("Entrada inválida");
	return { vehiclePrice, entry, financedAmount: vehiclePrice - entry };
}
