import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { ProgressBar } from "./index";

type MakeSut = {
	initialValue?: number;
	value: number;
	color?: string;
	dataTestId?: string;
};

const makeSut = ({ value, initialValue = 0, color = "rgb(0, 70, 192)", dataTestId }: MakeSut) => {
	return render(
		<ProgressBar
			initialValue={initialValue}
			value={value}
			color={color}
			data-testid={dataTestId ? dataTestId : "progress-bar"}
		/>
	);
};

describe("ProgressBar", () => {
	it("Should render correctly with default values", () => {
		makeSut({ value: 50 });

		const progressBar = screen.getByTestId("progress-bar");
		const progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("role", "progressbar");
		expect(progressBar).toHaveAttribute("aria-label", "barra de progresso");
		expect(progressBar).toHaveAttribute("aria-valuenow", "50");
		expect(progressBar).toHaveAttribute("aria-valuemin", "0");
		expect(progressBar).toHaveAttribute("aria-valuemax", "100");
		expect(progressBar).toHaveAttribute("aria-valuetext", "50%");
		expect(progressBar).toHaveAttribute("tabindex", "0");
		expect(progressBarFill).toHaveStyle({
			width: "50%",
			backgroundColor: "#0046c0",
		});
	});

	it("Should render with custom initial value", () => {
		makeSut({ initialValue: 20, value: 80 });

		const progressBar = screen.getByTestId("progress-bar");
		const progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("aria-valuenow", "80");
		expect(progressBarFill).toHaveStyle({
			width: "80%",
			backgroundColor: "rgb(0, 70, 192)",
		});
	});

	it("Should render with custom color", () => {
		makeSut({ initialValue: 20, value: 50, color: "#FF0000" });

		const progressBar = screen.getByTestId("progress-bar");
		const progressBarFill = progressBar.children[0];

		expect(progressBarFill).toHaveStyle({
			width: "50%",
			backgroundColor: "#FF0000",
		});
	});

	it("Should normalize values ​​outside the range 0-100", () => {
		const { rerender } = makeSut({ value: 120, dataTestId: "progress-bar" });

		let progressBar = screen.getByTestId("progress-bar");
		let progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("aria-valuenow", "100");
		expect(progressBarFill).toHaveStyle({
			width: "100%",
			backgroundColor: "rgb(0, 70, 192)",
		});

		// @ts-ignore
		rerender(<ProgressBar value={-20} data-testid="progress-bar" />);

		progressBar = screen.getByTestId("progress-bar");
		progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("aria-valuenow", "0");
		expect(progressBarFill).toHaveStyle({
			width: "0%",
			backgroundColor: "rgb(0, 70, 192)",
		});
	});

	it("Should update the value when the value prop changes", () => {
		const { rerender } = makeSut({ value: 30 });

		let progressBar = screen.getByTestId("progress-bar");
		let progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("aria-valuenow", "30");
		expect(progressBarFill).toHaveStyle({
			width: "30%",
			backgroundColor: "rgb(0, 70, 192)",
		});

		rerender(<ProgressBar value={70} data-testid="progress-bar" />);

		progressBar = screen.getByTestId("progress-bar");
		progressBarFill = progressBar.children[0];

		expect(progressBar).toHaveAttribute("aria-valuenow", "70");
		expect(progressBarFill).toHaveStyle({
			width: "70%",
			backgroundColor: "rgb(0, 70, 192)",
		});
	});

	it("Should allow customization of data-testid", () => {
		makeSut({ value: 50, dataTestId: "custom-test-id" });

		expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
	});
});
