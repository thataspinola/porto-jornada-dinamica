import { act, renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'
import { ServiceError } from '@/services/types'
vi.mock('@/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: () => ({ navigateTo: vi.fn() }),
}))
vi.mock('@porto-stack/ui/utils', () => ({ notify: vi.fn() }))
it('usa fieldError para marcar CPF como erro server', () => {
  const { result } = renderHook(() => {
    const methods = useForm()
    return { methods, ...useServiceErrorHandler(methods) }
  })
  act(() =>
    result.current.handleServiceError(new ServiceError('NOT_ELIGIBLE', 422), {
      nodeErrors: [
        {
          code: 'NOT_ELIGIBLE',
          action: {
            kind: 'fieldError',
            field: 'taxvat',
            message: 'Produto indisponível',
          },
        },
      ],
    })
  )
  expect(result.current.methods.getFieldState('taxvat').error).toMatchObject({
    type: 'server',
    message: 'Produto indisponível',
  })
})
