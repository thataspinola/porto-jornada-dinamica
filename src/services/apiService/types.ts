export type ApiRequest = {
	url: string;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	headers?: Record<string, string>;
	signal?: AbortSignal;
	maxRedirects?: number;
};

export type ApiServiceInput = ApiRequest & { recaptchaHeader?: string };
