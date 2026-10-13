"use client";
import Script from "next/script";
export function RecaptchaClient({
	siteKey,
	enabled = false,
}: {
	siteKey: string;
	enabled?: boolean;
}) {
	return enabled ? (
		<Script
			src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`}
			strategy="afterInteractive"
		/>
	) : null;
}
