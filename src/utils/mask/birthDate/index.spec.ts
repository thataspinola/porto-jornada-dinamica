import { birthDateMask } from "./index";
test("limita e formata os dígitos", () =>
	expect(birthDateMask("01021990abc99")).toBe("01/02/1990"));
