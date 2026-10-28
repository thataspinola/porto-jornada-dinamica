import { useContext } from 'react'
import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCurrentPathname } from '@/hooks'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useNavigationVisibility } from '@/hooks/useNavigationVisibility'
import { JourneyVariantContext } from '@/hooks/journeyVariantContext'
import { useBirthDateAgeSync } from '@/components/Elements/BirthDateInputElement/hooks/useBirthDateAgeSync'
import { useCepAddressFormSync } from '@/components/Elements/CepElement/hooks/useCepAddressFormSync'
import { usePanelHeight } from '@/components/Elements/SummaryPanelElement/hooks/usePanelHeight'
import { useCepAddressErrorHandler } from '@/components/Elements/CepElement/hooks/useCepAddressErrorHandler'
import { useAddressErrorHandler } from '@/components/Elements/CepElement/components/ModalWithoutCep/hooks'
import {
  useAddressStatus,
  useModalState,
} from '@/components/Elements/CepElement/components/ModalWithoutCep/hooks'
import { useVehicleBrandsErrorHandler } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/hooks/useVehicleBrandsErrorHandler'
import { useVehicleModelsPriceErrorHandler } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/hooks/useVehicleModelsPriceErrorHandler'
import { useFCDCPriceSimulationErrorHandler } from '@/features/fcdc/components/Elements/FCDCPriceSimulationElement/useFCDCPriceSimulationErrorHandler'
import { REFFSimulationElementErrorHandler } from '@/features/reff/components/Elements/REFFSimulationElement/REFFSimulationElementErrorHandler'
import { useManufacturingYears } from '@/features/fcdc/components/Elements/FCDCUnknownLicensePlateElement/hooks/useManufacturingYears'
import { useInstallments } from '@/features/reff/components/Elements/REFFSimulationElement/useInstallments'
import { NAVIGATE_EVENT } from '@/constants'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('campaign=porto'),
  usePathname: () => window.location.pathname,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})
describe('sincronização de estado', () => {
  it('pathname sincroniza navegação e remove listeners', () => {
    window.history.replaceState({}, '', '/cpf')
    const remove = vi.spyOn(window, 'removeEventListener')
    const { result, unmount } = renderHook(() => useCurrentPathname())
    expect(result.current).toBe('/cpf')
    act(() => {
      window.history.replaceState({}, '', '/dados')
      window.dispatchEvent(new Event(NAVIGATE_EVENT))
    })
    expect(result.current).toBe('/dados')
    act(() => {
      window.history.replaceState({}, '', '/resumo')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(result.current).toBe('/resumo')
    unmount()
    expect(remove).toHaveBeenCalledWith(NAVIGATE_EVENT, expect.any(Function))
    expect(remove).toHaveBeenCalledWith('popstate', expect.any(Function))
    remove.mockRestore()
  })
  it('busca parâmetro com fallback e usa variante do contexto', () => {
    const search = renderHook(() => [
      useSearchParam('campaign')[0],
      useSearchParam('missing')[0],
      useSearchParam('missing')[0],
    ])
    expect(search.result.current).toEqual(['porto', undefined, undefined])
    const web = renderHook(() => useContext(JourneyVariantContext))
    expect(web.result.current).toBe(null)
    const app = renderHook(() => useContext(JourneyVariantContext), {
      wrapper: ({ children }) => (
        <JourneyVariantContext.Provider value="app">
          {children}
        </JourneyVariantContext.Provider>
      ),
    })
    expect(app.result.current).toBe('app')
  })

  it('idade e endereço sincronizam os campos com validação', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-14T12:00:00Z'))
    const setValue = vi.fn()
    const age = renderHook(
      ({ value }) => useBirthDateAgeSync(value, 'age', setValue),
      { initialProps: { value: '14/10/2000' } }
    )
    expect(setValue).toHaveBeenCalledWith('age', 26, { shouldValidate: true })
    age.rerender({ value: 'inválida' })
    expect(setValue).toHaveBeenLastCalledWith('age', null, {
      shouldValidate: true,
    })
    setValue.mockClear()
    const address = renderHook(
      ({ data }) => useCepAddressFormSync(data, setValue),
      {
        initialProps: {
          data: undefined as Record<string, unknown> | undefined,
        },
      }
    )
    expect(setValue).not.toHaveBeenCalled()
    address.rerender({ data: { city: 'São Paulo', number: 0 } })
    expect(setValue.mock.calls).toEqual([
      ['city', 'São Paulo', { shouldValidate: true }],
      ['number', 0, { shouldValidate: true }],
    ])
  })
  it('altura observa container e desconecta ao desmontar', () => {
    let callback!: ResizeObserverCallback
    const observe = vi.fn(),
      disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: ResizeObserverCallback) {
          callback = cb
        }
        observe = observe
        disconnect = disconnect
      }
    )
    function Panel() {
      const { ref, height } = usePanelHeight()
      return (
        <div ref={ref}>
          <output>{height}</output>
        </div>
      )
    }
    const { unmount } = render(<Panel />)
    expect(observe).toHaveBeenCalledOnce()
    act(() =>
      callback(
        [{ contentRect: { height: 120 } }] as ResizeObserverEntry[],
        {} as ResizeObserver
      )
    )
    expect(screen.getByText('120')).toBeInTheDocument()
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    const empty = renderHook(() => usePanelHeight())
    expect(empty.result.current.height).toBe(0)
  })
  it('modal alterna sem afetar dados e status prioriza loading e erro', () => {
    const { result } = renderHook(() => useModalState())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
    expect(
      useAddressStatus({ isLoading: true, error: new Error('Falha') })
    ).toBe('loading')
    expect(
      useAddressStatus({ isLoading: false, error: new Error('Falha') })
    ).toBe('error')
    expect(useAddressStatus({ isLoading: false, data: [{}] })).toBe('ready')
    expect(useAddressStatus({ isLoading: false, data: [] })).toBe('empty')
    expect(useAddressStatus({ isLoading: false })).toBe('empty')
  })
})
describe('erros e dados de veículos', () => {
  it.each([
    useCepAddressErrorHandler,
    useAddressErrorHandler,
    useVehicleBrandsErrorHandler,
    useVehicleModelsPriceErrorHandler,
    useFCDCPriceSimulationErrorHandler,
    REFFSimulationElementErrorHandler,
  ])('expõe mensagem de erro e permite limpar', (useHandler) => {
    const { result } = renderHook(() => useHandler())
    expect(result.current.error).toBe('')
    act(() => result.current.handleError(new Error('Sem conexão')))
    expect(result.current.error).toBe('Sem conexão')
    act(() => result.current.handleError('opaque'))
    expect(result.current.error).toBe('Não foi possível carregar os dados.')
    act(() => result.current.clearError())
    expect(result.current.error).toBe('')
  })
  it('lista anos em ordem decrescente e seleciona parcelas existentes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-14'))
    expect(useManufacturingYears(2024)).toEqual([
      { label: '2026', value: '2026' },
      { label: '2025', value: '2025' },
      { label: '2024', value: '2024' },
    ])
    expect(useManufacturingYears(2026, 2024)).toEqual([])
    const installment = { count: 12, amount: 100 }
    expect(useInstallments([installment], 12)).toBe(installment)
    expect(useInstallments([installment], 24)).toBeUndefined()
  })
})
