'use client'

import { formatPrice } from '@/utils'

import { Input } from '@/components/UI'

import styles from '../PriceSelector.module.scss'

type PriceInputProps = {
  value: number
}

export function PriceInput({ value }: PriceInputProps) {
  return (
    <Input
      variant="big"
      className={styles.input}
      inputMode="numeric"
      aria-label="Valor"
      disabled
      value={formatPrice(value)}
      onChange={() => {}}
    />
  )
}
