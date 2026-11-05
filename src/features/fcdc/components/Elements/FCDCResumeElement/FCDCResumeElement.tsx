'use client'

import { IconFilePDF } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import { Button, Tag } from '@/components/UI'

import styles from './FCDCResumeElement.module.scss'
import type {
  FCDCResumeElementProps,
  FCDCResumeOption
} from './FCDCResumeElement.types'
import { ResumePdf } from './ResumePdf'
import { useFCDCResumeElementController } from './useFCDCResumeElementController'

function ResumeOptionRow({ option }: { option: FCDCResumeOption }) {
  return (
    <div className={styles.option}>
      <div className={styles.optionLabel}>
        <Typography variant="body1" color="neutral-800">
          {option.label}
        </Typography>
      </div>

      {option.tag && (
        <Tag negative={option.tag.negative} variant={option.tag.variant}>
          {option.tag.label}
        </Tag>
      )}

      {option.value && (
        <Typography variant="body1" weight="bold">
          {option.value}
        </Typography>
      )}
    </div>
  )
}

export function FCDCResumeElement({ element }: FCDCResumeElementProps) {
  const {
    preTitle,
    installmentValue,
    mainInfos,
    feeInfos,
    pdfOptions,
    pdfFileName,
    children,
    hasInstallmentInfo
  } = useFCDCResumeElementController(element)

  if (!hasInstallmentInfo) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {preTitle && (
          <Typography variant="title6" weight="medium">
            {preTitle}
          </Typography>
        )}

        <div className={styles.titleContainer}>
          {installmentValue && (
            <Typography as="h3" weight="bold" variant="title4">
              {installmentValue}
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
                  pageTitle="Financiamento Auto"
                  pageDescription="Resumo da simulação"
                  preTitle={preTitle}
                  title={installmentValue}
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
        <hr className={styles.divider} />
      </div>

      <div className={styles.optionsContainer}>
        {mainInfos.map((option, index) => (
          <Fragment key={`main-${option.label}-${index}`}>
            <ResumeOptionRow option={option} />
            {option.hasDivider && <hr className={styles.divider} />}
          </Fragment>
        ))}

        {feeInfos.map((option, index) => (
          <Fragment key={`fee-${option.label}-${index}`}>
            <ResumeOptionRow option={option} />
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
