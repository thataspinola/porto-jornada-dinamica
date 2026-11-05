/**
 * Applies a birth date mask to a string.
 * @param value - The input string to format.
 * @returns The formatted date string in the format DD/MM/YYYY.
 */
export const birthDateMask = (value: string): string => {
  if (typeof value !== 'string') return ''

  let numericValue = value.replace(/\D/g, '')

  if (numericValue.length > 8) {
    numericValue = numericValue.substring(0, 8)
  }

  if (numericValue.length <= 2) return numericValue
  if (numericValue.length <= 4)
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`
  return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4)}`
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Converts a form value (ISO `YYYY-MM-DD`, `DD/MM/YYYY` or raw digits) into the
 * display representation `DD/MM/YYYY`. Partial digits are masked progressively.
 */
export const birthDateToDisplay = (value: unknown): string => {
  if (typeof value !== 'string' || !value) return ''

  const iso = value.match(ISO_DATE_PATTERN)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`

  return birthDateMask(value)
}

/**
 * Converts a raw display/typed value into the canonical form storage value.
 * Returns `YYYY-MM-DD` when the input contains exactly 8 digits; otherwise
 * returns the extracted digits (up to 8) so partial typing is preserved.
 */
export const birthDateToFormValue = (value: unknown): string => {
  if (typeof value !== 'string') return ''

  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length !== 8) return digits

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return `${year}-${month}-${day}`
}
