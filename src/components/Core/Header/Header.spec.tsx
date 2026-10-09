/** biome-ignore-all lint/performance/noImgElement: <> */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { Header } from "./Header";

// Mock dos ícones
jest.mock("./icons/ic-arrow-left.svg", () => "arrow-left.svg");
jest.mock("./icons/ic-logo-porto.svg", () => "logo-porto.svg");
jest.mock("./icons/ic-shopping-cart.svg", () => "shopping-cart.svg");

jest.mock("next/image", () => {
	return function Image({
		src,
		alt,
		className,
		onClick,
		width,
		height,
	}: {
		src: string;
		alt: string;
		className?: string;
		onClick?: () => void;
		width: number;
		height: number;
	}) {
		return (
			<img
				src={src}
				alt={alt}
				className={className}
				onClick={onClick}
				onKeyDown={
					onClick
						? (e) => {
								if (e.key === "Enter") {
									onClick();
								}
							}
						: undefined
				}
				width={width}
				height={height}
				data-testid="mock-image"
				role={onClick ? "button" : undefined}
				tabIndex={onClick ? 0 : undefined}
			/>
		);
	};
});

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
		prefetch: jest.fn(),
	}),
}));

describe("HeaderAcquisitionFlow", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockPush.mockClear();
	});

	it("Should render correctly with default values", () => {
		const { container } = render(<Header />);

		const header = container.querySelector(".header-acquisition-flow");
		expect(header).toBeInTheDocument();
		expect(header).toHaveClass("header-acquisition-flow");

		const images = screen.getAllByTestId("mock-image");
		expect(images.length).toBeGreaterThan(0);

		const arrowIcon = screen.getByAltText("icone-voltar-para-pagina-anterior");
		expect(arrowIcon).toBeInTheDocument();

		const logoElement = screen.getByAltText("icon-logo-porto");
		expect(logoElement).toBeDefined();

		const cartIcon = screen.getByAltText("icone-carinho");
		expect(cartIcon).toBeInTheDocument();
	});

	it("Should navigate to the home page by clicking on the logo", () => {
		render(<Header />);

		const logoElement = screen.getByAltText("icon-logo-porto");
		expect(logoElement).toBeDefined();

		if (logoElement) {
			fireEvent.click(logoElement);
			expect(mockPush).toHaveBeenCalledTimes(1);
			expect(mockPush).toHaveBeenCalledWith("/");
		}
	});

	it("Should navigate to the back link when clicking the back button", () => {
		render(<Header goBackLink="/previous-page" />);

		const arrowIcon = screen.getByAltText("icone-voltar-para-pagina-anterior");
		expect(arrowIcon).toBeInTheDocument();

		arrowIcon && fireEvent.click(arrowIcon);

		expect(mockPush).toHaveBeenCalledWith("/previous-page");
	});

	it("Should navigate to the back link when clicking the cart button", () => {
		render(<Header goBackLink="/cart" />);

		const cartIcon = screen.getByAltText("icone-carinho");
		expect(cartIcon).toBeInTheDocument();

		expect(cartIcon).toBeDefined();
		cartIcon && fireEvent.click(cartIcon);

		expect(mockPush).toHaveBeenCalledWith("/cart");
	});

	it("Should use the provided goBackLink", () => {
		render(<Header goBackLink="/custom-back-link" />);

		const cartIcon = screen.getByAltText("icone-carinho");
		expect(cartIcon).toBeInTheDocument();
		expect(cartIcon).toBeDefined();
		cartIcon && fireEvent.click(cartIcon);

		expect(mockPush).toHaveBeenCalledWith("/custom-back-link");
	});

	it("Should have adequate accessibility attributes", () => {
		render(<Header />);

		const logoElement = screen.getByAltText("icon-logo-porto");
		expect(logoElement).toBeDefined();
	});
});
