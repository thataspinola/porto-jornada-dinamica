import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiSchema } from './elementUi.schemas'

const productTextSchema = z.object(typographyUiSchema)

export const productsListElementSchema = baseElementSchema.extend({
  type: z.literal('PRODUCT_LIST'),
  config: z.object({
    label: productTextSchema.optional(),
    value: productTextSchema.optional(),
  }),
})
