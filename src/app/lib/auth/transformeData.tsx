import { hashPassword } from './password'
import { protectData, protectDataPassword } from './protectData'

export async function transformDataRegister(data: any) {
	for (let key in data) {
		// transformation de données
		data[key] = (data[key] as string).trim()

		if (key === 'password') {
			// console.log(data[key])
			data[key] = await protectDataPassword(data[key])
			data[key] = await hashPassword(data[key]) // protection des données
		} else {
			data[key] = await protectData(data[key]) // protection des données
		}

		if (key === 'username' || key === 'lastname') {
			const firstLetter = data[key].charAt(0).toUpperCase()
			const rest = data[key].slice(1).toLowerCase()
			data[key] = firstLetter + rest
		} else if (key === 'email') {
			data[key] = data[key].toLowerCase()
		}

		if (key === 'phone') {
			data[key] = data[key].replace('0', '+33')
		}
	}
	// data.password = await hashPassword(data.password)
	return data
}

export async function transformDataLogin(data: any) {
	for (let key in data) {
		// transformation de données
		// console.log(data[key])
		data[key] = (data[key] as string).trim()
		// console.log(data[key])

		if (key === 'password') {
			data[key] = await protectDataPassword(data[key])
			// data[key] = await hashPassword(data[key]) // protection des données
		} else {
			data[key] = await protectData(data[key]) // protection des données
		}

		if (key === 'email') {
			data[key] = data[key].toLowerCase()
		}
	}
	// console.log(data)
	// data.password = await hashPassword(data.password)
	return data
}
