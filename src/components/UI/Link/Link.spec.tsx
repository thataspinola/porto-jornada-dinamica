import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type React from "react";
import type { ComponentProps } from "react";
import { Link } from "./Link";

jest.mock("./Link.scss", () => ({}));

jest.mock("next/link", () => {
	return function NextLink({
		children,
		className,
		...props
	}: {
		children: React.ReactNode;
		className?: string;
		href: string;
		[key: string]: unknown;
	}) {
		return (
			<a className={className} {...props}>
				{children}
			</a>
		);
	};
});

jest.mock("@/utils", () => ({
	clsx: (...args: unknown[]) => {
		return args
			.map((arg) => {
				if (typeof arg === "string") return arg;
				if (typeof arg === "object" && arg !== null) {
					return Object.entries(arg)
						.filter(([_, value]) => Boolean(value))
						.map(([key]) => key)
						.join(" ");
				}
				return "";
			})
			.filter(Boolean)
			.join(" ");
	},
}));

const makeSut = (props: Partial<ComponentProps<typeof Link>> = {}) => {
	const result = render(
		<Link href="/example" {...props}>
			{props.children || "Link text"}
		</Link>,
	);

	return {
		...result,
		link: screen.getByRole("link"),
	};
};

describe("Link", () => {
	it("should render correctly with default values", () => {
		const { link } = makeSut({ href: "/example", children: "Example Link" });

		expect(link).toBeInTheDocument();
		expect(link).toHaveClass("link");
		expect(link).toHaveClass("--insurance-primary");
		expect(link).toHaveClass("--large");
		expect(link).toHaveClass("--fluid");
		expect(link).toHaveAttribute("href", "/example");
		expect(link).toHaveAttribute("target", "_self");
		expect(link).toHaveTextContent("Example Link");
	});

	it("should render with custom variant", () => {
		const { link } = makeSut({ variant: "disabled" });

		expect(link).toHaveClass("--disabled-primary");
		expect(link).not.toHaveClass("--insurance-primary");
	});

	it("should render with custom style", () => {
		const { link } = makeSut({ styles: "secondary" });

		expect(link).toHaveClass("--insurance-secondary");
		expect(link).not.toHaveClass("--insurance-primary");
	});

	it("should render with custom size", () => {
		const { link } = makeSut({ size: "small" });

		expect(link).toHaveClass("--small");
		expect(link).not.toHaveClass("--large");
	});

	it("should render with custom width", () => {
		const { link } = makeSut({ width: "fluid" });

		expect(link).toHaveClass("--fluid");
	});

	it("should render as disabled", () => {
		const { link } = makeSut({ disabled: true });

		expect(link).toHaveClass("--disabled-primary");
		expect(link).not.toHaveClass("--insurance-primary");
		expect(link).toHaveAttribute("disabled");
	});

	it("should apply custom CSS classes", () => {
		const { link } = makeSut({ className: "custom-class" });

		expect(link).toHaveClass("custom-class");
		expect(link).toHaveClass("link");
	});

	it("should pass additional HTML attributes to the link element", () => {
		const { link } = makeSut({
			"aria-label": "Example Link",
			title: "Link title",
			rel: "nofollow",
		} as any);

		expect(link).toHaveAttribute("aria-label", "Example Link");
		expect(link).toHaveAttribute("title", "Link title");
		expect(link).toHaveAttribute("rel", "nofollow");
	});

	it("should combine multiple custom properties", () => {
		const { link } = makeSut({
			variant: "insurance",
			styles: "ghost",
			size: "small",
			width: "fluid",
			className: "custom-class",
		});

		expect(link).toHaveClass("--insurance-ghost");
		expect(link).toHaveClass("--small");
		expect(link).toHaveClass("--fluid");
		expect(link).toHaveClass("custom-class");
	});

	it("should render with default href when not provided", () => {
		render(<Link>Link without href</Link>);
		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("href", "#");
	});
});
