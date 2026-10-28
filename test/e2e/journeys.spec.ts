import { chromium, type Browser } from 'playwright'
import { beforeAll, afterAll, expect, it } from 'vitest'

let browser: Browser
let baseURL: URL
beforeAll(async () => {
  if (!process.env.E2E_BASE_URL)
    throw new Error(
      'Configure E2E_BASE_URL para a aplicação no ambiente de testes.'
    )
  baseURL = new URL(process.env.E2E_BASE_URL.replace(/\/?$/, '/'))
  if (!['http:', 'https:'].includes(baseURL.protocol))
    throw new Error('E2E_BASE_URL inválida')
  browser = await chromium.launch()
})
afterAll(async () => browser?.close())
it('health responde no ambiente configurado', async () => {
  const response = await fetch(new URL('api/health', baseURL))
  expect(response.status).toBe(200)
})
it('aplicação carrega no navegador sem erro de execução', async () => {
  const page = await browser.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  try {
    const response = await page.goto(baseURL.href)
    expect(response?.ok()).toBe(true)
    await expect.poll(() => page.locator('body').innerText()).not.toBe('')
    expect(errors).toEqual([])
  } finally {
    await page.close()
  }
})

it.each([
  ['REFF', 'E2E_REFF_URL'],
  ['FCDC', 'E2E_FCDC_URL'],
])('%s apresenta os dois produtos na negativa de CPF e registra uma promoção', async (_journey, urlVariable) => {
  const url = process.env[urlVariable]
  const cpf = process.env.E2E_NOT_ELIGIBLE_CPF
  if (!url || !cpf)
    throw new Error(
      `Configure ${urlVariable} e E2E_NOT_ELIGIBLE_CPF com dados do ambiente de testes.`
    )
  const page = await browser.newPage()
  try {
    await page.goto(url)
    await page.getByLabel('CPF', { exact: true }).fill(cpf)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    const wrapper = page.locator('#cpf-recommended-products-wrapper')
    await wrapper.getByText('Empréstimo Consignado', { exact: true }).waitFor()
    await wrapper.getByText('Empréstimo Pessoal', { exact: true }).waitFor()
    const promotions = () =>
      page.evaluate(() => {
        const events =
          (window as Window & { dataLayer?: unknown[] }).dataLayer ?? []
        return events.filter(
          (event): event is Record<string, unknown> =>
            !!event &&
            typeof event === 'object' &&
            'event' in event &&
            event.event === 'view_promotion' &&
            'items' in event &&
            Array.isArray(event.items) &&
            event.items.some(
              (item) => item?.creative_slot === 'cpf-negativa-elegibilidade'
            )
        )
      })
    await expect.poll(async () => (await promotions()).length).toBe(1)
    const [event] = await promotions()
    expect(event.ev_action).toBe('ecommerce:visualizar:promocao:sucesso')
    expect(event.items).toHaveLength(2)
    expect(event).not.toHaveProperty('currency')
    expect(event).not.toHaveProperty('value')
  } finally {
    await page.close()
  }
})
