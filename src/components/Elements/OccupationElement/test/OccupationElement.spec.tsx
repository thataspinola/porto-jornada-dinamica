import { render, screen, fireEvent } from "@testing-library/react";
import { OccupationElement } from "@/components/Elements/OccupationElement/OccupationElement";
test("OccupationElement: interação", () => {
	render(
		<OccupationElement
			element={{
				id: "x",
				type: "OCCUPATION",
				config: {
					name: "occupation",
					label: "Ocupação",
					options: [{ label: "Dev", value: "dev" }],
				},
			}}
		/>,
	);
	fireEvent.change(screen.getByRole("combobox"), { target: { value: "dev" } });
	expect(screen.getByRole("combobox")).toHaveValue("dev");
});
