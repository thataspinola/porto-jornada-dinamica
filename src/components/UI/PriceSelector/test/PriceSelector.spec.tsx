import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PriceSelector } from "@/components/UI/PriceSelector/PriceSelector";
test("PriceSelector: comportamento acessível", () => {
	const onChange = vi.fn();
	render(
		<PriceSelector
			label="Valor"
			value={10}
			min={0}
			max={100}
			onChange={onChange}
		/>,
	);
	fireEvent.change(screen.getByRole("slider"), { target: { value: "20" } });
	expect(onChange).toHaveBeenCalledWith(20);
});
