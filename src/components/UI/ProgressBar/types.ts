import type { HTMLAttributes } from 'react'

export interface ProgressBarRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor máximo da barra */
  max: number

  /** Valor atual da barra */
  value: number
}

export type ProgressBarIndicatorProps = HTMLAttributes<HTMLDivElement>
