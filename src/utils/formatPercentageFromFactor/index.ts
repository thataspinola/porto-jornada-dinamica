import { formatPercentage } from "@/utils/formatPercentage";
export function formatPercentageFromFactor(value: number) {
	return formatPercentage(value * 100);
}
