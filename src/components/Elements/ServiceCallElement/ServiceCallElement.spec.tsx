import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceCallElement } from "./ServiceCallElement";
test("impede chamada quando formulário não está pronto", () => {
	const onCall = jest.fn();
	render(
		<ServiceCallElement
			element={{
				id: "s",
				type: "SERVICE_CALL",
				config: {
					label: "Continuar",
					service: "eligibility",
					targetStepOnSuccess: "/next",
				},
			}}
			canProceed={false}
			onCall={onCall}
		/>,
	);
	fireEvent.click(screen.getByRole("button"));
	expect(onCall).not.toHaveBeenCalled();
});
