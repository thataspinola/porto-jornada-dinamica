'use server'
import { BANK_SOURCE } from './sources/bank'
import type { ServiceResult } from '@/services/types'
export async function fetchSelectOptions({
  source,
}: {
  source: string
}): Promise<ServiceResult<Record<string, unknown>[]>> {
  if (source !== 'bank')
    return { success: false, error: 'OPTIONS_SOURCE_NOT_REGISTERED' }
  return { success: true, data: [...BANK_SOURCE] }
}
