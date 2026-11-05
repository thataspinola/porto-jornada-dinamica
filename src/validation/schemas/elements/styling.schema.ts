import type { CSSProperties } from 'react'
import { z } from 'zod'

export const SPACING_TOKENS = [
  108, 96, 80, 72, 64, 56, 48, 40, 32, 24, 20, 16, 12, 8, 4, 0
] as const

export type SpacingToken = (typeof SPACING_TOKENS)[number]

const isSpacingToken = (value: number): value is SpacingToken =>
  SPACING_TOKENS.includes(value as SpacingToken)

export const spacingTokenSchema = z.number().int().refine(isSpacingToken, {
  message: 'Spacing inválido'
})

const responsive = <Schema extends z.ZodType>(schema: Schema) =>
  z.union([
    schema,
    z.object({
      desktop: schema,
      mobile: schema
    })
  ])

const displaySchema = z.enum([
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'none'
])

const flexDirectionSchema = z.enum([
  'row',
  'row-reverse',
  'column',
  'column-reverse'
])

const elementStyleShape = z.object({
  marginBottom: responsive(spacingTokenSchema).optional(),
  marginTop: responsive(spacingTokenSchema).optional(),
  marginRight: responsive(spacingTokenSchema).optional(),
  marginLeft: responsive(spacingTokenSchema).optional(),
  padding: responsive(spacingTokenSchema).optional(),
  order: responsive(z.number().int()).optional(),
  flex: responsive(z.number()).optional(),
  display: responsive(displaySchema).optional(),
  flexDirection: responsive(flexDirectionSchema).optional(),
  height: responsive(z.union([spacingTokenSchema, z.string()])).optional(),
  background: z.string().optional()
})

export type ElementStyle = z.infer<typeof elementStyleShape>

export const elementStyleSchema = elementStyleShape.transform(
  (value) => value as CSSProperties
)
