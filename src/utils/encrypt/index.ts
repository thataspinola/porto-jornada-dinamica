import * as AesJs from "aes-js";
import * as CryptoJS from "crypto-js";

const DEFAULT_ENCRYPTION_KEY = "chave";

const getEncryptedKeyBuffer = (key: string) => {
	const key256 = CryptoJS.SHA256(key);
	const buffer = Buffer.from(key256.toString(CryptoJS.enc.Hex), "hex");
	return new Uint8Array(buffer).slice(0, 16);
};

export const encryptGtmClientId = (text = "") => {
	if (!text) return;

	const textAsBytes = AesJs.utils.utf8.toBytes(text);
	const aes = new AesJs.AES(getEncryptedKeyBuffer(DEFAULT_ENCRYPTION_KEY));
	const encryptedBytes = aes.encrypt(AesJs.padding.pkcs7.pad(textAsBytes));

	return AesJs.utils.hex.fromBytes(encryptedBytes);
};
