'use client'

import { JourneyVariantContext } from '@/hooks/journeyVariantContext'

import type { JourneyDefinition } from '@/validation/schemas'

import { useJourneyBuilderController } from './useJourneyBuilderController'

import './styles.scss'

import { CustomDataAnalytics } from '../CustomDataAnalytics'
import { JourneyStepForm } from '../JourneyStepForm'
import { JourneyWrapper } from './JourneyWrapper'
import { PrefetchedStep } from './PrefetchedStep'

export function JourneyBuilder({ journey }: { journey: JourneyDefinition }) {
  const controller = useJourneyBuilderController(journey)

  if (!controller.isCaptchaReady) {
    return null
  }

  const stepContent = (
    <div key={controller.currentStep.id}>
      <JourneyStepForm
        key={controller.currentStep.id}
        step={controller.currentStep}
        product={journey.product}
        analyticsProduct={journey.analytics?.product}
        journeyId={journey.id}
        sortedElements={controller.sortedElements}
      />
    </div>
  )

  const content = controller.currentStep.prefetch ? (
    <PrefetchedStep
      config={controller.currentStep.prefetch}
      product={journey.product ?? ''}
      queryKey={['step', journey.id, controller.currentStep.id]}
      fieldsCount={controller.sortedElements.length}>
      {stepContent}
    </PrefetchedStep>
  ) : (
    stepContent
  )

  return (
    <JourneyVariantContext.Provider value={journey.variant}>
      {journey.analytics && (
        <CustomDataAnalytics
          funnelStep={controller.currentStep.order + 1}
          {...journey.analytics}
        />
      )}
      <JourneyWrapper
        controller={controller}
        contentWidth={controller.currentStep.contentWidth ?? 'grid'}
        gridColumn={controller.currentStep.gridColumn ?? '4/10'}
        showProgressBar={controller.currentStep.showProgressBar ?? true}
        whatsapp={journey.whatsapp}>
        {journey.prefetch ? (
          <PrefetchedStep
            config={journey.prefetch}
            product={journey.product ?? ''}
            queryKey={['journey', journey.id]}
            fieldsCount={controller.sortedElements.length}>
            {content}
          </PrefetchedStep>
        ) : (
          content
        )}
      </JourneyWrapper>
    </JourneyVariantContext.Provider>
  )
}
