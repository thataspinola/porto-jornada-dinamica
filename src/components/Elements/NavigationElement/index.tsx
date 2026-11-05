'use client'

import { Link } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import { useFormContext } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { buildGtmAttrs, setCookiesFromTemplates } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'
import { useNavigationStore } from '@/store/navigationStore'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Button } from '@/components/UI/Button/Button'
import { FixedButtonWrapper } from '@/components/UI/FixedButtonWrapper/FixedButtonWrapper'

import s from './styles.module.scss'
import type { NavigationElementProps } from './types'

export function NavigationElement({ element }: NavigationElementProps) {
  const {
    label,
    url,
    cookies = {},
    fixed,
    presentation,
    variant,
    cssProperties,
    styles: btnStyles,
    size,
    className,
    requiresStepCompletion,
    analytics
  } = element.config

  const { getValues } = useFormContext()
  const { navigateTo, isStepComplete, stepTitle } = useJourneyStepForm()
  const { isNavigationVisible, isNavigationDisabled } = useNavigationStore(
    useShallow((s) => ({
      isNavigationVisible: s.isNavigationVisible,
      isNavigationDisabled: s.isNavigationDisabled
    }))
  )

  const trimmedUrl = url.trim()
  const isDisabled =
    isNavigationDisabled || (requiresStepCompletion && !isStepComplete)
  const gtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle: analytics?.gtmName ?? stepTitle,
    label: analytics?.gtmSubname ?? label
  })

  function handleNavigate() {
    const context = {
      fields: getValues(),
      services: useJourneyStore.getState().services
    }

    setCookiesFromTemplates(cookies, context)

    navigateTo(trimmedUrl)
  }

  if (!isNavigationVisible) {
    return null
  }

  if (presentation === 'link') {
    return (
      <Link
        asChild
        size={size}
        variant={variant}
        className={clsx(s.link, className)}>
        <button
          type="button"
          {...gtmAttrs}
          style={cssProperties}
          onClick={handleNavigate}
          disabled={isDisabled}
          aria-disabled={isDisabled}>
          {label}
        </button>
      </Link>
    )
  }

  const button = (
    <Button
      type="button"
      {...gtmAttrs}
      onClick={handleNavigate}
      variant={variant}
      style={cssProperties}
      styles={btnStyles}
      size={size}
      fluid
      disabled={isDisabled}
      className={clsx(s.button, className)}
      aria-disabled={isDisabled}>
      {label}
    </Button>
  )

  if (fixed) {
    return <FixedButtonWrapper>{button}</FixedButtonWrapper>
  }

  return button
}
