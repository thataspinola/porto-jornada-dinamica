'use client'

import { clsx } from '@porto-stack/ui/utils'
import { useFormContext } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { buildGtmAttrs } from '@/utils'

import { useNavigationStore } from '@/store/navigationStore'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { LoadingScreen } from '@/components/UI'
import { FixedButtonWrapper } from '@/components/UI/FixedButtonWrapper/FixedButtonWrapper'

import { Button } from '../../UI/Button/Button'
import styles from './styles.module.scss'
import type { ServiceCallElementProps } from './types'

export function ServiceCallElement({ element }: ServiceCallElementProps) {
  const {
    label,
    variant,
    styles: btnStyles,
    size,
    className,
    loadingScreen,
    fixed,
    cssProperties,
    requiresStepCompletion,
    analytics
  } = element.config

  const { formState } = useFormContext()
  const {
    requestAction,
    formId,
    isStepComplete,
    activeAction,
    activeServiceIndex,
    isMutationPending,
    stepTitle
  } = useJourneyStepForm()

  const currentLoadingScreen = Array.isArray(loadingScreen)
    ? loadingScreen[activeServiceIndex]
    : loadingScreen

  const { isNavigationVisible, isNavigationDisabled } = useNavigationStore(
    useShallow((s) => ({
      isNavigationVisible: s.isNavigationVisible,
      isNavigationDisabled: s.isNavigationDisabled
    }))
  )

  const isButtonLoading = formState.isSubmitting
  const isScreenLoading = !!activeAction
  const isDisabled =
    isNavigationDisabled ||
    (requiresStepCompletion && !isStepComplete) ||
    isButtonLoading

  if (!isNavigationVisible) {
    return null
  }

  const gtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle: analytics?.gtmName ?? stepTitle,
    label: analytics?.gtmSubname ?? label
  })

  const button = (
    <Button
      style={cssProperties}
      type="submit"
      form={formId}
      onClick={() => requestAction(element.config)}
      variant={variant}
      styles={btnStyles}
      size={size}
      fluid
      disabled={isDisabled}
      className={clsx(styles.container, className)}
      aria-disabled={isDisabled}
      isLoading={isButtonLoading && !currentLoadingScreen}
      {...gtmAttrs}>
      {label}
    </Button>
  )

  return (
    <>
      {fixed ? <FixedButtonWrapper>{button}</FixedButtonWrapper> : button}
      {currentLoadingScreen && isScreenLoading && (
        <LoadingScreen
          config={currentLoadingScreen}
          complete={currentLoadingScreen.to === 100 && !isMutationPending}
        />
      )}
    </>
  )
}
