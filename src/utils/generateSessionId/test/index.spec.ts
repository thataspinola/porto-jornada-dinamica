import { generateSessionId } from "@/utils/generateSessionId/index";
test("gera identificadores distintos", () => {
	expect(generateSessionId()).not.toBe(generateSessionId());
});
