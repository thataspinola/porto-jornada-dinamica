import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, firefox, webkit, type Browser } from 'playwright'

let browser: Browser
const engines = { chromium, firefox, webkit }
beforeAll(async () => {
  for (const name of [
    'E2E_BASE_URL',
    'E2E_REFF_URL',
    'E2E_FCDC_URL',
    'E2E_NOT_ELIGIBLE_CPF'
  ]) {
    if (!process.env[name])
      throw new Error(
        `Configure ${name} para executar o E2E no ambiente autorizado`
      )
  }
  const engine = process.env.E2E_BROWSER ?? 'chromium'
  if (!(engine in engines))
    throw new Error('E2E_BROWSER deve ser chromium, firefox ou webkit')
  browser = await engines[engine as keyof typeof engines].launch({
    headless: true,
    ...(engine === 'chromium' && process.env.E2E_CHANNEL
      ? { channel: process.env.E2E_CHANNEL }
      : {})
  })
})
afterAll(async () => {
  await browser?.close()
})

it('acessa a aplicação real', async () => {
  const page = await browser.newPage()
  try {
    const response = await page.goto(process.env.E2E_BASE_URL!)
    expect(response?.ok()).toBe(true)
  } finally {
    await page.close()
  }
})

it.each([
  'E2E_REFF_URL',
  'E2E_FCDC_URL'
])('registra uma promoção após a negativa em %s', async (name) => {
  const page = await browser.newPage()
  try {
    await page.goto(process.env[name]!)
    await page
      .getByLabel('CPF', { exact: true })
      .fill(process.env.E2E_NOT_ELIGIBLE_CPF!)
    const button = page.getByRole('button', { name: /continuar/i })
    await button.click()
    await page
      .getByText('Empréstimo Consignado', { exact: true })
      .waitFor({ state: 'visible' })
    await page
      .getByText('Empréstimo Pessoal', { exact: true })
      .waitFor({ state: 'visible' })
    const promotions = () =>
      page.evaluate(() =>
        (window.dataLayer ?? []).filter(
          (entry) => (entry as { event?: string })?.event === 'view_promotion'
        )
      )
    await expect.poll(async () => (await promotions()).length).toBe(1)
    const [event] = await promotions()
    expect(event).toMatchObject({
      ev_action: 'ecommerce:visualizar:promocao:sucesso',
      items: [
        { item_name: 'Empréstimo Consignado' },
        { item_name: 'Empréstimo Pessoal' }
      ]
    })
    expect(event).not.toHaveProperty('currency')
    expect(event).not.toHaveProperty('value')
  } finally {
    await page.close()
  }
})
