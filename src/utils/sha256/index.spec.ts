import { sha256 } from '.'

describe('sha256', () => {
  it('should return the SHA-256 hex digest of an empty string', async () => {
    await expect(sha256('')).resolves.toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    )
  })

  it('should return the SHA-256 hex digest of "abc"', async () => {
    await expect(sha256('abc')).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })

  it('should handle non-ASCII input', async () => {
    await expect(sha256('José')).resolves.toBe(
      '24c2ab65b7adab7e070ba05a00a3f3ae074e28b8bcdd59735b7107e7a538a551'
    )
  })
})
