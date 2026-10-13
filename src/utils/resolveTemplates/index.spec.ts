import { resolveTemplates } from "./index";
test("resolveTemplates: transforma entrada sem incluir dados extras", () => {
	expect(resolveTemplates({ label: "{{user}}" }, { user: "Ana" })).toEqual({
		label: "Ana",
	});
});
