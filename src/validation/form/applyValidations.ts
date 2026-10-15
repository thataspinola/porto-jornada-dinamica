import { z } from 'zod'

import { optionalString } from '@/validation/primitives'
import type { FieldValidation } from '@/validation/schemas/elements/validations.schema'

function applyValidation(schema: z.ZodString, validation: FieldValidation) {
  switch (validation.type) {
    case 'MIN_LENGTH':
      return schema.min(validation.value, validation.message)
    case 'MAX_LENGTH':
      return schema.max(validation.value, validation.message)
    case 'REGEX':
      return schema.regex(new RegExp(validation.value), validation.message)
  }
}

export function applyValidations(
  schema: z.ZodString,
  validations: FieldValidation[] = [],
) {
  let currentSchema = schema

  for (const validation of validations) {
    currentSchema = applyValidation(currentSchema, validation)
  }

  return currentSchema
}

export function applyOptionalValidations(
  validations: FieldValidation[] = [],
  { trim = false }: { trim?: boolean } = {},
) {
  const base = trim ? z.string().trim() : z.string()
  return optionalString().pipe(applyValidations(base, validations).optional())
}
