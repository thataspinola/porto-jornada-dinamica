export function formatPercentage(value: number) {
	return (
		new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value) +
		"%"
	);
}
