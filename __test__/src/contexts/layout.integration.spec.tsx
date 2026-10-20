import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("layout e provider da aplicação", () => {
	it("renderiza documento pt-BR e conteúdo dentro do provider real", () => {
		const html = renderToStaticMarkup(
			<RootLayout>
				<p>Jornada da fixture</p>
			</RootLayout>,
		);
		expect(html).toContain('lang="pt-BR"');
		expect(html).toContain("<main><p>Jornada da fixture</p></main>");
		expect(html).toContain('name="viewport"');
	});
});
