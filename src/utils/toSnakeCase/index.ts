export function toSnakeCase(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
		.replace(/[^a-zA-Z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.toLowerCase();
}
