import { z } from "zod";
import { calculateAge } from "@/utils/calculateAge";
export const birthDate = (required = true) =>
	z
		.string()
		.refine(
			(v) => (!required && !v.trim()) || calculateAge(v) !== null,
			"Data de nascimento inválida",
		);
