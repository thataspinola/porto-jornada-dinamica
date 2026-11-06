import { render, screen } from '@testing-library/react'

import { IconContent } from '@/components/UI/IconContent/index'

describe('IconContent', () => {
  describe('Root', () => {
    it('should render its children', () => {
      render(
        <IconContent.Root data-testid="root">
          <span>child</span>
        </IconContent.Root>
      )

      expect(screen.getByText('child')).toBeInTheDocument()
    })

    it('should apply the base iconContent class', () => {
      render(<IconContent.Root data-testid="root">content</IconContent.Root>)

      expect(screen.getByTestId('root').className).toContain('iconContent')
    })

    it('should apply the alignStart class when align is "start"', () => {
      render(
        <IconContent.Root align="start" data-testid="root">
          content
        </IconContent.Root>
      )

      expect(screen.getByTestId('root').className).toContain('alignStart')
    })

    it('should not apply the alignStart class by default', () => {
      render(<IconContent.Root data-testid="root">content</IconContent.Root>)

      expect(screen.getByTestId('root').className).not.toContain('alignStart')
    })

    it('should forward className and div props to the wrapper', () => {
      render(
        <IconContent.Root
          className="custom"
          aria-label="wrapper"
          data-testid="root"
        >
          content
        </IconContent.Root>
      )

      const root = screen.getByTestId('root')

      expect(root).toHaveClass('custom')
      expect(root).toHaveAttribute('aria-label', 'wrapper')
    })
  })

  describe('Icon', () => {
    it('should render an svg element', () => {
      const { container } = render(<IconContent.Icon icon="add" />)

      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should apply a default size of 32', () => {
      const { container } = render(<IconContent.Icon icon="add" />)

      expect(container.querySelector('svg')).toHaveStyle({
        width: '32px',
        height: '32px'
      })
    })

    it('should respect a provided size', () => {
      const { container } = render(<IconContent.Icon icon="add" size={20} />)

      expect(container.querySelector('svg')).toHaveStyle({
        width: '20px',
        height: '20px'
      })
    })

    it('should forward a custom className', () => {
      const { container } = render(
        <IconContent.Icon icon="add" className="custom-icon" />
      )

      expect(container.querySelector('svg')).toHaveClass('custom-icon')
    })
  })

  describe('Content', () => {
    it('should render its children', () => {
      render(
        <IconContent.Content>
          <span>child</span>
        </IconContent.Content>
      )

      expect(screen.getByText('child')).toBeInTheDocument()
    })

    it('should apply the base text class', () => {
      render(
        <IconContent.Content data-testid="content">text</IconContent.Content>
      )

      expect(screen.getByTestId('content').className).toContain('text')
    })
  })

  describe('Title', () => {
    it('should render its children', () => {
      render(<IconContent.Title>My title</IconContent.Title>)

      expect(screen.getByText('My title')).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('should render its children', () => {
      render(<IconContent.Description>My description</IconContent.Description>)

      expect(screen.getByText('My description')).toBeInTheDocument()
    })
  })

  describe('Trailing', () => {
    it('should render its children', () => {
      render(
        <IconContent.Trailing>
          <span>end</span>
        </IconContent.Trailing>
      )

      expect(screen.getByText('end')).toBeInTheDocument()
    })

    it('should apply the base trailing class', () => {
      render(
        <IconContent.Trailing data-testid="trailing">end</IconContent.Trailing>
      )

      expect(screen.getByTestId('trailing').className).toContain('trailing')
    })
  })

  describe('Action', () => {
    it('should render the text', () => {
      render(<IconContent.Action text="Entender modalidades" />)

      expect(screen.getByText('Entender modalidades')).toBeInTheDocument()
    })

    it('should call onClick when clicked', () => {
      const onClick = vi.fn()

      render(
        <IconContent.Action text="Consultar regulamento" onClick={onClick} />
      )

      screen.getByRole('button', { name: 'Consultar regulamento' }).click()

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should apply the end alignment class when align is "end"', () => {
      render(<IconContent.Action text="Ver mais" align="end" />)

      expect(
        screen.getByRole('button', { name: 'Ver mais' }).className
      ).toContain('actionEnd')
    })
  })
})
