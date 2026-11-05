'use client'

import { IconArrowRight, IconMapPin } from '@porto-stack/icons'

import { buildGtmAttrs, redirectTo as navigateTo } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Text } from '@/components/UI/Text/Text'

import styles from './styles.module.scss'
import type { LocationBoxElementProps } from './types'

export function LocationBoxElement({ element }: LocationBoxElementProps) {
  const { firstLine, secondLine, redirectTo, cssProperties } = element.config
  const { stepTitle } = useJourneyStepForm()
  const gtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label: 'alterar-endereco'
  })

  const content = (
    <>
      <IconMapPin size={20} aria-hidden />
      <div className={styles.content}>
        <Text
          text={firstLine}
          variant="caption"
          style={{ textTransform: 'capitalize' }}
        />
        <Text text={secondLine} variant="caption" />
      </div>
      {redirectTo ? (
        <IconArrowRight className={styles.trailingIcon} size={16} aria-hidden />
      ) : null}
    </>
  )

  if (redirectTo) {
    return (
      <button
        type="button"
        className={styles.locationBox}
        style={cssProperties}
        {...gtmAttrs}
        onClick={() => navigateTo(redirectTo)}>
        {content}
      </button>
    )
  }

  return (
    <div className={styles.locationBox} style={cssProperties}>
      {content}
    </div>
  )
}
