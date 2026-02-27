import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from ".";

const makeSut = (props: any = {}) => {
  const defaultProps = {
    "data-testid": "checkbox",
    ...props,
  };

  const sut = render(<Checkbox {...defaultProps} {...props} />);

  const root = screen.getByTestId(defaultProps["data-testid"]);
  const label = root.querySelector(".checkbox__label");
  const svg = root.querySelector("svg.checkbox__svg");
  const input = root.querySelector(".checkbox__input");

  return {
    sut: sut.container.children[0],
    props: defaultProps,
    label,
    svg,
    input,
  };
};

describe("Checkbox", () => {
  it("Should render correctly with default values", () => {
    const { sut, svg, label } = makeSut();


    expect(sut).toBeInTheDocument();
    expect(sut).toHaveClass("checkbox__root");
    expect(sut).toHaveClass("--default");
    expect(svg).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toBeEmptyDOMElement();
  });

  it("Should display label text correctly", () => {
    const { label } = makeSut({ label: "Aceito os termos" });

    expect(label).toHaveTextContent("Aceito os termos");
    expect(label).toHaveClass("checkbox__label");
  });

  it("Should be able apply the 'checked' variant", () => {
    const { sut } = makeSut({});

    fireEvent.click(sut);

    expect(sut).toHaveClass("--checked");
  });

  it("Should be able apply the 'disabled' variant", () => {
    const { sut } = makeSut({ disabled: true });
    expect(sut).toHaveClass("--disabled");
  });

  it("Should apply additional CSS classes", () => {
    const { sut } = makeSut({ className: "custom-class" });
    expect(sut).toHaveClass("custom-class");
  });

  it("Should pass HTML attributes to the root element", () => {
    const { sut } = makeSut({
      "aria-label": "Caixa de seleção",
      role: "checkbox",
      "aria-checked": "false",
    });

    expect(sut).toHaveAttribute("aria-label", "Caixa de seleção");
    expect(sut).toHaveAttribute("role", "checkbox");
    expect(sut).toHaveAttribute("aria-checked", "false");
  });

  it("Should apply the title correctly in the visual input", () => {
    const title = "Título de exemplo";
    const { input } = makeSut({ title });

    expect(input).toHaveAttribute("title", title);
    expect(input).toHaveClass("checkbox__input");
  });

  it("Should render HTML in label using dangerouslySetInnerHTML", () => {
    const { label } = makeSut({ label: "Aceito os <strong>termos</strong>" });
    expect(label?.innerHTML).toContain("<strong>termos</strong>");
  });

  it("Should renders SVG with correct attributes", () => {
    const { svg } = makeSut();

    expect(svg).toHaveAttribute("width", "21");
    expect(svg).toHaveAttribute("height", "20");
    expect(svg).toHaveAttribute("viewBox", "0 0 21 20");
    expect(svg).toHaveAttribute("fill", "none");

    const path = svg?.querySelector("path");
    expect(path).toHaveAttribute("stroke", "white");
    expect(path).toHaveAttribute("stroke-width", "3");
    expect(path).toHaveAttribute("stroke-linecap", "round");
    expect(path).toHaveAttribute("stroke-linejoin", "round");
  });
});
