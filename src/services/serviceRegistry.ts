'use server'
import { callApi } from './apiService'
import type { ApiServiceInput } from './apiService/types'
import type { ServiceResult } from './types'
export async function callService(
  input: ApiServiceInput,
  recaptchaToken: string
): Promise<ServiceResult> {
  if (!recaptchaToken?.trim()) return { success: false, error: 'INVALID_INPUT' }
  return callApi(input, recaptchaToken)
}
