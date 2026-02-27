"use server";

import { env } from "next-runtime-env";

import { api } from "@/lib";

import type { AuthorizationServiceResponse } from "./types";

export async function AuthorizationService() {
	const basePath = env("NEXT_PUBLIC_SENSEDIA_CLOUD_URL");
	const authorization = env("NEXT_PUBLIC_SERVICE_AUTHORIZATION_PATH");
	const credentials = process.env.CREDENTIALS;
	const endpoint = `${basePath}${authorization}/access-token`;

	const configHeaders = {
		headers: {
			Authorization: `Basic ${credentials}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
	};

	const body = { grant_type: "client_credentials" };

	const httpResponse = await api.post<AuthorizationServiceResponse>(
		endpoint,
		body,
		configHeaders,
	);

	if (httpResponse.status !== 200 || !httpResponse.data?.access_token) {
		return { access_token: "" };
	}

	return httpResponse.data;
}
