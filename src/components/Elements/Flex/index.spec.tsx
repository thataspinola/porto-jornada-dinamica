import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Flex } from "./index";

jest.mock("./styles.module.scss", () => ({
	flex: "flex-class",
	inline: "inline-class",
}));

describe("Flex", () => {
	it("deve renderizar corretamente com valores padrão", () => {
		render(
			<Flex>
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toBeInTheDocument();
		expect(container).toHaveClass("flex-class");

		expect(container).toHaveStyle({
			flexDirection: "row",
			alignItems: "stretch",
			justifyContent: "flex-start",
			flexWrap: "nowrap",
		});

		expect(container).toHaveTextContent("Item 1");
		expect(container).toHaveTextContent("Item 2");
	});

	it("deve renderizar com direção column", () => {
		render(
			<Flex direction="column">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			flexDirection: "column",
		});
	});

	it("deve renderizar com alinhamento center", () => {
		render(
			<Flex align="center">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			alignItems: "center",
		});
	});

	it("deve renderizar com justificação space-between", () => {
		render(
			<Flex justify="space-between">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			justifyContent: "space-between",
		});
	});

	it("deve renderizar com wrap", () => {
		render(
			<Flex wrap="wrap">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			flexWrap: "wrap",
		});
	});

	it("deve renderizar com gap", () => {
		render(
			<Flex gap="1rem">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			gap: "1rem",
		});
	});

	it("deve renderizar como inline-flex quando inline=true", () => {
		render(
			<Flex inline>
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveClass("inline-class");
	});

	it("deve renderizar com elemento HTML personalizado", () => {
		render(
			<Flex as="section">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		// Usar type assertion para evitar erro de TypeScript
		if (container) {
			expect(container.tagName.toLowerCase()).toBe("section");
		}
	});

	it("deve aplicar classes CSS adicionais", () => {
		render(
			<Flex className="custom-class">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveClass("custom-class");
		expect(container).toHaveClass("flex-class");
	});

	it("deve aplicar estilos inline adicionais", () => {
		render(
			<Flex style={{ color: "red" }}>
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({ color: "red" });
	});

	it("deve combinar múltiplas propriedades flex", () => {
		render(
			<Flex direction="column" align="center" justify="space-between" wrap="wrap" gap="2rem">
				<div>Item 1</div>
				<div>Item 2</div>
			</Flex>
		);

		const element = screen.getByText("Item 1");
		const container = element.parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveStyle({
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "space-between",
			flexWrap: "wrap",
			gap: "2rem",
		});
	});

	it("deve renderizar com texto", () => {
		render(<Flex>Texto de teste</Flex>);

		// O texto é renderizado diretamente no container Flex
		const element = screen.getByText("Texto de teste");
		expect(element).toBeInTheDocument();

		// Neste caso, o elemento é o próprio container Flex
		expect(element).toHaveClass("flex-class");
	});
});
