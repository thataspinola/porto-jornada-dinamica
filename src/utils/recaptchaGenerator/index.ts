'use client'

import { RECAPTCHA_KEY } from '../../scripts/recaptchatClient'

export async function recaptcha(action) {
  let recaptchaTokenReturn = ''
  if (
    typeof window !== 'undefined' &&
    RECAPTCHA_KEY &&
    window.grecaptcha?.enterprise
  ) {
    recaptchaTokenReturn = await window.grecaptcha.enterprise.execute(
      RECAPTCHA_KEY,
      { action: action ?? 'submit' }
    )
  }

  return recaptchaTokenReturn
}
