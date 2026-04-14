'use server'
import { env } from 'next-runtime-env'

export type RecaptchaServiceSiteVerifyProps = {
  recaptchaToken: string
  recaptchaAction: string
}
export type RecaptchaServiceSiteVerifyReturn = {
  isValid: boolean
  message?: string
}

export const RecaptchaServiceSiteVerify = async ({
  recaptchaToken,
  recaptchaAction,
}: RecaptchaServiceSiteVerifyProps): Promise<RecaptchaServiceSiteVerifyReturn> => {
  try {
    const reCaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${env('RECAPTCHA')}&response=${recaptchaToken}&action=${recaptchaAction}`,
      },
    )

    const reCaptchaData = await reCaptchaResponse.json()

    if (!reCaptchaData.success || reCaptchaData.score <= 0.6) {
      console.log(
        'Received data from reCaptcha siteverify:',
        JSON.stringify(reCaptchaData),
      )
      return {
        isValid: false,
        message: 'reCAPTCHA verification failed.',
      }
    }

    return {
      isValid: true,
      message: 'reCAPTCHA verification succeded.',
    }
  } catch (error) {
    console.error('reCAPTCHA verification failed: error', error)
    return {
      isValid: false,
      message: 'reCAPTCHA verification failed: internal error.',
    }
  }
}
