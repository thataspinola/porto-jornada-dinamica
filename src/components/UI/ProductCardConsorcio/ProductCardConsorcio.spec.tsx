import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCardConsorcio } from "./ProductCardConsorcio";
test("ProductCardConsorcio: comportamento acessível", () => {
	render(
		<ProductCardConsorcio
			title="Consórcio"
			description="Detalhes"
			url="/produto"
		/>,
	);
	expect(screen.getByRole("link")).toHaveAttribute("href", "/produto");
});
