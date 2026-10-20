import Script from 'next/script'
import { env } from 'next-runtime-env'

export const RECAPTCHA_KEY = env('NEXT_PUBLIC_RECAPTCHA_SITE_K')

export const RecaptchaClient = () => {
  return (
    <Script
      id='recaptcha'
      strategy='beforeInteractive'
      src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_KEY}`}
    />
  )
}
