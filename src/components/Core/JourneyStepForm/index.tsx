'use client'

import { FormProvider } from 'react-hook-form'

import { FullscreenErrorView } from '@/components/Core/JourneyBuilder/FullscreenErrorView'

import { renderJourneyElement } from '../JourneyRenderElements'
import { JourneyStepFormContext } from './context'
import type { JourneyElement, JourneyStep } from './types'
import { useJourneyStepFormController } from './useJourneyStepFormController'

export { useJourneyStepForm } from './context'
export type { JourneyStep, JourneyStepFormContextValue } from './types'

type JourneyStepFormProps = {
  step: JourneyStep
  sortedElements: JourneyElement[]
  product?: string
  analyticsProduct?: string
  journeyId: string
}

export function JourneyStepForm({
  step,
  sortedElements,
  product,
  analyticsProduct,
  journeyId
}: JourneyStepFormProps) {
  const {
    methods,
    formProps,
    requestAction,
    activeAction,
    activeServiceIndex,
    isMutationPending,
    formId,
    commitFields,
    navigateTo,
    isStepComplete,
    fullscreenError,
    retryCount,
    clearFullscreenError
  } = useJourneyStepFormController({
    step,
    product,
    analyticsProduct,
    journeyId
  })

  if (fullscreenError) {
    return (
      <FullscreenErrorView
        error={fullscreenError}
        retryCount={retryCount}
        onRetry={clearFullscreenError}
      />
    )
  }

  return (
    <FormProvider {...methods}>
      <JourneyStepFormContext.Provider
        value={{
          requestAction,
          activeAction,
          activeServiceIndex,
          isMutationPending,
          formId,
          commitFields,
          navigateTo,
          isStepComplete,
          stepTitle: step.name
        }}>
        <form {...formProps}>
          {sortedElements.map((element, index) => (
            <div
              className={`animateItem animateItemDelay${index + 2}`}
              key={element.id}>
              {renderJourneyElement(element)}
            </div>
          ))}
        </form>
      </JourneyStepFormContext.Provider>
    </FormProvider>
  )
}
