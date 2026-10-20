import { pushEvent } from '../pushEvent'
import { sha256 } from '../sha256'
import { splitFullName } from './splitFullName'

export type PushLeadEventInput = {
  evLabel: 'pf' | 'pj'
  method?: string
  leadId: string
  clientId?: string
  clientBcp?: string
  email?: string
  phone?: string
  fullName?: string
  evAction?: string
}

async function hashOptional(
  value: string | undefined
): Promise<string | undefined> {
  if (!value) return undefined
  return sha256(value)
}

export async function pushLeadEvent(input: PushLeadEventInput): Promise<void> {
  const { firstName, lastName } = splitFullName(input.fullName)
  const phoneE164 = input.phone ? `+55${input.phone}` : undefined

  const [
    clientEmail,
    clientPhone,
    clientPhoneE164,
    clientFirstName,
    clientLastName,
  ] = await Promise.all([
    hashOptional(input.email),
    hashOptional(input.phone),
    hashOptional(phoneE164),
    hashOptional(firstName),
    hashOptional(lastName),
  ])

  pushEvent({
    event: 'lead',
    evAction: input.evAction ?? 'lead:sucesso',
    evLabel: input.evLabel,
    method: input.method ?? 'tipo-contato:padrao',
    leadId: input.leadId,
    clientId: input.clientId,
    clientBcp: input.clientBcp,
    clientEmail,
    clientPhone,
    clientPhoneE164,
    clientFirstName,
    clientLastName,
  })
}
