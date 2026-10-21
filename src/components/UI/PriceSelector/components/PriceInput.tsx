'use client'

import { type ChangeEvent, useState } from 'react'

import { centsToReais, clampNumber, formatPrice, onlyNumbers } from '@/utils'

import { Input } from '@/components/UI'

type PriceInputProps = {
  value: number
  min: number
  max: number
  editable?: boolean
  onChange: (value: number) => void
}

export function PriceInput({
  value,
  min,
  max,
  editable = false,
  onChange,
}: PriceInputProps) {
  const [draft, setDraft] = useState<number | null>(null)
  const displayValue = `R$ ${formatPrice(draft ?? value)}`

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const typedValue = centsToReais(Number(onlyNumbers(event.target.value)))
    const isWithinRange = typedValue >= min && typedValue <= max

    setDraft(typedValue)

    if (isWithinRange) onChange(typedValue)
  }

  const handleBlur = () => {
    if (draft === null) return

    onChange(clampNumber(draft, min, max))
    setDraft(null)
  }

  return (
    <Input
      variant='big'
      inputMode='numeric'
      aria-label='Valor'
      disabled={!editable}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
