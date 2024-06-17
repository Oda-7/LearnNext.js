export async function protectData(data: any) {
	const replacementsXssAndSql: any = {
		"'": '',
		'"': '',
		';': '',
		'/': '',
		'<': '',
		'>': '',
		'|': '',
		'`': '',
		'(': '',
		')': '',
		'[': '',
		']': '',
		'{': '',
		'}': '',
		'=': '',
		'+': '',
		'-': '',
		'*': '',
		'&': '',
		'%': '',
		'!': '',
		'?': '',
		'#': '',
		'§': '',
		' ': '',
	}

	// console.log(data)
	// console.log(data.replace(replacementsXss["'"], replacementsXss["'"]))
	for (let key in replacementsXssAndSql) {
		data = await data.replaceAll(key, replacementsXssAndSql[key])
	}
	// console.log(data)
	return data
}

export async function protectDataPassword(data: any) {
	// console.log(data)
	const replacementsXssAndSql: any = {
		"'": '',
		'"': '',
		';': '',
		'/': '',
		'<': '',
		'>': '',
		'|': '',
		'`': '',
		'(': '',
		')': '',
		'[': '',
		']': '',
		'{': '',
		'}': '',
		'=': '',
		'+': '',
		'?': '',
		'§': '',
		' ': '',
	}
	for (let key in replacementsXssAndSql) {
		data = await data.replaceAll(key, replacementsXssAndSql[key])
	}
	// console.log(data)
	return data
}
