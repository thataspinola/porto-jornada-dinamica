import { render, screen, fireEvent } from "@testing-library/react";
import { ConditionalTag } from "./ConditionalTag";
test("ConditionalTag: comportamento acessível", () => {
	const { rerender } = render(
		<ConditionalTag visible={false}>Conteúdo</ConditionalTag>,
	);
	expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
	rerender(<ConditionalTag visible>Conteúdo</ConditionalTag>);
	expect(screen.getByText("Conteúdo")).toBeInTheDocument();
});
