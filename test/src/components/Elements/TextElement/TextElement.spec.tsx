import { render, screen } from '@testing-library/react'
import { TextElement } from '@/components/Elements/TextElement/TextElement'
test('renderiza texto literal', () => {
  render(
    <TextElement
      element={{ id: 't', type: 'TEXT', config: { text: 'Teste' } }}
    />
  )
  expect(screen.getByText('Teste')).toBeInTheDocument()
})
