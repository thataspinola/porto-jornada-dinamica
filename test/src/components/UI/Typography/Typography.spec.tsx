import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { Typography } from '@/components/UI/Typography/Typography'

vi.mock('@/components/UI/Typography/Typography.scss', () => ({}))

// Factory to simplify rendering and element selection
const makeSut = (props: Partial<ComponentProps<typeof Typography>> = {}) => {
  const result = render(
    <Typography data-testid="typography" {...props}>
      {props.children || 'Typography'}
    </Typography>
  )

  return {
    ...result,
    element: screen.getByTestId('typography'),
  }
}

describe('Typography', () => {
  it('should render correctly with default values', () => {
    const { element } = makeSut()

    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('typography')
    expect(element).toHaveClass('--title1')
    expect(element).toHaveClass('--insurance-900')
    expect(element).toHaveClass('--regular')
    expect(element).toHaveClass('--normal')
    expect(element.tagName.toLowerCase()).toBe('h1')
    expect(element).toHaveTextContent('Typography')
  })

  it('should render with custom variant', () => {
    const { element } = makeSut({ variant: 'title3', children: 'Title' })

    expect(element).toHaveClass('--title3')
    expect(element).toHaveTextContent('Title')
  })

  it('should render with custom HTML tag', () => {
    const { element } = makeSut({ as: 'h2', children: 'Subtitle' })

    expect(element.tagName.toLowerCase()).toBe('h2')
  })

  it('should render with custom color', () => {
    const { element } = makeSut({ color: 'insurance-500' as any })

    expect(element).toHaveClass('--insurance-500')
  })

  it('should render with custom font weight', () => {
    const { element } = makeSut({ weight: 'bold' })

    expect(element).toHaveClass('--bold')
  })

  it('should render with custom font style', () => {
    const { element } = makeSut({ fontStyle: 'italic' })

    expect(element).toHaveClass('--italic')
  })

  it('should apply custom CSS classes', () => {
    const { element } = makeSut({ className: 'custom-class' })

    expect(element).toHaveClass('custom-class')
    expect(element).toHaveClass('typography')
  })

  it('should pass additional HTML attributes to the element', () => {
    const { element } = makeSut({
      'aria-label': 'Example text',
      title: 'Text title',
    } as any)

    expect(element).toHaveAttribute('aria-label', 'Example text')
    expect(element).toHaveAttribute('title', 'Text title')
  })

  it('should render as a paragraph', () => {
    const { element } = makeSut({ as: 'p', variant: 'body1' })

    expect(element.tagName.toLowerCase()).toBe('p')
    expect(element).toHaveClass('--body1')
  })

  it('should render as a span', () => {
    const { element } = makeSut({ as: 'span', variant: 'caption' })

    expect(element.tagName.toLowerCase()).toBe('span')
    expect(element).toHaveClass('--caption')
  })

  it('should render as a label', () => {
    const { element } = makeSut({ as: 'label', variant: 'label' })

    expect(element.tagName.toLowerCase()).toBe('label')
    expect(element).toHaveClass('--label')
  })

  it('should combine multiple custom properties', () => {
    const { element } = makeSut({
      as: 'h3',
      variant: 'title4',
      color: 'insurance-700' as any,
      weight: 'semibold',
      fontStyle: 'italic',
      className: 'custom-class',
      children: 'Customized Text',
    })

    expect(element.tagName.toLowerCase()).toBe('h3')
    expect(element).toHaveClass('--title4')
    expect(element).toHaveClass('--insurance-700')
    expect(element).toHaveClass('--semibold')
    expect(element).toHaveClass('--italic')
    expect(element).toHaveClass('custom-class')
    expect(element).toHaveTextContent('Customized Text')
  })
})
