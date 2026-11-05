'use client'

import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

import { formatGtmText } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { type Product, useProducts } from '@/hooks/useProducts'

import {
  PROMOTION_CREATIVE_NAME,
  PROMOTION_CREATIVE_SLOT
} from '../constants'
import { getProposalFields, type PlanViewModel } from './coveragePlans'

type TurbineOption = NonNullable<PlanViewModel['turbine']>['options'][number]

export type PlanAnalyticsContext = {
  productTitle?: string
  housingType?: string
  itemListName?: string
  itemListId?: string
  discount?: number
}

function buildPlanProductAnalytics(
  plan: PlanViewModel,
  context: PlanAnalyticsContext
): Product['analytics'] {
  return {
    itemCategory: formatGtmText(plan.title),
    itemVariant: context.housingType
      ? `tipo-moradia:${formatGtmText(context.housingType)}`
      : undefined,
    itemListName: context.itemListName,
    itemListId: context.itemListId,
    discount: context.discount
  }
}

function buildTurbineProductAnalytics(
  plan: PlanViewModel,
  option: TurbineOption
): Product['analytics'] {
  return {
    itemCategory: formatGtmText(plan.title),
    itemVariant: formatGtmText(option.label) || undefined,
    creativeName: PROMOTION_CREATIVE_NAME,
    creativeSlot: PROMOTION_CREATIVE_SLOT,
    promotionName: option.description ?? option.label
  }
}

function getSelectedTurbines(
  plan: PlanViewModel,
  optionIds: string[]
): Product[] {
  return (
    plan.turbine?.options
      .filter((option) => optionIds.includes(option.id))
      .map((option) => ({
        ...option.product,
        analytics: buildTurbineProductAnalytics(plan, option)
      })) ?? []
  )
}

export function usePlanSelection(context: PlanAnalyticsContext = {}) {
  const { products, addProduct, removeProduct, replaceProducts } = useProducts()
  const { setValue } = useFormContext()
  const mergeFields = useJourneyStore((state) => state.mergeFields)

  const getTurbineValues = useCallback(
    (plan: PlanViewModel) => {
      return (
        plan.turbine?.options
          .filter((option) =>
            products.some((product) => product.id === option.product.id)
          )
          .map((option) => option.id) ?? []
      )
    },
    [products]
  )

  const syncProposalFields = useCallback(
    (plan: PlanViewModel, selectedOptionIds: string[]) => {
      const fields = getProposalFields(plan, selectedOptionIds)

      mergeFields(fields)
      setValue('productSku', fields.productSku, {
        shouldDirty: true,
        shouldValidate: true
      })
      setValue('boost', fields.boost, {
        shouldDirty: true,
        shouldValidate: true
      })
    },
    [mergeFields, setValue]
  )

  const getAnalyticsPlanProduct = useCallback(
    (plan: PlanViewModel): Product => ({
      ...plan.product,
      analytics: buildPlanProductAnalytics(plan, context)
    }),
    [context]
  )

  const applyPlanSelection = useCallback(
    (
      plan: PlanViewModel,
      selectableProductIds: string[],
      selectedOptionIds: string[]
    ) => {
      const selectedTurbines = getSelectedTurbines(plan, selectedOptionIds)
      const selectedProducts = [
        getAnalyticsPlanProduct(plan),
        ...selectedTurbines
      ]
      const productIdsToRemove = [
        ...selectableProductIds,
        ...products.map((product) => product.id)
      ]

      replaceProducts(productIdsToRemove, selectedProducts)
      syncProposalFields(plan, selectedOptionIds)
    },
    [products, replaceProducts, syncProposalFields, getAnalyticsPlanProduct]
  )

  function selectPlan(
    plan: PlanViewModel,
    selectableProductIds: string[],
    turbineValues: string[]
  ) {
    applyPlanSelection(plan, selectableProductIds, turbineValues)
    mergeFields({ isPlanSelected: true })
  }

  function toggleTurbine(
    plan: PlanViewModel,
    optionId: string,
    checked: boolean,
    currentValues: string[]
  ) {
    const option = plan.turbine?.options.find(
      (current) => current.id === optionId
    )
    if (!option) return

    const nextValues = checked
      ? [...new Set([...currentValues, optionId])]
      : currentValues.filter((id) => id !== optionId)

    if (checked) {
      addProduct({
        ...option.product,
        analytics: buildTurbineProductAnalytics(plan, option)
      })
    } else {
      removeProduct(option.product.id)
    }

    syncProposalFields(plan, nextValues)
  }

  const initializePlan = useCallback(
    (plan: PlanViewModel, plans: PlanViewModel[]) => {
      const selectableProductIds = plans.flatMap((currentPlan) => [
        currentPlan.product.id,
        ...(currentPlan.turbine?.options.map((option) => option.product.id) ??
          [])
      ])

      const selectedOptionIds = getTurbineValues(plan)
      const selectedTurbines = getSelectedTurbines(plan, selectedOptionIds)
      const selectedProducts = [plan.product, ...selectedTurbines]
      const hasSelectedPlanProducts =
        products.length === selectedProducts.length &&
        products.every(
          (product, index) => product.id === selectedProducts[index]?.id
        )

      if (!hasSelectedPlanProducts) {
        applyPlanSelection(plan, selectableProductIds, selectedOptionIds)
      } else {
        syncProposalFields(plan, selectedOptionIds)
      }
    },
    [applyPlanSelection, getTurbineValues, products, syncProposalFields]
  )

  return {
    getTurbineValues,
    selectPlan,
    toggleTurbine,
    initializePlan
  }
}
