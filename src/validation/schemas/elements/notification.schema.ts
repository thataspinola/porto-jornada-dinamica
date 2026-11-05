import { z } from 'zod'

import { icons } from '@/components/UI/Icon/icons'

import { baseElementSchema } from './baseElement.schema'

const iconNames = Object.keys(icons)

const iconNameSchema = z.string().refine((value) => iconNames.includes(value), {
  message: 'Informe um nome de ícone válido'
})

export const notificationElementSchema = baseElementSchema.extend({
  type: z.literal('NOTIFICATION'),
  config: z.object({
    text: z.string(),
    icon: iconNameSchema,
    iconSize: z.number().int().positive().optional(),
    variant: z
      .enum(['default', 'information', 'warning', 'success', 'danger'])
      .optional(),
    styles: z.enum(['stroke', 'filled', 'flat']).optional()
  })
})
