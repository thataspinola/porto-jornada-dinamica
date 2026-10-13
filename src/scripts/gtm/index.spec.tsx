import { render } from "@testing-library/react";
import { GoogleTagManager } from "./index";
test("não injeta script sem habilitação", () =>
	expect(
		render(<GoogleTagManager id="GTM-ABC" />).container,
	).toBeEmptyDOMElement());
