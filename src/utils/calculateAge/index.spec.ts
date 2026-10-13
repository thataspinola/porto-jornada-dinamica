import { calculateAge } from "./index";
test("calculateAge: transforma entrada sem incluir dados extras", () => {
	expect(calculateAge("29/02/2000", new Date(2025, 1, 28))).toEqual(24);
});
