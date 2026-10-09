import { pushEvent } from "./index";
describe("pushEvent view_promotion", () => {
	beforeEach(() => {
		(
			window as Window & {
				dataLayer?: unknown[];
			}
		).dataLayer = [];
	});
	it("omite campos monetários ausentes e define a ação de sucesso", () => {
		expect(pushEvent({ event: "view_promotion", items: [] })).toBe(true);
		expect(
			(
				window as Window & {
					dataLayer?: unknown[];
				}
			).dataLayer,
		).toEqual([
			{
				event: "view_promotion",
				ev_action: "ecommerce:visualizar:promocao:sucesso",
				items: [],
			},
		]);
	});
	it("preserva valores monetários explícitos, inclusive zero, e a ação de erro", () => {
		pushEvent({
			event: "view_promotion",
			ev_action: "ecommerce:visualizar:promocao:alert",
			items: [],
			currency: "BRL",
			value: 0,
		});
		expect(
			(
				window as Window & {
					dataLayer?: unknown[];
				}
			).dataLayer?.[0],
		).toMatchObject({
			currency: "BRL",
			value: 0,
			ev_action: "ecommerce:visualizar:promocao:alert",
		});
	});
});
