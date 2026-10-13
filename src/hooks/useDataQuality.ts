export function useDataQuality(
	values: Record<string, unknown>,
	required: string[],
) {
	const missing = required.filter(
		(key) =>
			values[key] === undefined || values[key] === null || values[key] === "",
	);
	return { complete: missing.length === 0, missing };
}
