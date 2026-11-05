import { formatGtmText } from '../formatGtm'

export type GtmDataAttrs = {
  'data-gtm-type': 'form' | 'click'
  'data-gtm-name': string
  'data-gtm-subname': string
  'data-gtm-form'?: 'input'
  'data-gtm-clicktype'?: string
}

type BaseInput = {
  stepTitle: string
}

type FormInputInput = BaseInput & {
  kind: 'form-input'
  label: string
}

type ButtonInput = BaseInput & {
  kind: 'button'
  label: string
}

type ClickComponentInput = BaseInput & {
  kind: 'click-component'
  componentName: string
  target?: 'button' | 'self'
  label?: string
  title?: string
  subtitle?: string
}

export type BuildGtmAttrsInput =
  | FormInputInput
  | ButtonInput
  | ClickComponentInput

function joinSubname(parts: Array<string | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => formatGtmText(part))
    .filter(Boolean)
    .join(':')
}

export function buildGtmAttrs(input: BuildGtmAttrsInput): GtmDataAttrs {
  const name = formatGtmText(input.stepTitle)

  if (input.kind === 'form-input') {
    return {
      'data-gtm-type': 'form',
      'data-gtm-form': 'input',
      'data-gtm-name': name,
      'data-gtm-subname': formatGtmText(input.label)
    }
  }

  if (input.kind === 'button') {
    return {
      'data-gtm-type': 'click',
      'data-gtm-clicktype': 'button',
      'data-gtm-name': name,
      'data-gtm-subname': formatGtmText(input.label)
    }
  }

  const target = input.target ?? 'self'
  const clicktype = `${formatGtmText(input.componentName)}-${target}`

  return {
    'data-gtm-type': 'click',
    'data-gtm-clicktype': clicktype,
    'data-gtm-name': name,
    'data-gtm-subname': joinSubname([input.title, input.subtitle, input.label])
  }
}
