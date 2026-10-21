import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { emailInputElementSchema } from '@/validation/schemas/elements/emailInput.schema'
import { EmailInputElement } from '@/components/Elements'

function Form() {
  const { control } = useForm<Record<string, unknown>>({
    defaultValues: { email: '' },
  })
  return (
    <EmailInputElement
      control={control}
      element={emailInputElementSchema.parse({
        id: 'email',
        type: 'EMAIL_INPUT',
        config: { name: 'email', label: 'E-mail' },
      })}
    />
  )
}

test('barrel exporta o componente correto e mantém o campo de e-mail controlado', () => {
  render(<Form />)
  const input = screen.getByLabelText('E-mail')
  expect(input).toHaveAttribute('type', 'email')
  fireEvent.change(input, { target: { value: 'teste@example.com' } })
  expect(input).toHaveValue('teste@example.com')
})
