import type { FieldValidation } from '@/validation/schemas/elements/validations.schema'

type ValidationAttributes = {
  minLength?: number
  maxLength?: number
  pattern?: string
}

export const resolveValidationAttributes = (
  validations: FieldValidation[]
): ValidationAttributes => {
  const attributes: ValidationAttributes = {}

  for (const validation of validations) {
    if (validation.type === 'MIN_LENGTH') {
      attributes.minLength = validation.value
    }

    if (validation.type === 'MAX_LENGTH') {
      attributes.maxLength = validation.value
    }

    if (validation.type === 'REGEX') {
      attributes.pattern = validation.value
    }
  }

  return attributes
}
