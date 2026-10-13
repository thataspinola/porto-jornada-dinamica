import { z } from "zod";
import { applyValidations } from "./applyValidations";
test("valida limites e padrão", () => {
	const s = applyValidations(z.string(), {
		minLength: 2,
		maxLength: 4,
		pattern: "^[A-Z]+$",
	});
	expect(s.safeParse("AB").success).toBe(true);
	for (const v of ["A", "ABCDE", "ab"])
		expect(s.safeParse(v).success).toBe(false);
});
