import { render, screen, fireEvent } from "@testing-library/react";
import { IconContentList } from "./IconContentList";
test("IconContentList: comportamento acessível", () => {
	render(
		<IconContentList
			items={[
				{ id: "1", content: "A" },
				{ id: "2", content: "B" },
			]}
		/>,
	);
	expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
