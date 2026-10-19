import { z } from 'zod'

import { elementStyleSchema } from './styling.schema'

const baseElementFields = {
  id: z.string(),
  order: z.number().optional(),
}

const baseObjectSchema = z.object(baseElementFields)

const configStyleFields = {
  cssProperties: elementStyleSchema.optional(),
}

type WithConfigStyle<Shape extends z.ZodRawShape> = {
  [Key in keyof Shape]: Key extends 'config'
    ? Shape[Key] extends z.ZodObject<infer ConfigShape>
      ? z.ZodObject<ConfigShape & typeof configStyleFields>
      : Shape[Key]
    : Shape[Key]
}

function extendWithConfigStyle<Shape extends z.ZodRawShape>(shape: Shape) {
  const { config } = shape

  const nextShape =
    config instanceof z.ZodObject
      ? {
          ...shape,
          config: z.preprocess(
            (value) =>
              normalizeElementConfig(
                shape.type instanceof z.ZodLiteral
                  ? String(shape.type.value)
                  : '',
                value
              ),
            config.extend(configStyleFields)
          ),
        }
      : shape

  return baseObjectSchema.extend(nextShape as WithConfigStyle<Shape>)
}

export const baseElementSchema = Object.assign(z.object(baseElementFields), {
  extend: extendWithConfigStyle,
}) as Omit<typeof baseObjectSchema, 'extend'> & {
  extend: typeof extendWithConfigStyle
}

const operators: Record<string, string> = {
  equals: 'EQUAL',
  notEquals: 'NOT_EQUAL',
  exists: 'EXISTS',
  notExists: 'NOT_EXISTS',
}

function normalizeElementConfig(type: string, value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const config = { ...(value as Record<string, unknown>) }

  if (config.ui && typeof config.ui === 'object')
    Object.assign(config, { ...config.ui, ...config })

  if (config.children === undefined && Array.isArray(config.elements)) {
    config.children =
      type === 'COMPOSABLE_CARD'
        ? config.elements.map((element, index) => ({
            id: String(index),
            element,
          }))
        : config.elements
  }

  if (
    type === 'CONDITIONAL_WRAPPER' &&
    config.checks === undefined &&
    Array.isArray(config.conditions)
  ) {
    config.checks = config.conditions.map((condition) =>
      !condition || typeof condition !== 'object'
        ? condition
        : {
            left: { from: condition.source ?? 'fields', path: condition.path },
            op: operators[condition.operator ?? 'equals'],
            ...(condition.value !== undefined
              ? { right: { value: condition.value } }
              : {}),
          }
    )
  }

  if (type === 'CHECKBOX' && typeof config.label === 'string')
    config.label = { text: config.label }

  return config
}
