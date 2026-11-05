import type { JourneyDefinition } from '@/validation/schemas'

export const injectProgressToSteps = (
  journey: JourneyDefinition
): JourneyDefinition => {
  const totalSteps = journey.steps.length
  const stepWeight = 100 / totalSteps

  return {
    ...journey,
    steps: journey.steps.map((step, index) => {
      const initialValue = Math.round(index * stepWeight)
      const value = Math.round((index + 1) * stepWeight)

      return {
        ...step,
        progress: {
          initialValue,
          value
        }
      }
    })
  }
}
