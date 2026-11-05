/**
 * Gera um ID de sessão exclusivo usando o carimbo de data/hora atual e um número aleatório.
 * @param orgid - O ID da organização a ser incluído no ID da sessão.
 * @returns Um ID de sessão único.
 */
export const generateSessionId = (orgid: string): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = now.getUTCMilliseconds()
  const randomPart = Math.ceil(Math.random() * 1e6)

  const sessionId = `${orgid}-${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}-${randomPart}`

  return sessionId
}
