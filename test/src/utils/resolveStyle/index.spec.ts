import { resolveStyle } from '@/utils/resolveStyle'
it('resolve tokens corporativos e preserva propriedades CSS diretas', () => {
  expect(
    resolveStyle({ marginTop: 12, background: 'neutral-100', display: 'flex' })
  ).toEqual({
    marginTop: 'var(--ui-spacing-12)',
    background: 'var(--ui-colors-neutral-100)',
    display: 'flex',
  })
})
