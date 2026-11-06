import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { vi } from 'vitest'

import { useJourneyStepFormController } from '@/components/Core/JourneyStepForm/useJourneyStepFormController'
import type {
  JourneyStep,
  PendingAction
} from '@/components/Core/JourneyStepForm/types'
import { ServiceError } from '@/services/types'
import { useJourneyStore } from '@/store/journeyStore'

const effects = vi.hoisted(() => ({
  execute: vi.fn(),
  handleError: vi.fn(),
  guard: vi.fn(),
  validate: vi.fn(),
  push: vi.fn(),
  cookies: vi.fn()
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: effects.push })
}))
vi.mock('@/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: () => ({ navigateTo: effects.push })
}))
vi.mock('@/hooks/useJourneyService', () => ({
  useJourneyService: () => ({ executeJourneyService: effects.execute })
}))
vi.mock('@/hooks/useServiceErrorHandler', () => ({
  useServiceErrorHandler: () => ({ handleServiceError: effects.handleError })
}))
vi.mock('@/hooks/useConditionGuard', () => ({
  useConditionGuard: () => ({ evaluate: effects.guard })
}))
vi.mock('@/hooks/useDataQuality', () => ({
  useDataQuality: () => ({ validate: effects.validate })
}))
vi.mock('@/utils/setCookiesFromTemplates', () => ({
  setCookiesFromTemplates: effects.cookies
}))
vi.mock('@/components/Core/JourneyStepForm/dispatchServiceEvent', () => ({
  dispatchServiceEvent: vi.fn()
}))

function setup(value = 'Preenchido') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  const step = {
    id: 'dados',
    slug: 'dados',
    name: 'Dados',
    empty: false,
    elements: [
      {
        id: 'name',
        type: 'TEXT_INPUT',
        config: {
          name: 'name',
          label: 'Nome',
          required: true,
          defaultValue: value,
          validations: []
        }
      }
    ]
  } as JourneyStep
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return {
    ...renderHook(
      () =>
        useJourneyStepFormController({
          step,
          product: 'loans',
          journeyId: 'journey'
        }),
      { wrapper }
    ),
    queryClient
  }
}
function action(extra: Partial<PendingAction> = {}) {
  return {
    service: { action: 'eligibility', module: 'customer' },
    targetStepOnSuccess: '/dados-confirmados',
    fullPageRedirect: false,
    ...extra
  } as PendingAction
}
beforeEach(async () => {
  vi.resetAllMocks()
  effects.execute.mockResolvedValue({ success: true, data: {} })
  effects.guard.mockReturnValue({ matched: false })
  effects.validate.mockResolvedValue(true)
  window.dataLayer = []
  useJourneyStore.getState().reset()
  await useJourneyStore.persist.rehydrate()
})

it('executa serviços, cookies e navegação na submissão válida', async () => {
  const { result, unmount, queryClient } = setup()
  const config = action({ cookiesOnSuccess: { result: 'ok' } })
  await act(async () => result.current.requestAction(config))
  await act(async () => result.current.formProps.onSubmit())
  expect(
    effects.execute.mock.calls.map(
      ([request]) => `${request.action}/${request.module}`
    )
  ).toEqual(['session/session', 'eligibility/customer'])
  expect(effects.cookies).toHaveBeenCalledWith(
    { result: 'ok' },
    expect.objectContaining({ fields: { name: 'Preenchido' } })
  )
  expect(effects.push).toHaveBeenCalledExactlyOnceWith('/dados-confirmados')
  expect(useJourneyStore.getState().fields.name).toBe('Preenchido')
  unmount()
  queryClient.clear()
})
it('entrega NOT_ELIGIBLE ao handler nativo e libera uma nova tentativa', async () => {
  const error = new ServiceError('NOT_ELIGIBLE', 422)
  effects.execute.mockImplementation(async (request) => {
    if (request.action === 'eligibility') throw error
    return { success: true, data: {} }
  })
  const { result, unmount, queryClient } = setup()
  const config = action({
    alertEvent: 'view_promotion',
    errors: [
      {
        code: 'NOT_ELIGIBLE',
        action: { kind: 'fieldError', field: 'taxvat', message: 'Não elegível' }
      }
    ]
  })
  await act(async () => result.current.requestAction(config))
  await act(async () => result.current.formProps.onSubmit())
  expect(effects.handleError).toHaveBeenCalledWith(
    error,
    expect.objectContaining({
      nodeErrors: config.errors,
      alertContext: {
        alertEvent: 'view_promotion',
        errorService: 'eligibility/customer'
      }
    })
  )
  expect(effects.push).not.toHaveBeenCalled()
  expect(result.current.activeAction).toBeNull()
  effects.execute.mockResolvedValue({ success: true, data: {} })
  await act(async () => result.current.requestAction(config))
  await act(async () => result.current.formProps.onSubmit())
  expect(effects.push).toHaveBeenCalledExactlyOnceWith('/dados-confirmados')
  unmount()
  queryClient.clear()
})
it('não executa serviços ou navega quando a condição bloqueia a ação', async () => {
  effects.guard.mockReturnValue({ matched: true })
  const { result, unmount, queryClient } = setup()
  await act(async () => result.current.requestAction(action()))
  await act(async () => result.current.formProps.onSubmit())
  expect(effects.execute).not.toHaveBeenCalled()
  expect(effects.push).not.toHaveBeenCalled()
  expect(result.current.activeAction).toBeNull()
  unmount()
  queryClient.clear()
})
it('preserva a invalidação do prefetch antes da navegação', async () => {
  const { result, unmount, queryClient } = setup()
  const refetch = vi.spyOn(queryClient, 'refetchQueries')
  await act(async () =>
    result.current.requestAction(action({ revalidatePrefetch: true }))
  )
  await act(async () => result.current.formProps.onSubmit())
  expect(refetch).toHaveBeenCalledWith(
    {
      queryKey: ['journey-prefetch', 'journey', 'journey'],
      exact: true,
      type: 'active'
    },
    { throwOnError: false }
  )
  expect(effects.push).toHaveBeenCalledOnce()
  unmount()
  queryClient.clear()
})
it('mantém a validação de formulário funcionando quando o dataLayer está indisponível', async () => {
  const { result, unmount, queryClient } = setup('')
  const layer = window.dataLayer
  Reflect.deleteProperty(window, 'dataLayer')
  try {
    await act(async () => result.current.requestAction(action()))
    await act(async () => result.current.formProps.onSubmit())
    expect(result.current.methods.getFieldState('name').error).toBeDefined()
    expect(effects.execute).not.toHaveBeenCalled()
    expect(result.current.activeAction).toBeNull()
  } finally {
    window.dataLayer = layer
    unmount()
    queryClient.clear()
  }
})
