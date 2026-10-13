import { z } from "zod";
export const phone = (required = true) =>
	z
		.string()
		.refine(
			(v) =>
				(!required && !v.trim()) ||
				/^[1-9]\d{9,10}$/.test(v.replace(/\D/g, "")),
			"Telefone inválido",
		);
