import { pushLeadEvent } from "./index";
test("registra lead sem dados pessoais", () => {
	window.dataLayer = [];
	pushLeadEvent();
	expect(window.dataLayer).toEqual([{ event: "generate_lead" }]);
});
