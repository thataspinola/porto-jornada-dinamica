import { z } from 'zod'

import { icons } from '@/components/UI/Icon/icons'

import { baseElementSchema } from './baseElement.schema'

const iconNames = Object.keys(icons)

const iconNameSchema = z.string().refine((value) => iconNames.includes(value), {
  message: 'Informe um nome de ícone válido'
})

export const iconElementSchema = baseElementSchema.extend({
  type: z.literal('ICON'),
  config: z.object({
    icon: iconNameSchema,
    size: z.number().int().positive().optional(),
    color: z.string().optional()
  })
})
