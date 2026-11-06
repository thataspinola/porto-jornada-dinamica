import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { vi } from 'vitest'

import '@/components/Core/JourneyRenderElements'
import { JourneyStepFormContext } from '@/components/Core/JourneyStepForm/context'
import { ConditionalWrapperElement } from '@/components/Elements/ConditionalWrapperElement'
import type { ConditionalWrapperElementProps } from '@/components/Elements/ConditionalWrapperElement/types'
import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'
import { ServiceError } from '@/services/types'
import { useJourneyStore } from '@/store/journeyStore'
import type { ServiceErrorsConfig } from '@/validation/schemas'
import {
  journeys,
  recommendedProducts
} from '../../../../fixtures/recommendedProducts'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/contrate/financiamento-de-veiculos/cpf',
  useSearchParams: () => new URLSearchParams()
}))

function Harness({ slug }: { slug: string }) {
  const journey = journeys.find((entry) => entry.slug === slug)!
  const methods = useForm({ defaultValues: { taxvat: '' } })
  const { handleServiceError } = useServiceErrorHandler(methods)
  const element = recommendedProducts(
    journey
  ) as ConditionalWrapperElementProps['element']

  return (
    <FormProvider {...methods}>
      <JourneyStepFormContext.Provider
        value={{
          requestAction: () => {},
          activeAction: null,
          activeServiceIndex: 0,
          isMutationPending: false,
          formId: 'cpf-form',
          commitFields: () => {},
          navigateTo: () => {},
          isStepComplete: true,
          stepTitle: 'CPF'
        }}
      >
        <button
          type="button"
          onClick={() =>
            handleServiceError(new ServiceError('NOT_ELIGIBLE', 422))
          }
        >
          Validar CPF
        </button>
        <ConditionalWrapperElement element={element} />
      </JourneyStepFormContext.Provider>
    </FormProvider>
  )
}

it.each(
  journeys
)('exibe os cards e uma promoção após NOT_ELIGIBLE em $slug', async (journey) => {
  useJourneyStore.getState().reset()
  useJourneyStore.getState().mergeBusiness({ journeySlug: journey.slug })
  useJourneyStore.getState().setErrors(journey.errors as ServiceErrorsConfig)
  window.dataLayer = []
  const user = userEvent.setup()
  render(<Harness slug={journey.slug} />)
  expect(screen.queryByText('Produtos recomendados')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Validar CPF' }))
  expect(await screen.findByText('Empréstimo Consignado')).toBeVisible()
  expect(screen.getByText('Empréstimo Pessoal')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Validar CPF' }))
  await waitFor(() =>
    expect(
      window.dataLayer.filter(
        (entry) => (entry as { event?: string })?.event === 'view_promotion'
      )
    ).toHaveLength(1)
  )
})
