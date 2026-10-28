import { composableCardElementSchema } from '@/validation/schemas/elements/composableCard.schema'
import { render, screen } from '@testing-library/react'
import { ComposableCardElement } from '@/components/Elements/ComposableCardElement/ComposableCardElement'
test('renderiza os filhos do card', () => {
  render(
    <ComposableCardElement
      element={composableCardElementSchema.parse({
        id: 'c',
        type: 'COMPOSABLE_CARD',
        config: {
          elements: [{ id: 't', type: 'TEXT', config: { text: 'Título' } }],
        },
      })}
      renderElement={(e) => <span>{e.id}</span>}
    />
  )
  expect(screen.getByText('t')).toBeInTheDocument()
})
