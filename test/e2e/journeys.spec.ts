import { spawn, type ChildProcess } from 'node:child_process'
import { createServer, type Server } from 'node:http'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium, type Browser } from 'playwright'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

type PromotionPayload = { event: string; items: { item_id: string }[] }
let browser: Browser
let app: ChildProcess
let backend: Server
let baseURL: string
let requests: unknown[] = []
let eligible = false
let output = ''

beforeAll(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
  })

  backend = createServer(async (request, response) => {
    let body = ''
    for await (const chunk of request) body += chunk
    requests.push(JSON.parse(body))
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ eligible }))
  })

  backend.listen(0, '127.0.0.1')
  await once(backend, 'listening')
  const backendAddress = backend.address()

  if (!backendAddress || typeof backendAddress === 'string')
    throw new Error('Backend local indisponível')

  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const appAddress = reservation.address()

  if (!appAddress || typeof appAddress === 'string')
    throw new Error('Porta indisponível')

  const port = appAddress.port
  await new Promise<void>((resolve) => reservation.close(() => resolve()))
  const origin = `http://127.0.0.1:${port}`

  const manifest = JSON.parse(
    await readFile(
      resolve('dist/react-ssr-corp-hubv-dinamic-journey/routes-manifest.json'),
      'utf8'
    )
  ) as { basePath?: string }

  baseURL = origin + (manifest.basePath ?? '')

  app = spawn(
    process.execPath,
    [resolve('dist/react-ssr-corp-hubv-dinamic-journey/standalone/server.js')],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOSTNAME: '127.0.0.1',
        PORT: String(port),
        ELIGIBILITY_URL: `http://127.0.0.1:${backendAddress.port}/eligibility`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )

  app.stdout?.on('data', (data) => {
    output += String(data)
    const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/)

    if (match && match[0] !== origin)
      throw new Error('Servidor iniciou em porta inesperada')
  })

  app.stderr?.on('data', (data) => {
    output += String(data)
  })

  await vi.waitFor(
    async () => {
      if (app.exitCode !== null) throw new Error(`Servidor encerrou: ${output}`)
      expect(baseURL, output).toBeTruthy()
      expect((await fetch(`${baseURL}/api/health`)).status).toBe(200)
    },
    { timeout: 50000, interval: 100 }
  )
})

afterAll(async () => {
  await browser?.close()

  if (app && app.exitCode === null) {
    app.kill('SIGTERM')
    const killTimeout = setTimeout(() => app.kill('SIGKILL'), 5000)
    await once(app, 'exit')
    clearTimeout(killTimeout)
  }

  if (backend?.listening)
    await new Promise<void>((resolve, reject) =>
      backend.close((error) => (error ? reject(error) : resolve()))
    )
})

describe('E2E das jornadas com backend HTTP local controlado', () => {
  it.each(['emprestimo-com-garantia-de-veiculo', 'financiamento-de-veiculos'])(
    'negativa CPF mostra dois produtos e dispara view_promotion uma vez: %s',
    async (slug) => {
      eligible = false
      requests = []
      const context = await browser.newContext()
      const page = await context.newPage()

      try {
        await page.goto(`${baseURL}/contrate/${slug}/cpf`)

        const products = page.getByText('Empréstimo Consignado', {
          exact: true,
        })

        expect(await products.count()).toBe(0)
        const cpf = page.getByLabel('CPF', { exact: true })
        await cpf.fill('52998224724')

        const next = page.getByRole('button', {
          name: 'Continuar',
          exact: true,
        })

        expect(await next.isEnabled()).toBe(false)
        expect(requests).toHaveLength(0)
        await cpf.fill('52998224725')
        await vi.waitFor(async () => expect(await next.isEnabled()).toBe(true))
        await next.click()

        await products.waitFor({ state: 'visible' })

        expect(
          await page
            .getByText('Empréstimo Pessoal', { exact: true })
            .isVisible()
        ).toBe(true)

        expect(requests[0]).toMatchObject({ fields: { taxvat: '52998224725' } })

        const events = () =>
          page.evaluate(() =>
            (window.dataLayer ?? []).filter(
              (event): event is PromotionPayload =>
                typeof event === 'object' &&
                event !== null &&
                'event' in event &&
                event.event === 'view_promotion'
            )
          )

        const payloads = await events()
        expect(payloads).toHaveLength(1)

        expect(payloads[0]).toMatchObject({
          event: 'view_promotion',
          ev_action: 'ecommerce:visualizar:promocao:sucesso',
          items: [
            {
              item_name: 'Empréstimo Consignado',
              item_brand: 'porto',
              affiliation: 'porto',
              creative_name: 'produtos-recomendados',
              creative_slot: 'cpf-negativa-elegibilidade',
            },
            {
              item_name: 'Empréstimo Pessoal',
              item_brand: 'porto',
              affiliation: 'porto',
              creative_name: 'produtos-recomendados',
              creative_slot: 'cpf-negativa-elegibilidade',
            },
          ],
        })

        expect(payloads[0]).not.toHaveProperty('currency')
        expect(payloads[0]).not.toHaveProperty('value')

        for (const item of payloads[0].items) {
          expect(item).not.toHaveProperty('price')
          expect(item).not.toHaveProperty('sku')
          expect(item).not.toHaveProperty('url')
        }

        const source = JSON.parse(
          await readFile(resolve(`public/jsonContent/${slug}.json`), 'utf8')
        )

        const wrapper = source.steps
          .flatMap(
            (step: {
              elements: {
                id: string
                config: {
                  elements: {
                    config: {
                      elements: { type: string; config: { url: string } }[]
                    }
                  }[]
                }
              }[]
            }) => step.elements
          )
          .find(
            (element: { id: string }) =>
              element.id === 'cpf-recommended-products-wrapper'
          )

        const urls = wrapper.config.elements.map(
          (card: {
            config: { elements: { type: string; config: { url: string } }[] }
          }) =>
            card.config.elements.find(
              (element) => element.type === 'NAVIGATION'
            )?.config.url
        )

        expect(
          payloads[0].items.map((item: { item_id: string }) => item.item_id)
        ).toEqual(urls)

        await cpf.fill('11111111111')
        await cpf.fill('52998224725')
        expect(await events()).toHaveLength(1)
      } finally {
        await context.close()
      }
    }
  )

  it('carrega catálogo, health e retorna 404 para jornada desconhecida', async () => {
    const page = await browser.newPage()

    try {
      await page.goto(`${baseURL}/contrate`)

      expect(
        await page.getByRole('heading', { name: 'Produtos Porto' }).isVisible()
      ).toBe(true)

      expect(
        (await page.goto(`${baseURL}/contrate/jornada-inexistente`))?.status()
      ).toBe(404)

      const health = await fetch(`${baseURL}/api/health`)
      expect(health.status).toBe(200)
      expect(health.headers.get('x-content-type-options')).toBe('nosniff')
      expect(health.headers).get('content-type').toBe('application/json')
    } finally {
      await page.close()
    }
  })
})
