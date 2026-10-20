import type { CSSProperties } from 'react'

import type { ElementStyle } from '@/validation/schemas/elements/styling.schema'

import { colorParser, type StylePropertyParser, spacingParser } from './parsers'

const stylePropertyParsers: Partial<
  Record<keyof ElementStyle, StylePropertyParser>
> = {
  marginBottom: spacingParser,
  marginTop: spacingParser,
  marginRight: spacingParser,
  marginLeft: spacingParser,
  padding: spacingParser,
  background: colorParser,
}

type ResponsiveValue = {
  desktop: unknown
  mobile: unknown
}

const isResponsiveValue = (value: unknown): value is ResponsiveValue =>
  typeof value === 'object' &&
  value !== null &&
  'desktop' in value &&
  'mobile' in value

const getResponsiveMode = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(max-width: 767px)').matches
    ? 'mobile'
    : 'desktop'

export function resolveStyle(
  style?: ElementStyle | CSSProperties
): CSSProperties | undefined {
  if (!style) return undefined
  const declaredStyle = style as Record<string, unknown>
  const resolvedStyle: Record<string, unknown> = {}
  const responsiveMode = getResponsiveMode()

  for (const property of Object.keys(declaredStyle)) {
    const parser = stylePropertyParsers[property as keyof ElementStyle]
    const configuredValue = declaredStyle[property]

    const value = isResponsiveValue(configuredValue)
      ? configuredValue[responsiveMode]
      : configuredValue

		if (value === undefined || !parser) {
			resolveStyle[property] = value
		} else {
			resolveStyle[property] = parser(value)
		}
  }

	return resolvedStyle as CSSProperties
}
