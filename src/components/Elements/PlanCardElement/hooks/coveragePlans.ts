import { z } from 'zod'

import { formatPrice, sanitize } from '@/utils'

import type { Product } from '@/hooks/useProducts'

export type PlanOption = {
  sku?: string
  title: string
  description?: string
  amount: string
  installments: string
  installment_price: string
}

export type PlanProduct = {
  sku: string
  plan_name: string
  amount: string
  installments: string
  installment_price: string
  plan_description_of_the_free_services?: string
  plan_free_services?: string
  coverage_basic_name?: string
  coverage_basic_description?: string
  coverage_basic_value?: string
  coverage_multi_name?: string
  coverage_multi_description?: string
  coverage_multi_value?: string
  coverage_damage_third_parties_name?: string
  coverage_damage_third_parties_description?: string
  coverage_damage_third_parties_value?: string
  coverage_phone_name?: string | null
  coverage_phone_description?: string | null
  coverage_phone_value?: string | null
  option_title?: string
  option_amount?: string
  option_installments?: string
  option_installment_price?: string
  options?: PlanOption[]
  boosted?: PlanProduct | null
  plan_title_of_the_free_services?: string
  plan_explanation_title_of_the_free_services?: string
  plan_explanation_of_the_free_services?: string
}

const planProductSchema: z.ZodType<PlanProduct> = z.lazy(() =>
  z
    .object({
      sku: z.string(),
      plan_name: z.string(),
      amount: z.string(),
      installments: z.string(),
      installment_price: z.string(),
      plan_description_of_the_free_services: z.string().optional(),
      plan_free_services: z.string().optional(),
      coverage_basic_name: z.string().optional(),
      coverage_basic_description: z.string().optional(),
      coverage_basic_value: z.string().optional(),
      coverage_multi_name: z.string().optional(),
      coverage_multi_description: z.string().optional(),
      coverage_multi_value: z.string().optional(),
      coverage_damage_third_parties_name: z.string().optional(),
      coverage_damage_third_parties_description: z.string().optional(),
      coverage_damage_third_parties_value: z.string().optional(),
      coverage_phone_name: z.string().nullable().optional(),
      coverage_phone_description: z.string().nullable().optional(),
      coverage_phone_value: z.string().nullable().optional(),
      option_title: z.string().optional(),
      option_amount: z.string().optional(),
      option_installments: z.string().optional(),
      option_installment_price: z.string().optional(),
      options: z
        .array(
          z.object({
            sku: z.string().optional(),
            title: z.string(),
            description: z.string().optional(),
            amount: z.string(),
            installments: z.string(),
            installment_price: z.string()
          })
        )
        .optional(),
      boosted: z
        .lazy(() => planProductSchema)
        .nullable()
        .optional(),
      plan_title_of_the_free_services: z.string().optional(),
      plan_explanation_title_of_the_free_services: z.string().optional(),
      plan_explanation_of_the_free_services: z.string().optional()
    })
    .passthrough()
)

export function parseCoverageProducts(value: unknown): PlanProduct[] {
  if (value === undefined || value === null) return []

  return z.array(planProductSchema).parse(value)
}

function parseLocalizedNumber(value: string): number {
  const normalized = value.includes(',')
    ? value.replace(/\./g, '').replace(',', '.')
    : value
  const parsed = Number(normalized)

  if (!Number.isFinite(parsed)) {
    throw new Error(`Valor numérico inválido: ${value}`)
  }

  return parsed
}

export type PlanCoverageDetail = {
  title: string
  value?: string
  description?: string
}

export type PlanServiceDetails = {
  title: string
  description?: string
  items: string[]
}

