type FormValues = Record<string, unknown>

function hasRequiredValue(value: unknown) {
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'boolean') return value
  return value != null
}

export function areRequiredFieldsComplete(
  requiredFields: string[],
  values: FormValues
) {
  return requiredFields.every((field) => hasRequiredValue(values[field]))
}
