import { vi, type Mock } from "vitest";
import { apiService } from "./index";
import { carbonClient } from "@/lib/carbonClient";
vi.mock("@/lib/carbonClient", () => ({
	carbonClient: { request: vi.fn() },
}));
test("propaga resposta e falha HTTP", async () => {
	const request = carbonClient.request as Mock;
	request.mockResolvedValueOnce({ data: { ok: true } });
	expect(await apiService({ url: "/api" })).toEqual({ ok: true });
	request.mockRejectedValueOnce(new Error("HTTP 503"));
	await expect(apiService({ url: "/api" })).rejects.toThrow("HTTP 503");
});
