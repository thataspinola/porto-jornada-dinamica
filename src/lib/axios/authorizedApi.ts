"use server";
import { AuthorizationService } from "@/services";
import { authorizedApi } from "./axiosInstance";

const addAuthToken = async (config: any) => {
	const { access_token } = await AuthorizationService();
	if (access_token) {
		config.headers.Authorization = `Bearer ${access_token}`;
	}
};

authorizedApi.interceptors.request.use(
	async (config) => {
		await addAuthToken(config);
		return config;
	},
	(error) => Promise.reject(error),
);

authorizedApi.interceptors.response.use(
	(response) => response,
	async (error) => Promise.reject(error),
);

export { authorizedApi };
