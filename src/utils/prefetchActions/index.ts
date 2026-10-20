import {
  type CryptoKey,
  compactDecrypt,
  exportJWK,
  generateKeyPair,
} from 'jose'

export type PrefetchActionContext = Record<string, unknown>

export type PreparedPrefetchPayload = {
  payload: Record<string, unknown>
  privateKey?: CryptoKey
}

type PrefetchActionHandler = {
  preparePayload: (
    payload: Record<string, unknown>,
    context: PrefetchActionContext
  ) => Promise<PreparedPrefetchPayload>
  processResponse: (data: unknown, privateKey?: CryptoKey) => Promise<unknown>
}

async function prepareGetSessionEncryptedPayload(
  payload: Record<string, unknown> = {},
  _context: PrefetchActionContext = {}
): Promise<PreparedPrefetchPayload> {
  const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256', {
    modulusLength: 2048,
    extractable: true,
  })

  const publicJwk = await exportJWK(publicKey)

  if (!publicJwk.n || !publicJwk.e) {
    throw new Error('Não foi possível gerar a chave pública da sessão.')
  }

  return {
    payload: {
      ...payload,
      publicKey: {
        kty: publicJwk.kty ?? 'RSA',
        n: publicJwk.n,
        e: publicJwk.e,
        alg: 'RSA-OAEP-256',
      },
    },
    privateKey,
  }
}

async function processGetSessionEncryptedResponse(
  data: unknown,
  privateKey?: CryptoKey
): Promise<unknown> {
  if (typeof data !== 'string' || !privateKey) return data
  const { plainText } = await compactDecrypt(data, privateKey)
  const decryptedText = new TextDecoder().decode(plainText)
  return JSON.parse(decryptedText)
}

const PREFETCH_ACTIONS: Record<string, PrefetchActionHandler> = {
  'get-session-encrypted': {
    preparePayload: prepareGetSessionEncryptedPayload,
    processResponse: processGetSessionEncryptedResponse,
  },
}

export async function preparePrefetchPayload(
  action: string | undefined,
  payload: Record<string, unknown> | undefined,
  context: PrefetchActionContext = {}
): Promise<PreparedPrefetchPayload> {
  const handler = action ? PREFETCH_ACTIONS[action.trim()] : undefined

  if (!handler) {
    return { payload: payload ?? {} }
  }

  return handler.preparePayload(payload ?? {}, context)
}

export async function processPrefetchResponse(
  action: string | undefined,
  data: unknown,
  privateKey?: CryptoKey
): Promise<unknown> {
  const handler = action ? PREFETCH_ACTIONS[action.trim()] : undefined

  if (!handler) {
    return data
  }

  return handler.processResponse(data, privateKey)
}
