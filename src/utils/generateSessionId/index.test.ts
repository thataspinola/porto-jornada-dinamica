import { generateSessionId } from '.'

const regex = new RegExp(/^[a-zA-Z]+-\d+-\d+/)

describe('generateSessionId', () => {
  it('should generate a string', () => {
    const orgid = 'portoservicos'
    const sessionId = generateSessionId(orgid)
    expect(typeof sessionId).toBe('string')
  })

  it('should generate unique IDs', () => {
    const orgid = 'portoservicos'
    const id1 = generateSessionId(orgid)
    const id2 = generateSessionId(orgid)
    expect(id1).not.toBe(id2)
  })

  it('should generate ID with correct format', () => {
    const orgid = 'portoservicos'
    const sessionId = generateSessionId(orgid)

    expect(regex.test(sessionId)).toBeTruthy()
  })

  it('should generate ID with incorrect format', () => {
    const orgid = 'porto-servicos'
    const sessionId = generateSessionId(orgid)

    expect(regex.test(sessionId)).toBeFalsy()
  })

  it('should generate ID with special characters', () => {
    const orgid = '@portoservicos'
    const sessionId = generateSessionId(orgid)

    expect(regex.test(sessionId)).toBeFalsy()
  })
})
