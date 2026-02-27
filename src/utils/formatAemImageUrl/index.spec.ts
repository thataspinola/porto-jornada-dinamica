import { formatAemImageUrl } from ".";

describe("formatAemImageUrl.ts", () => {
	it("should return undefined for undefined input", () => {
		expect(formatAemImageUrl(undefined)).toBe("");
	});

	it("should return empty string for empty input", () => {
		expect(formatAemImageUrl("")).toBe("");
		expect(formatAemImageUrl("   ")).toBe("");
	});

	it("should format URL with base URL from environment", () => {
		const path = "/content/dam/image.jpg";
		const expected = "https://www.portoseguro.com.br/content/dam/image.jpg";
		expect(formatAemImageUrl(path)).toBe(expected);
	});

	it("should remove leading and trailing slashes", () => {
		const path = "///content/dam/image.jpg///";
		const expected = "https://www.portoseguro.com.br/content/dam/image.jpg";
		expect(formatAemImageUrl(path)).toBe(expected);
	});

	it("should handle URLs with query parameters", () => {
		const path = "/content/dam/image.jpg?width=100";
		const expected =
			"https://www.portoseguro.com.br/content/dam/image.jpg?width=100";
		expect(formatAemImageUrl(path)).toBe(expected);
	});
});
