'use client'

import { Slider as SliderPrimitive } from '@/components/UI/Slider'

import styles from '../PriceSelector.module.scss'
import { SliderThumbIcon } from './SliderThumbIcon'

type SliderProps = {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function Slider({ min, max, step, value, onChange }: SliderProps) {
  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([next]) => onChange(next)}>
      <SliderPrimitive.Track>
        <SliderPrimitive.Range />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={styles.sliderThumb}
        aria-label="Selecionar valor">
        <span className={styles.sliderThumbIcon}>
          <SliderThumbIcon />
        </span>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}
