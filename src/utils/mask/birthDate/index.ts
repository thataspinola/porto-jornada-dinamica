export function birthDateMask(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 8)
		.replace(/^(\d{2})(\d)/, "$1/$2")
		.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}
