export function extractClientIp(headers: Headers) {
	return (headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "")
		.split(",")[0]
		.trim();
}
