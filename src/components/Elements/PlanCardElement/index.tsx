'use client'

import { useEffect, useRef } from 'react'

import {
  buildGtmAttrs,
  formatGtmText,
  formatPrice,
  pushEvent,
  resolveTemplates
} from '@/utils'
import type { Item } from '@/utils/pushEvent'

import { useJourneyStore } from '@/store/journeyStore'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
import { useSearchParam } from '@/hooks/useSearchParam'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'

import { PlanCard } from './components/PlanCard'
import { PlanCoverageDrawer } from './components/PlanCoverageDrawer'
import { PROMOTION_CREATIVE_NAME, PROMOTION_CREATIVE_SLOT } from './constants'
import {
  getPlanTotalPrice,
  getProposalFields,
  type PlanViewModel,
  useCoveragePlans,
  usePlanSelection
} from './hooks'
import styles from './PlanCardElement.module.scss'
import type { PlanCardElementProps } from './types'

type TurbineOption = NonNullable<PlanViewModel['turbine']>['options'][number]

function sumItemPrices(items: Item[]): number {
  return items.reduce((total, item) => total + Number(item.price ?? 0), 0)
}

function buildViewItem(
  plan: PlanViewModel,
  productTitle: string | undefined,
  housingType: string | undefined,
  itemListName: string | undefined,
  itemListId: string | undefined,
  discount: number | undefined
): Item {
  return {
    item_id: plan.product.sku,
    item_name: productTitle ? formatGtmText(productTitle) : undefined,
    item_category: formatGtmText(plan.title),
    item_brand: 'porto',
    item_variant: housingType
      ? `tipo-moradia:${formatGtmText(housingType)}`
      : undefined,
    price: plan.product.installmentsPrice,
    item_list_name: itemListName,
    item_list_id: itemListId,
    discount,
    affiliation: 'porto'
  }
}

function getSelectedTurbineOptions(
  plan: PlanViewModel,
  turbineValues: string[]
): TurbineOption[] {
  return (
    plan.turbine?.options.filter((option) =>
      turbineValues.includes(option.id)
    ) ?? []
  )
}

function buildCartItem(
  plan: PlanViewModel,
  turbineValues: string[],
  productTitle: string | undefined,
  housingType: string | undefined
): Item {
  const selectedOptions = getSelectedTurbineOptions(plan, turbineValues)
  const { productSku } = getProposalFields(plan, turbineValues)
  const turbineDescriptions = selectedOptions
    .map((option) => option.description ?? option.label)
    .join('|')
  const housingVariant = housingType
    ? `tipo-moradia:${formatGtmText(housingType)}`
    : undefined
  const turbineVariant = selectedOptions
    .map((option) => formatGtmText(option.label))
    .filter(Boolean)
    .join('|')
  const itemVariant =
    [housingVariant, turbineVariant].filter(Boolean).join('|') || undefined
  const price = getPlanTotalPrice(plan, turbineValues)

  return {
    item_id: productSku,
    item_name: productTitle ? formatGtmText(productTitle) : undefined,
    item_category: formatGtmText(plan.title),
    item_brand: 'porto',
    item_variant: itemVariant,
    creative_name: PROMOTION_CREATIVE_NAME,
    creative_slot: PROMOTION_CREATIVE_SLOT,
    promotion_name: turbineDescriptions || undefined,
    price,
    affiliation: 'porto'
  }
}

export function PlanCardElement({ element }: PlanCardElementProps) {
  const {
    sourcePath,
    drawerSlugPrefix,
    returnUrl,
    productTitle,
    productSuffix,
    itemListName,
    itemListId,
    discount
  } = element.config
  const { navigateTo } = useJourneyNavigation()
  const plans = useCoveragePlans(sourcePath)
  const { stepTitle } = useJourneyStepForm()
  const fields = useJourneyStore((state) => state.fields)
  const resolvedHousingType = resolveTemplates(productSuffix, { fields })
  const housingType =
    typeof resolvedHousingType === 'string' ? resolvedHousingType : undefined
  const { getTurbineValues, selectPlan, toggleTurbine } = usePlanSelection({
    productTitle,
    housingType,
    itemListName,
    itemListId,
    discount
  })
  const selectableProductIds = plans.flatMap((plan) => [
    plan.product.id,
    ...(plan.turbine?.options.map((option) => option.product.id) ?? [])
  ])
  const [activeDrawer, setActiveDrawer] = useSearchParam('drawer')
  const activePlan = plans.find(
    (plan) => `${drawerSlugPrefix}-${plan.id}` === activeDrawer
  )
  const hasSentViewItemRef = useRef(false)

  useEffect(() => {
    if (hasSentViewItemRef.current || plans.length === 0) return

    const items = plans.map((plan) =>
      buildViewItem(
        plan,
        productTitle,
        housingType,
        itemListName,
        itemListId,
        discount
      )
    )

    pushEvent({
      event: 'view_item',
      evAction: 'ecommerce:visualizar:produto:sucesso',
      currency: 'BRL',
      value: sumItemPrices(items),
      items
    })
    hasSentViewItemRef.current = true
  }, [plans, productTitle, housingType, itemListName, itemListId, discount])

  function handleSelect(plan: PlanViewModel) {
    const turbineValues = getTurbineValues(plan)
    const cartItems = [
      buildCartItem(plan, turbineValues, productTitle, housingType)
    ]

    pushEvent({
      event: 'add_to_cart',
      evAction: 'ecommerce:add:carrinho:sucesso',
      currency: 'BRL',
      value: sumItemPrices(cartItems),
      items: cartItems
    })

    selectPlan(plan, selectableProductIds, turbineValues)
    navigateTo(returnUrl, { removeSearchParams: ['drawer'] })
  }

  function handleTurbineChange(
    plan: PlanViewModel,
    optionId: string,
    checked: boolean
  ) {
    const option = plan.turbine?.options.find(
      (current) => current.id === optionId
    )
    if (!option) return

    const currentValues = getTurbineValues(plan)
    toggleTurbine(plan, optionId, checked, currentValues)

    pushEvent({
      event: 'select_content',
      evLabel: option.label,
      evAction: `${checked ? 'check' : 'uncheck'}:${formatGtmText(stepTitle)}`
    })
  }

  return (
    <>
      <div className={styles.group}>
        {plans.map((plan) => {
          const turbineValues = getTurbineValues(plan)
          const priceValue = formatPrice(getPlanTotalPrice(plan, turbineValues))

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              turbineValues={turbineValues}
              priceValue={priceValue}
              gtmAttrs={buildGtmAttrs({
                kind: 'button',
                stepTitle,
                label: plan.cta?.label ?? 'Escolher este plano'
              })}
              detailsGtmAttrs={buildGtmAttrs({
                kind: 'click-component',
                stepTitle,
                componentName: 'plan-card',
                target: 'button',
                title: plan.title,
                subtitle: priceValue,
                label: plan.details?.label ?? 'Ver detalhes'
              })}
              onSelect={() => handleSelect(plan)}
              onTurbineChange={(optionId, checked) =>
                handleTurbineChange(plan, optionId, checked)
              }
              onDetails={() =>
                setActiveDrawer(`${drawerSlugPrefix}-${plan.id}`)
              }
            />
          )
        })}
      </div>
      {activePlan && (
        <PlanCoverageDrawer
          plan={activePlan}
          slug={`${drawerSlugPrefix}-${activePlan.id}`}
        />
      )}
    </>
  )
}

export { PlanCoverageDrawer } from './components/PlanCoverageDrawer'
export { PROMOTION_CREATIVE_NAME, PROMOTION_CREATIVE_SLOT } from './constants'
