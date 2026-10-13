export function getMarketingParams(search: string) {
	return Object.fromEntries(
		Array.from(new URLSearchParams(search)).filter(
			([key]) =>
				/^utm_(source|medium|campaign|term|content)$/.test(key) ||
				["gclid", "fbclid"].includes(key),
		),
	);
}
