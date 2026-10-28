import { buildRecommendedProductsPromotion } from '@/utils/buildRecommendedProductsPromotion'

function cards() {
  return ['Empréstimo Consignado', 'Empréstimo Pessoal'].map(
    (title, index) => ({
      type: 'COMPOSABLE_CARD',
      config: {
        children: [
          { element: { type: 'TEXT', config: { text: title } } },
          { element: { type: 'TEXT', config: { text: `Descrição ${index}` } } },
          {
            element: {
              type: 'NAVIGATION',
              config: { url: `https://example.test/${index}` },
            },
          },
        ],
      },
    })
  )
}
const input = (journeySlug = 'financiamento-de-veiculos') => ({
  wrapperId: 'cpf-recommended-products-wrapper',
  journeySlug,
  children: cards(),
})
it.each([
  'financiamento-de-veiculos',
  'emprestimo-com-garantia-de-veiculo',
])('monta os dois produtos em uma promoção para %s', (journeySlug) => {
  const result = buildRecommendedProductsPromotion(input(journeySlug))
  expect(result).toEqual({
    event: 'view_promotion',
    evAction: 'ecommerce:visualizar:promocao:sucesso',
    items: cards().map((card, index) => ({
      item_id: `https://example.test/${index}`,
      item_name: card.config.children[0].element.config.text,
      item_brand: 'porto',
      creative_name: 'produtos-recomendados',
      creative_slot: 'cpf-negativa-elegibilidade',
      promotion_name: `Descrição ${index}`,
      affiliation: 'porto',
    })),
  })
  expect(result).not.toHaveProperty('currency')
  expect(result).not.toHaveProperty('value')
})
it('não se aplica a outros wrappers ou jornadas', () => {
  expect(
    buildRecommendedProductsPromotion({ ...input(), wrapperId: 'other' })
  ).toBeUndefined()
  expect(buildRecommendedProductsPromotion(input('other'))).toBeUndefined()
})
it('não envia um único card ou dados incompletos', () => {
  expect(
    buildRecommendedProductsPromotion({
      ...input(),
      children: cards().slice(0, 1),
    })
  ).toBeUndefined()
  const incomplete = cards()
  incomplete[0].config.children.pop()
  expect(
    buildRecommendedProductsPromotion({ ...input(), children: incomplete })
  ).toBeUndefined()
})
