import { z } from 'zod'

import { tagVariants } from '@/components/UI/Tag/Tag'

import { baseElementSchema } from './baseElement.schema'
import { confirmNavigationButtonElementSchema } from './confirmNavigationButton.schema'
import { navigationElementSchema } from './navigation.schema'
import { serviceCallElementSchema } from './serviceCall.schema'

const tagVariantSchema = z.enum(tagVariants)

const comparableSchema = z.union([z.string(), z.boolean(), z.number()])

const tagRuleSchema = z.object({
  label: z.string(),
  variant: tagVariantSchema.optional(),
  negative: z.boolean().optional(),
  when: z
    .object({
      field: z.string(),
      equals: comparableSchema.optional(),
      notEquals: comparableSchema.optional(),
    })
    .refine(
      (rule) => rule.equals !== undefined || rule.notEquals !== undefined,
      {
        message: 'Informe `equals` ou `notEquals` na regra de tag',
      }
    ),
})

const resumeChildSchema = z.discriminatedUnion('type', [
  navigationElementSchema,
  serviceCallElementSchema,
  confirmNavigationButtonElementSchema,
])

export const resumeElementSchema = baseElementSchema.extend({
  type: z.literal('RESUME'),
  config: z.object({
    preTitle: z.string().optional(),
    title: z.string().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string().optional(),
          tag: z.array(tagRuleSchema).optional(),
          hasDivider: z.boolean().optional(),
        })
      )
      .optional(),
    children: z.array(resumeChildSchema).optional(),
  }),
})
