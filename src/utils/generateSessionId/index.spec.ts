import { generateSessionId } from "./index";
test("gera identificadores distintos", () => {
	expect(generateSessionId()).not.toBe(generateSessionId());
});
