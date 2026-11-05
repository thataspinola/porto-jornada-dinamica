import { render, screen } from '@testing-library/react'

import { IconContentList } from './index'

describe('IconContentList', () => {
  describe('Root', () => {
    it('should render its children', () => {
      render(
        <IconContentList.Root>
          <IconContentList.Item>item</IconContentList.Item>
        </IconContentList.Root>
      )

      expect(screen.getByText('item')).toBeInTheDocument()
    })

    it('should render a ul element with the base class', () => {
      render(
        <IconContentList.Root data-testid="list">content</IconContentList.Root>
      )

      const list = screen.getByTestId('list')

      expect(list.tagName).toBe('UL')
      expect(list.className).toContain('iconContentList')
    })

    it('should apply the withDivider class when divider is true', () => {
      render(
        <IconContentList.Root divider data-testid="list">
          content
        </IconContentList.Root>
      )

      expect(screen.getByTestId('list').className).toContain('withDivider')
    })

    it('should not apply the withDivider class by default', () => {
      render(
        <IconContentList.Root data-testid="list">content</IconContentList.Root>
      )

      expect(screen.getByTestId('list').className).not.toContain('withDivider')
    })

    it('should forward className and ul props to the list', () => {
      render(
        <IconContentList.Root
          className="custom"
          aria-label="list"
          data-testid="list">
          content
        </IconContentList.Root>
      )

      const list = screen.getByTestId('list')

      expect(list).toHaveClass('custom')
      expect(list).toHaveAttribute('aria-label', 'list')
    })
  })

  describe('Item', () => {
    it('should render a li element with its children', () => {
      render(
        <IconContentList.Item data-testid="item">content</IconContentList.Item>
      )

      const item = screen.getByTestId('item')

      expect(item.tagName).toBe('LI')
      expect(item).toHaveTextContent('content')
    })

    it('should forward className and li props to the item', () => {
      render(
        <IconContentList.Item className="custom" data-testid="item">
          content
        </IconContentList.Item>
      )

      expect(screen.getByTestId('item')).toHaveClass('custom')
    })
  })
})
