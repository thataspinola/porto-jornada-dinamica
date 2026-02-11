/**
 * Interface para dados do GTM
 */
export interface GTMData {
	event?: string;
	category?: string;
	action?: string;
	label?: string;
	value?: string | number;
	[key: string]: any;
}

/**
 * Formata texto para uso no Google Tag Manager
 * Remove acentos, caracteres especiais e converte para lowercase
 * @param text - Texto a ser formatado
 * @returns Texto formatado para GTM
 */
export const formatGtmText = (text: string | undefined): string => {
	if (!text?.trim()) return "";

	return (
		text
			.normalize("NFD")
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u0300-\u036f]/g, "") // Remove acentos
			.toLocaleLowerCase()
			.trim()
			.replace(/(<([^>]+)>)|[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, "") // Remove caracteres especiais e tags HTML
			.split(/\s+/) // Split em qualquer quantidade de espaços
			.join("-")
	);
};
