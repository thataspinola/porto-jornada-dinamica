export async function sha256(text: string): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest !== 'function') {
    throw new Error('sha256: SubtleCrypto is not available in this environment')
  }

  const encoded = new TextEncoder().encode(text)
  const buffer = await globalThis.crypto.subtle.digest('SHA-256', encoded)
  const bytes = new Uint8Array(buffer)

  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}
