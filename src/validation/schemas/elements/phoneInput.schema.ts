import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'

export const phoneInputElementSchema = baseElementSchema.extend({
  type: z.literal('PHONE_INPUT'),
  config: z.object({
    label: z.string().default('Celular'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('phone'),
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    clearOnInput: z.boolean().optional(),
    trailingIcon: z.string().optional(),
    ...inputUiFields
  })
})
