import { z } from 'zod'

import { iconNameSchema } from './icon.schema'

export const inputUiSchema = {
  variant: z.enum(['outlined', 'default', 'big']).optional(),
  width: z.enum(['fluid', 'contain']).optional(),
  disabled: z.boolean().optional(),
  autoFocus: z.boolean().optional(),
  helperText: z.string().optional(),
  className: z.string().optional(),
} as const

export const buttonUiFields = {
  size: z.enum(['sm', 'md']).default('md'),
  styles: z.enum(['filled', 'stroke', 'ghost']).default('filled'),
  variant: z.enum(['primary', 'secondary']).default('primary'),
  className: z.string().default(''),
  icon: z
    .object({
      name: iconNameSchema,
      position: z.enum(['left', 'right']),
      size: z.number().int().positive().optional(),
    })
    .optional(),
} as const

export const typographyUiSchema = z
  .object({
    as: z
      .enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label'])
      .optional(),
    variant: z
      .enum([
        'title1',
        'title2',
        'title3',
        'title4',
        'title5',
        'title6',
        'body1',
        'body1Expanded',
        'body2',
        'body2Expanded',
        'caption',
        'label',
        'overline',
        'button',
        'display',
      ])
      .optional(),
    color: z.enum(['neutral-black', 'neutral-800', 'seguro-900']).optional(),
    weight: z
      .enum(['light', 'regular', 'medium', 'semibold', 'bold'])
      .optional(),
    fontStyle: z.enum(['italic', 'normal']).optional(),
    className: z.string().optional(),
  })
  .optional()

export const linkUiSchema = {
  size: z.enum(['large', 'small']).optional(),
  styles: z.enum(['primary', 'secondary', 'ghost']).optional(),
  width: z.enum(['contain', 'fluid']).optional(),
  variant: z.enum(['insurance', 'disabled']).optional(),
  disabled: z.boolean().optional(),
  className: z.string().optional(),
} as const
