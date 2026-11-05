import { act, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { vi } from 'vitest'

import { ConditionalWrapperElement } from '@/components/Elements/ConditionalWrapperElement'
import type { ConditionalWrapperElementProps } from '@/components/Elements/ConditionalWrapperElement/types'
import { useJourneyStore } from '@/store/journeyStore'
import {
  journeys,
  recommendedProducts
} from '../../../../fixtures/recommendedProducts'

// O teste unitário exercita o wrapper, visibilidade e analytics reais;
// os filhos pertencem aos testes de integração/funcionais.
vi.mock('@/components/Core/JourneyRenderElements/renderJourneyElement', () => ({
  renderJourneyElement: (element: { id: string }) => <span>{element.id}</span>
}))

let methods: UseFormReturn<{ taxvat: string }>
function Harness({ element }: ConditionalWrapperElementProps) {
  methods = useForm({ defaultValues: { taxvat: '' } })
  return (
    <FormProvider {...methods}>
      <ConditionalWrapperElement element={element} />
    </FormProvider>
  )
}

function block() {
  return recommendedProducts() as ConditionalWrapperElementProps['element']
}
function events() {
  return window.dataLayer.filter(
    (entry) => (entry as { event?: string })?.event === 'view_promotion'
  )
}
beforeEach(() => {
  window.dataLayer = []
  useJourneyStore.getState().reset()
  useJourneyStore.getState().mergeBusiness({ journeySlug: journeys[0].slug })
})

it('dispara uma vez na negativa, inclusive em StrictMode e re-render', async () => {
  const { rerender } = render(
    <StrictMode>
      <Harness element={block()} />
    </StrictMode>
  )
  expect(events()).toHaveLength(0)
  await act(async () =>
    methods.setError('taxvat', { type: 'server', message: 'Não elegível' })
  )
  expect(screen.getByText('cpf-error-produtos-title')).toBeVisible()
  expect(events()).toHaveLength(1)
  expect(events()[0]).toMatchObject({
    ev_action: 'ecommerce:visualizar:promocao:sucesso',
    items: [
      { item_name: 'Empréstimo Consignado' },
      { item_name: 'Empréstimo Pessoal' }
    ]
  })
  expect(events()[0]).not.toHaveProperty('currency')
  expect(events()[0]).not.toHaveProperty('value')
  rerender(
    <StrictMode>
      <Harness element={block()} />
    </StrictMode>
  )
  await act(async () => methods.clearErrors())
  await act(async () => methods.setError('taxvat', { type: 'server' }))
  expect(events()).toHaveLength(1)
})

it('não dispara em validação local ou em outros wrappers/jornadas', async () => {
  const element = block()
  const { rerender } = render(<Harness element={element} />)
  await act(async () => methods.setError('taxvat', { type: 'required' }))
  expect(events()).toHaveLength(0)
  await act(async () =>
    useJourneyStore
      .getState()
      .mergeBusiness({ journeySlug: 'seguro-residencial' })
  )
  await act(async () => methods.setError('taxvat', { type: 'server' }))
  expect(events()).toHaveLength(0)
  rerender(<Harness element={{ ...element, id: 'outro-wrapper' }} />)
  await act(async () =>
    useJourneyStore.getState().mergeBusiness({ journeySlug: journeys[0].slug })
  )
  expect(events()).toHaveLength(0)
})

it('aguarda o slug da jornada quando o bloco já está visível', async () => {
  useJourneyStore.getState().mergeBusiness({ journeySlug: undefined })
  render(<Harness element={block()} />)
  await act(async () => methods.setError('taxvat', { type: 'server' }))
  expect(events()).toHaveLength(0)
  await act(async () =>
    useJourneyStore.getState().mergeBusiness({ journeySlug: journeys[1].slug })
  )
  expect(events()).toHaveLength(1)
})
