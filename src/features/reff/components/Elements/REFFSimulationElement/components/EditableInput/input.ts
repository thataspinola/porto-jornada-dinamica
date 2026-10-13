export function parseMonetaryInput(value: string) {
	const number = Number(value.replace(/\./g, "").replace(",", "."));
	return Number.isFinite(number) ? number : null;
}
