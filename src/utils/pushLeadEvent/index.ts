export function pushLeadEvent() {
	if (typeof window === "undefined") return false;
	window.dataLayer ??= [];
	window.dataLayer.push({ event: "generate_lead" });
	return true;
}
