import { useSimulatedProgress } from '@/components/UI/LoadingScreen/useSimulatedProgress'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as Skeleton from '@/components/UI/Skeleton'
import { ResumePdf } from '@/components/Elements/ResumeElement/ResumePdf'
import { ResumePdf as FCDCResumePdf } from '@/features/fcdc/components/Elements/FCDCResumeElement/ResumePdf'
import { LicensePlateElement, RadioGroupElement } from '@/components/Elements'

afterEach(() => vi.useRealTimers())
describe('carregamento e resumo', () => {
  it('skeleton preserva dimensões e conteúdo', () => {
    const { container } = render(
      <Skeleton.Root width="100px" height="30px" display="flex" gap="2px">
        <Skeleton.Block width="20px" height="10px" />
        <Skeleton.RadioGroupSkeleton />
      </Skeleton.Root>
    )
    expect(container.firstChild).toHaveStyle({
      width: '100px',
      height: '30px',
      display: 'flex',
      gap: '2px',
    })
    expect(screen.getByLabelText('Carregando opções')).toBeInTheDocument()
  })
  it('progresso é limitado ao intervalo e limpa o timer', () => {
    vi.useFakeTimers()
    const { result, rerender, unmount } = renderHook(
      ({ complete }) => useSimulatedProgress({ from: 0, to: 90, complete }),
      { initialProps: { complete: false } }
    )
    act(() => vi.advanceTimersByTime(20000))
    expect(result.current).toBe(90)
    rerender({ complete: true })
    expect(result.current).toBe(100)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it.each([
    ResumePdf,
    FCDCResumePdf,
  ])('resumo apresenta valores e permite impressão', (Component) => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    const { rerender } = render(
      <Component values={{ CPF: '52998224725', Valor: 1000 }} />
    )
    expect(screen.getByText('1000')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir resumo' }))
    expect(print).toHaveBeenCalledOnce()
    rerender(<Component values={{}} />)
    expect(screen.queryByText('CPF')).toBeNull()
    print.mockRestore()
  })
  it('placa sanitiza entrada antes do callback', () => {
    const onChange = vi.fn()
    render(
      <LicensePlateElement name="plate" label="Placa" onChange={onChange} />
    )
    fireEvent.change(screen.getByLabelText('Placa'), {
      target: { value: 'abc1234' },
    })
    expect(onChange).toHaveBeenCalledWith('ABC-1234')
  })
  it('grupo de rádio mantém seleção e chama callback', () => {
    const handleClick = vi.fn()
    render(
      <RadioGroupElement
        label="Tipo"
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
        defaultValue="a"
        handleClick={handleClick}
      />
    )
    fireEvent.click(screen.getByText('B'))
    expect(handleClick).toHaveBeenCalledWith('b')
  })
})
