import type { FieldValues } from 'react-hook-form'

import type { DataQualityType } from '@/hooks/useDataQuality'
import { isMaskedEmail, isMaskedPhone } from '@/validation/fields/maskedValue'

import type { JourneyElement } from './types'

type Target = { type: DataQualityType; fieldName: string }
type Failure = { fieldName: string; message: string }

const ERROR_MESSAGE: Record<DataQualityType, string> = {
  email: 'E-mail inválido.',
  phone: 'Celular inválido.',
  socialName: 'Nome social inválido.'
}

function collectTargets(
  elements: JourneyElement[],
  values: FieldValues
): Target[] {
  const targets: Target[] = []
  for (const element of elements) {
    if (element.type === 'EMAIL_INPUT') {
      const fieldName = element.config.name
      if (values[fieldName] && !isMaskedEmail(values[fieldName]))
        targets.push({ type: 'email', fieldName })
    } else if (element.type === 'PHONE_INPUT') {
      const fieldName = element.config.name
      if (values[fieldName] && !isMaskedPhone(values[fieldName]))
        targets.push({ type: 'phone', fieldName })
    } else if (element.type === 'SOCIAL_NAME') {
      const fieldName = element.config.name
      if (values.hasSocialName === true && values[fieldName])
        targets.push({ type: 'socialName', fieldName })
    }
  }
  return targets
}

export async function validateStepDataQuality(
  elements: JourneyElement[],
  values: FieldValues,
  validate: (type: DataQualityType, value: string) => Promise<boolean>
): Promise<Failure[]> {
  const results = await Promise.all(
    collectTargets(elements, values).map(async (target) => ({
      target,
      isValid: await validate(target.type, values[target.fieldName])
    }))
  )
  return results
    .filter((result) => !result.isValid)
    .map(({ target }) => ({
      fieldName: target.fieldName,
      message: ERROR_MESSAGE[target.type]
    }))
}
