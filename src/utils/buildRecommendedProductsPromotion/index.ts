import type { GtmEvent, Item } from '../pushEvent/types'

type PromotionEvent = Extract<GtmEvent, { event: 'view_promotion' }>
type Node = Record<string, unknown>

function asNode(value: unknown): Node | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Node)
    : undefined
}

function childrenOf(node: Node): Node[] {
  const children = asNode(node.config)?.children
  if (!Array.isArray(children)) return []

  return children.flatMap((child) => {
    const entry = asNode(child)
    const element = asNode(entry?.element) ?? entry
    return element ? [element] : []
  })
}

function collectCards(node: Node): Node[] {
  if (node.type === 'COMPOSABLE_CARD') return [node]
  if (
    !['CONDITIONAL_WRAPPER', 'GRID', 'GRID_ITEM'].includes(String(node.type))
  ) {
    return []
  }
  return childrenOf(node).flatMap(collectCards)
}

function buildItem(card: Node): Item | undefined {
  const children = childrenOf(card)
  const texts = children
    .filter((child) => child.type === 'TEXT')
    .map((child) => asNode(child.config)?.text)
  const navigation = children.find((child) => child.type === 'NAVIGATION')
  const url = asNode(navigation?.config)?.url
  const [title, description] = texts

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof description !== 'string' ||
    !description.trim() ||
    typeof url !== 'string' ||
    !url.trim()
  )
    return undefined

  return {
    item_id: url,
    item_name: title,
    item_brand: 'porto',
    creative_name: 'produtos-recomendados',
    creative_slot: 'cpf-negativa-elegibilidade',
    promotion_name: description,
    affiliation: 'porto'
  }
}

export function buildRecommendedProductsPromotion(
  element: unknown,
  journeySlug: unknown
): PromotionEvent | undefined {
  if (
    journeySlug !== 'emprestimo-com-garantia-de-veiculo' &&
    journeySlug !== 'financiamento-de-veiculos'
  )
    return undefined

  const wrapper = asNode(element)
  if (
    wrapper?.type !== 'CONDITIONAL_WRAPPER' ||
    wrapper.id !== 'cpf-recommended-products-wrapper'
  )
    return undefined

  const cards = collectCards(wrapper)
  if (cards.length !== 2) return undefined
  const items = cards.map(buildItem)
  if (items.some((item) => !item)) return undefined

  return {
    event: 'view_promotion',
    evAction: 'ecommerce:visualizar:promocao:sucesso',
    items: items as Item[]
  }
}
