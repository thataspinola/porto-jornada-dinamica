'use client'
import type { PrefetchDefinition } from '@/validation/schemas'
import type { ReactNode } from 'react'
import { usePrefetch } from './usePrefetch'
export function PrefetchedStep({
  actions,
  product,
  children,
}: {
  actions: PrefetchDefinition[]
  product: string
  children: ReactNode
}) {
  const state = usePrefetch(actions, product)
  if (state.isLoading) return <output>Carregando...</output>
  if (state.error) return <p role="alert">{state.error}</p>
  return <>{children}</>
}
