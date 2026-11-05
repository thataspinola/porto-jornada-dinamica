import { buildRecommendedProductsPromotion } from '@/utils/buildRecommendedProductsPromotion'
import {
  journeys,
  recommendedProducts
} from '../../../fixtures/recommendedProducts'

describe('buildRecommendedProductsPromotion', () => {
  it.each(journeys)('monta os dois produtos da jornada $slug', (journey) => {
    const event = buildRecommendedProductsPromotion(
      recommendedProducts(journey),
      journey.slug
    )
    expect(event).toEqual({
      event: 'view_promotion',
      evAction: 'ecommerce:visualizar:promocao:sucesso',
      items: [
        {
          item_id: 'https://www.portoseguro.com.br/emprestimo-consignado',
          item_name: 'Empréstimo Consignado',
          item_brand: 'porto',
          creative_name: 'produtos-recomendados',
          creative_slot: 'cpf-negativa-elegibilidade',
          promotion_name:
            'Crédito com as menores taxas e toda a segurança Porto Bank.',
          affiliation: 'porto'
        },
        {
          item_id: 'https://www.portoseguro.com.br/emprestimo-pessoal-cartao',
          item_name: 'Empréstimo Pessoal',
          item_brand: 'porto',
          creative_name: 'produtos-recomendados',
          creative_slot: 'cpf-negativa-elegibilidade',
          promotion_name:
            'Dinheiro na hora direto na sua conta para usar como quiser.',
          affiliation: 'porto'
        }
      ]
    })
  })

  it.each([
    undefined,
    'seguro-residencial',
    'reff',
    'fcdc'
  ])('ignora jornada fora do escopo: %s', (slug) => {
    expect(
      buildRecommendedProductsPromotion(recommendedProducts(), slug)
    ).toBeUndefined()
  })

  it.each([
    null,
    [],
    {},
    { type: 'GRID', id: 'cpf-recommended-products-wrapper' },
    { type: 'CONDITIONAL_WRAPPER', id: 'outro' }
  ])('ignora outro bloco: %j', (element) => {
    expect(
      buildRecommendedProductsPromotion(element, journeys[0].slug)
    ).toBeUndefined()
  })

  it('não envia um evento parcial com card incompleto', () => {
    const block = {
      id: 'cpf-recommended-products-wrapper',
      type: 'CONDITIONAL_WRAPPER',
      config: {
        children: [
          { type: 'COMPOSABLE_CARD', config: { children: [] } },
          { type: 'COMPOSABLE_CARD', config: { children: [] } }
        ]
      }
    }
    expect(
      buildRecommendedProductsPromotion(block, journeys[0].slug)
    ).toBeUndefined()
  })

  it('não envia blocos vazios ou com quantidade diferente de dois cards', () => {
    for (const config of [
      {},
      { children: [] },
      { children: [null, 'invalid'] }
    ]) {
      expect(
        buildRecommendedProductsPromotion(
          {
            id: 'cpf-recommended-products-wrapper',
            type: 'CONDITIONAL_WRAPPER',
            config
          },
          journeys[0].slug
        )
      ).toBeUndefined()
    }
  })
})
