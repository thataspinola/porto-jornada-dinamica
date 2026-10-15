import {
  requiredString,
  optionalString,
  optionalBoolean,
} from '@/validation/primitives'

import type { ElementHandler } from './types'

export const socialName: ElementHandler<'SOCIAL_NAME'> = ({ name }) => ({
  schema: {
    hasSocialName: optionalBoolean(),
    [name]: optionalString().transform((value) =>
      typeof value === 'string' ? value.trim() : value
    ),
  },
  defaultValues: { hasSocialName: false, [name]: '' },
  refine: (data, ctx) => {
    const val = data[name]

    if (!val || String(val).trim() === '') {
      ctx.addIssue({
        path: [name],
        code: 'custom',
        message: 'Insira o seu nome social.',
      })
    }
  },
})
