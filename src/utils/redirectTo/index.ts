import { dispatchNavigate } from "@/utils/dispatchNavigate";
export function redirectTo(urlOrSlug: string) {
	if (typeof window === "undefined" || !urlOrSlug) return;
	const target = urlOrSlug.trim();
	if (/^https?:\/\//i.test(target)) {
		window.location.assign(target);
		return;
	}
	if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//"))
		throw new Error("Destino inválido");
	const segments = window.location.pathname.split("/").filter(Boolean);
	const base =
		segments[0] === "contrate" ? segments.slice(0, 2) : segments.slice(0, 1);
	const step = target.replace(/^\/+/, "");
	window.history.pushState(
		{},
		"",
		target === "/" ? "/" : `/${[...base, step].join("/")}`,
	);
	dispatchNavigate();
}
