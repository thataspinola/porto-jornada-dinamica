import { vi, type Mock } from "vitest";
import axios from "axios";
import { eligibility } from "@/services/EligibilityService/index";
vi.mock("axios");
afterEach(() => {
	delete process.env.ELIGIBILITY_URL;
	vi.resetAllMocks();
});
test("não inventa sucesso sem integração", async () =>
	expect(await eligibility({})).toMatchObject({
		success: false,
		code: "SERVICE_NOT_CONFIGURED",
	}));
test("propaga negativa", async () => {
	process.env.ELIGIBILITY_URL = "https://api.example.test/eligibility";
	(axios.post as Mock).mockResolvedValue({ data: { eligible: false } });
	expect(await eligibility({})).toMatchObject({
		success: false,
		code: "NOT_ELIGIBLE",
	});
});
