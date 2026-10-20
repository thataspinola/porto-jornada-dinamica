import type { cookies } from 'next/headers'
import { env } from 'next-runtime-env'

type CookieStore = Awaited<ReturnType<typeof cookies>>

const CUSTOMER_TOKEN_COOKIE = 'ComercialCustomerToken'

export function promoteCustomerTokenCookie(
  cookieStore: CookieStore,
  clientCookies: Record<string, string> | undefined
): void {
  const serverValue = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value
  const token = clientCookies?.[CUSTOMER_TOKEN_COOKIE] ?? serverValue
  if (!token || token === serverValue) return
  const secure = env('NEXT_PUBLIC_NODE_ENV') === 'production'

  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    path: '/',
    domain: env('NEXT_PUBLIC_COOKIE_DOMAIN'),
    secure,
    sameSite: secure ? 'none' : 'lax',
  })
}
