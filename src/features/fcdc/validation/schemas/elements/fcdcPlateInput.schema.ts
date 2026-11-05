import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'
import { inputUiFields } from '@/validation/schemas/elements/elementUi.schemas'

export const fcdcPlateInputElementSchema = baseElementSchema.extend({
  type: z.literal('FCDC_PLATE_INPUT'),
  config: z.object({
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    name: z.string(),
    defaultValue: z.string().optional(),
    defaultValueFrom: z.any().optional(),
    ...inputUiFields
  })
})
