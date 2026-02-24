/**
 * Localiza os dados de um passo específico da jornada e calcula metadados de navegação.
 * * @param {any[]} steps - Array de objetos contendo a configuração de todos os passos da jornada.
 * @param {string} currentSlug - O slug (identificador amigável) do passo que se deseja encontrar.
 * * @returns {Object|null} Retorna um objeto com os dados do passo e metadados, ou null caso o slug não seja encontrado.
 * * @property {any} step - O objeto de configuração original do passo encontrado.
 * @property {number} position - O índice (base 0) do passo dentro do array.
 * @property {boolean} isFirst - Indica se este é o primeiro passo da jornada.
 * @property {boolean} isLast - Indica se este é o último passo da jornada.
 * @property {number} progress - Valor percentual (0 a 100) representando o progresso atual.
 * * @example
 * const stepData = getStepData(pageConfig.steps, 'placa');
 * if (stepData) {
 * console.log(stepData.progress); // 40
 * console.log(stepData.isLast);   // false
 * }
 */
export const getStepData = (steps: any[], currentSlug: string) => {
  const index = steps.findIndex((s) => s.slug === currentSlug);

  if (index === -1) return null;

  return {
    step: steps[index],
    position: index,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    // Cálculo do progresso baseado na posição atual em relação ao total
    progress: ((index + 1) / steps.length) * 100,
  };
};
