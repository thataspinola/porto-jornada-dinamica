import { clsx } from '@porto-stack/ui/utils'
import {
  TabsContent as RadixTabsContent,
  type TabsContentProps as RadixTabsContentProps,
  TabsList as RadixTabsList,
  type TabsListProps as RadixTabsListProps,
  Tabs as RadixTabsRoot,
  type TabsProps as RadixTabsRootProps,
  TabsTrigger as RadixTabsTrigger,
  type TabsTriggerProps as RadixTabsTriggerProps
} from '@radix-ui/react-tabs'
import { forwardRef, type ReactNode } from 'react'

import styles from './Tabs.module.scss'

type TabsRootProps = RadixTabsRootProps & {
  children: ReactNode
  className?: string
}

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabsRoot
      ref={ref}
      className={clsx(styles.container, className)}
      {...props}>
      {children}
    </RadixTabsRoot>
  )
)

type TabsListProps = RadixTabsListProps

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabsList
      ref={ref}
      className={clsx(styles.tabList, className)}
      {...props}>
      {children}
    </RadixTabsList>
  )
)

type TabsTriggerProps = RadixTabsTriggerProps

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabsTrigger
      ref={ref}
      className={clsx(styles.tab, className)}
      {...props}>
      {children}
    </RadixTabsTrigger>
  )
)

type TabsContentProps = RadixTabsContentProps

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabsContent
      ref={ref}
      className={clsx(styles.content, className)}
      {...props}>
      {children}
    </RadixTabsContent>
  )
)

TabsRoot.displayName = 'Tabs.Root'
TabsList.displayName = 'Tabs.List'
TabsTrigger.displayName = 'Tabs.Trigger'
TabsContent.displayName = 'Tabs.Content'

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
}
