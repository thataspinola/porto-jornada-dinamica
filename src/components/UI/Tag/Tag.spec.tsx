import { render, screen, fireEvent } from "@testing-library/react";
import { Tag } from "./Tag";
test("Tag: comportamento acessível", () => {
	render(<Tag>Ativo</Tag>);
	expect(screen.getByText("Ativo")).toBeInTheDocument();
});
