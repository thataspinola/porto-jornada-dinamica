import { resolveTemplates } from "@/utils/resolveTemplates";
export function resolveCookiePayload(
	value: unknown,
	cookies: Record<string, string>,
) {
	return resolveTemplates(value, { cookies });
}
