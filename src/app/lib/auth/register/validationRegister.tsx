import prisma from '../../prisma'
import { validateEmail } from '../validateEmail'
import { regexEmail, regexName } from '../regex'

export function checkFirstname(firstname: string, arrayError: { error: {} }) {
	if (!firstname) {
		arrayError.error = {
			...arrayError.error,
			firstname: 'Vous navez pas donné de prénom',
		}
	} else if (firstname.length > 30) {
		arrayError.error = {
			...arrayError.error,
			firstname: 'Le prénom que vous avez donné est trop long',
		}
	} else if (!regexName.test(firstname)) {
		arrayError.error = {
			...arrayError.error,
			firstname: "Vous n'avez pas donné le bon format pour le prénom",
		}
	}
	return arrayError
}

export function checkLastname(lastname: string, arrayError: { error: {} }) {
	if (!lastname) {
		arrayError.error = {
			...arrayError.error,
			lastname: 'Vous navez pas donné de nom',
		}
	} else if (lastname.length > 30) {
		arrayError.error = {
			...arrayError.error,
			lastname: 'Le nom que vous avez donné est trop long',
		}
	} else if (!regexName.test(lastname)) {
		arrayError.error = {
			...arrayError.error,
			lastname: "Vous n'avez pas donné le bon format pour le nom",
		}
	}
	// console.log(lastname)
	// console.log(regexName.test(lastname))
	return arrayError
}

export function checkEmail(email: string, arrayError: { error: {} }) {
	if (email) {
		const emailError = validateEmail(email, regexEmail)
		if (emailError) {
			arrayError.error = { ...arrayError.error, ...emailError }
		} else {
			const emailExist = prisma.users.findUnique({
				where: {
					email: email,
				},
			})

			if (!emailExist) {
				arrayError.error = {
					...arrayError.error,
					email: 'Cette adresse e-mail est déjà utilisée',
				}
			}
		}
	} else {
		arrayError.error = {
			...arrayError.error,
			email: "Vous navez pas donné d'adresse e-mail",
		}
	}
	return arrayError
}

export function checkPhone(phone: string, arrayError: { error: {} }) {
	// console.log(phone)
	// console.log(phone.length)
	if (!phone) {
		arrayError.error = {
			...arrayError.error,
			phone: 'Vous navez pas donné de numéro de téléphone',
		}
	}

	if (phone.length !== 12) {
		arrayError.error = {
			...arrayError.error,
			phone: 'Vous navez pas donné un numéro de téléphone valide',
		}
	}
}
