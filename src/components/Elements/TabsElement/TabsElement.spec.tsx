import { render, screen, fireEvent } from "@testing-library/react";
import { TabsElement } from "./TabsElement";
test("TabsElement: interação", () => {
	render(
		<TabsElement
			element={{
				id: "x",
				type: "TABS",
				config: {
					items: [
						{ title: "A", description: "Primeiro" },
						{ title: "B", description: "Segundo" },
					],
				},
			}}
		/>,
	);
	fireEvent.click(screen.getByRole("tab", { name: "B" }));
	expect(screen.getByRole("tabpanel")).toHaveTextContent("Segundo");
});
