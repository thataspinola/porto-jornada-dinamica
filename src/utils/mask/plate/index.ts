/**
 * Aplica máscara de placa de veículo (AAA-0000 ou AAA0A00).
 * Converte para maiúsculas e limita a 7 caracteres alfanuméricos.
 * * @param {string} value - Valor bruto do input
 * @returns {string} Valor formatado
 */
export const maskLicensePlate = (value: string): string => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7)
    .replace(/^([A-Z]{3})([0-9A-Z]{1,4})$/, "$1-$2");
};
