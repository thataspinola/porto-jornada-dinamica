import { render, screen, fireEvent } from "@testing-library/react";
import { IconContent } from "@/components/UI/IconContent/IconContent";
test("IconContent: comportamento acessível", () => {
	render(<IconContent title="Cobertura">Detalhes</IconContent>);
	expect(screen.getByRole("heading")).toHaveTextContent("Cobertura");
});
