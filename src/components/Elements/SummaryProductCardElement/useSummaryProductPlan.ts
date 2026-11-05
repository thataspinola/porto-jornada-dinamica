'use client'

import { resolveTemplates } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { useProducts } from '@/hooks/useProducts'

import type { PlanViewModel } from '@/components/Elements/PlanCardElement/hooks'

import type { SummaryProductCardDefaultPerField } from './types'

function getDefaultPlanName(
  defaultPerField: SummaryProductCardDefaultPerField,
  fields: Record<string, unknown>
): string | undefined {
  if (!defaultPerField) return undefined

  for (const [fieldName, mapping] of Object.entries(defaultPerField)) {
    const fieldValue = fields[fieldName]
    if (fieldValue != null && mapping[String(fieldValue)]) {
      return mapping[String(fieldValue)]
    }
  }

  return undefined
}

export function useSummaryProductPlan(
  plans: PlanViewModel[],
  defaultPerField: SummaryProductCardDefaultPerField,
  productSuffix?: string
) {
  const { products, totalInstallmentsPrice } = useProducts()
  const fields = useJourneyStore((state) => state.fields)

  const defaultPlanName = getDefaultPlanName(defaultPerField, fields)
  const defaultPlan = plans.find((p) => p.product.name === defaultPlanName)
  const selectedPlan = plans.find((p) =>
    products.some((product) => product.id === p.product.id)
  )

  const isPlanSelected = Boolean(fields.isPlanSelected)
  const plan =
    (isPlanSelected ? selectedPlan : undefined) ??
    defaultPlan ??
    selectedPlan ??
    plans[0]
  const resolvedProductSuffix = resolveTemplates(productSuffix, { fields })
  const productVariant =
    typeof resolvedProductSuffix === 'string'
      ? resolvedProductSuffix
      : undefined

  return { plan, totalInstallmentsPrice, productVariant }
}
