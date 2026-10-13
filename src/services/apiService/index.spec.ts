import { apiService } from "./index";
import { carbonClient } from "@/lib/carbonClient";
jest.mock("@/lib/carbonClient", () => ({
	carbonClient: { request: jest.fn() },
}));
test("propaga resposta e falha HTTP", async () => {
	const request = carbonClient.request as jest.Mock;
	request.mockResolvedValueOnce({ data: { ok: true } });
	expect(await apiService({ url: "/api" })).toEqual({ ok: true });
	request.mockRejectedValueOnce(new Error("HTTP 503"));
	await expect(apiService({ url: "/api" })).rejects.toThrow("HTTP 503");
});
