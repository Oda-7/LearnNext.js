export async function checkUrl(token: any) {
	// console.log(token)
	const matches: any = {
		' ': '',
		'!': '',
		'"': '',
		"'": '',
		'#': '',
		'%': '',
		'&': '',
		'(': '',
		')': '',
		'*': '',
		'+': '',
		',': '',
		'/': '',
		':': '',
		';': '',
		'<': '',
		'=': '',
		'>': '',
		'?': '',
	}

	for (let key in matches) {
		// console.log(key, matches[key])
		token = await token.replaceAll(key, matches[key])
	}
	// console.log(token)
	return token
}
