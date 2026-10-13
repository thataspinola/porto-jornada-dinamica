export function dispatchServiceEvent(service: string, success: boolean) {
	if (typeof window === "undefined") return;
	window.dataLayer ??= [];
	window.dataLayer.push({ event: "service_call", service, success });
}
