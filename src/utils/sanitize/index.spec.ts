import { sanitize } from "./index";

describe("sanitize", () => {
	it("should remove HTML tags", () => {
		const input = "<p>Test <strong>content</strong></p>";
		expect(sanitize(input)).toBe("pTest strongcontentstrongp");
	});

	it("should handle empty string", () => {
		expect(sanitize("")).toBe("");
	});

	it("should remove script tags and content", () => {
		const input = '<p>Safe content</p><script>alert("xss")</script>';
		expect(sanitize(input)).toBe("pSafe contentpscriptalertxssscript");
	});

	it("should remove style tags and content", () => {
		const input = "<p>Content</p><style>.dangerous {color: red; }</style>";
		expect(sanitize(input)).toBe("pContentpstyle.dangerous color red style");
	});

	it("should handle nested tags", () => {
		const input = "<div><p>Level 1 <span>Level 2 <em>Level 3</em></span></p></div>";
		expect(sanitize(input)).toBe("divpLevel 1 spanLevel 2 emLevel 3emspanpdiv");
	});

	it("should preserve whitespace appropriately", () => {
		const input = "<p>First</p> <p>Second</p>";
		expect(sanitize(input)).toBe("pFirstp pSecondp");
	});
});
