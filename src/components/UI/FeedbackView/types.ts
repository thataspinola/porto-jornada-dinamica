export const FEEDBACK_VIEW_STYLES = ['porto-holding'] as const

export const FEEDBACK_VIEW_TONES = [
  'positive',
  'negative',
  'super-positive',
] as const

export type FeedbackViewStyles = (typeof FEEDBACK_VIEW_STYLES)[number]
export type FeedbackViewTone = (typeof FEEDBACK_VIEW_TONES)[number]
