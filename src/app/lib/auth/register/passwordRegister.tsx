import { regexPassword } from '../regex'

export function checkFirstPassword(
	password: string,
	arrayError: { error: {} }
) {
	if (!password) {
		arrayError.error = {
			...arrayError.error,
			password: 'Vous navez pas donné de mot de passe',
		}
	} else if (
		password.length < 10 ||
		password.length > 40 ||
		!regexPassword.test(password)
	) {
		arrayError.error = {
			...arrayError.error,
			password:
				'Votre mot de passe doit contenir au moins 10 caractères, 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial et ne doit pas dépasser 40 caractères',
		}
	}

	return arrayError
}

export function checkAllPassword(
	password: string,
	second_password: string,
	arrayError: { error: {} },
	form: any
) {
	if (
		password !== second_password ||
		second_password.length < 10 ||
		second_password.length > 40 ||
		!regexPassword.test(password)
	) {
		arrayError.error = {
			...arrayError.error,
			second_password: 'Votre mot de passe ne correspond pas au premier',
		}
	} else {
		delete form.second_password
	}
	// console.log(arrayError)
	return arrayError
}
