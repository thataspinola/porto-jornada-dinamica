import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationElement } from "@/components/Elements/NavigationElement/NavigationElement";
test("navega para o destino declarado", () => {
	const onNavigate = vi.fn();
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
