import type { Step } from "@/types";
import { render, screen } from "@testing-library/react";
import { Journey } from ".";
import { journeis } from "../../mock";

const vehicleFinancingJourney = journeis["financiamento-de-veiculos"];

const makeSut = ({ slug, step }: { slug: string; step: Step }) => {
	const sut = render(<Journey journeySlug={slug} step={step} />);

	return sut;
};

describe("Journey", () => {
	it("Should be able to render CPF step", async () => {
		const cpfStep = vehicleFinancingJourney.steps[0];
		const sut = makeSut({
			slug: "dados-do-equipamentos",
			step: cpfStep,
		});

		const title = "Qual é o seu CPF?";
		const subtitle =
			"Precisamos dele para confirmar se o financiamento está disponível para você.";
		// ACT
		// await userEvent.click(screen.getByText('Load Greeting'))
		// await screen.findByRole('heading')

		screen.debug(sut.container);

		// ASSERT
		// expect(screen.getByRole('heading')).toHaveTextContent('hello there')
	});
});
