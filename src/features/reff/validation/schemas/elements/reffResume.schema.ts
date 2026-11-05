import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'
import { confirmNavigationButtonElementSchema } from '@/validation/schemas/elements/confirmNavigationButton.schema'
import { navigationElementSchema } from '@/validation/schemas/elements/navigation.schema'
import { serviceCallElementSchema } from '@/validation/schemas/elements/serviceCall.schema'

const resumeChildSchema = z.discriminatedUnion('type', [
  navigationElementSchema,
  serviceCallElementSchema,
  confirmNavigationButtonElementSchema
])

export const reffResumeElementSchema = baseElementSchema.extend({
  type: z.literal('REFF_RESUME'),
  config: z.object({
    children: z.array(resumeChildSchema).optional()
  })
})
