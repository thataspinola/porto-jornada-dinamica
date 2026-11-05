import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiFields } from './elementUi.schemas'

const productTextSchema = z.object(typographyUiFields)

export const productsListElementSchema = baseElementSchema.extend({
  type: z.literal('PRODUCTS_LIST'),
  config: z.object({
    label: productTextSchema.optional(),
    value: productTextSchema.optional()
  })
})
