import { toSnakeCase } from "@/utils/toSnakeCase/index";
test("toSnakeCase: transforma entrada sem incluir dados extras", () => {
	expect(toSnakeCase("PortoSeguro Veículos")).toEqual("porto_seguro_veiculos");
});
