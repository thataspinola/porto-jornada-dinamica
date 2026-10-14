import { setCookiesFromTemplates } from "@/utils/setCookiesFromTemplates/index";
test("codifica cookie e rejeita nome inválido", () => {
	setCookiesFromTemplates({ campaign: "{{value}}" }, { value: "a;b" });
	expect(document.cookie).toContain("campaign=a%3Bb");
	expect(() => setCookiesFromTemplates({ "x;y": "v" }, {})).toThrow();
});
