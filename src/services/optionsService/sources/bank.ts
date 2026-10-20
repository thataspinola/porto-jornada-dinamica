const BANKS: ReadonlyArray<{ code: number; name: string }> = [
  { code: 246, name: 'Banco ABC Brasil S.A' }, // precisa preencher com o resto dos bancos
]

export const BANK_SOURCE = BANKS.map(({ code, name }) => ({
  code: String(code).padStart(3, '0'),
  name,
}))
