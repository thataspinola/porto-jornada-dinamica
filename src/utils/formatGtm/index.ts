function extractText(value: unknown): string {
  if (value == null) return ''

  if (typeof value === 'string') return value

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join(' ')
  }

  if (typeof value === 'object') {
    if ('text' in value && typeof value.text === 'string') {
      return value.text
    }

    return Object.values(value).map(extractText).filter(Boolean).join(' ')
  }

  return ''
}

export function formatGtmText(value: unknown) {
  const text = extractText(value)

  if (!text.trim()) return ''

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[®©™`~!@#$%^&*()_+=?;'",.<>{}[\]\\/]/g, '')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, '-')
}
