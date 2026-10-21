'use client'

import { Typography } from '@porto-stack/ui'

import { formatPrice } from '@/utils'

import { PriceInput } from './components/PriceInput'
import { PriceSelectorLayout } from './components/PriceSelectorLayout'
import { Slider } from './components/Slider'
import { StepperButton } from './components/StepperButton'
import type { PriceSelectorProps } from './types'

function PriceSelectorComponent({
  value,
  min,
  max,
  step,
  editable = false,
  onChange,
}: PriceSelectorProps) {
  const normalizeValue = (next: number) => {
    if (next < min || next > max) {
      return min
    }

    return next
  }

  const clampedValue = normalizeValue(value)
  const setValue = (next: number) => onChange(normalizeValue(next))

  return (
    <PriceSelectorLayout.Root>
      <PriceSelectorLayout.Stepper>
        <StepperButton
          icon='circle-remove'
          label='Diminuir valor'
          disabled={clampedValue <= min}
          onClick={() => setValue(clampedValue - step)}
        />

        <PriceInput
          value={clampedValue}
          min={min}
          max={max}
          editable={editable}
          onChange={setValue}
        />

        <StepperButton
          icon='circle-add'
          label='Aumentar valor'
          disabled={clampedValue >= max}
          onClick={() => setValue(clampedValue + step)}
        />
      </PriceSelectorLayout.Stepper>

      <PriceSelectorLayout.Bottom>
        <Slider
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          onChange={setValue}
        />

        <PriceSelectorLayout.Bounds>
          <Typography variant='body2' color='neutral-700'>
            R$ {formatPrice(min)}
          </Typography>
          <Typography variant='body2' color='neutral-700'>
            R$ {formatPrice(max)}
          </Typography>
        </PriceSelectorLayout.Bounds>
      </PriceSelectorLayout.Bottom>
    </PriceSelectorLayout.Root>
  )
}

const priceSelectorParts = {
  Slider,
  StepperButton,
  Input: PriceInput,
  Root: PriceSelectorLayout.Root,
  Bounds: PriceSelectorLayout.Bounds,
  Bottom: PriceSelectorLayout.Bottom,
  Stepper: PriceSelectorLayout.Stepper,
}

export const PriceSelector = Object.assign(
  PriceSelectorComponent,
  priceSelectorParts
)
