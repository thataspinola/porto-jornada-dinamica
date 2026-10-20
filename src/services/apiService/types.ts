import type { JourneyDefinition } from '@/validation/schemas'

export interface ServiceConfig {
  headers: Record<string, string>
  additionalPayload?: Record<string, string>
  clientCookies?: Record<string, string>
  mockResponse?: {
    data: Record<string, unknown>
    delayMs: number
  }
}

export interface ApiServiceInput {
  variant: JourneyDefinition['variant']
  serviceConfig: ServiceConfig
  fields: Record<string, unknown>
  business: {
    metadata: {
      sessionId?: string
      ipAddress?: string
      userAgent?: string
      linkUuid?: string
      susep?: string
      socialMedia?: string
      idGoogle?: string
      gaClientId?: string
      gaMeasurementSessionId?: string
      analyticsUserId?: string
      idLink?: string
      gclid?: string
      fbclid?: string
      msclkid?: string
      utmSource?: string
      utmMedium?: string
      utmCampaign?: string
      utmTerm?: string
      utmContent?: string
      utmId?: string
      [key: string]: string | undefined
    }
  }
}
