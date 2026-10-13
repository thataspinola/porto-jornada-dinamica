import { carbonClient } from "@/lib/carbonClient";
import type { ApiRequest } from "./types";
export async function apiService<T>(request: ApiRequest): Promise<T> {
	const response = await carbonClient.request<T>({
		url: request.url,
		method: request.method ?? "GET",
		data: request.body,
		headers: request.headers,
		signal: request.signal,
	});
	return response.data;
}
