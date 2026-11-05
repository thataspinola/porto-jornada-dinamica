import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const selectOptionSchema = z.object({
  label: z.string(),
  value: z.string()
})

export const selectOptionsSourceSchema = z.object({
  source: z.string(),
  valueKey: z.string().default('value'),
  labelTemplate: z.string().default('{{label}}')
})

export type SelectOptionsSource = z.infer<typeof selectOptionsSourceSchema>

export const selectElementSchema = baseElementSchema.extend({
  type: z.literal('SELECT'),
  config: z.object({
    label: z.string(),
    required: z.boolean().default(false),
    options: z.array(selectOptionSchema).default([]),
    optionsSource: selectOptionsSourceSchema.optional(),
    name: z.string(),
    defaultValue: z.string().default('')
  })
})
