import type { ReactNode } from 'react'

type HighlightTitleProps = {
  title: string
  highlight?: string
  highlightClassName?: string
}

export function highlightTitle({
  title,
  highlight,
  highlightClassName
}: HighlightTitleProps): ReactNode {
  if (!highlight) return title

  const index = title.toLowerCase().indexOf(highlight.toLowerCase())
  if (index === -1) return title

  const before = title.slice(0, index)
  const match = title.slice(index, index + highlight.length)
  const after = title.slice(index + highlight.length)

  return (
    <>
      {before}
      <span className={highlightClassName}>{match}</span>
      {after}
    </>
  )
}
