import { z } from 'zod'

import { elementStyleSchema } from './styling.schema'

const baseElementFields = {
  id: z.string(),
  order: z.number().optional()
}

const baseObjectSchema = z.object(baseElementFields)

const configStyleFields = {
  cssProperties: elementStyleSchema.optional()
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
      ? { ...shape, config: config.extend(configStyleFields) }
      : shape

  return baseObjectSchema.extend(nextShape as WithConfigStyle<Shape>)
}

export const baseElementSchema = Object.assign(z.object(baseElementFields), {
  extend: extendWithConfigStyle
}) as Omit<typeof baseObjectSchema, 'extend'> & {
  extend: typeof extendWithConfigStyle
}
