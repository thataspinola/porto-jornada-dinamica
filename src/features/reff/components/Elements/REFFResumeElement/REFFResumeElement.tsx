'use client'

import { Typography } from '@porto-stack/ui'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import { Tag } from '@/components/UI'

import styles from './REFFResumeElement.module.scss'
import type {
  REFFResumeElementProps,
  REFFResumeOption
} from './REFFResumeElement.types'
import { useREFFResumeElementController } from './useREFFResumeElementController'

function ResumeOptionRow({ option }: { option: REFFResumeOption }) {
  if (option.isSection) {
    return (
      <div className={styles.section}>
        <Typography variant="body1" color="neutral-800">
          {option.label}
        </Typography>
      </div>
    )
  }

  return (
    <div className={styles.option}>
      <div className={styles.optionLabel}>
        <Typography variant="body2" color="neutral-800">
          {option.label}
        </Typography>
      </div>

      {option.tag && (
        <Tag negative={option.tag.negative} variant={option.tag.variant}>
          {option.tag.label}
        </Tag>
      )}

      {option.values && option.values.length > 0 && (
        <div className={styles.stackedValues}>
          {option.values.map((value) => (
            <Typography key={value} variant="body1" weight="bold">
              {value}
            </Typography>
          ))}
        </div>
      )}

      {!option.values?.length && option.value && (
        <Typography variant="body1" weight="bold">
          {option.value}
        </Typography>
      )}
    </div>
  )
}

export function REFFResumeElement({ element }: REFFResumeElementProps) {
  const { options, children, hasInstallmentInfo } =
    useREFFResumeElementController(element)

  if (!hasInstallmentInfo) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <Fragment key={`${option.label}-${index}`}>
              <ResumeOptionRow option={option} />
              {option.hasDivider && <hr className={styles.divider} />}
            </Fragment>
          ))}
        </div>
      </div>

      {children && children.length > 0 && (
        <div className={styles.actions}>
          {children.map((child) => (
            <Fragment key={child.id}>{renderJourneyElement(child)}</Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
