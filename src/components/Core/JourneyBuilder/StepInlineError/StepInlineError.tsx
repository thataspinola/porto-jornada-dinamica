'use client'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

import { Button } from '@/components/UI/Button/Button'
import { FixedButtonWrapper } from '@/components/UI/FixedButtonWrapper/FixedButtonWrapper'
import { Icon, type IconName } from '@/components/UI/Icon'
import { Text } from '@/components/UI/Text/Text'

type NavigationAction = { label: string; url: string }
type CallbackAction = {
  label: string
  onClick: () => void
  isLoading?: boolean
}

export type StepInlineErrorAction = NavigationAction | CallbackAction

export type StepInlineErrorConfig = {
  icon: string
  title: string
  description?: string
  action: StepInlineErrorAction
}

function isNavigationAction(
  action: StepInlineErrorAction
): action is NavigationAction {
  return 'url' in action
}

export function StepInlineError({
  icon,
  title,
  description,
  action
}: StepInlineErrorConfig) {
  const { navigateTo } = useJourneyNavigation()

  const handleClick = () => {
    if (isNavigationAction(action)) {
      navigateTo(action.url)
      return
    }
    action.onClick()
  }

  const isLoading = !isNavigationAction(action) && action.isLoading === true

  return (
    <div role="alert">
      <Icon
        icon={icon as IconName}
        size={64}
        color="neutral-black"
        style={{ marginBottom: 24 }}
      />
      <Text
        text={title}
        variant="title3"
        color="neutral-black"
        weight="medium"
        style={{ marginBottom: 16 }}
      />
      {description && (
        <Text text={description} variant="body1" color="neutral-800" />
      )}
      <FixedButtonWrapper>
        <Button
          type="button"
          variant="primary"
          styles="filled"
          size="md"
          fluid
          isLoading={isLoading}
          onClick={handleClick}>
          {action.label}
        </Button>
      </FixedButtonWrapper>
    </div>
  )
}
