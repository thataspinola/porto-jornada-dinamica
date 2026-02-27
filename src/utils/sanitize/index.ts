import sanitizeHtml from "sanitize-html";

/**
 * Utilitário para sanitização e limpeza de dados de entrada.
 * Focado em garantir a integridade dos dados antes de salvar no Store ou enviar para APIs.
 */
export const sanitize = {
	/**
	 * Remove todos os caracteres que não sejam letras (incluindo acentuadas) ou espaços.
	 * Útil para nomes de pessoas e descrições simples.
	 * @param {string} value - O texto original.
	 * @returns {string} Texto apenas com letras e espaços, com trim aplicado.
	 * @example sanitize.text("João @ Silva 123!") // "João Silva"
	 */
	text: (value: string): string => {
		return value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "").trim();
	},

	/**
	 * Mantém apenas os dígitos numéricos.
	 * IMPORTANTE: Retorna string para preservar zeros à esquerda (essencial para CEP e CPF).
	 * @param {string} value - O texto original.
	 * @returns {string} String contendo apenas números.
	 * @example sanitize.digits("012.345-67") // "01234567"
	 */
	digits: (value: string): string => {
		return value.replace(/\D/g, "");
	},

	/**
	 * Transforma a entrada em um Number, removendo qualquer caractere não numérico.
	 * @param {string} value - O texto original.
	 * @returns {number | string} O número convertido ou string vazia se inválido.
	 * @example sanitize.number("R$ 1.500,00") // 150000
	 */
	number: (value: string): number | string => {
		const newValue = value?.replace(/\D/g, "").trim();
		if (newValue === "") return "";
		return Number(newValue);
	},

	/**
	 * Sanitiza strings de e-mail, forçando minúsculas e removendo caracteres proibidos em protocolos SMTP.
	 * @param {string} value - O e-mail original.
	 * @returns {string} E-mail em lowercase e limpo.
	 */
	email: (value: string): string => {
		return value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9@._-]/g, "");
	},

	/**
	 * Remove todos os caracteres especiais, mantendo apenas letras (com acentos) e números.
	 * Remove espaços.
	 * @param {string} value - O texto original.
	 * @returns {string} Texto alfanumérico contínuo.
	 */
	alphanumeric: (value: string): string => {
		return value.replace(/[^a-zA-Z0-9\u00C0-\u00FF]/g, "");
	},

	/**
	 * Remove todas as tags HTML e atributos de uma string para evitar ataques XSS.
	 * @param {string} input - String que pode conter HTML.
	 * @returns {string} Texto puro sem tags.
	 */
	dom: (input: string): string => {
		return sanitizeHtml(input, {
			allowedTags: [],
			allowedAttributes: {},
		});
	},

	/**
	 * Remove absolutamente todos os caracteres especiais e acentos, mantendo apenas letras e números básicos.
	 * Ideal para nomes de arquivos ou chaves de integração.
	 * @param {string} value - O texto original.
	 * @returns {string} Texto sem acentos e sem caracteres especiais.
	 * @example sanitize.pureAscii("Atenção!") // "Atencao"
	 */
	pureAscii: (value: string): string => {
		return value
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // Remove acentos
			.replace(/[^a-zA-Z0-9]/g, ""); // Remove especiais
	},
};
