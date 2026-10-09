import type { PromotionEvent } from "./types";
export type { Item, PromotionEvent } from "./types";
export function pushEvent(event: PromotionEvent): boolean {
	if (typeof window === "undefined") return false;
	const payload: PromotionEvent = {
		event: event.event,
		ev_action: event.ev_action ?? "ecommerce:visualizar:promocao:sucesso",
		items: event.items,
	};
	if (event.currency !== undefined) payload.currency = event.currency;
	if (event.value !== undefined) payload.value = event.value;
	const target = window as Window & {
		dataLayer?: PromotionEvent[];
	};
	target.dataLayer ??= [];
	target.dataLayer.push(payload);
	return true;
}
