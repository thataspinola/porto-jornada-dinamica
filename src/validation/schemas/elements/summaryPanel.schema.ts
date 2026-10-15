import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { boxElementSchema } from './box.schema'
import { checkboxElementSchema } from './checkbox.schema'
import { labelValueElementSchema } from './labelValue.schema'
import { navigationElementSchema } from './navigation.schema'
import { textElementSchema } from './text.schema'

const summaryPanelChildSchema = z.discriminatedUnion('type', [
  textElementSchema,
  checkboxElementSchema,
  navigationElementSchema,
  labelValueElementSchema,
  boxElementSchema,
])

export const summaryPanelElementSchema = baseElementSchema.extend({
  type: z.literal('SUMMARY_PANEL'),
  config: z.object({
    children: z.array(summaryPanelChildSchema).optional().default([]),
  }),
})
