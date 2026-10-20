'use server'

import { env } from 'next-runtime-env'

export const ipService = async () => {
  const ipServiceUrl = env('NEXT_PUBLIC_IP_SERVICE')
  if (!ipServiceUrl) return ''

  try {
    const response = await fetch(ipServiceUrl)
    const data = await response.json()
    return data?.ipAddress || ''
  } catch {
    return ''
  }
}
