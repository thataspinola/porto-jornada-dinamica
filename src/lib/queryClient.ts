export class QueryClient {
	private cache = new Map<string, Promise<unknown>>();
	fetch<T>(key: string, load: () => Promise<T>): Promise<T> {
		const cached = this.cache.get(key);
		if (cached) return cached as Promise<T>;
		const promise = load().catch((error) => {
			this.cache.delete(key);
			throw error;
		});
		this.cache.set(key, promise);
		return promise;
	}
	invalidate(key?: string) {
		if (key) this.cache.delete(key);
		else this.cache.clear();
	}
}
