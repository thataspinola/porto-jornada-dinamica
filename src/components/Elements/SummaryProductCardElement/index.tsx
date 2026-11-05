'use client'

import { Link } from '@porto-stack/ui'
import { useEffect, useRef } from 'react'

import { buildGtmAttrs, formatGtmText, formatPrice, pushEvent } from '@/utils'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import {
  PlanCoverageDrawer,
  PROMOTION_CREATIVE_NAME,
  PROMOTION_CREATIVE_SLOT
} from '@/components/Elements/PlanCardElement'
import {
  useCoveragePlans,
  usePlanSelection
} from '@/components/Elements/PlanCardElement/hooks'
import { Icon } from '@/components/UI/Icon'
import { Text } from '@/components/UI/Text/Text'

import styles from './SummaryProductCardElement.module.scss'
import type { SummaryProductCardElementProps } from './types'
import { useSummaryProductPlan } from './useSummaryProductPlan'

export function SummaryProductCardElement({
  element
}: SummaryProductCardElementProps) {
  const {
    sourcePath,
    productTitle,
    productSuffix,
    changePlanUrl,
    defaultPerField,
    coverageLabel,
    drawerSlug,
    itemListName,
    itemListId,
    discount,
    cssProperties
  } = element.config
  const { navigateTo } = useJourneyNavigation()
  const { stepTitle } = useJourneyStepForm()
  const plans = useCoveragePlans(sourcePath)
  const { plan, totalInstallmentsPrice, productVariant } =
    useSummaryProductPlan(plans, defaultPerField, productSuffix)
  const { initializePlan, getTurbineValues } = usePlanSelection({
    productTitle,
    housingType: productVariant,
    itemListName,
    itemListId,
    discount
  })
  const hasSentViewItemRef = useRef(false)

  useEffect(() => {
    if (!plan) return
    initializePlan(plan, plans)
  }, [plan, plans])

  useEffect(() => {
    if (
      hasSentViewItemRef.current ||
      !plan ||
      totalInstallmentsPrice === undefined
    ) {
      return
    }

    const hasTurbine = getTurbineValues(plan).length > 0

    pushEvent({
      event: 'view_item',
      evAction: 'ecommerce:visualizar:produto:sucesso',
      currency: 'BRL',
      value: totalInstallmentsPrice,
      items: [
        {
          item_id: plan.product.sku,
          item_name: productTitle ? formatGtmText(productTitle) : undefined,
          item_category: formatGtmText(plan.title),
          item_brand: 'porto',
          item_variant: productVariant
            ? `tipo-moradia:${formatGtmText(productVariant)}`
            : undefined,
          item_list_name: itemListName,
          item_list_id: itemListId,
          discount,
          creative_name: hasTurbine ? PROMOTION_CREATIVE_NAME : undefined,
          creative_slot: hasTurbine ? PROMOTION_CREATIVE_SLOT : undefined,
          price: totalInstallmentsPrice,
          affiliation: 'porto'
        }
      ]
    })
    hasSentViewItemRef.current = true
  }, [
    plan,
    productTitle,
    productVariant,
    totalInstallmentsPrice,
    itemListName,
    itemListId,
    discount,
    getTurbineValues
  ])

  if (!plan) return null

  const subtitle = [plan.title, productVariant].filter(Boolean).join(' - ')

  return (
    <div
      className={styles.card}
      style={cssProperties}
      {...buildGtmAttrs({
        kind: 'click-component',
        stepTitle,
        componentName: 'summary-product-card',
        target: 'self',
        title: productTitle,
        subtitle: plan.title
      })}>
      <button
        className={styles.cardAction}
        type="button"
        aria-label="Alterar plano"
        {...buildGtmAttrs({
          kind: 'button',
          stepTitle,
          label: 'alterar-plano'
        })}
        onClick={() => navigateTo(changePlanUrl)}>
        <Icon icon="short-arrow-right" color="neutral-700" size={16} />
      </button>

      <Text
        text={subtitle}
        variant="body2"
        color="neutral-800"
        className={styles.subtitle}
      />
      <Text
        text={productTitle}
        variant="title5"
        color="neutral-black"
        className={styles.title}
      />
      <Text
        text={
          totalInstallmentsPrice !== undefined
            ? `${plan.product.installments}x R$ ${formatPrice(totalInstallmentsPrice)}`
            : plan.summaryPrice
        }
        variant="title5"
        color="seguro-900"
        className={styles.price}
      />

      <Link asChild>
        <button
          type="button"
          className={styles.coverageLink}
          {...buildGtmAttrs({
            kind: 'button',
            stepTitle,
            label: coverageLabel
          })}
          onClick={() => navigateTo(`?drawer=${drawerSlug}`)}>
          {coverageLabel}
        </button>
      </Link>

      <PlanCoverageDrawer plan={plan} slug={drawerSlug} />
    </div>
  )
}
