'use client'

import { Typography } from '@porto-stack/ui'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import { Tabs } from '@/components/UI'

import { useFormTabs } from './hooks/useFormTabs'
import { useLocalTabs } from './hooks/useLocalTabs'
import type { TabsElementProps } from './types'

export function TabsElement({ element }: TabsElementProps) {
  const { name, items } = element.config

  const formTabs = useFormTabs(name, items)
  const localTabs = useLocalTabs()

  const { activeIndex, select } = name ? formTabs : localTabs

  const tabValues = items.map((item, index) => item.value ?? String(index))
  const activeTabValue = tabValues[activeIndex] ?? tabValues[0]

  const handleValueChange = (value: string) => {
    const nextIndex = tabValues.indexOf(value)
    if (nextIndex >= 0) {
      select(nextIndex)
    }
  }

  const activeItem = items[activeIndex] ?? items[0]
  const children = activeItem?.children

  return (
    <Tabs.Root value={activeTabValue} onValueChange={handleValueChange}>
      <Tabs.List>
        {items.map((item, index) => (
          <Tabs.Trigger key={`${item.label}-${index}`} value={tabValues[index]}>
            <Typography variant="title6">{item.label}</Typography>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {children && children.length > 0 && (
        <Tabs.Content key={activeIndex} value={activeTabValue}>
          {children.map((child) => (
            <Fragment key={child.id}>{renderJourneyElement(child)}</Fragment>
          ))}
        </Tabs.Content>
      )}
    </Tabs.Root>
  )
}
