import { render, screen, waitFor } from '@testing-library/react'

import { ProgressBar } from './index'

describe('ProgressBar', () => {
  it('should compute the fill width from value/max', async () => {
    render(
      <ProgressBar.Root value={2} max={4} data-testid="progress-bar">
        <ProgressBar.Indicator data-testid="progress-bar-indicator" />
      </ProgressBar.Root>
    )

    const progressBarFill = screen.getByTestId('progress-bar-indicator')

    await waitFor(() => expect(progressBarFill).toHaveStyle({ width: '50%' }))
  })

  it('should update the width when value changes', async () => {
    const { rerender } = render(
      <ProgressBar.Root value={1} max={4} data-testid="progress-bar">
        <ProgressBar.Indicator data-testid="progress-bar-indicator" />
      </ProgressBar.Root>
    )

    await waitFor(() =>
      expect(screen.getByTestId('progress-bar-indicator')).toHaveStyle({
        width: '25%'
      })
    )

    rerender(
      <ProgressBar.Root value={4} max={4} data-testid="progress-bar">
        <ProgressBar.Indicator data-testid="progress-bar-indicator" />
      </ProgressBar.Root>
    )

    await waitFor(() =>
      expect(screen.getByTestId('progress-bar-indicator')).toHaveStyle({
        width: '100%'
      })
    )
  })

  it('should forward className and div props to the root', () => {
    render(
      <ProgressBar.Root
        value={1}
        max={2}
        className="custom"
        data-testid="progress-bar">
        <ProgressBar.Indicator data-testid="progress-bar-indicator" />
      </ProgressBar.Root>
    )

    expect(screen.getByTestId('progress-bar')).toHaveClass('custom')
  })

  it('should apply className to the indicator element', () => {
    render(
      <ProgressBar.Root value={1} max={2} data-testid="progress-bar">
        <ProgressBar.Indicator
          className="custom-fill"
          data-testid="progress-bar-indicator"
        />
      </ProgressBar.Root>
    )

    expect(screen.getByTestId('progress-bar-indicator')).toHaveClass(
      'custom-fill'
    )
  })

  it('should expose progressbar accessibility attributes', () => {
    render(
      <ProgressBar.Root value={1} max={4}>
        <ProgressBar.Indicator data-testid="progress-bar-indicator" />
      </ProgressBar.Root>
    )

    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-label', 'barra de progresso')
    expect(progressBar).toHaveAttribute('aria-valuenow', '1')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '4')
    expect(progressBar).toHaveAttribute('aria-valuetext', '25%')
  })

  it('should allow overriding the default aria-label', () => {
    render(
      <ProgressBar.Root value={1} max={4} aria-label="Progresso da jornada">
        <ProgressBar.Indicator />
      </ProgressBar.Root>
    )

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Progresso da jornada'
    )
  })
})
