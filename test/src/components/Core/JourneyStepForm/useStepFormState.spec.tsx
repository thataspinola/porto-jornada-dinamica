import { act, renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import type { JourneyStep } from '@/components/Core/JourneyStepForm/types'
import { useStepFormState } from '@/components/Core/JourneyStepForm/useStepFormState'
import { useJourneyStore } from '@/store/journeyStore'

function step(empty = false, prefill = false): JourneyStep {
  return {
    id: 'dados',
    name: 'Dados',
    slug: 'dados',
    empty,
    elements: [
      {
        id: 'name',
        type: 'TEXT_INPUT',
        config: {
          name: 'name',
          required: true,
          validations: [],
          defaultValue: prefill ? '' : 'Padrão',
          ...(prefill
            ? { defaultValueFrom: { service: 'customer', path: 'name' } }
            : {})
        }
      }
    ]
  } as JourneyStep
}
beforeEach(async () => {
  vi.restoreAllMocks()
  useJourneyStore.getState().reset()
  await useJourneyStore.persist.rehydrate()
})
afterEach(() => vi.restoreAllMocks())

it('mantém campos persistidos ao hidratar uma etapa normal', () => {
  useJourneyStore.getState().mergeFields({ name: 'Persistido' })
  const currentStep = step()
  const { result } = renderHook(() => useStepFormState(currentStep))
  expect(result.current.methods.getValues('name')).toBe('Persistido')
})
it('ignora a persistência na etapa configurada como vazia', () => {
  useJourneyStore.getState().mergeFields({ name: 'Persistido' })
  const currentStep = step(true)
  const { result } = renderHook(() => useStepFormState(currentStep))
  expect(result.current.methods.getValues('name')).toBe('Padrão')
})
it('aplica prefill e preserva o que o usuário já alterou', async () => {
  useJourneyStore
    .getState()
    .mergeServices({ customer: { name: 'Pré-preenchido' } })
  const currentStep = step(false, true)
  const { result, rerender } = renderHook(() => useStepFormState(currentStep))
  await waitFor(() =>
    expect(result.current.methods.getValues('name')).toBe('Pré-preenchido')
  )
  await act(async () =>
    result.current.methods.setValue('name', 'Digitado', { shouldDirty: true })
  )
  await act(async () =>
    useJourneyStore
      .getState()
      .mergeServices({ customer: { name: 'Atualizado no serviço' } })
  )
  rerender()
  expect(result.current.methods.getValues('name')).toBe('Digitado')
  expect(result.current.isStepComplete).toBe(true)
})
it('acompanha hidratação tardia e remove a assinatura ao desmontar', async () => {
  let finish: Parameters<typeof useJourneyStore.persist.onFinishHydration>[0]
  const unsubscribe = vi.fn()
  vi.spyOn(useJourneyStore.persist, 'hasHydrated').mockReturnValue(false)
  vi.spyOn(useJourneyStore.persist, 'onFinishHydration').mockImplementation(
    (callback) => {
      finish = callback
      return unsubscribe
    }
  )
  const currentStep = step()
  const { result, unmount } = renderHook(() => useStepFormState(currentStep))
  await act(async () => {
    useJourneyStore.getState().mergeFields({ name: 'Hidratado' })
    finish(useJourneyStore.getState())
  })
  expect(result.current.methods.getValues('name')).toBe('Hidratado')
  unmount()
  expect(unsubscribe).toHaveBeenCalledOnce()
})
