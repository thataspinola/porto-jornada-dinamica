import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'

export const emailInputElementSchema = baseElementSchema.extend({
  type: z.literal('EMAIL_INPUT'),
  config: z.object({
    label: z.string().default('E-mail'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('email'),
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    clearOnInput: z.boolean().optional(),
    trailingIcon: z.string().optional(),
    ...inputUiFields
  })
})
