import { drawerElementSchema } from "./drawer.schema";
test("rejeita elemento sem identidade", () =>
	expect(
		drawerElementSchema.safeParse({ type: "DRAWER", config: {} }).success,
	).toBe(false));
