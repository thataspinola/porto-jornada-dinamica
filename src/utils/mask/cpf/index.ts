/**
 * Applies a Brazilian CPF mask to a string.
 * @param value - The input string to format.
 * @returns The formatted CPF string in the format XXX.XXX.XXX-XX.
 */
export const cpfMask = (value: string): string => {
	const cpfNumbers = value.replace(/\D/g, "").slice(0, 11);

	return cpfNumbers
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{2})$/, "$1-$2");
};
