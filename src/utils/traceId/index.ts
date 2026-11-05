'use server'
import { cookies, headers } from 'next/headers'

/**
 * Gera um ID único e curto de 11 caracteres (Base 62) usando aleatoriedade criptográfica.
 * Não utiliza timestamp. Usa 8 bytes (64 bits) de entropia pura.
 */
function gerarHashCurtoPuro() {
  // 1. Gera 7 bytes (56 bits), mas usaremos apenas os 53 bits inferiores para segurança.
  // Usar 8 bytes e depois descartar os bits superiores é uma forma mais segura de obter alta entropia.
  const randomBytes = new Uint8Array(8)
  crypto.getRandomValues(randomBytes)

  // 2. Converte os bytes em um Number (limitando-o à precisão de 53 bits)
  let randomNumber = 0
  for (let i = 0; i < randomBytes.length; i++) {
    // Combina os bytes no número.
    randomNumber = randomNumber * 256 + randomBytes[i]
  }

  // Máscara: Máximo de 53 bits que um Number JS pode ter.
  // Isso garante que o número final seja sempre inferior a Number.MAX_SAFE_INTEGER.
  const MAX_53_BIT = 9007199254740991

  // Usamos o operador OR ( | ) e AND ( & ) para garantir que a aleatoriedade
  // fique dentro do limite de 53 bits seguros
  let safeRandomNumber =
    (randomBytes[0] +
      randomBytes[1] * 256 +
      randomBytes[2] * 65536 +
      randomBytes[3] * 16777216) *
      2 ** 21 +
    (randomBytes[4] * 256 * 256 + randomBytes[5] * 256 + randomBytes[6])

  // Garantimos que não ultrapasse 2^53
  safeRandomNumber = safeRandomNumber % (MAX_53_BIT + 1)

  // 3. Compacta o Number seguro em uma string Base 64 de 9 caracteres
  return decimalToBase64(safeRandomNumber)
}

function decimalToBase64(decimalNumber) {
  // 1. Definição do Charset (64 Símbolos)
  // O charset seguro para URL geralmente usa:
  // 0-9 (10), a-z (26), A-Z (26) (omitindo - e _)
  const BASE64_CHARS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const BASE = BASE64_CHARS.length // 62

  let num = Math.abs(Math.floor(decimalNumber)) // Garante que o número seja um inteiro positivo

  if (num === 0) {
    // Caso especial: 0
    return BASE64_CHARS[0] // Retorna '0'
  }
  let result = ''
  while (num > 0) {
    // 2. Processo de Conversão (Divisão e Resto)
    const remainder = num % BASE // Pega o resto da divisão pela base(índice do caractere)
    result = BASE64_CHARS[remainder] + result // Adiciona o caractere correspondente ao início do resultado
    num = Math.floor(num / BASE) // Atualiza o número para a próxima iteração (divisão inteira)
  }

  return result
}

function base64EncodeString(inputString: string) {
  const buffer = Buffer.from(inputString, 'utf8')
  const base64String = buffer.toString('base64')
  const compactedBase64String = base64String.replace(/=+$/, '')
  return compactedBase64String
}
function base64EncodeIp(inputIp: string) {
  const validIpRegex = /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/gm
  let valueToConvert = '000000000000'
  if (validIpRegex.test(inputIp)) {
    const ipParts = inputIp.split('.')
    const zeroFilledIpParts = ipParts.map((part) => part.padStart(3, '0'))
    valueToConvert = zeroFilledIpParts.join('')
  }
  return decimalToBase64(Number.parseFloat(valueToConvert))
}

function generateTraceIdString(
  hubOriginValue,
  xForwardedForHeaderValue,
  traceHash
) {
  const currentDateTimeNow = new Date(Date.now())
  const ipBase64String = base64EncodeIp(
    xForwardedForHeaderValue ?? '000.000.000.000'
  )
  const timestampBase64String = decimalToBase64(currentDateTimeNow.getTime())
  const traceHashBase64String = base64EncodeString(traceHash)
  const returnValue = `${hubOriginValue}-${ipBase64String}-${timestampBase64String}-${traceHashBase64String}`
  return returnValue
}

/**
 * Generates or acquire Trace ID using cookies/requests headers as source.
 * If there is a cookie named hubSessionId and have value it's value will be considered.
 * Otherwise, if 'porto-hub-trace-id' header exists in request headers array it's value will be considered.
 * Otherwise, if 'carbon-trace-id' header exists in request headers array it's value will be considered.
 * Otherwise, a new UUID value will be generated and considered.
 *
 * @returns {string} - trace-id
 */

export async function getTraceId(): Promise<string> {
  const cookieStore = await cookies()
  const traceIdCokie = cookieStore.get('portoHubTraceId')?.value

  const headersStore = await headers()
  const xForwardedFor = headersStore.get('x-forwarded-for')
  const portoHubSessionId = headersStore.get('porto-hub-trace-id')
  const carbonTraceId = headersStore.get('carbon-trace-id')

  const randomHash = gerarHashCurtoPuro()

  const hubOriginValue = 20 //Considering 20 for card/first-purchase
  const returnValue =
    traceIdCokie ??
    portoHubSessionId ??
    carbonTraceId ??
    generateTraceIdString(hubOriginValue, xForwardedFor, randomHash)
  return returnValue
}
