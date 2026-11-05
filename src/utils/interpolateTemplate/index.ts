import { getByPath } from '../getByPath'

const PLACEHOLDER_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g

type InterpolateOptions = {
  keepMissing?: boolean
}

export function interpolateTemplate(
  template: string | undefined,
  data: Record<string, unknown>,
  options: InterpolateOptions = {}
): string | undefined {
  if (template == null) {
    return template
  }

  const { keepMissing = false } = options

  let hasMissing = false

  const result = template.replace(PLACEHOLDER_REGEX, (match, key: string) => {
    const value = getByPath(data, key)

    if (value == null || value === '') {
      hasMissing = true
      return keepMissing ? match : ''
    }

    return String(value)
  })

  if (hasMissing && !keepMissing) {
    return undefined
  }

  return result
}
