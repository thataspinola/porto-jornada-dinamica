import { toSnakeCase } from "./index";
test("toSnakeCase: transforma entrada sem incluir dados extras", () => {
	expect(toSnakeCase("PortoSeguro Veículos")).toEqual("porto_seguro_veiculos");
});
