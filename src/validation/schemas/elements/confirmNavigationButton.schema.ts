import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { buttonUiFields } from './elementUi.schemas'

export const confirmNavigationButtonElementSchema = baseElementSchema.extend({
  type: z.literal('CONFIRM_NAVIGATION_BUTTON'),
  config: z.object({
    label: z.string(),
    url: z.string(),
    ...buttonUiFields,
    dialog: z.object({
      title: z.string(),
      description: z.string().optional(),
      confirmLabel: z.string(),
      cancelLabel: z.string(),
    }),
  }),
})
