import { createElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChipsImage } from "./ChipsImage";
test("seleciona opção", () => {
	const onChange = jest.fn();
	render(
		createElement(ChipsImage, {
			options: [{ label: "A", value: "a" }],
			onChange,
		}),
	);
	fireEvent.click(screen.getByRole("button"));
	expect(onChange).toHaveBeenCalledWith("a");
});
