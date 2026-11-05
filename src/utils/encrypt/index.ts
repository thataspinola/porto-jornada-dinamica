'use server'

import * as AesJs from 'aes-js'
import * as CryptoJS from 'crypto-js'
import { env } from 'next-runtime-env'

const GTM_ENCRYPTION = env('GTM-ENCRYPTION') as string

function getEncryptedKeyBuffer(key: string) {
  const key256 = CryptoJS.SHA256(key)
  const buffer = Buffer.from(key256.toString(CryptoJS.enc.Hex), 'hex')
  return new Uint8Array(buffer).slice(0, 16)
}

export async function encryptGtmClientId(
  text = ''
): Promise<string | undefined> {
  if (!text) return

  const textAsBytes = AesJs.utils.utf8.toBytes(text)
  const aes = new AesJs.AES(getEncryptedKeyBuffer(GTM_ENCRYPTION))
  const encryptedBytes = aes.encrypt(AesJs.padding.pkcs7.pad(textAsBytes))

  return AesJs.utils.hex.fromBytes(encryptedBytes)
}
