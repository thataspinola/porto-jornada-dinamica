import { generateSessionId } from '@/utils/generateSessionId'
it('inclui a organização no identificador sem depender de rede', () => {
  expect(generateSessionId('fixture')).toMatch(/^fixture-\d+-\d+$/)
})
