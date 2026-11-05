import {
  IconContent,
  IconContentList,
  type IconContentProps
} from '@/components/UI/IconContentList'

import s from './styles.module.scss'
import type { IconContentListElementProps } from './types'

export function IconContentListElement({
  element
}: IconContentListElementProps) {
  const { items, divider } = element.config

  return (
    <div className={s.wrapper}>
      <IconContentList.Root divider={divider}>
        {(items as IconContentProps[])?.map((item) => (
          <IconContentList.Item key={`${item.icon.icon}-${item.title}`}>
            <IconContent.Root align={item.description ? 'start' : 'center'}>
              <IconContent.Icon {...item.icon} />
              <IconContent.Content>
                <IconContent.Title
                  weight={item.description ? 'bold' : 'regular'}>
                  {item.title}
                </IconContent.Title>
                {item.description && (
                  <IconContent.Description>
                    {item.description}
                  </IconContent.Description>
                )}
              </IconContent.Content>
            </IconContent.Root>
          </IconContentList.Item>
        ))}
      </IconContentList.Root>
    </div>
  )
}
