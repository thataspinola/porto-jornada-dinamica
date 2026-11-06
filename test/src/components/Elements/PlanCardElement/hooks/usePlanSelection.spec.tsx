import { fireEvent, render } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'

import { formatGtmText } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import {
  adaptCoveragePlans,
  type PlanViewModel
} from '@/components/Elements/PlanCardElement/hooks/coveragePlans'
import { usePlanSelection } from '@/components/Elements/PlanCardElement/hooks/usePlanSelection'

const [plan] = adaptCoveragePlans([
  {
    sku: '1360-4',
    plan_name: 'Plano 100',
    amount: '238,80',
    installments: '12',
    installment_price: '19,90',
    boosted: {
      sku: '1360-4-cellphone',
      plan_name: 'Plano 100',
      amount: '358,80',
      installments: '12',
      installment_price: '29,90',
      coverage_phone_name: 'Proteção para roubo do celular'
    }
  }
])
const boostedProduct = plan.turbine?.options.find(
  (option) => option.kind === 'boosted'
)?.product

const noContextPlanProduct = {
  ...plan.product,
  analytics: {
    itemCategory: formatGtmText(plan.title),
    itemVariant: undefined,
    itemListName: undefined,
    itemListId: undefined,
    discount: undefined
  }
}

function PlanSelectionHarness({
  selectedPlan,
  plans
}: {
  selectedPlan: PlanViewModel
  plans: PlanViewModel[]
}) {
  const { initializePlan, selectPlan } = usePlanSelection()

  return (
    <>
      <button type="button" onClick={() => initializePlan(selectedPlan, plans)}>
        initialize
      </button>
      <button
        type="button"
        onClick={() => selectPlan(selectedPlan, [selectedPlan.product.id], [])}
      >
        select
      </button>
    </>
  )
}

function FormHarness({
  selectedPlan,
  plans
}: {
  selectedPlan: PlanViewModel
  plans: PlanViewModel[]
}) {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <PlanSelectionHarness selectedPlan={selectedPlan} plans={plans} />
    </FormProvider>
  )
}

describe('usePlanSelection', () => {
  beforeEach(() => {
    useJourneyStore.getState().reset()
  })

  it('preserves a selected boosted product when initializing the summary plan', () => {
    expect(plan).toBeDefined()
    expect(boostedProduct).toBeDefined()

    useJourneyStore.getState().mergeFields({
      products: [plan.product, boostedProduct]
    })

    const { getByRole } = render(
      <FormHarness selectedPlan={plan} plans={[plan]} />
    )

    fireEvent.click(getByRole('button', { name: 'initialize' }))

    const fields = useJourneyStore.getState().fields
    expect(fields.products).toEqual([plan.product, boostedProduct])
    expect(fields.productSku).toBe('1360-4-cellphone')
  })

  it('removes stale products from previous quotations on initializePlan', () => {
    const staleProduct = {
      id: 'old-product-999',
      sku: 'old-sku-999',
      name: 'Old Plan',
      amount: 100,
      installments: 12,
      installmentsPrice: 10
    }

    useJourneyStore.getState().mergeFields({
      products: [staleProduct]
    })

    const { getByRole } = render(
      <FormHarness selectedPlan={plan} plans={[plan]} />
    )

    fireEvent.click(getByRole('button', { name: 'initialize' }))

    const fields = useJourneyStore.getState().fields
    expect(fields.products).toEqual([noContextPlanProduct])
  })

  it('sets isPlanSelected to true when selectPlan is executed', () => {
    const { getByRole } = render(
      <FormHarness selectedPlan={plan} plans={[plan]} />
    )

    fireEvent.click(getByRole('button', { name: 'select' }))

    const fields = useJourneyStore.getState().fields
    expect(fields.isPlanSelected).toBe(true)
    expect(fields.products).toEqual([noContextPlanProduct])
  })
})
