export type Installment = { count: number; amount: number; total?: number };
export function useInstallments(options: Installment[], selected: number) {
	return options.find((option) => option.count === selected);
}
