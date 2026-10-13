"use client";
import Script from "next/script";
export function GoogleTagManager({
	id,
	enabled = false,
}: {
	id: string;
	enabled?: boolean;
}) {
	if (!enabled || !/^GTM-[A-Z0-9]+$/.test(id)) return null;
	return (
		<Script
			src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`}
			strategy="afterInteractive"
		/>
	);
}
