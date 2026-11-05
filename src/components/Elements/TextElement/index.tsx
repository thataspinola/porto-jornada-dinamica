'use client'

import { Text, type TextProps } from '@/components/UI/Text/Text'

import type { TextElementProps } from './types'

type TextConfig = TextProps

export function TextElement({ element }: TextElementProps) {
  const { text, cssProperties, ...typographyProps } = element.config

  return (
    <Text
      {...(typographyProps as TextConfig)}
      text={text}
      style={cssProperties}
    />
  )
}
