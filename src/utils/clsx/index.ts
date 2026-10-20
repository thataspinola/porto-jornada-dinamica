/**
 * Utilitário para construir strings de classes CSS condicionalmente.
 * Permite combinar nomes de classes fixas, expressões lógicas e objetos
 * onde a chave é o nome da classe e o valor é um booleano que determina sua inclusão.
 * @param {...(string | undefined | null | false | Record<string, boolean>)} args
 * Uma lista de argumentos que podem ser strings, valores falsy ou objetos de mapeamento.
 * @returns {string} Uma string contendo todos os nomes de classes válidos separados por espaço.
 * @example
 * // Uso básico com strings e lógica
 * clsx('btn', isPrimary && '--primary', isLarge ? '--large' : '--small');
 * // "btn --primary --large"
 * @example
 * // Uso com objetos (Mapeamento de estados)
 * clsx('checkbox', {
 * '--checked': isChecked,
 * '--disabled': isDisabled
 * });
 * // Se isChecked for true: "checkbox --checked"
 */
export function clsx(
  ...args: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  return args
    .flatMap((arg) => {
      if (!arg) return []
      if (typeof arg === 'string') return [arg]

      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      }

      return []
    })
    .join(' ')
}
