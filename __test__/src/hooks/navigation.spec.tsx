import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UseJourneyNavigationParams } from '@/hooks/useJourneyNavigation'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
import { useNavigationLock } from '@/hooks/useNavigationLock'
import { useJourneyService } from '@/hooks/useJourneyService'
import { useDataQuality } from '@/hooks/useDataQuality'
import { useClearPrefillOnInput } from '@/hooks/useClearPrefillOnInput'
import { useServiceErrorEffect } from '@/hooks/useServiceErrorEffect'
import { journeyStore } from '@/store/journeyStore'
import { journeySchema } from '@/validation/schemas'
import { callService } from '@/services'
import { redirectTo } from '@/utils'

vi.mock('@/services', () => ({ callService: vi.fn() }))
vi.mock('@/utils', async () => ({
  ...(await vi.importActual<typeof import('@/utils')>('@/utils')),
  redirectTo: vi.fn(),
}))
const journey = journeySchema.parse({
  id: 'test',
  slug: 'financiamento-de-veiculos',
  name: 'Teste',
  steps: [
    {
      id: 'first',
      slug: 'cpf',
      name: 'CPF',
      backStepSlug: '/',
      elements: [
        {
          id: 'cpf',
          type: 'CPF_INPUT',
          config: { name: 'taxvat', label: 'CPF' },
        },
      ],
    },
    { id: 'second', slug: 'dados', name: 'Dados', elements: [] },
  ],
})
function params(
  overrides: Partial<UseJourneyNavigationParams> = {}
): UseJourneyNavigationParams {
  return {
    journeySlug: journey.slug,
    steps: journey.steps,
    currentStep: journey.steps[0],
    currentStepIndex: 0,
    currentStepFields: ['taxvat'],
    setFormError: vi.fn(),
    getValues: vi.fn(() => ({
      taxvat: '52998224725',
    })) as unknown as UseJourneyNavigationParams['getValues'],
    trigger: vi.fn(async () => true),
    getFieldState: vi.fn(() => ({
      invalid: false,
      isDirty: false,
      isTouched: false,
      isValidating: false,
    })),
    handleSubmit: vi.fn((callback) => async () => {
      await callback({ taxvat: '52998224725' })
    }),
    ...overrides,
  }
}
beforeEach(() => {
  journeyStore.getState().reset()
  vi.mocked(callService).mockResolvedValue({ success: true, data: {} })
})
describe('navegação', () => {
  it('bloqueia avanço e guarda mensagens de validação', async () => {
    const options = params({
      trigger: vi.fn(async () => false),
      getFieldState: vi.fn(() => ({
        invalid: true,
        isDirty: false,
        isTouched: true,
        isValidating: false,
        error: { type: 'required', message: 'CPF inválido' },
      })),
    })
    const { result } = renderHook(() => useJourneyNavigation(options))
    await act(() => result.current.goNext({ type: 'next' }))
    expect(journeyStore.getState().error).toEqual({ taxvat: 'CPF inválido' })
    expect(redirectTo).not.toHaveBeenCalled()
    expect(callService).not.toHaveBeenCalled()
  })
  it('não inventa mensagens quando o campo inválido não tem mensagem', async () => {
    const { result } = renderHook(() =>
      useJourneyNavigation(params({ trigger: vi.fn(async () => false) }))
    )
    await act(() => result.current.goNext({ type: 'next' }))
    expect(journeyStore.getState().error).toEqual({})
  })
  it('mescla dados e avança para próxima etapa', async () => {
    const { result } = renderHook(() => useJourneyNavigation(params()))
    await act(() => result.current.goNext({ type: 'next' }))
    expect(redirectTo).toHaveBeenCalledWith('dados')
    expect(journeyStore.getState().fields).toEqual({ taxvat: '52998224725' })
  })
  it('navega somente após sucesso do serviço', async () => {
    const { result } = renderHook(() => useJourneyNavigation(params()))
    await act(() =>
      result.current.goNext({
        type: 'service',
        serviceName: 'eligibility',
        targetSlug: 'dados',
      })
    )
    expect(redirectTo).toHaveBeenCalledWith('dados')
    expect(journeyStore.getState().services).toEqual({
      eligibility: { success: true, data: {} },
    })
  })
  it.each([
    { success: false, message: 'Falha informada' },
    { success: false, error: 'Falha técnica' },
    { success: false },
  ])('propaga falhas e impede navegação', async (response) => {
    vi.mocked(callService).mockResolvedValue(response)
    const { result } = renderHook(() => useJourneyNavigation(params()))
    await act(() =>
      result.current.goNext({
        type: 'service',
        serviceName: 'eligibility',
        targetSlug: 'dados',
      })
    )
    expect(redirectTo).not.toHaveBeenCalled()
    expect(journeyStore.getState().error.service).toBe(
      response.message ?? response.error ?? 'Não foi possível continuar.'
    )
  })
  it('permite navegação declarativa sem campos e não age sem etapa', async () => {
    const { result, rerender } = renderHook(
      ({ options }) => useJourneyNavigation(options),
      { initialProps: { options: params({ currentStepFields: [] }) } }
    )
    await act(() =>
      result.current.goNext({ type: 'navigation', targetSlug: 'destino' })
    )
    expect(redirectTo).toHaveBeenCalledWith('destino')
    vi.mocked(redirectTo).mockClear()
    rerender({ options: params({ currentStep: null }) })
    await act(() => result.current.goNext({ type: 'next' }))
    expect(redirectTo).not.toHaveBeenCalled()
  })
  it('última etapa submete os campos e permite limpar o resultado', async () => {
    const { result } = renderHook(() =>
      useJourneyNavigation(
        params({
          currentStep: journey.steps[1],
          currentStepIndex: 1,
          currentStepFields: [],
        })
      )
    )
    await act(() => result.current.goNext({ type: 'next' }))
    await waitFor(() =>
      expect(result.current.submitted).toMatchObject({
        fields: { taxvat: '52998224725' },
        error: {},
      })
    )
    act(() => result.current.setSubmitted(null))
    expect(result.current.submitted).toBeNull()
  })
  it.each(['/', 'cpf'])(
    'preserva os campos ao voltar para %s',
    (backStepSlug) => {
      const { result } = renderHook(() =>
        useJourneyNavigation(
          params({ currentStep: { ...journey.steps[0], backStepSlug } })
        )
      )
      act(() => result.current.goPrev())
      expect(redirectTo).toHaveBeenCalledWith(backStepSlug)
      expect(journeyStore.getState().fields.taxvat).toBe('52998224725')
    }
  )
  it('não volta quando não há etapa anterior', () => {
    const { result } = renderHook(() =>
      useJourneyNavigation(
        params({ currentStep: { ...journey.steps[0], backStepSlug: '' } })
      )
    )
    act(() => result.current.goPrev())
    expect(redirectTo).not.toHaveBeenCalled()
  })
})
describe('concorrência, qualidade e efeitos', () => {
  it('trava navegação concorrente e destrava após erro', async () => {
    const { result } = renderHook(() => useNavigationLock())
    let release!: () => void
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve
        })
    )
    const first = result.current(action)
    expect(await result.current(action)).toBe(false)
    release()
    expect(await first).toBe(true)
    await expect(
      result.current(async () => {
        throw new Error('Falha')
      })
    ).rejects.toThrow('Falha')
    expect(await result.current(async () => {})).toBe(true)
  })
  it('impede serviço concorrente, guarda resultado e limpa loading após falha', async () => {
    const { result } = renderHook(() => useJourneyService())
    let release!: (response: { success: boolean }) => void
    vi.mocked(callService).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve
        })
    )
    let first: ReturnType<typeof result.current.execute>
    act(() => {
      first = result.current.execute('eligibility', {})
    })
    expect(result.current.isLoading).toBe(true)
    await act(async () =>
      expect(await result.current.execute('eligibility', {})).toBeUndefined()
    )
    await act(async () => {
      release({ success: true })
      await first
    })
    expect(result.current.result).toEqual({ success: true })
    expect(result.current.isLoading).toBe(false)
    vi.mocked(callService).mockRejectedValueOnce(new Error('Falha'))
    await act(async () => {
      await expect(result.current.execute('eligibility', {})).rejects.toThrow(
        'Falha'
      )
    })
    expect(result.current.isLoading).toBe(false)
  })
  it('qualidade distingue ausência de zero e falso', () => {
    expect(
      useDataQuality({ zero: 0, no: false, empty: '', nil: null }, [
        'zero',
        'no',
        'empty',
        'nil',
        'missing',
      ])
    ).toEqual({ complete: false, missing: ['empty', 'nil', 'missing'] })
    expect(useDataQuality({ name: 'Ana' }, ['name'])).toEqual({
      complete: true,
      missing: [],
    })
  })
  it('limpa apenas os nomes configurados com validação', () => {
    const setValue = vi.fn()
    const { result } = renderHook(() =>
      useClearPrefillOnInput(setValue, ['cpf', 'name'])
    )
    act(() => result.current())
    expect(setValue.mock.calls).toEqual([
      ['cpf', '', { shouldValidate: true }],
      ['name', '', { shouldValidate: true }],
    ])
  })
  it('efeito só propaga resultado de falha', () => {
    const onError = vi.fn()
    const { rerender } = renderHook(
      ({ response }) => useServiceErrorEffect(response, onError),
      {
        initialProps: {
          response: undefined as { success: boolean } | undefined,
        },
      }
    )
    rerender({ response: { success: true } })
    expect(onError).not.toHaveBeenCalled()
    rerender({ response: { success: false } })
    expect(onError).toHaveBeenCalledWith({ success: false })
  })
})

describe('submissão e navegação com múltiplos serviços', () => {
  it('registry executa todos os pedidos preservando ordem', async () => {
    const { callMultipleServices } = await import('@/hooks/useMultipleService')
    const { prefetchActions } = await import('@/utils/prefetchActions')
    vi.mocked(callService)
      .mockResolvedValueOnce({ success: true, data: 'first' })
      .mockResolvedValueOnce({ success: false, error: 'FAIL' })
    expect(
      await callMultipleServices([
        { name: 'one', input: { id: 1 } },
        { name: 'two', input: { id: 2 } },
      ])
    ).toEqual([
      { success: true, data: 'first' },
      { success: false, error: 'FAIL' },
    ])
    expect(vi.mocked(callService).mock.calls.slice(-2)).toEqual([
      ['one', { id: 1 }],
      ['two', { id: 2 }],
    ])
    vi.mocked(callService).mockClear()
    expect(await prefetchActions([])).toEqual([])
    await prefetchActions([{ service: 'one', input: { id: 3 } }])
    expect(callService).toHaveBeenCalledWith('one', { id: 3 })
  })
})
