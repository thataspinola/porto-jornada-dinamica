import { resolveStyle } from "@/utils/resolveStyle/index";
test("resolveStyle: transforma entrada sem incluir dados extras", () => {
	expect(resolveStyle({ marginTop: 12, color: " blue " })).toEqual({
		marginTop: 12,
		color: "blue",
	});
});
