import type { GtmEvent, Item } from '@/utils/pushEvent'

type PromotionElement = {
  type: string
  config: Record<string, unknown>
}

type PromotionInput = {
  wrapperId: string
  journeySlug: string
  children: readonly PromotionElement[]
}

type PromotionEvent = Extract<GtmEvent, { event: 'view_promotion' }>

export function buildRecommendedProductsPromotion({
  wrapperId,
  journeySlug,
  children,
}: PromotionInput): PromotionEvent | undefined {
  if (
    wrapperId !== 'cpf-recommended-products-wrapper' ||
    ![
      'emprestimo-com-garantia-de-veiculo',
      'financiamento-de-veiculos',
    ].includes(journeySlug)
  )
    return undefined

  const items: Item[] = []
  for (const child of children) {
    if (child.type !== 'COMPOSABLE_CARD') continue
    const parts = child.config.children as
      | { element: PromotionElement }[]
      | undefined
    if (!Array.isArray(parts)) return undefined
    const elements = parts.map((part) => part.element)
    const texts = elements.filter((element) => element.type === 'TEXT')
    const navigation = elements.find((element) => element.type === 'NAVIGATION')
    const title = texts[0]?.config.text
    const description = texts[1]?.config.text
    const url = navigation?.config.url
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof description !== 'string' ||
      !description.trim() ||
      typeof url !== 'string' ||
      !url.trim()
    )
      return undefined
    items.push({
      item_id: url,
      item_name: title,
      item_brand: 'porto',
      creative_name: 'produtos-recomendados',
      creative_slot: 'cpf-negativa-elegibilidade',
      promotion_name: description,
      affiliation: 'porto',
    })
  }
  if (items.length !== 2) return undefined
  return {
    event: 'view_promotion',
    evAction: 'ecommerce:visualizar:promocao:sucesso',
    items,
  }
}
