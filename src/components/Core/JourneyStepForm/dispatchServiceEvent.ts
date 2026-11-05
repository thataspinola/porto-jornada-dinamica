import {
  buildVehicleViewItem,
  encryptGtmClientId,
  pushEvent,
  pushLeadEvent,
  resolveGoogleClientId,
  resolveProductAnalytics,
  sha256
} from '@/utils'
import type { Item } from '@/utils/pushEvent'
import { splitFullName } from '@/utils/pushLeadEvent/splitFullName'

import type { Product } from '@/hooks/useProducts'

type ServiceRef = {
  action: string
  module: string
  successEvent?: 'purchase' | 'add_to_cart'
}

type MutationResult = { data?: unknown } | undefined

type Values = Record<string, unknown>

export type DispatchServiceEventInput = {
  service: ServiceRef
  result: MutationResult
  formData: Values
  fields: Values
  services: Values
  product?: string
  parameters: Values
}

type LeadSupportResponse = {
  idLead?: string
  pescod?: string | number
}

type LeadQuotationAnalytics = {
  client_id?: string
  client_bcp?: string
  client_email?: string
  client_phone?: string
  client_phone_e164?: string
  client_first_name?: string
  client_last_name?: string
}

type LeadQuotationResponse = {
  quotation?: {
    quotationResult?: {
      analytics?: LeadQuotationAnalytics
      lead?: {
        idLead?: string
      }
    }
  }
}

function pickString(...candidates: unknown[]): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.length > 0) return candidate
  }

  return undefined
}

async function dispatchLeadSupport(input: DispatchServiceEventInput) {
  const response = input.result?.data as LeadSupportResponse | undefined

  if (!response?.idLead) {
    return
  }

  const cpf = pickString(input.formData.taxvat, input.fields.taxvat)
  const clientId = cpf ? await encryptGtmClientId(cpf) : undefined

  await pushLeadEvent({
    evLabel: 'pf',
    leadId: response.idLead,
    clientId,
    clientBcp:
      response.pescod !== undefined ? String(response.pescod) : undefined,
    email: pickString(input.formData.email, input.fields.email),
    phone: pickString(input.formData.phone, input.fields.phone),
    fullName: pickString(input.formData.name, input.fields.name)
  })
}

async function dispatchProposalSent(input: DispatchServiceEventInput) {
  const withInsurance = input.fields.withInsurance === true
  const productAnalytics = resolveProductAnalytics(input.product)

  const quotationInstallments = (
    input.services?.quotation as { installments?: Values } | undefined
  )?.installments as { requestedAmount?: number | string } | undefined

  const requestedAmount = quotationInstallments?.requestedAmount

  const installmentValue = input.fields.installmentValueAmount as
    | number
    | string
    | undefined

  const { firstName, lastName } = splitFullName(
    pickString(input.formData.name, input.fields.name)
  )
  const phoneE164 = input.fields.phone ? `+55${input.fields.phone}` : undefined
  const [
    clientId,
    clientEmail,
    clientPhone,
    clientPhoneE164,
    clientFirstName,
    clientLastName
  ] = await Promise.all([
    resolveGoogleClientId(),
    sha256(pickString(input.formData.email, input.fields.email)),
    sha256(pickString(input.formData.phone, input.fields.phone)),
    sha256(phoneE164),
    sha256(firstName),
    sha256(lastName)
  ])

  pushEvent({
    event: 'purchase',
    evAction: 'ecommerce:purchase:sucesso',
    currency: 'BRL',
    value: requestedAmount ?? '',
    paymentType: pickString(
      input.formData.paymentMethod,
      input.fields.paymentMethod
    ),
    clientId,
    clientEmail,
    clientPhone,
    clientPhoneE164,
    clientFirstName,
    clientLastName,
    items: productAnalytics
      ? [
          buildVehicleViewItem({
            branchId: productAnalytics.branchId,
            productName: productAnalytics.product,
            fields: input.fields,
            standardVehicle: input.parameters.standardVehicle,
            withInsurance,
            installmentValue,
            quantity: 1,
            installments: input.fields.numberOfInstallments as
              | number
              | string
              | undefined,
            includeFinancialProtection: true
          })
        ]
      : []
  })
}

function sumProductPrices(products: Product[]): number {
  return products.reduce(
    (total, product) => total + Number(product.installmentsPrice ?? 0),
    0
  )
}

function dispatchProductsAddedToCart(input: DispatchServiceEventInput) {
  const products = (input.fields.products ?? []) as Product[]

  if (products.length === 0) return

  const items: Item[] = products.map((product) => ({
    item_id: product.sku,
    item_name: product.name,
    item_category: product.analytics?.itemCategory,
    item_brand: 'porto',
    item_variant: product.analytics?.itemVariant,
    item_list_name: product.analytics?.itemListName,
    item_list_id: product.analytics?.itemListId,
    discount: product.analytics?.discount,
    creative_name: product.analytics?.creativeName,
    creative_slot: product.analytics?.creativeSlot,
    promotion_name: product.analytics?.promotionName,
    price: product.installmentsPrice,
    affiliation: 'porto'
  }))

  pushEvent({
    event: 'add_to_cart',
    evAction: 'ecommerce:add:carrinho:sucesso',
    currency: 'BRL',
    value: sumProductPrices(products),
    items
  })
}

async function dispatchLeadQuotation(input: DispatchServiceEventInput) {
  const response = input.result?.data as LeadQuotationResponse | undefined
  const analytics = response?.quotation?.quotationResult?.analytics
  const leadId = response?.quotation?.quotationResult?.lead?.idLead

  if (!analytics || !leadId) return

  pushEvent({
    event: 'lead',
    evAction: 'lead:sucesso',
    evLabel: 'pf',
    method: 'tipo-contato:padrao',
    leadId,
    clientId: analytics.client_id,
    clientBcp: analytics.client_bcp,
    clientEmail: analytics.client_email,
    clientPhone: analytics.client_phone,
    clientPhoneE164: analytics.client_phone_e164,
    clientFirstName: analytics.client_first_name,
    clientLastName: analytics.client_last_name
  })
}

export async function dispatchServiceEvent(
  input: DispatchServiceEventInput
): Promise<void> {
  const key = `${input.service.action}/${input.service.module}`

  try {
    switch (key) {
      case 'lead/support':
        await dispatchLeadSupport(input)
        break
      case 'proposal/proposal':
        if (input.service.successEvent === 'add_to_cart') {
          dispatchProductsAddedToCart(input)
        } else {
          await dispatchProposalSent(input)
        }
        break
      case 'quotation/quotation':
        await dispatchLeadQuotation(input)
        break
    }
  } catch {
    console.warn(
      '[analytics] Falha ao registrar evento de sucesso do serviço:',
      key
    )
  }
}
