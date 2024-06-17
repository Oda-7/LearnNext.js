export function checkRecaptcha(tokenRecaptcha: any, arrayError: { error: {} }) {
	// console.log(tokenRecaptcha)
	if (tokenRecaptcha.success === true && tokenRecaptcha.score < 0.5) {
		arrayError.error = {
			...arrayError.error,
			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
		}
	} else if (tokenRecaptcha.success === false) {
		arrayError.error = {
			...arrayError.error,
			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
		}
	}

	return arrayError
}
