import { z } from "zod";
export function isValidCpf(input: string) {
	const s = input.replace(/\D/g, "");
	if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false;
	for (let size = 9; size <= 10; size++) {
		let sum = 0;
		for (let i = 0; i < size; i++) sum += Number(s[i]) * (size + 1 - i);
		const digit = ((sum * 10) % 11) % 10;
		if (digit !== Number(s[size])) return false;
	}
	return true;
}
export const cpf = (required = true) =>
	z
		.string()
		.refine((v) => (!required && !v.trim()) || isValidCpf(v), "CPF inválido");
