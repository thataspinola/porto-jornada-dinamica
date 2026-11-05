import type { JourneyDefinition } from '@/validation/schemas'

type ProductsListElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PRODUCTS_LIST' }
>

export type ProductsListElementProps = {
  element: ProductsListElementType
}
