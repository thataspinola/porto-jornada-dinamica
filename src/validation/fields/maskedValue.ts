import { z } from "zod";
export const maskedValue = (length: number) =>
	z
		.string()
		.transform((v) => v.replace(/\D/g, ""))
		.refine((v) => v.length === length, "Quantidade de dígitos inválida");
