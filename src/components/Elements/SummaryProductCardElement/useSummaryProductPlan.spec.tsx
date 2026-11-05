import { renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useJourneyStore } from '@/store/journeyStore'

import { adaptCoveragePlans } from '@/components/Elements/PlanCardElement/hooks'

import { useSummaryProductPlan } from './useSummaryProductPlan'

const plans = adaptCoveragePlans([
  {
    sku: '1360-1',
    plan_name: 'Plano 300',
    amount: '358,80',
    installments: '12',
    installment_price: '29,90'
  },
  {
    sku: '1360-2',
    plan_name: 'Plano 500',
    amount: '598,80',
    installments: '12',
    installment_price: '49,90'
  },
  {
    sku: '1360-3',
    plan_name: 'Plano 700',
    amount: '778,80',
    installments: '12',
    installment_price: '64,90'
  }
])

const defaultPerField = {
  planPropertyType: {
    Casa: 'Plano 700',
    Apartamento: 'Plano 500'
  }
}

function Wrapper({ children }: PropsWithChildren) {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('useSummaryProductPlan', () => {
  beforeEach(() => {
    useJourneyStore.getState().reset()
  })

  it('selects Plano 700 by default when planPropertyType is Casa', () => {
    useJourneyStore.getState().mergeFields({ planPropertyType: 'Casa' })

    const { result } = renderHook(
      () => useSummaryProductPlan(plans, defaultPerField),
      { wrapper: Wrapper }
    )

    expect(result.current.plan.title).toBe('Plano 700')
  })

  it('selects Plano 500 by default when planPropertyType is Apartamento', () => {
    useJourneyStore.getState().mergeFields({ planPropertyType: 'Apartamento' })

    const { result } = renderHook(
      () => useSummaryProductPlan(plans, defaultPerField),
      { wrapper: Wrapper }
    )

    expect(result.current.plan.title).toBe('Plano 500')
  })

  it('prioritizes user-selected plan when isPlanSelected is true', () => {
    useJourneyStore.getState().mergeFields({
      planPropertyType: 'Casa',
      isPlanSelected: true,
      products: [plans[0].product]
    })

    const { result } = renderHook(
      () => useSummaryProductPlan(plans, defaultPerField),
      { wrapper: Wrapper }
    )

    expect(result.current.plan.title).toBe('Plano 300')
  })
})
