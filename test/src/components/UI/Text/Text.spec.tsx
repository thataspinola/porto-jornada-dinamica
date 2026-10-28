import { render, screen, fireEvent } from '@testing-library/react'
import { Text } from '@/components/UI/Text/Text'
test('Text: comportamento acessível', () => {
  render(<Text>Descrição</Text>)
  expect(screen.getByText('Descrição').tagName).toBe('P')
})
