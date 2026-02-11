import { formatGtmText } from ".";

describe("formatGtm.ts", () => {
	describe("string input", () => {
		it("should handle undefined input", () => {
			expect(formatGtmText(undefined)).toBe("");
		});

		it("should handle empty string", () => {
			expect(formatGtmText("")).toBe("");
			expect(formatGtmText("   ")).toBe("");
		});

		it("should format string with spaces", () => {
			expect(formatGtmText("Test String")).toBe("test-string");
		});

		it("should format string with special characters", () => {
			expect(formatGtmText("Test@String!")).toBe("teststring");
		});

		it("should format string with multiple spaces", () => {
			expect(formatGtmText("  Test   String  ")).toBe("test-string");
		});

		it("should format string with accents", () => {
			expect(formatGtmText("Tést Strîng")).toBe("test-string");
		});
	});
});
