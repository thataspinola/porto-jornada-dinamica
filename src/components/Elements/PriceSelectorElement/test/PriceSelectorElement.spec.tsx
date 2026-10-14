import { render, screen, fireEvent } from "@testing-library/react";
import { PriceSelectorElement } from "@/components/Elements/PriceSelectorElement/PriceSelectorElement";
test("PriceSelectorElement: interação", () => {
	render(
		<PriceSelectorElement
			element={{
				id: "x",
				type: "PRICE_SELECTOR",
				config: { name: "price", label: "Valor", min: 0, max: 100 },
			}}
		/>,
	);
	expect(screen.getByRole("slider")).toHaveAttribute("max", "100");
});
