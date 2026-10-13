import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationElement } from "./NavigationElement";
test("navega para o destino declarado", () => {
	const onNavigate = jest.fn();
	render(
		<NavigationElement
			element={{
				id: "n",
				type: "NAVIGATION",
				config: { label: "Ir", url: "/passo" },
			}}
			onNavigate={onNavigate}
			bussines={{}}
		/>,
	);
	fireEvent.click(screen.getByRole("link"));
	expect(onNavigate).toHaveBeenCalledWith("/passo");
});
