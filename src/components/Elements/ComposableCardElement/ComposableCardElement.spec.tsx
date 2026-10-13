import { render, screen } from "@testing-library/react";
import { ComposableCardElement } from "./ComposableCardElement";
test("renderiza os filhos do card", () => {
	render(
		<ComposableCardElement
			element={{
				id: "c",
				type: "COMPOSABLE_CARD",
				config: {
					elements: [{ id: "t", type: "TEXT", config: { text: "Título" } }],
				},
			}}
			renderElement={(e) => <span>{e.id}</span>}
		/>,
	);
	expect(screen.getByText("t")).toBeInTheDocument();
});
