import type { Metadata } from "next";
export function journeyMetadata(name: string): Metadata {
	return { title: `${name} | Porto`, description: `Conheça ${name} na Porto.` };
}
