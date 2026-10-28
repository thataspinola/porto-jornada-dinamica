import { render, screen, fireEvent } from '@testing-library/react'
import { Tag } from '@/components/UI/Tag/Tag'
test('Tag: comportamento acessível', () => {
  render(<Tag>Ativo</Tag>)
  expect(screen.getByText('Ativo')).toBeInTheDocument()
})
