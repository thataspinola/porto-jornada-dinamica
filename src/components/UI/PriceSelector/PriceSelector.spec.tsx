import { render, screen, fireEvent } from "@testing-library/react";
import { PriceSelector } from "./PriceSelector";
test("PriceSelector: comportamento acessível", () => {
	const onChange = jest.fn();
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
