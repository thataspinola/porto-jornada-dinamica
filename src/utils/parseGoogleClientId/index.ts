import { env } from 'next-runtime-env'

const GA_CLIENT_ID_PATTERN = /^GA\d+\.\d+\.(\d+\.\d+)$/
const GA_MEASUREMENT_SESSION_PATTERN = /^[^.]+\.[^.]+\.s([^$]+)(\$).*$/

function getCookie(cookieHeader: string, name: string): string | undefined {
  const prefix = `${name}=`

  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length)
}

function getBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }

  return getCookie(document.cookie, name)
}

export function resolveGoogleClientId(): string | undefined {
  return getBrowserCookie('_ga')?.match(GA_CLIENT_ID_PATTERN)?.[1]
}

export function resolveGoogleAnalyticsMetadata(): {
  gaClientId?: string
  gaMeasurementSessionId?: string
} {
  const gaClientId = resolveGoogleClientId()
  const measurementId = env('NEXT_PUBLIC_GA_COOKIE_SESSION_ID')
  const gaMeasurementSessionId = measurementId
    ? getBrowserCookie(`_ga_${measurementId}`)?.match(
        GA_MEASUREMENT_SESSION_PATTERN
      )?.[1]
    : undefined

  return {
    ...(gaClientId ? { gaClientId } : {}),
    ...(gaMeasurementSessionId ? { gaMeasurementSessionId } : {})
  }
}
