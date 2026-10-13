export function getCookieOptions() {
	return {
		path: "/",
		sameSite: "Lax" as const,
		secure: typeof location !== "undefined" && location.protocol === "https:",
	};
}
