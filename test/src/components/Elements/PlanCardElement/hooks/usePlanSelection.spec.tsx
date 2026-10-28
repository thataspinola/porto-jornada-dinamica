import { renderHook, act } from '@testing-library/react'
import { usePlanSelection } from '@/components/Elements/PlanCardElement/hooks/usePlanSelection'
test('atualiza seleção', () => {
  const { result } = renderHook(() => usePlanSelection('a'))
  act(() => result.current.selectPlan('b'))
  expect(result.current.selectedId).toBe('b')
})
