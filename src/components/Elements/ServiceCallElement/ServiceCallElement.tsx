'use client'
import { Button } from '@/components/UI/Button'
import type { JourneyDefinition } from '@/validation/schemas'
export type ServiceCallConfig = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SERVICE_CALL' }
>['config']
type Props = {
  element: Extract<
    JourneyDefinition['steps'][number]['elements'][number],
    { type: 'SERVICE_CALL' }
  >
  canProceed: boolean
  onCall: (config: ServiceCallConfig) => void
}
export function ServiceCallElement({ element, canProceed, onCall }: Props) {
  const { label, size, styles, variant, className, disabled } = element.config
  return (
    <Button
      type="button"
      size={size}
      styles={styles}
      variant={variant}
      className={className}
      disabled={disabled || !canProceed}
      onClick={() => onCall(element.config)}
    >
      {label}
    </Button>
  )
}
