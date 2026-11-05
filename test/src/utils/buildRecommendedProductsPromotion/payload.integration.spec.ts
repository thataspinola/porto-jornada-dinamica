import { buildRecommendedProductsPromotion } from '@/utils/buildRecommendedProductsPromotion'
import { pushEvent } from '@/utils/pushEvent'
import { resolveErrorAction } from '@/hooks/serviceErrorHandlers/resolveErrorAction'
import type { ServiceErrorsConfig } from '@/validation/schemas'
import {
  journeys,
  recommendedProducts
} from '../../../fixtures/recommendedProducts'

it.each(
  journeys
)('integra os contratos de erro, JSON e dataLayer de $slug', (journey) => {
  window.dataLayer = []
  expect(
    resolveErrorAction({
      code: 'NOT_ELIGIBLE',
      journeyErrors: journey.errors as ServiceErrorsConfig
    })
  ).toMatchObject({ kind: 'fieldError', field: 'taxvat' })
  const event = buildRecommendedProductsPromotion(
    recommendedProducts(journey),
    journey.slug
  )
  expect(event).toBeDefined()
  pushEvent(event!)
  expect(window.dataLayer).toHaveLength(1)
  expect(window.dataLayer[0]).toMatchObject({
    event: 'view_promotion',
    ev_action: 'ecommerce:visualizar:promocao:sucesso'
  })
  expect(window.dataLayer[0]).not.toHaveProperty('currency')
  expect(window.dataLayer[0]).not.toHaveProperty('value')
})
