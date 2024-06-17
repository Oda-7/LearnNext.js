import crypto from 'crypto'
import { env } from 'process'

let key = env.ENCRYPTED_KEY
// console.log(key)

let iv: any
let keytest: any
if (key !== undefined) {
	keytest = Buffer.from(key, 'hex')
	keytest = keytest.slice(0, 20)
	iv = keytest.slice(0, 16)
	// console.log(keytest)
	// console.log(iv)
}
// console.log(key.toString('hex'))
export function encrypted(data: any) {
	// console.log(data)
	// console.log(key)

	const algo = 'aes-256-cbc'
	const cipher = crypto.createCipheriv(algo, keytest, iv)
	let encryptedData = cipher.update(data, 'utf-8', 'hex')
	encryptedData += cipher.final('hex')

	// let decryptedData = decipher.update(data, 'utf-8', 'hex')
	// decryptedData += decipher.final('hex')
	console.log(encryptedData)
	// console.log(decryptedData)
	return encryptedData
}

export function decrypted(data: any) {
	console.log(iv)
	console.log(data)
	const algo = 'aes-256-cbc'
	const decipher = crypto.createDecipheriv(algo, keytest, iv)
	let decryptedData = decipher.update(data, 'hex', 'utf-8')
	// console.log(decryptedData)
	decryptedData += decipher.final('utf-8')
	console.log(decryptedData)
	return decryptedData
}

// export class Encrypted {
// 	private key: any
// 	private iv: any
// 	private algo: string

// 	constructor() {
// 		this.key = crypto.randomBytes(32)
// 		this.iv = crypto.randomBytes(16)
// 		this.algo = 'aes-256-cbc'
// 	}

// 	encrypt(data: any) {
// 		console.log(this.key)
// 		const cipher = crypto.createCipheriv(this.algo, this.key, this.iv)
// 		let encryptedData = cipher.update(data, 'utf8', 'hex')
// 		encryptedData += cipher.final('hex')
// 		return encryptedData
// 	}

// 	getKey() {
// 		return this.key
// 	}

// 	decrypt(data: any) {
// 		console.log(this.key)
// 		const decipher = crypto.createDecipheriv(this.algo, this.key, this.iv)
// 		let decryptedData = decipher.update(data, 'hex', 'utf8')
// 		decryptedData += decipher.final('utf8')
// 		return decryptedData
// 	}
// }
