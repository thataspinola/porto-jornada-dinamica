import { render } from "@testing-library/react";
import { LexisScript } from "./index";
test("não injeta script sem habilitação", () =>
	expect(
		render(<LexisScript src="https://example.com/script.js" />).container,
	).toBeEmptyDOMElement());
