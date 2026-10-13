export function parseStyleValue(value: string | number) {
	return typeof value === "string" ? value.trim() : value;
}
