import { interpolateTemplate } from "@/utils/interpolateTemplate";
export function setCookiesFromTemplates(
	templates: Record<string, string>,
	context: Record<string, unknown>,
) {
	for (const [name, value] of Object.entries(templates)) {
		if (!/^[\w-]+$/.test(name)) throw new Error("Nome de cookie inválido");
		document.cookie = `${name}=${encodeURIComponent(interpolateTemplate(value, context))}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
	}
}
