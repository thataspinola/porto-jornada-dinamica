import { z } from 'zod'

export const inputUiFields = {
  variant: z.enum(['outlined', 'default', 'big']).default('default'),
  disabled: z.boolean().optional(),
  autoFocus: z.boolean().optional(),
  helperText: z.string().optional(),
  className: z.string().optional()
} as const

export const buttonUiFields = {
  size: z.enum(['sm', 'md']).default('md'),
  styles: z.enum(['filled', 'stroke', 'ghost']).default('filled'),
  variant: z.enum(['primary', 'secondary']).default('primary'),
  className: z.string().default('')
} as const

export const typographyUiFields = {
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
      'display'
    ])
    .optional(),
  color: z.enum(['neutral-black', 'neutral-800', 'seguro-900']).optional(),
  weight: z.enum(['light', 'regular', 'medium', 'semibold', 'bold']).optional()
} as const
