import { vi } from "vitest";
import { callApi } from "./apiService";
import { eligibility } from "./EligibilityService";
import { callService } from "./serviceRegistry";

vi.mock("./apiService", () => ({ callApi: vi.fn() }));
vi.mock("./EligibilityService", () => ({ eligibility: vi.fn() }));
afterEach(() => {
	delete process.env.SERVICE_ALLOWED_ORIGINS;
	vi.resetAllMocks();
});
test("preserva o contrato de elegibilidade usado pelo runner", async () => {
	vi.mocked(eligibility).mockResolvedValue({
		success: false,
		code: "NOT_ELIGIBLE",
	});
	expect(
		await callService("eligibility", { fields: { taxvat: "52998224725" } }),
	).toMatchObject({ code: "NOT_ELIGIBLE" });
});
test("recusa chamada genérica sem origem autorizada", async () => {
	expect(
		await callService({ url: "https://api.example.test/consulta" }, ""),
	).toMatchObject({ success: false, error: "SERVICE_NOT_CONFIGURED" });
	expect(callApi).not.toHaveBeenCalled();
});
test("aceita somente a origem explicitamente configurada", async () => {
	process.env.SERVICE_ALLOWED_ORIGINS = "https://api.example.test";
	vi.mocked(callApi).mockResolvedValue({ success: true, data: { ok: true } });
	expect(
		await callService({ url: "https://api.example.test/consulta" }, "token"),
	).toMatchObject({ success: true });
	expect(
		await callService(
			{ url: "https://api.example.test.evil.test/consulta" },
			"",
		),
	).toMatchObject({ success: false });
	expect(
		await callService(
			{ url: "https://user:pass@api.example.test/consulta" },
			"",
		),
	).toMatchObject({ success: false });
	expect(callApi).toHaveBeenCalledTimes(1);
});
