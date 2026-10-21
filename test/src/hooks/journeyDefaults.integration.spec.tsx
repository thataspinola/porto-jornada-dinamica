import { act, renderHook } from '@testing-library/react'
import { useJourneyForm } from '@/hooks/useJourneyForm'
import { useJourneyStore } from '@/store'
import { journeySchema } from '@/validation/schemas'

const journey = journeySchema.parse({
  id: 'test',
  name: 'Teste',
  slug: 'teste',
  steps: [
    {
      id: 'cpf',
      name: 'CPF',
      slug: 'cpf',
      elements: [
        {
          id: 'cpf',
          type: 'CPF_INPUT',
          config: { name: 'taxvat', label: 'CPF', required: true },
        },
        {
          id: 'hidden',
          type: 'INPUT_HIDDEN',
          config: { name: 'product', value: 'test-product' },
        },
      ],
    },
  ],
})
afterEach(() =>
  useJourneyStore.setState({ fields: {}, services: {}, _hasHydrated: true })
)
it.each([
  true,
  false,
])('hidratação %s preserva defaults que não estavam na sessão', (hydrated) => {
  useJourneyStore.setState({
    fields: hydrated ? { taxvat: '52998224725' } : {},
    services: {},
    _hasHydrated: hydrated,
  })
  const { result } = renderHook(() => useJourneyForm(journey, journey.steps[0]))
  if (!hydrated)
    act(() =>
      useJourneyStore.setState({
        fields: { taxvat: '52998224725' },
        _hasHydrated: true,
      })
    )
  expect(result.current.getValues()).toMatchObject({
    taxvat: '52998224725',
    product: 'test-product',
  })
  expect(result.current.canProceed).toBe(true)
})
