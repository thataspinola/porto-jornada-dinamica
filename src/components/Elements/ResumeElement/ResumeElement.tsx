'use client'

import { IconFilePDF } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import { Button } from '@/components/UI'
import { ConditionalTag } from '@/components/UI/ConditionalTag'

import styles from './ResumeElement.module.scss'
import { ResumePdf } from './ResumePdf'
import type { ResumeElementProps } from './types'
import { useResumeElementController } from './useResumeElementController'

export function ResumeElement({ element }: ResumeElementProps) {
  const {
    preTitle,
    title,
    options,
    pdfOptions,
    fields,
    resolveLabel,
    children,
    pdfFileName
  } = useResumeElementController(element)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {preTitle && (
          <Typography variant="title6" weight="medium">
            {preTitle}
          </Typography>
        )}

        <div className={styles.titleContainer}>
          {!!title && (
            <Typography as="h3" weight="bold" variant="title4">
              {title}
            </Typography>
          )}

          <Button
            type="button"
            styles="ghost"
            className={styles.downloadButton}
            asChild>
            <PDFDownloadLink
              document={
                <ResumePdf
                  preTitle={preTitle}
                  title={title}
                  options={pdfOptions}
                />
              }
              fileName={pdfFileName}
              className={styles.downloadLink}>
              {() => (
                <>
                  <IconFilePDF size={20} />
                  Baixar PDF
                </>
              )}
            </PDFDownloadLink>
          </Button>
        </div>
        <hr className={styles.divider}></hr>
      </div>

      <div className={styles.optionsContainer}>
        {options.map((option, index) => (
          <Fragment key={`${option.label}-${index}`}>
            <div className={styles.option}>
              <div className={styles.optionLabel}>
                <Typography variant="body1" color="neutral-800">
                  {option.label}
                </Typography>
                {option.tag && (
                  <ConditionalTag
                    fields={fields}
                    resolveLabel={resolveLabel}
                    conditionalRules={option.tag}
                    size="sm"
                  />
                )}
              </div>

              {option.value && (
                <Typography variant="body1" weight="bold">
                  {option.value}
                </Typography>
              )}
            </div>

            {option.hasDivider && <hr className={styles.divider} />}
          </Fragment>
        ))}
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
