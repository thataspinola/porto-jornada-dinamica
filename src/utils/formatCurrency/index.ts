export const formatToCurrency = (value: number | string): string => {
	const formatedValue = value?.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	return formatedValue;
};