export type PlanViewModel = {
  id: string
  product: Product
  highlighted?: boolean
  badge?: string
  title: string
  installments?: string
  price: {
    prefix?: string
    value: string
    suffix?: string
  }
  cta?: {
    label?: string
    indemnity?: string
  }
  coverages?: {
    label?: string
    items: Array<{
      title: string
      description?: string
    }>
  }
  turbine?: {
    label?: string
    options: Array<{
      id: string
      kind: 'option' | 'boosted'
      product: Product
      label: string
      description?: string
      additionalPrice?: string
      disabled?: boolean
    }>
  }
  details?: {
    label?: string
  }
  summaryPrice: string
  coverageDetails: PlanCoverageDetail[]
  serviceDetails?: PlanServiceDetails
}

export function getPlanTotalPrice(
  plan: PlanViewModel,
  selectedOptionIds: string[]
): number {
  const selectedOptions =
    plan.turbine?.options.filter((option) =>
      selectedOptionIds.includes(option.id)
    ) ?? []

  return selectedOptions.reduce(
    (total, option) => total + option.product.installmentsPrice,
    plan.product.installmentsPrice
  )
}

export function getProposalFields(
  plan: PlanViewModel,
  selectedOptionIds: string[]
) {
  const selectedOptions =
    plan.turbine?.options.filter((option) =>
      selectedOptionIds.includes(option.id)
    ) ?? []
  const boostedOption = selectedOptions.find(
    (option) => option.kind === 'boosted'
  )

  return {
    productSku: boostedOption?.product.sku ?? plan.product.sku,
    boost: selectedOptions.some((option) => option.kind === 'option')
      ? '1'
      : '0'
  }
}

function formatMoney(value: string | null | undefined) {
  if (!value) return undefined

  return formatPrice(parseLocalizedNumber(value))
}

function adaptCoverage(
  title: string | null | undefined,
  description: string | null | undefined,
  value: string | null | undefined
) {
  if (!title) return undefined

  const formattedValue = formatMoney(value)
  return {
    card: {
      title,
      description: formattedValue
        ? `Até R$ ${formattedValue}`
        : description
          ? sanitize.dom(description)
          : undefined
    },
    detail: {
      title,
      value: formattedValue ? `R$ ${formattedValue}` : undefined,
      description: description ? sanitize.dom(description) : undefined
    }
  }
}

type CoverageGroup = {
  key: string
  name?: string
  description?: string
  value?: string
}

function getCoverageGroups(product: PlanProduct): CoverageGroup[] {
  const groups = new Map<string, CoverageGroup>()

  for (const [field, value] of Object.entries(product)) {
    const match = field.match(/^coverage_(.+)_(name|description|value)$/)
    if (!match || typeof value !== 'string') continue

    const [, key, property] = match
    const group = groups.get(key) ?? { key }
    group[property as 'name' | 'description' | 'value'] = value
    groups.set(key, group)
  }

  return [...groups.values()].filter((group) => group.name)
}

function getPriceDelta(total: string | undefined, baseTotal: string) {
  return total
    ? parseLocalizedNumber(total) - parseLocalizedNumber(baseTotal)
    : 0
}

function formatAdditionalPrice(value: number) {
  return `+R$ ${formatPrice(value)}/mês`
}

function getPlanOptions(product: PlanProduct): PlanOption[] {
  if (product.options) return product.options
  if (!product.option_title) return []

  return [
    {
      title: product.option_title,
      amount: product.option_amount ?? product.amount,
      installments: product.option_installments ?? product.installments,
      installment_price: product.option_installment_price ?? '0'
    }
  ]
}

