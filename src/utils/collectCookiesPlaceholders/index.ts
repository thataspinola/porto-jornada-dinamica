export function collectCookiesPlaceholders(value: unknown): string[] {
	const found = new Set<string>();
	const visit = (v: unknown) => {
		if (typeof v === "string") {
			for (const m of v.matchAll(/\{\{\s*cookies\.([\w-]+)\s*\}\}/g))
				found.add(m[1]);
		} else if (Array.isArray(v)) v.forEach(visit);
		else if (v && typeof v === "object") Object.values(v).forEach(visit);
	};
	visit(value);
	return [...found];
}
