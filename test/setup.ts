import '@testing-library/jest-dom/vitest'
import { createElement } from 'react'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, priority, ...props }: any) =>
    createElement('img', {
      src: typeof src === 'object' ? src.src : src,
      alt,
      width,
      height,
      'data-priority': priority ? 'true' : undefined,
      ...props
    })
}))

// Provide a default dataLayer so components that call pushEvent during tests
// don't emit the "dataLayer is not defined" warn. Individual specs can still
// reset or clear it to exercise specific behaviour.
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = []
}
