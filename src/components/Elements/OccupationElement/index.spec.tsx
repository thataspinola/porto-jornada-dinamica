import { fireEvent, render, screen } from '@testing-library/react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'

import { OccupationElement } from './index'
import type { OccupationElementProps } from './types'

function createElement(): OccupationElementProps['element'] {
  return {
    id: 'occupation-element',
    type: 'OCCUPATION',
    order: 1,
    config: {
      required: true,
      name: 'occupationCode'
    }
  } as OccupationElementProps['element']
}

function WatchedField({ name }: { name: string }) {
  const value = useWatch({ name })

  return <output data-testid="watched-value">{String(value)}</output>
}

type Wrapper = {
  defaultValues?: Record<string, unknown>
}

function renderWithForm({ defaultValues }: Wrapper = {}) {
  function Harness() {
    const methods = useForm({
      defaultValues: {
        occupationCode: 'OCC_RETIRED',
        occupationProfession: '',
        netSalary: undefined,
        ...defaultValues
      }
    })

    return (
      <FormProvider {...methods}>
        <OccupationElement element={createElement()} />
        <WatchedField name="netSalary" />
      </FormProvider>
    )
  }

  return render(<Harness />)
}

describe('OccupationElement', () => {
  it('starts the income input empty when netSalary is undefined', () => {
    renderWithForm()

    const incomeInput = screen.getByLabelText('Renda') as HTMLInputElement

    expect(incomeInput.value).toBe('')
    expect(screen.getByTestId('watched-value')).toHaveTextContent('undefined')
  })

  it('renders the pre-filled numeric netSalary as a masked BRL string', () => {
    renderWithForm({ defaultValues: { netSalary: 10000 } })

    const incomeInput = screen.getByLabelText('Renda') as HTMLInputElement

    expect(incomeInput.value).toMatch(/^R\$\s10\.000,00$/)
  })

  it('stores netSalary in the form as a number in reais when the user types', () => {
    renderWithForm()

    const incomeInput = screen.getByLabelText('Renda') as HTMLInputElement

    fireEvent.change(incomeInput, { target: { value: '1000000' } })

    expect(incomeInput.value).toMatch(/^R\$\s10\.000,00$/)
    expect(screen.getByTestId('watched-value')).toHaveTextContent('10000')
  })

  it('preserves decimals for values with cents', () => {
    renderWithForm()

    const incomeInput = screen.getByLabelText('Renda') as HTMLInputElement

    fireEvent.change(incomeInput, { target: { value: '1050050' } })

    expect(incomeInput.value).toMatch(/^R\$\s10\.500,50$/)
    expect(screen.getByTestId('watched-value')).toHaveTextContent('10500.5')
  })
})
