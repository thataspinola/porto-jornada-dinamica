export function ensureAnalyticsUserId(storage: Storage = sessionStorage) {
	const key = "analytics-user-id";
	const existing = storage.getItem(key);
	if (existing) return existing;
	const id = crypto.randomUUID();
	storage.setItem(key, id);
	return id;
}
