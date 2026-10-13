import { traceId } from "./index";
test("gera 32 caracteres hexadecimais", () =>
	expect(traceId()).toMatch(/^[0-9a-f]{32}$/));
