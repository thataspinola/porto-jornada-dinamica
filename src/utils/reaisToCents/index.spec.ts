import { reaisToCents } from "./index";
test("reaisToCents: transforma entrada sem incluir dados extras", () => {
	expect(reaisToCents(10.555)).toEqual(1056);
});
