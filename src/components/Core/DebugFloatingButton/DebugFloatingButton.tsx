'use client'

import { env } from 'next-runtime-env'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import { useJourneyStore } from '@/store/journeyStore'

import styles from './DebugFloatingButton.module.scss'

const isProduction = env('NEXT_PUBLIC_NODE_ENV') === 'production'

export function DebugFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  const data = useJourneyStore(
    useShallow((state) => ({
      business: state.business,
      formValues: state.fields,
      services: state.services,
      parameters: state.parameters,
      errors: state.error
    }))
  )

  const coloredJson = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <span className={styles.debugEmpty}>
          Nenhum dado capturado ainda...
        </span>
      )
    }

    const jsonString = JSON.stringify(data, null, 2)

    const cleanRegex =
      /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g

    const parts = jsonString
      .split(cleanRegex)
      .filter((part) => part !== undefined && part !== '')

    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) return part

      let className = styles.debugText

      if (/^"/.test(part)) {
        if (/:$/.test(part)) {
          className = styles.debugKey
        } else {
          className = styles.debugString
        }
      } else if (/true|false/.test(part)) {
        className = styles.debugBoolean
      } else if (/null/.test(part)) {
        className = styles.debugNull
      } else if (/-?\d/.test(part)) {
        className = styles.debugNumber
      }

      if (className === styles.debugKey) {
        return (
          <span key={index} className={styles.debugKey}>
            {part.replace(/:$/, '')}
            <span className={styles.debugSeparator}>:</span>
          </span>
        )
      }

      return (
        <span key={index} className={className}>
          {part}
        </span>
      )
    })
  }, [data])

  if (isProduction) {
    return null
  }

  return (
    <div className={styles.debugContainer}>
      <button
        type="button"
        className={styles.debugButton}
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '+'}
      </button>

      {isOpen && (
        <div className={styles.debugPanel}>
          <div className={styles.debugHeader}>
            <h3>Journey Debugger</h3>
            <span className={styles.debugCount}>
              {Object.keys(data).length} campos
            </span>
          </div>
          <pre className={styles.debugCode}>{coloredJson}</pre>
        </div>
      )}
    </div>
  )
}
