'server-only'

import { createCarbonClient } from '@porto-stack/utils'
import { env } from 'next-runtime-env'

export const carbonClient = createCarbonClient({
  baseUrl: env('NEXT_PUBLIC_SENSEDIA_CLOUD_URL'),
  recaptchaSecret: env('RECAPTCHA')
})
