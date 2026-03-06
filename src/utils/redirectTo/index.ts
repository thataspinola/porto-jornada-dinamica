export function redirectTo(urlOrSlug: string, bussines: { base_url?: string }) {
	const joinPaths = (base: string, path: string) => {
		if (!base.endsWith("/")) base += "/";
		if (path.startsWith("/")) path = path.substring(1);
		return base + path;
	};

	const baseUrl =
		typeof bussines.base_url === "string" ? bussines.base_url.trim() : "";
	const fullUrl = baseUrl ? joinPaths(baseUrl, urlOrSlug) : urlOrSlug;

	if (!fullUrl) return;

	if (/^https?:\/\//i.test(fullUrl)) {
		try {
			const target = new URL(fullUrl);
			if (target.origin !== window.location.origin) {
				window.location.href = fullUrl;
				return;
			}
			window.history.pushState(null, "", target.pathname + target.search);
			return;
		} catch {
			return;
		}
	}

	const path = fullUrl.startsWith("/") ? fullUrl : `/${fullUrl}`;
	window.history.pushState(null, "", path);
}
