import { collectCookiesPlaceholders } from "@/utils/collectCookiesPlaceholders/index";
test("collectCookiesPlaceholders: transforma entrada sem incluir dados extras", () => {
	expect(
		collectCookiesPlaceholders({ a: "{{cookies._ga}}", b: "{{cookies._ga}}" }),
	).toEqual(["_ga"]);
});
