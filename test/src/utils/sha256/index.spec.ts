/** @vitest-environment node */
import { sha256 } from '@/utils/sha256/index'
test('vetor SHA-256 conhecido', async () =>
  expect(await sha256('abc')).toBe(
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  ))
