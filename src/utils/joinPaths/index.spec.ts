import { joinPaths } from "./index";
test("preserva URL absoluta", () =>
	expect(joinPaths("/base", "https://www.portoseguro.com.br")).toBe(
		"https://www.portoseguro.com.br",
	));
test("une caminhos", () =>
	expect(joinPaths("/base/", "/step")).toBe("/base/step"));
