import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes a string by removing special characters and sanitizing HTML.
 * @param dirtyValue - The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitize = (dirtyValue: string): string => {
	const value = String(dirtyValue);
	const valueWithoutSpecialCharacter = value.replace(/[^a-zA-Z0-9@_. ]/g, "");
	return sanitizeHtml(valueWithoutSpecialCharacter);
};
