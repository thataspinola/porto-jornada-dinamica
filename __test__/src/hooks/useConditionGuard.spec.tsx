import { vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'
import { useConditionGuard } from '@/hooks/useConditionGuard'
import { journeyStore } from '@/store/journeyStore'
import { notify } from '@/components/Core/JourneyNotifier'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/contrate/financiamento-de-veiculos/cpf',
}))
vi.mock('@/components/Core/JourneyNotifier', () => ({ notify: vi.fn() }))
beforeEach(() => {
  act(() => journeyStore.getState().reset())
})
test('aplica erro e foco quando todos os checks combinam', () => {
  const setError = vi.fn(),
    setFocus = vi.fn()
  const methods = {
    setError,
    setFocus,
    formState: { errors: {} },
  } as unknown as UseFormReturn<FieldValues>
  const { result } = renderHook(() => useConditionGuard(methods))
  act(() => {
    const response = result.current.evaluate({
      formData: { age: 17 },
      rules: [
        {
          checks: [
            {
              left: { from: 'fields', path: 'age' },
              op: 'LESS_THAN',
              right: { value: 18 },
            },
          ],
          action: {
            kind: 'fieldError',
            field: 'age',
            message: 'Idade mínima 18 anos',
            focus: true,
          },
        },
      ],
    })
    expect(response.matched).toBe(true)
  })
  expect(setError).toHaveBeenCalledWith('age', {
    type: 'condition',
    message: 'Idade mínima 18 anos',
  })
  expect(setFocus).toHaveBeenCalledWith('age')
})
test('aplica redirect da regra e não age quando ela não combina', () => {
  const methods = {
    formState: { errors: {} },
  } as unknown as UseFormReturn<FieldValues>
  const { result } = renderHook(() => useConditionGuard(methods))
  const rules = [
    {
      checks: [
        {
          left: { from: 'fields' as const, path: 'blocked' },
          op: 'EQUAL' as const,
          right: { value: true },
        },
      ],
      action: { kind: 'redirect' as const, url: '/dados' },
    },
  ]
  act(() => {
    result.current.evaluate({ rules, formData: { blocked: false } })
  })
  expect(push).not.toHaveBeenCalled()
  act(() => {
    result.current.evaluate({ rules, formData: { blocked: true } })
  })
  expect(push).toHaveBeenCalledWith('/contrate/financiamento-de-veiculos/dados')
  expect(notify).not.toHaveBeenCalled()
})

test('regras ausentes ou vazias não causam ação', () => {
  const { result } = renderHook(() =>
    useConditionGuard({
      formState: { errors: {} },
    } as UseFormReturn<FieldValues>)
  )
  expect(result.current.evaluate({ rules: undefined, formData: {} })).toEqual({
    matched: false,
  })
  expect(result.current.evaluate({ rules: [], formData: {} })).toEqual({
    matched: false,
  })
})
function evaluateAction(
  action: import('@/validation/schemas/elements/conditions.schema').ConditionAction,
  methods = { formState: { errors: {} } } as UseFormReturn<FieldValues>
) {
  const { result } = renderHook(() => useConditionGuard(methods))
  return result.current.evaluate({
    formData: { name: 'Ana' },
    rules: [
      {
        checks: [{ left: { value: 1 }, op: 'EQUAL', right: { value: 1 } }],
        action,
      },
    ],
  })
}
test('notificação interpola dados e executa redirect da ação', () => {
  evaluateAction({
    kind: 'notify',
    title: 'Olá {{fields.name}}',
    description: 'Aviso',
    actionButton: {
      children: 'Ir',
      onClickAction: { kind: 'redirect', url: '/' },
    },
  })
  const message = vi.mocked(notify).mock.calls[0][0]
  expect(message.title).toBe('Olá Ana')
  message.actionButton?.onClick?.()
  expect(push).toHaveBeenCalledWith('/')
})
test('notificação sem botão e com botão sem ação', () => {
  evaluateAction({ kind: 'notify', title: 'Aviso', description: '' })
  expect(vi.mocked(notify).mock.calls[0][0].actionButton).toBeUndefined()
  evaluateAction({
    kind: 'notify',
    title: 'Aviso',
    description: '',
    actionButton: { children: 'Continuar' },
  })
  expect(
    vi.mocked(notify).mock.calls[1][0].actionButton?.onClick
  ).toBeUndefined()
})
test('erro sem formulário vira notificação', () => {
  evaluateAction(
    { kind: 'fieldError', field: 'cpf', message: 'CPF inválido' },
    null
  )
  expect(notify).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'CPF inválido' })
  )
})
test('erro sem foco não move foco do usuário', () => {
  const setError = vi.fn(),
    setFocus = vi.fn()
  evaluateAction({ kind: 'fieldError', field: 'cpf', message: 'Inválido' }, {
    formState: { errors: {} },
    setError,
    setFocus,
  } as unknown as UseFormReturn<FieldValues>)
  expect(setError).toHaveBeenCalled()
  expect(setFocus).not.toHaveBeenCalled()
})
test('fullscreen interpola tentativa e executa botão', () => {
  evaluateAction({
    kind: 'fullscreen',
    icon: 'error',
    attempts: [
      {
        title: 'Olá {{fields.name}}',
        actionButton: {
          children: 'Tentar',
          onClickAction: { kind: 'redirect', url: 'dados' },
        },
      },
    ],
  })
  const message = vi.mocked(notify).mock.calls[0][0]
  expect(message).toMatchObject({
    fullscreen: true,
    title: 'Olá Ana',
    description: '',
  })
  message.actionButton?.onClick?.()
  expect(push).toHaveBeenCalledWith('/contrate/financiamento-de-veiculos/dados')
})
test('fullscreen sem callback não cria ação e tentativa ausente não notifica', () => {
  evaluateAction({
    kind: 'fullscreen',
    icon: 'error',
    attempts: [
      {
        title: 'Aviso',
        description: 'Falha',
        actionButton: { children: 'Fechar' },
      },
    ],
  })
  expect(
    vi.mocked(notify).mock.calls[0][0].actionButton?.onClick
  ).toBeUndefined()
  vi.mocked(notify).mockClear()
  evaluateAction({ kind: 'fullscreen', icon: 'error', attempts: [] })
  expect(notify).not.toHaveBeenCalled()
})
test.each(['javascript:alert(1)', '//external.test', 'data:text/html,porto'])(
  'rejeita destino inseguro %s',
  (url) => {
    expect(() => evaluateAction({ kind: 'redirect', url })).toThrow(
      'Destino inválido'
    )
    expect(push).not.toHaveBeenCalled()
  }
)
