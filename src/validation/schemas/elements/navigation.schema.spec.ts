import { navigationElementSchema } from "./navigation.schema";
test("exige destino e label", () => {
	expect(
		navigationElementSchema.safeParse({
			id: "1",
			type: "NAVIGATION",
			config: { label: "Ir" },
		}).success,
	).toBe(false);
});
