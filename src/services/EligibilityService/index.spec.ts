import axios from "axios";
import { eligibility } from "./index";
jest.mock("axios");
afterEach(() => {
	delete process.env.ELIGIBILITY_URL;
	jest.resetAllMocks();
});
test("não inventa sucesso sem integração", async () =>
	expect(await eligibility({})).toMatchObject({
		success: false,
		code: "SERVICE_NOT_CONFIGURED",
	}));
test("propaga negativa", async () => {
	process.env.ELIGIBILITY_URL = "https://api.example.test/eligibility";
	(axios.post as jest.Mock).mockResolvedValue({ data: { eligible: false } });
	expect(await eligibility({})).toMatchObject({
		success: false,
		code: "NOT_ELIGIBLE",
	});
});
