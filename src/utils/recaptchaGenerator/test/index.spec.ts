import { vi } from "vitest";
import { recaptchaGenerator } from "@/utils/recaptchaGenerator/index";
afterEach(() => {
	delete window.grecaptcha;
});
test("suporta a API enterprise declarada na main", async () => {
	const execute = vi.fn().mockResolvedValue("token");
	window.grecaptcha = {
		enterprise: { ready: (callback) => callback(), execute },
	};
	expect(await recaptchaGenerator("site-key", "eligibility")).toBe("token");
	expect(execute).toHaveBeenCalledWith("site-key", { action: "eligibility" });
});
test("falha explicitamente quando o script não está disponível", async () => {
	await expect(recaptchaGenerator("site-key", "eligibility")).rejects.toThrow(
		"reCAPTCHA indisponível",
	);
});
