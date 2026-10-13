import { centsToReais } from "./index";
test("centsToReais: transforma entrada sem incluir dados extras", () => {
	expect(centsToReais(1050)).toEqual(10.5);
});
