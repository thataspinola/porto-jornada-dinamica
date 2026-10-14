import { render } from "@testing-library/react";
import { GoogleTagManager } from "@/scripts/gtm/index";
test("não injeta script sem habilitação", () =>
	expect(
		render(<GoogleTagManager id="GTM-ABC" />).container,
	).toBeEmptyDOMElement());
