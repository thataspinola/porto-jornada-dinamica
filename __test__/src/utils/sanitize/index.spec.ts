import { sanitize } from "@/utils/sanitize/index";

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

describe("sanitização de dados antes de envio", () => {
	it("preserva letras e zeros enquanto remove caracteres proibidos", () => {
		expect(sanitize.text("João @ Silva123")).toBe("João  Silva");
		expect(sanitize.digits("012.345-67")).toBe("01234567");
		expect(sanitize.number("R$ 1.500,00")).toBe(150000);
		expect(sanitize.number("abc")).toBe("");
		expect(sanitize.email("  ANA+spam@PORTO.TEST  ")).toBe(
			"anaspam@porto.test",
		);
		expect(sanitize.alphanumeric("João @ Silva123")).toBe("JoãoSilva123");
		expect(sanitize.dom("<script>alert(1)</script><b>Porto</b>")).toBe("Porto");
		expect(sanitize.pureAscii("Atenção! 2026")).toBe("Atencao2026");
	});
});
