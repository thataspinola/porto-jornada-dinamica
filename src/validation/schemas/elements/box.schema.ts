import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { checkboxElementSchema } from './checkbox.schema'
import { labelValueElementSchema } from './labelValue.schema'
import { navigationElementSchema } from './navigation.schema'
import { productsListElementSchema } from './productList.schema'
import { serviceCallElementSchema } from './serviceCall.schema'
import { textElementSchema } from './text.schema'

export const boxChildSchema = z.discriminatedUnion('type', [
  textElementSchema,
  checkboxElementSchema,
  navigationElementSchema,
  serviceCallElementSchema,
  labelValueElementSchema,
  productsListElementSchema,
])

export const boxElementSchema = baseElementSchema.extend({
  type: z.literal('BOX'),
  config: z.object({
    children: z.array(boxChildSchema).optional().default([]),
  }),
})
