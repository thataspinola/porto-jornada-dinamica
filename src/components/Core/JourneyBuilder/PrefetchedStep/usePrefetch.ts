'use client'
import { useEffect, useState } from 'react'
import { useJourneyService } from '@/hooks/useJourneyService'
import type { PrefetchDefinition } from '@/validation/schemas'
import {
  preparePrefetchPayload,
  processPrefetchResponse,
} from '@/utils/prefetchActions'
import { useJourneyStore } from '@/store/journeyStore'
export function usePrefetch(actions: PrefetchDefinition[], product: string) {
  const { executeJourneyService } = useJourneyService()
  const [state, setState] = useState({ isLoading: true, error: '' })
  useEffect(() => {
    let active = true
    setState({ isLoading: true, error: '' })
    async function execute() {
      for (const item of actions) {
        if (!active) return
        if (!item.action || !item.module || !product)
          throw new Error('Pré-carregamento não configurado')
        const prepared = await preparePrefetchPayload(item.action, item.payload)
        const result = await executeJourneyService({
          fields: prepared.payload,
          product,
          action: item.action,
          module: item.module,
          recaptchaAction: item.action,
        })
        const data = await processPrefetchResponse(
          item.action,
          result.data,
          prepared.privateKey
        )
        if (!active) return
        const services = useJourneyStore.getState().services
        useJourneyStore
          .getState()
          .mergeServices({
            [item.module]: { ...services[item.module], [item.action]: data },
          })
      }
    }
    execute().then(
      () => {
        if (active) setState({ isLoading: false, error: '' })
      },
      () => {
        if (active)
          setState({
            isLoading: false,
            error: 'Não foi possível carregar os dados',
          })
      }
    )
    return () => {
      active = false
    }
  }, [actions, product, executeJourneyService])
  return state
}
