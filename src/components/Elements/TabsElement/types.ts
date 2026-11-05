import type { JourneyDefinition } from '@/validation/schemas'

type TabsElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'TABS' }
>

export type TabsConfig = TabsElementType['config']
export type TabItems = TabsConfig['items']

export type TabsElementProps = {
  element: TabsElementType
}
