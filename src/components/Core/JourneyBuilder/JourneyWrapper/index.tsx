'use client'
import { clsx } from '@porto-stack/ui/utils'
import { type ComponentProps, type ReactNode, useMemo } from 'react'

import { ProgressBar } from '@/components/UI/ProgressBar'

import type { JourneyDefinition } from '@/validation'

import { DebugFloatingButton } from '../../DebugFloatingButton/DebugFloatingButton'
import { Header } from '../../Header'
import { WhatsappButton } from '../../WhatsappButton'
import type { useJourneyBuilderController } from '../useJourneyBuilderController'
import s from './styles.module.scss'

type JourneyController = ReturnType<typeof useJourneyBuilderController>

interface JourneyWrapperProps {
  children: ReactNode
  showProgressBar?: boolean
  controller: JourneyController
  contentWidth?: 'grid' | 'fit'
  gridColumn?: '1/13' | '5/9' | '3/11' | '4/10'
  whatsapp: JourneyDefinition['whatsapp']
}

export const JourneyWrapper = ({
  children,
  className,
  contentWidth = 'grid',
  controller,
  gridColumn = '4/10',
  showProgressBar = true,
  whatsapp,
  ...props
}: ComponentProps<'div'> & JourneyWrapperProps) => {
  const { currentStep, currentStepIndex, handleGoBack, steps, variant } =
    controller
  const totalSteps = steps.length

  const hasProgressBar =
    totalSteps !== undefined &&
    currentStepIndex !== undefined &&
    showProgressBar

  const gridColumnClass = useMemo(
    () =>
      clsx({
        [s.gridColumnFull]: gridColumn === '1/13',
        [s.gridColumn59]: gridColumn === '5/9',
        [s.gridColumn410]: gridColumn === '4/10',
        [s.gridColumn311]: gridColumn === '3/11'
      }),
    [gridColumn]
  )

  return (
    <>
      <Header handleGoBack={handleGoBack} variant={variant} />
      {hasProgressBar && (
        <ProgressBar.Root
          className={clsx({ [s.appProgressBar]: variant === 'app' })}
          value={currentStepIndex + 1}
          max={totalSteps}>
          <ProgressBar.Indicator />
        </ProgressBar.Root>
      )}
      <div
        className={clsx(s.journeyWrapper, {
          [s.mobileBgSeguro900]: currentStep?.mobileBg === 'seguro-900',
          [className]: className
        })}>
        <main
          className={clsx(s.main, {
            [s.heightWithProgressBar]: showProgressBar
          })}
          {...props}>
          <div
            className={clsx(s.content, gridColumnClass, {
              [s.contentFit]: contentWidth === 'fit'
            })}>
            {children}
          </div>
        </main>
      </div>

      {whatsapp && (
        <WhatsappButton link={whatsapp.link} exclude={whatsapp.exclude} />
      )}
      <DebugFloatingButton />
    </>
  )
}
