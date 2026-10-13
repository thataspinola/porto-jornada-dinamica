"use client";
import Script from "next/script";
export function VwoScript({
	src,
	enabled = false,
}: {
	src: string;
	enabled?: boolean;
}) {
	return enabled ? <Script src={src} strategy="afterInteractive" /> : null;
}
