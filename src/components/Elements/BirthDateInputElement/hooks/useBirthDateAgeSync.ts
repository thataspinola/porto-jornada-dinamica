import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { calculateAge } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

type UseBirthDateAgeSyncParams = {
  fieldName: string
}

const AGE_FIELD = 'age'

export function useBirthDateAgeSync({ fieldName }: UseBirthDateAgeSyncParams) {
  const { watch } = useFormContext()

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name && name !== fieldName) {
        return
      }

      const raw = values[fieldName]
      const age = calculateAge(raw)

      if (age === null) {
        const currentFields = useJourneyStore.getState().fields

        if (!(AGE_FIELD in currentFields)) {
          return
        }

        const { [AGE_FIELD]: _omit, ...rest } = currentFields
        useJourneyStore.setState({ fields: rest })
        return
      }

      if (useJourneyStore.getState().fields[AGE_FIELD] === age) {
        return
      }

      useJourneyStore.getState().mergeFields({ [AGE_FIELD]: age })
    })

    return () => subscription.unsubscribe()
  }, [watch, fieldName])
}
