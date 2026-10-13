import { z } from "zod";
export const cep = (required = true) =>
	z
		.string()
		.refine(
			(v) => (!required && !v.trim()) || /^\d{8}$/.test(v.replace(/\D/g, "")),
			"CEP inválido",
		);
