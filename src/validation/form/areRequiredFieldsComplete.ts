export function areRequiredFieldsComplete(
	names: string[],
	values: Record<string, unknown>,
) {
	return names.every(
		(name) =>
			values[name] !== undefined &&
			values[name] !== null &&
			values[name] !== "" &&
			values[name] !== false,
	);
}
