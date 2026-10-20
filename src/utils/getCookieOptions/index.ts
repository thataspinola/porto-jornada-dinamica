import { env } from 'next-runtime-env'

export function getCookieOptions() {
  return {
    path: '/',
    domain: env('NEXT_PUBLIC_COOKIE_DOMAIN'),
    expires: 7,
    secure: true,
    httpOnly: false,
    sameSite: 'lax' as const,
  }
}
