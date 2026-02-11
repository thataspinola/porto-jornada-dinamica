export function plateMask(placa: string): string {
	return placa
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "")
		.slice(0, 7);
}
