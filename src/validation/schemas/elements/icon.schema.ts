import { z } from 'zod'

import { icons } from '@/components/UI/Icon/icons'

const iconNames = Object.keys(icons)

import { baseElementSchema } from './baseElement.schema'

type IconName = keyof typeof icons

export const iconNameSchema = z.custom<IconName>(
  (value) =>
    typeof value === 'string' &&
    (iconNames as readonly string[]).includes(value),
  {
    message: 'Informe um nome de ícone válido',
  }
)

export const iconElementSchema = baseElementSchema.extend({
  type: z.literal('ICON'),
  config: z.object({
    icon: iconNameSchema,
    size: z.number().int().positive().optional(),
    color: z.string().optional(),
  }),
})
