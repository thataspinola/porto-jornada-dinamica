import { serviceCallElementSchema } from '@/validation/schemas/elements/serviceCall.schema'
import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ServiceCallElement } from '@/components/Elements/ServiceCallElement/ServiceCallElement'
test('impede chamada quando formulário não está pronto', () => {
  const onCall = vi.fn()
  render(
    <ServiceCallElement
      element={serviceCallElementSchema.parse({
        id: 's',
        type: 'SERVICE_CALL',
        config: {
          label: 'Continuar',
          service: 'eligibility',
          targetStepOnSuccess: '/next',
        },
      })}
      canProceed={false}
      onCall={onCall}
    />
  )
  fireEvent.click(screen.getByRole('button'))
  expect(onCall).not.toHaveBeenCalled()
})
