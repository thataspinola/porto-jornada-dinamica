import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes a string by removing special characters and sanitizing HTML.
 * @param value - The input string to sanitize.
 * @returns The sanitized string.
 */

export const sanitize = {
  string: (value: string) => {
    return value.replace(/[^a-zA-Z\u00C0-\u00FF\s'-]/g, '');
  },
  number: (value: string) => {
    const newValue = value?.replace(/\D/g, '').trim();

    if (newValue === '') return '';
    return Number(newValue);
  },
  email: (value: string) => {
    const lowerValue = value.toLocaleLowerCase();
    return lowerValue.replace(/[^a-zA-Z0-9@._-]/g, '');
  },
  alphanumeric: (value: string) => {
    return value.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/g, '');
  },
  dom: (input: string) => {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });
  },
};
