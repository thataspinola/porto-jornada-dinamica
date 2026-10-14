import { reaisToCents } from "@/utils/reaisToCents/index";
test("reaisToCents: transforma entrada sem incluir dados extras", () => {
	expect(reaisToCents(10.555)).toEqual(1056);
});
