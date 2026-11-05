import type { Tag as TagPrimitive } from '@porto-stack/ui'
import type { ComponentProps } from 'react'

export const tagVariants = [
  'primary',
  'secondary',
  'seguro',
  'bank',
  'saude',
  'green',
  'red',
  'yellow',
  'violet',
  'pink'
] as const

export type TagVariant = (typeof tagVariants)[number]

export type TagProps = Omit<
  ComponentProps<typeof TagPrimitive>,
  'variant' | 'styles'
> & {
  /**
   * Aplica a versão de contraste invertido definida no wrapper local do Tag,
   * trocando as cores de fundo e texto para variantes preenchidas.
   */
  negative?: boolean
  styles?: TagVariant
  variant?: TagVariant
}
