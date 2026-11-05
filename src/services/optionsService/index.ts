'use server'

import type { ServiceResult } from '../types'
import { BANK_SOURCE } from './sources/banks'
import type { SelectOptionItem, SelectOptionsInput } from './types'

const OPTION_SOURCES: Record<string, SelectOptionItem[]> = {
  banks: BANK_SOURCE
}

export async function fetchSelectOptions(
  input: SelectOptionsInput
): Promise<ServiceResult<SelectOptionItem[]>> {
  const data = OPTION_SOURCES[input.source]

  if (!data) {
    return { success: false, error: 'OPTIONS_SOURCE_NOT_FOUND' }
  }

  return { success: true, data }
}