export function adaptCoveragePlans(products: PlanProduct[]): PlanViewModel[] {
  return products.map((product, index) => {
    const freeServices =
      product.plan_free_services
        ?.split(',')
        .map((service) => service.trim())
        .filter(Boolean) ?? []
    const freeServicesDescription =
      freeServices.length > 0 && product.plan_description_of_the_free_services
        ? sanitize.dom(product.plan_description_of_the_free_services)
        : undefined

    const coverageGroups = getCoverageGroups(product)
    const coverages = coverageGroups
      .map((coverage) =>
        adaptCoverage(coverage.name, coverage.description, coverage.value)
      )
      .filter((value) => value !== undefined)

    const turbineOptions: NonNullable<
      NonNullable<PlanViewModel['turbine']>['options']
    > = []

    getPlanOptions(product).forEach((option, optionIndex) => {
      const id =
        option.sku ??
        `${product.sku}-boost${optionIndex === 0 ? '' : `-${optionIndex + 1}`}`
      const installmentsPrice = parseLocalizedNumber(option.installment_price)

      turbineOptions.push({
        id,
        kind: 'option',
        product: {
          id,
          sku: id,
          name: `+ ${option.title}`,
          amount: getPriceDelta(option.amount, product.amount),
          installments: parseLocalizedNumber(option.installments),
          installmentsPrice
        },
        label: option.title,
        description: option.description
          ? sanitize.dom(option.description)
          : undefined,
        additionalPrice: formatAdditionalPrice(installmentsPrice)
      })
    })

    const boosted = product.boosted
    if (boosted?.sku) {
      const boostedCoverages = getCoverageGroups(boosted).filter(
        (coverage) =>
          !coverageGroups.some(
            (current) => current.key === coverage.key && current.name
          )
      )
      const boostedLabel =
        boostedCoverages.map((coverage) => coverage.name).join(', ') ||
        'Plano ampliado'
      const boostedDescription = boostedCoverages
        .map((coverage) =>
          [coverage.name, coverage.description].filter(Boolean).join(': ')
        )
        .join(' ')
      const id = `${product.sku}-boosted`
      const installmentsPrice = getPriceDelta(
        boosted.installment_price,
        product.installment_price
      )

      turbineOptions.push({
        id,
        kind: 'boosted',
        product: {
          id,
          sku: boosted.sku,
          name: `+ ${boostedLabel}`,
          amount: getPriceDelta(boosted.amount, product.amount),
          installments: parseLocalizedNumber(boosted.installments),
          installmentsPrice
        },
        label: boostedLabel,
        description: boostedDescription
          ? sanitize.dom(boostedDescription)
          : undefined,
        additionalPrice: formatAdditionalPrice(installmentsPrice)
      })
    }

    const turbine =
      turbineOptions.length > 0
        ? { label: 'Turbine', options: turbineOptions }
        : undefined

    return {
      id: product.sku,
      product: {
        id: product.sku,
        sku: product.sku,
        name: product.plan_name,
        amount: parseLocalizedNumber(product.amount),
        installments: parseLocalizedNumber(product.installments),
        installmentsPrice: parseLocalizedNumber(product.installment_price)
      },
      highlighted: index === 0,
      badge: index === 0 ? 'Maior proteção' : undefined,
      title: product.plan_name,
      installments: `${product.installments}x sem juros`,
      summaryPrice: `${product.installments}x R$ ${product.installment_price}`,
      price: {
        prefix: 'R$',
        value: product.installment_price,
        suffix: '/mês'
      },
      cta: {
        label: 'Escolher este plano',
        indemnity: product.coverage_basic_value
          ? `Indenização de até R$ ${formatMoney(product.coverage_basic_value)}`
          : undefined
      },
      coverages: {
        label: 'Principais coberturas',
        items: [
          ...(freeServices.length > 0
            ? [
                {
                  title: `Assistência grátis: ${freeServices.join(', ')}`,
                  description: freeServicesDescription
                }
              ]
            : []),
          ...coverages.map(({ card }) => card)
        ]
      },
      turbine,
      details: { label: 'Ver detalhes' },
      coverageDetails: coverages.map(({ detail }) => detail),
      serviceDetails:
        freeServices.length > 0
          ? {
              title:
                product.plan_title_of_the_free_services ?? 'Serviços gratuitos',
              description: freeServicesDescription,
              items: freeServices
            }
          : undefined
    }
  })
}
