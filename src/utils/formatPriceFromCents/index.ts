import { formatPrice } from "@/utils/formatPrice";
export function formatPriceFromCents(value: number) {
	return formatPrice(value / 100);
}
