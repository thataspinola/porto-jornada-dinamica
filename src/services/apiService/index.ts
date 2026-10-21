'use server'

import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'

import { carbonClient } from '@/lib/carbonClient'

import { getTraceId } from '@/utils/traceId'
import { resolveCookiePayload } from '@/utils/resolveCookiePayload'

import { SERVICE_ERROR_CODE, type ServiceResult } from '../types'
import { promoteCustomerTokenCookie } from './promoteCustomerTokenCookies'
import type { ApiServiceInput } from './types'

const journeyPath = env('NEXT_PUBLIC_JORNADA_DINAMICA')
const SESSION_HEADER_NAME = 'hubSessionId'

export async function callApi(
  input: ApiServiceInput,
  recaptchaToken: string
): Promise<ServiceResult> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_HEADER_NAME)?.value

  try {
    const endpoint = `/${journeyPath}`
    const traceId = await getTraceId()

    const mergePayload = {
      ...input.fields,
      ...input.serviceConfig.additionalPayload,
    }

    promoteCustomerTokenCookie(cookieStore, input.serviceConfig.clientCookies)

    const data = {
      payload: resolveCookiePayload(
        mergePayload,
        cookieStore,
        input.serviceConfig.clientCookies,
        input.business.metadata.userAgent
      ),
      metadata: { ...input.business.metadata },
    }

    const httpResponse = await carbonClient.post(endpoint, data, {
      headers: {
        ...input.serviceConfig.headers,
        'X-Recaptcha-Token': recaptchaToken,
        'X-Recaptcha-Action': input.serviceConfig.headers['porto-action'],
        ...(input.variant === 'app' && {
          'X-Recaptcha-Verification-Disabled': 'true',
        }),
        'porto-hub-trace-id': traceId,
        'carbon-trace-id': traceId,
        ...(sessionId ? { 'porto-session-id': sessionId } : {}),
      },
    })

    const rawResponseSessionId = httpResponse.headers['porto-session-id']
    const isString = typeof rawResponseSessionId === 'string'
    const hasValue = isString && rawResponseSessionId.length > 0
    const isNewSessionId = hasValue && rawResponseSessionId !== sessionId

    if (isNewSessionId) {
      cookieStore.set(SESSION_HEADER_NAME, rawResponseSessionId, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: env('NEXT_PUBLIC_NODE_ENV') === 'production',
      })
    }

    if (sessionId && isNewSessionId) {
      return { success: false, sessionRestarted: true }
    }

    return { success: true, data: httpResponse.data }
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw error
    }

    const rawResponseSessionId = error.response?.headers?.['porto-session-id']
    const isString = typeof rawResponseSessionId === 'string'
    const hasValue = isString && rawResponseSessionId.length > 0
    const isNewSessionId = hasValue && rawResponseSessionId !== sessionId

    if (isNewSessionId) {
      cookieStore.set(SESSION_HEADER_NAME, rawResponseSessionId, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: env('NEXT_PUBLIC_NODE_ENV') === 'production',
      })
    }

    if (sessionId && isNewSessionId) {
      return { success: false, sessionRestarted: true }
    }

    const status = error.response?.status ?? 0
    const message = error.response?.data?.message

    const errorCode =
      status === 0
        ? SERVICE_ERROR_CODE.CONNECTION_ERROR
        : typeof message === 'string' && message.length > 0
          ? message
          : SERVICE_ERROR_CODE.INTERNAL_SERVER_ERROR

    return { success: false, error: errorCode, statusCode: status }
  }
}
