export function joinPaths(base: string, path: string) {
	if (/^https?:\/\//i.test(path)) return path;
	const a = base.trim().replace(/\/+$/, "");
	const b = path.trim().replace(/^\/+/, "");
	if (!a) return b ? `/${b}` : "/";
	return b ? `${a}/${b}` : a;
}
