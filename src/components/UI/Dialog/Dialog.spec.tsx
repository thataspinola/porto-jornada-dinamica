import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import type React from "react";
import { Dialog } from "./Dialog";

// Mock createPortal para permitir testes
jest.mock("react-dom", () => ({
	...jest.requireActual("react-dom"),
	createPortal: (node: React.ReactNode) => node,
}));

// Mock dos estilos
jest.mock("./Dialog.scss", () => ({}));

// Mock do utilitário clsx
const mockClsx = jest.fn((...args: unknown[]) =>
	args.filter(Boolean).join(" "),
);
jest.mock("@/utils", () => ({
	clsx: (...args: unknown[]) => mockClsx(...args),
}));

describe("<Dialog />", () => {
	beforeEach(() => {
		mockClsx.mockClear();
	});
	it("deve renderizar quando isOpen é true", () => {
		render(
			<Dialog isOpen={true} title="Título do Diálogo">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(mockClsx).toHaveBeenCalledWith("dialog", "dialog__overlay", {
			"dialog__overlay--open": true,
		});

		expect(mockClsx).toHaveBeenCalledWith("dialog__box", "--small");

		expect(screen.getByText("Título do Diálogo")).toBeInTheDocument();
		expect(screen.getByText("Conteúdo do diálogo")).toBeInTheDocument();
	});

	it("não deve renderizar quando isOpen é false", () => {
		render(
			<Dialog isOpen={false} title="Título do Diálogo">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(mockClsx).toHaveBeenCalledWith("dialog", "dialog__overlay", {
			"dialog__overlay--open": false,
		});
	});

	it("deve aplicar a variante correta", () => {
		render(
			<Dialog isOpen={true} variant="medium">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(mockClsx).toHaveBeenCalledWith("dialog__box", "--medium");
	});

	it("deve renderizar o título corretamente", () => {
		render(
			<Dialog isOpen={true} title="Título de Teste">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(screen.getByText("Título de Teste")).toBeInTheDocument();
		expect(screen.getByText("Título de Teste")).toHaveClass("dialog__title");
	});

	it("deve renderizar o subtítulo corretamente", () => {
		render(
			<Dialog isOpen={true} subtitle="Subtítulo de Teste">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(screen.getByText("Subtítulo de Teste")).toBeInTheDocument();
		expect(screen.getByText("Subtítulo de Teste")).toHaveClass(
			"dialog__subtitle",
		);
	});

	it("deve renderizar a descrição corretamente", () => {
		render(
			<Dialog isOpen={true} description="Descrição de Teste">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(screen.getByText("Descrição de Teste")).toBeInTheDocument();
		expect(screen.getByText("Descrição de Teste")).toHaveClass(
			"dialog__description",
		);
	});

	it("deve renderizar o ícone corretamente", () => {
		render(
			<Dialog
				isOpen={true}
				icon={{ iconName: "info" }}
				data-testid="dialog-container"
			>
				Conteúdo do diálogo
			</Dialog>,
		);

		// Verificar se o clsx foi chamado corretamente
		expect(mockClsx).toHaveBeenCalledWith("dialog", "dialog__overlay", {
			"dialog__overlay--open": true,
		});

		// Verificar se o ícone X do Lucide React está presente
		const container = screen.getByTestId("dialog-container");
		const iconElement = container.querySelector(".dialog__icon");
		expect(iconElement).toBeInTheDocument();
	});

	it("deve renderizar o conteúdo principal corretamente", () => {
		render(
			<Dialog isOpen={true}>
				<p data-testid="dialog-content">Conteúdo principal</p>
			</Dialog>,
		);

		expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
		expect(
			screen.getByTestId("dialog-content").closest(".dialog__body"),
		).toBeInTheDocument();
	});

	it("deve renderizar o rodapé corretamente", () => {
		render(
			<Dialog
				isOpen={true}
				footer={
					<button type="button" data-testid="footer-button">
						Botão de Rodapé
					</button>
				}
			>
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(screen.getByTestId("footer-button")).toBeInTheDocument();
		expect(
			screen.getByTestId("footer-button").closest(".dialog__footer"),
		).toBeInTheDocument();
	});

	it("deve aplicar a variante de rodapé corretamente", () => {
		render(
			<Dialog
				isOpen={true}
				footerVariant="column"
				footer={<button type="button">Botão de Rodapé</button>}
			>
				Conteúdo do diálogo
			</Dialog>,
		);

		const clsxCalls = mockClsx.mock.calls;
		const footerClsxCall = clsxCalls.find((call) =>
			call.includes("dialog__footer"),
		);
		expect(footerClsxCall).toEqual(["dialog__footer", "--column"]);
	});

	it("deve chamar onClose quando o overlay é clicado", () => {
		const handleClose = jest.fn();
		render(
			<Dialog isOpen={true} onClose={handleClose} data-testid="dialog-overlay">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(mockClsx).toHaveBeenCalledWith("dialog", "dialog__overlay", {
			"dialog__overlay--open": true,
		});

		const overlay = screen.getByTestId("dialog-overlay");
		fireEvent.click(overlay);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it("deve aplicar classes CSS adicionais", () => {
		render(
			<Dialog isOpen={true} className="custom-dialog">
				Conteúdo do diálogo
			</Dialog>,
		);

		expect(mockClsx).toHaveBeenCalledWith("dialog", "dialog__overlay", {
			"dialog__overlay--open": true,
		});
	});
});
