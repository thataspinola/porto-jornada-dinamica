import { beforeEach, describe, expect, it, vi } from "vitest";
import { optionsService } from "@/services/optionsService";
import { apiService, callApi } from "@/services/apiService";
import { carbonClient } from "@/lib/carbonClient";
import { entryCalculation } from "@/services/EntryCalculationService";
import { authorizationService } from "@/services/authorizationService";
import { ServiceError, SERVICE_ERROR_CODE } from "@/services";

vi.mock("@/lib/carbonClient", () => ({
	carbonClient: { request: vi.fn(), post: vi.fn() },
}));
vi.mock("next-runtime-env", () => ({
	env: (name: string) =>
		({
			NEXT_PUBLIC_SENSEDIA_CLOUD_URL: "https://local.test",
			NEXT_PUBLIC_SERVICE_AUTHORIZATION_PATH: "/auth",
		})[name],
}));
beforeEach(() => {
	vi.mocked(carbonClient.request).mockResolvedValue({ data: { ok: true } });
});
describe("adaptadores de API e opções", () => {
	it("transmite método, body, signal e headers ao cliente", async () => {
		const signal = new AbortController().signal;
		await apiService({
			url: "/api",
			method: "POST",
			body: { id: 1 },
			signal,
			headers: { "x-test": "test" },
			maxRedirects: 0,
		});
		expect(carbonClient.request).toHaveBeenCalledWith({
			url: "/api",
			method: "POST",
			data: { id: 1 },
			signal,
			headers: { "x-test": "test" },
			maxRedirects: 0,
		});
	});
	it("callApi exige cabeçalho de recaptcha e evita redirects", async () => {
		expect(await callApi({ url: "/api" }, "token")).toMatchObject({
			success: false,
			error: "INVALID_CONFIGURATION",
		});
		expect(carbonClient.request).not.toHaveBeenCalled();
		expect(
			await callApi(
				{
					url: "/api",
					recaptchaHeader: "x-recaptcha",
					headers: { "x-id": "1" },
				},
				"token",
			),
		).toEqual({ success: true, data: { ok: true } });
		expect(carbonClient.request).toHaveBeenCalledWith(
			expect.objectContaining({
				maxRedirects: 0,
				headers: { "x-id": "1", "x-recaptcha": "token" },
			}),
		);
	});
	it("permite requisição sem token quando backend não o exige", async () => {
		expect(await callApi({ url: "/api" }, "")).toEqual({
			success: true,
			data: { ok: true },
		});
	});
	it.each([
		{
			isAxiosError: true,
			response: { status: 422, data: { code: "INVALID", message: "Inválido" } },
		},
		{ isAxiosError: true },
		{ plain: true },
	])("propaga erro de API sem simular sucesso", async (error) => {
		vi.mocked(carbonClient.request).mockRejectedValue(error);
		const result = await callApi({ url: "/api" }, "");
		expect(result.success).toBe(false);
		expect(result.error).toBe(
			"isAxiosError" in error
				? "response" in error
					? "INVALID"
					: "CONNECTION_ERROR"
				: "INTERNAL_SERVER_ERROR",
		);
	});
	it("opções mapeiam chaves configuradas e preservam zeros", async () => {
		vi.mocked(carbonClient.request).mockResolvedValue({
			data: [{ name: "Porto", id: "001" }, {}],
		});
		const signal = new AbortController().signal;
		expect(
			await optionsService(
				{ url: "/api", labelKey: "name", valueKey: "id" },
				signal,
			),
		).toEqual([
			{ label: "Porto", value: "001" },
			{ label: "", value: "" },
		]);
		expect(carbonClient.request).toHaveBeenCalledWith(
			expect.objectContaining({ signal }),
		);
	});
	it("opções aceitam chaves padrão e rejeitam lista inválida", async () => {
		vi.mocked(carbonClient.request)
			.mockResolvedValueOnce({ data: [{ label: "A", value: 1 }] })
			.mockResolvedValueOnce({ data: { items: [] } });
		expect(await optionsService({ url: "/api" })).toEqual([
			{ label: "A", value: "1" },
		]);
		await expect(optionsService({ url: "/api" })).rejects.toThrow(
			"Lista de opções inválida",
		);
	});
});
describe("autorização e cálculo de entrada", () => {
	it.each([
		{ status: 200, data: { access_token: "test-token" } },
		{ status: 401, data: {} },
		{ status: 200, data: {} },
	])("autoriza somente resposta HTTP válida com token", async (response) => {
		vi.mocked(carbonClient.post).mockResolvedValue(response);
		const result = await authorizationService();
		expect(result).toEqual(
			response.status === 200 && "access_token" in response.data
				? response.data
				: { access_token: "" },
		);
		expect(carbonClient.post).toHaveBeenCalledWith(
			"https://local.test/auth/access-token",
			{ grant_type: "client_credentials" },
			expect.objectContaining({
				headers: expect.objectContaining({
					"Content-Type": "application/x-www-form-urlencoded",
				}),
			}),
		);
	});
	it("calcula valor financiado inclusive nos extremos", () => {
		expect(entryCalculation({ vehiclePrice: 100, entry: 20 })).toEqual({
			vehiclePrice: 100,
			entry: 20,
			financedAmount: 80,
		});
		expect(
			entryCalculation({ vehiclePrice: 100, entry: 0 }).financedAmount,
		).toBe(100);
		expect(
			entryCalculation({ vehiclePrice: 100, entry: 100 }).financedAmount,
		).toBe(0);
	});
	it.each([
		[NaN, 0],
		[100, NaN],
		[0, 0],
		[-1, 0],
		[100, -1],
		[100, 101],
		[Infinity, 0],
	])("rejeita cálculo inválido %s/%s", (vehiclePrice, entry) =>
		expect(() => entryCalculation({ vehiclePrice, entry })).toThrow(
			RangeError,
		));
	it("ServiceError preserva identificação e status", () => {
		const error = new ServiceError("Falha", 422);
		expect(error).toBeInstanceOf(Error);
		expect(error).toMatchObject({
			name: "ServiceError",
			message: "Falha",
			statusCode: 422,
		});
		expect(SERVICE_ERROR_CODE.NOT_ELIGIBLE).toBe("NOT_ELIGIBLE");
	});
});
