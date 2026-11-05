import { describe, expect, it } from 'vitest'

import { drawerElementSchema } from './drawer.schema'

const drawer = {
  id: 'details-drawer',
  type: 'DRAWER',
  config: {
    slug: 'details',
    headerChildren: [
      {
        id: 'title',
        type: 'TITLE',
        config: {
          text: 'Detalhes'
        }
      }
    ],
    bodyChildren: [
      {
        id: 'description',
        type: 'TEXT',
        config: {
          text: 'Conteúdo do drawer'
        }
      },
      {
        id: 'name',
        type: 'TEXT_INPUT',
        config: {
          name: 'name',
          label: 'Nome',
          required: true
        }
      }
    ],
    footerChildren: [
      {
        id: 'continue',
        type: 'NAVIGATION',
        config: {
          label: 'Continuar'
        }
      }
    ]
  }
}

describe('drawerElementSchema', () => {
  it('accepts journey elements in each drawer slot', () => {
    expect(drawerElementSchema.parse(drawer)).toMatchObject(drawer)
  })

  it.each([
    'headerChildren',
    'bodyChildren',
    'footerChildren'
  ] as const)('rejects nested drawers in %s', (slot) => {
    expect(() =>
      drawerElementSchema.parse({
        ...drawer,
        config: { ...drawer.config, [slot]: [drawer] }
      })
    ).toThrow()
  })

  it('defaults omitted slots to empty arrays', () => {
    expect(
      drawerElementSchema.parse({
        id: 'empty-drawer',
        type: 'DRAWER',
        config: { slug: 'empty' }
      }).config
    ).toEqual({
      slug: 'empty',
      headerChildren: [],
      bodyChildren: [],
      footerChildren: []
    })
  })
})
