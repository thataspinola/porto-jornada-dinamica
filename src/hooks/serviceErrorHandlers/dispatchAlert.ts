export function dispatchAlert(event: string, action?: string) {
	if (typeof window === "undefined") return false;
	window.dataLayer ??= [];
	window.dataLayer.push({
		event,
		ev_action:
			action ??
			(event === "view_promotion"
				? "ecommerce:visualizar:promocao:alert"
				: `${event}:alert`),
	});
	return true;
}
