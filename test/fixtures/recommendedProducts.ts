import reff from '../../public/jsonContent/emprestimo-com-garantia-de-veiculo.json'
import fcdc from '../../public/jsonContent/financiamento-de-veiculos.json'

export const journeys = [reff, fcdc]

export function recommendedProducts(journey: (typeof journeys)[number] = reff) {
  const wrapper = journey.steps
    .flatMap((step) => step.elements)
    .find((element) => element.id === 'cpf-recommended-products-wrapper')
  if (!wrapper) throw new Error('Bloco de produtos ausente na jornada')
  return structuredClone(wrapper)
}
