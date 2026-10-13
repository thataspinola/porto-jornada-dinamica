export function unwrapApiEnvelope<T>(value: T | { data: T }): T {
	return value && typeof value === "object" && "data" in value
		? (value as { data: T }).data
		: (value as T);
}
