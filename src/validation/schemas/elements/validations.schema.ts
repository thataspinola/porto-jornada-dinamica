import { z } from 'zod'

const isValidRegex = (value: string) => {
  try {
    new RegExp(value)

    return true
  } catch {
    return false
  }
}

const lengthValidationFields = {
  value: z.number().int().positive(),
  message: z.string()
} as const

export const fieldValidationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('MIN_LENGTH'),
    ...lengthValidationFields
  }),
  z.object({
    type: z.literal('MAX_LENGTH'),
    ...lengthValidationFields
  }),
  z.object({
    type: z.literal('REGEX'),
    value: z.string().refine(isValidRegex, {
      message: 'Informe uma expressão regular válida'
    }),
    message: z.string()
  })
])

export const validationsSchema = z
  .array(fieldValidationSchema)
  .optional()
  .default([])

export type FieldValidation = z.infer<typeof fieldValidationSchema>
