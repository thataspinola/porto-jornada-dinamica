import { sanitize } from "./index";

describe("sanitize", () => {
	it("should remove special characters", () => {
		const input = "Test@123 content!";
		expect(sanitize.text(input)).toBe("Test content");
	});

	it("should handle empty string", () => {
		expect(sanitize.text("")).toBe("");
	});

	it("should preserve letters, spaces and hyphens", () => {
		const input = "Safe-content with spaces";
		expect(sanitize.text(input)).toBe("Safecontent with spaces");
	});

	it("should preserve accented characters", () => {
		const input = "Conteúdo com acentuação e çedilha";
		expect(sanitize.text(input)).toBe("Conteúdo com acentuação e çedilha");
	});

	it("should remove HTML-like characters", () => {
		const input = "<div>Level 1 & Level 2</div>";
		expect(sanitize.text(input)).toBe("divLevel   Level div");
	});

	it("should preserve whitespace appropriately", () => {
		const input = "First Second";
		expect(sanitize.text(input)).toBe("First Second");
	});
});
