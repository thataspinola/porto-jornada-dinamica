export const PRODUCT_ANALYTICS = {
  'financing-loans-vehicle': {
    branchId: 18,
    product: 'financiamento'
  },
  'financing-loans-vehicle-guarantee': {
    branchId: 20,
    product: 'emprestimo-com-garantia-de-veiculo'
  }
} as const

export type JourneyProductId = keyof typeof PRODUCT_ANALYTICS

export function resolveProductAnalytics(product?: string) {
  if (!product) return undefined

  if (product in PRODUCT_ANALYTICS) {
    return PRODUCT_ANALYTICS[product as JourneyProductId]
  }

  return undefined
}
