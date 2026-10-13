export function clampNumber(value: number, min: number, max: number) {
	if (min > max) throw new RangeError("Intervalo inválido");
	return Math.min(max, Math.max(min, value));
}
