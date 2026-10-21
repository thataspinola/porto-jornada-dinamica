import {
  resolveErrorAction,
  extractErrorCode,
} from '@/hooks/serviceErrorHandlers/resolveErrorAction'
import { ServiceError } from '@/services/types'
const action = {
  kind: 'fieldError' as const,
  field: 'taxvat',
  message: 'Indisponível',
}
it('prioriza a regra do componente sobre a regra da jornada', () => {
  expect(
    resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      nodeErrors: [{ code: 'NOT_ELIGIBLE', action }],
    })
  ).toEqual(action)
})
it('usa regra da jornada e oferece fallback sem simular sucesso', () => {
  expect(
    resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      journeyErrors: [{ code: 'NOT_ELIGIBLE', action }],
    })
  ).toEqual(action)
  expect(resolveErrorAction({ code: 'UNKNOWN' }).kind).toBe('notify')
})
it('extrai o código do erro do serviço', () =>
  expect(extractErrorCode(new ServiceError('NOT_ELIGIBLE', 422))).toBe(
    'NOT_ELIGIBLE'
  ))
