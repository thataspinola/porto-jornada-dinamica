import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "@/components/UI/Tabs/Tabs";
test("Tabs: comportamento acessível", () => {
	render(
		<Tabs
			items={[
				{ label: "A", content: "Primeiro" },
				{ label: "B", content: "Segundo" },
			]}
		/>,
	);
	fireEvent.click(screen.getByRole("tab", { name: "B" }));
	expect(screen.getByRole("tabpanel")).toHaveTextContent("Segundo");
	expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
});
