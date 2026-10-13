"use client";
import { useEffect } from "react";
export function CustomDataAnalytics({
	event,
}: {
	event: Record<string, unknown>;
}) {
	useEffect(() => {
		window.dataLayer ??= [];
		window.dataLayer.push(event);
	}, [event]);
	return null;
}
