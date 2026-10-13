export function parseGoogleClientId(cookie: string) {
	return /^GA\d+\.\d+\.(\d+\.\d+)$/.exec(cookie)?.[1] ?? "";
}
