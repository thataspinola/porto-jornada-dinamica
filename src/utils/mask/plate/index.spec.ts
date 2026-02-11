import { plateMask } from ".";

describe("plate.ts", () => {
	it("should format plate correctly", () => {
		expect(plateMask("1234%%567")).toBe("1234567");
	});

	it("should handle 7 digits max", () => {
		expect(plateMask("12345678")).toBe("1234567");
	});
});
