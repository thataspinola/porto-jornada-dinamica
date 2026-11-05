import type {
  ConditionCheck,
  ConditionOperand,
  ConditionRule
} from '@/validation/schemas/elements/conditions.schema'

import { getByPath } from '../getByPath'

export type EvaluationContext = {
  fields: Record<string, unknown>
  parameters: Record<string, unknown>
  services: Record<string, unknown>
  business: Record<string, unknown>
  formErrors: Record<string, unknown>
}

export type EvaluationResult =
  | { matched: true; rule: ConditionRule }
  | { matched: false }

function resolveOperand(
  operand: ConditionOperand | undefined,
  ctx: EvaluationContext
): unknown {
  if (operand == null) {
    return undefined
  }

  const ref = operand as unknown as {
    from?: keyof EvaluationContext
    path?: string
    value?: unknown
  }

  if (typeof ref.from === 'string' && typeof ref.path === 'string') {
    return getByPath(ctx[ref.from], ref.path)
  }

  return ref.value
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function compare(
  left: unknown,
  right: unknown,
  op: '>' | '>=' | '<' | '<='
): boolean {
  const leftNum = toNumber(left)
  const rightNum = toNumber(right)

  if (leftNum === null || rightNum === null) {
    return false
  }

  switch (op) {
    case '>':
      return leftNum > rightNum
    case '>=':
      return leftNum >= rightNum
    case '<':
      return leftNum < rightNum
    case '<=':
      return leftNum <= rightNum
  }
}

function looseEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true
  }

  const leftNum = toNumber(left)
  const rightNum = toNumber(right)

  if (leftNum !== null && rightNum !== null) {
    return leftNum === rightNum
  }

  if (left == null || right == null) {
    return false
  }

  return String(left) === String(right)
}

function isFilled(value: unknown): boolean {
  if (value == null) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim() !== ''
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return true
}

export function evaluateCheck(
  check: ConditionCheck,
  ctx: EvaluationContext
): boolean {
  const left = resolveOperand(check.left, ctx)

  if (check.op === 'EXISTS') {
    return isFilled(left)
  }

  if (check.op === 'NOT_EXISTS') {
    return !isFilled(left)
  }

  const right = resolveOperand(check.right, ctx)

  switch (check.op) {
    case 'EQUAL':
      return looseEqual(left, right)
    case 'NOT_EQUAL':
      return !looseEqual(left, right)
    case 'GREATER_THAN':
      return compare(left, right, '>')
    case 'GREATER_THAN_OR_EQUAL':
      return compare(left, right, '>=')
    case 'LESS_THAN':
      return compare(left, right, '<')
    case 'LESS_THAN_OR_EQUAL':
      return compare(left, right, '<=')
    case 'INCLUDES':
      if (left == null || right == null) {
        return false
      }

      return String(left).includes(String(right))
  }
}

export function evaluateRule(
  rule: ConditionRule,
  ctx: EvaluationContext
): boolean {
  return rule.checks.every((check) => evaluateCheck(check, ctx))
}

export function evaluateConditions(
  rules: ConditionRule[] | undefined,
  ctx: EvaluationContext
): EvaluationResult {
  if (!rules || rules.length === 0) {
    return {
      matched: false
    }
  }

  for (const rule of rules) {
    if (evaluateRule(rule, ctx)) {
      return {
        matched: true,
        rule
      }
    }
  }

  return {
    matched: false
  }
}
