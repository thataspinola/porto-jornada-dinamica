'use server'

import { callApi } from './apiService'
import type { ApiServiceInput } from './apiService/types'
import { eligibility } from './EligibilityService'
import type { ServiceResult } from './types'

export async function callService(
  input: string | ApiServiceInput,
  recaptchaTokenOrInput: unknown
): Promise<ServiceResult> {
  if (typeof input === 'string') {
    if (input === 'eligibility') return eligibility(recaptchaTokenOrInput)

    return {
      success: false,
      error: 'SERVICE_NOT_REGISTERED',
      message: 'Serviço não registrado: ' + input,
    }
  }

  if (typeof recaptchaTokenOrInput !== 'string' || recaptchaTokenOrInput.trim() === '')
    return { success: false, error: 'INVALID_INPUT' }

  try {
    const url = new URL(input.url)

    const allowed = (process.env.SERVICE_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      !allowed.includes(url.origin)
    )
      return {
        success: false,
        error: 'SERVICE_NOT_CONFIGURED',
        message: 'Origem do serviço não autorizada',
      }
  } catch {
    return { success: false, error: 'INVALID_INPUT' }
  }

  return callApi(input, recaptchaTokenOrInput)
}
