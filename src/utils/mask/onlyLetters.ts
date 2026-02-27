export function onlyLetterMask(value: string): string {
	if (!value) return "";

	const REGEX_ONLY_LETTERS = /[0-9]/gi;
	const SPECIAL_CHARS = /[^\w\s]/gi;

	return value.replace(REGEX_ONLY_LETTERS, "").normalize("NFD").replace(SPECIAL_CHARS, "");
}
