import { z } from "zod";
export const fullName = (required = true) =>
	z
		.string()
		.refine(
			(v) => (!required && !v.trim()) || v.trim().split(/\s+/).length >= 2,
			"Informe o nome completo",
		);
