import { render, screen, fireEvent } from '@testing-library/react'
import { DrawerElement } from '@/components/Elements/DrawerElement/DrawerElement'
test('DrawerElement: interação', () => {
  render(
    <DrawerElement
      element={{
        id: 'x',
        type: 'DRAWER',
        config: { label: 'Detalhes', elements: [] },
      }}
    />
  )
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
