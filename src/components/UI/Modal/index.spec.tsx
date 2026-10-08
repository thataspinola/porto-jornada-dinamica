import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";

import { Modal } from ".";

jest.mock("./styles.scss", () => ({}));

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
	})),
	useSearchParams: jest.fn(() => ({
		get: jest.fn((param) => (param === "modal" ? "test-modal" : null)),
	})),
}));

jest.mock("@/utils", () => {
	const mockClsx = jest.fn((...args: unknown[]) =>
		args.filter(Boolean).join(" "),
	);
	return {
		clsx: mockClsx,
	};
});

describe("Modal", () => {
	const originalLocation = window.location;
	let mockRouterPush: jest.Mock;

	beforeEach(() => {
		mockRouterPush = jest.fn();
		const { useRouter } = require("next/navigation");
		useRouter.mockReturnValue({
			push: mockRouterPush,
		});

		Object.defineProperty(window, "location", {
			writable: true,
			value: { search: "?modal=test-modal" },
		});
	});

	afterEach(() => {
		Object.defineProperty(window, "location", {
			writable: true,
			value: originalLocation,
		});
		jest.clearAllMocks();
	});

	it("deve renderizar corretamente quando aberto", () => {
		const { container } = render(
			<Modal
				name="test-modal"
				title="Título do Modal"
				subtitle="Subtítulo do Modal"
			>
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const modal = container.querySelector(".modal__root");
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveClass("modal__root");
		expect(modal).not.toHaveClass("modal--hidden");

		const overlay = container.querySelector(".modal__overlay");
		expect(overlay).toBeInTheDocument();

		const title = screen.getByText("Título do Modal");
		expect(title).toBeInTheDocument();
		expect(title).toHaveClass("modal__header-title");
		expect(title).toHaveAttribute("id", "modal-title");

		const subtitle = screen.getByText("Subtítulo do Modal");
		expect(subtitle).toBeInTheDocument();
		expect(subtitle).toHaveClass("modal__header-subtitle");
		expect(subtitle).toHaveAttribute("id", "modal-subtitle");

		const content = screen.getByText("Conteúdo do modal");
		expect(content).toBeInTheDocument();

		const closeButton = screen.getByRole("button", { name: /fechar modal/i });
		expect(closeButton).toBeInTheDocument();
		expect(closeButton).toHaveClass("modal__header-icon-close");
		expect(closeButton).toHaveAttribute("aria-label", "Fechar Modal");
	});

	it("deve fechar o modal ao clicar no botão de fechar", () => {
		render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const closeButton = screen.getByRole("button", { name: /fechar modal/i });
		fireEvent.click(closeButton);

		expect(mockRouterPush).toHaveBeenCalledWith("?", { scroll: false });
	});

	it("deve fechar o modal ao clicar no overlay", () => {
		const { container } = render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const overlay = container.querySelector(".modal__overlay");
		expect(overlay).toBeInTheDocument();
		if (overlay) {
			fireEvent.click(overlay);
		}

		expect(mockRouterPush).toHaveBeenCalledWith("?", { scroll: false });
	});

	it("não deve estar visível quando o parâmetro de URL não corresponder ao nome do modal", () => {
		const mockGet = jest.fn((param) =>
			param === "modal" ? "outro-modal" : null,
		);
		const { useSearchParams } = require("next/navigation");
		useSearchParams.mockReturnValue({
			get: mockGet,
		});

		const { container } = render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const overlay = container.querySelector(".modal__overlay");
		expect(overlay).toBeFalsy();
	});

	it("deve renderizar o subtítulo quando fornecido", () => {
		render(
			<Modal
				name="test-modal"
				title="Título do Modal"
				subtitle="Subtítulo do Modal"
			>
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const subtitle = screen.getByText("Subtítulo do Modal");
		expect(subtitle).toBeInTheDocument();
		expect(subtitle).toHaveClass("modal__header-subtitle");
		expect(subtitle).toHaveAttribute("id", "modal-subtitle");
	});

	it("não deve renderizar o subtítulo quando não fornecido", () => {
		const { container } = render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const subtitleElement = container.querySelector("#modal-subtitle");
		expect(subtitleElement).toBeInTheDocument();
		expect(subtitleElement?.textContent).toBe("");
	});

	it("deve ter os atributos de acessibilidade corretos", () => {
		const { container } = render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const modal = container.querySelector(".modal__root");
		expect(modal).toHaveAttribute("aria-modal", "true");
		expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
		expect(modal).toHaveAttribute("aria-describedby", "modal-subtitle");
		expect(modal).toHaveAttribute("tabindex", "-1");
	});

	it("deve renderizar o ícone de fechar corretamente", () => {
		render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const closeButton = screen.getByRole("button", { name: /fechar modal/i });
		expect(closeButton).toBeInTheDocument();
		expect(closeButton).toHaveClass("modal__header-icon-close");
		expect(closeButton).toHaveAttribute("type", "button");
		expect(closeButton).toHaveAttribute("aria-label", "Fechar Modal");

		const svg = closeButton.querySelector("svg");
		expect(svg).toBeInTheDocument();

		if (svg) {
			expect(svg).toHaveAttribute("width", "24");
			expect(svg).toHaveAttribute("height", "24");
			expect(svg).toHaveAttribute("viewBox", "0 0 40 40");
			expect(svg).toHaveAttribute("fill", "none");

			const title = svg.querySelector("title");
			expect(title).toHaveTextContent("Ícone de fechar");
		}
	});

	it("deve impedir a propagação de eventos ao clicar no modal", () => {
		const { container } = render(
			<Modal name="test-modal" title="Título do Modal">
				<p>Conteúdo do modal</p>
			</Modal>,
		);

		const modal = container.querySelector(".modal__root");
		expect(modal).toBeInTheDocument();

		if (modal) {
			const clickEvent = createEvent.click(modal);
			const stopPropagationSpy = jest.spyOn(clickEvent, "stopPropagation");

			fireEvent(modal, clickEvent);

			expect(stopPropagationSpy).toHaveBeenCalled();
		}
	});
});
