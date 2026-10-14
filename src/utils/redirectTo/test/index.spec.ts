import { redirectTo } from "@/utils/redirectTo/index";
test("mantém a jornada ao navegar entre steps", () => {
	window.history.replaceState(
		{},
		"",
		"/contrate/financiamento-de-veiculos/cpf",
	);
	redirectTo("/placa");
	expect(window.location.pathname).toBe(
		"/contrate/financiamento-de-veiculos/placa",
	);
});
test("bloqueia esquemas executáveis", () =>
	expect(() => redirectTo("javascript:alert(1)")).toThrow("Destino inválido"));
