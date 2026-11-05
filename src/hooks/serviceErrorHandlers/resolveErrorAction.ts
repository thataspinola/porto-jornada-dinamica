import { SERVICE_ERROR_CODE, ServiceError } from '@/services/types'

import { interpolateTemplate } from '@/utils/interpolateTemplate'

import type { ServiceErrorsConfig } from '@/validation/schemas'

import type { FullscreenAction, ServiceErrorAction } from './types'

type InterpolationContext = Record<string, unknown>

function interpolate(template: string, ctx: InterpolationContext): string {
  return interpolateTemplate(template, ctx, { keepMissing: true }) ?? template
}

export function extractErrorCode(error: unknown): string {
  if (error instanceof ServiceError) return error.message
  return SERVICE_ERROR_CODE.INTERNAL_SERVER_ERROR
}

export function buildErrorInterpolationScope(error: unknown) {
  if (error instanceof ServiceError) {
    return { message: error.message, statusCode: error.statusCode }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: '' }
}

export function interpolateFullscreenAction(
  action: FullscreenAction,
  ctx: InterpolationContext
): FullscreenAction {
  return {
    ...action,
    attempts: action.attempts.map((attempt) => {
      const clickAction = attempt.actionButton.onClickAction
      return {
        ...attempt,
        title: interpolate(attempt.title, ctx),
        description: attempt.description
          ? interpolate(attempt.description, ctx)
          : undefined,
        actionButton: {
          ...attempt.actionButton,
          children: interpolate(attempt.actionButton.children, ctx),
          onClickAction:
            clickAction?.kind === 'redirect'
              ? {
                  kind: 'redirect' as const,
                  url: interpolate(clickAction.url, ctx)
                }
              : clickAction
        }
      }
    })
  }
}

// Safety-net action shown when no JSON rule matches the returned code.
export const DEFAULT_ERROR_ACTION: ServiceErrorAction = {
  kind: 'notify',
  title: 'Poxa, parece que o nosso serviço não está funcionando',
  description:
    'Estamos trabalhando para que volte ao normal o quanto antes. Você pode tentar novamente clicando no botão abaixo.',
  actionButton: {
    children: 'Tentar novamente'
  }
}

type ResolveInput = {
  code: string
  nodeErrors?: ServiceErrorsConfig
  journeyErrors?: ServiceErrorsConfig
}

function findRule(
  errors: ServiceErrorsConfig | undefined,
  code: string
): ServiceErrorAction | undefined {
  return errors?.find((rule) => rule.code === code)?.action
}

export function resolveErrorAction({
  code,
  nodeErrors,
  journeyErrors
}: ResolveInput): ServiceErrorAction {
  return (
    findRule(nodeErrors, code) ??
    findRule(journeyErrors, code) ??
    DEFAULT_ERROR_ACTION
  )
}
