import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const inputHiddenElementSchema = baseElementSchema.extend({
  type: z.literal('INPUT_HIDDEN'),
  config: z.object({
    name: z.string().nonempty(),
    value: z.string().nonempty()
  })
})
