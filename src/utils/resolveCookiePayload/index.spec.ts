import { resolveCookiePayload } from "./index";
test("resolveCookiePayload: transforma entrada sem incluir dados extras", () => {
	expect(resolveCookiePayload({ id: "{{cookies.id}}" }, { id: "123" })).toEqual(
		{ id: "123" },
	);
});
