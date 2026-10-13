import { dispatchAlert } from "./dispatchAlert";
test("alerta não se confunde com impressão", () => {
	window.dataLayer = [];
	dispatchAlert("view_promotion");
	expect(window.dataLayer).toEqual([
		{
			event: "view_promotion",
			ev_action: "ecommerce:visualizar:promocao:alert",
		},
	]);
});
