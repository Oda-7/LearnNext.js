const domains = Array.from([
	'gmail.com',
	'yahoo.com',
	'outlook.com',
	'hotmail.fr',
	'hotmail.com',
	'aol.com',
	'protonmail.com',
	'tutanota.com',
	'posteo.com',
	'icloud.com',
])

export function validateEmail(email: string, regexEmail: any) {
	// Vérifiee que l'adresse e-mail est valide
	if (!regexEmail.test(email)) {
		return { email: "Votre adresse e-mail n'est pas valide" }
	}
	const parts = email.split('@')
	const domain = parts[1]
	// console.log(domain)
	if (!domains.includes(domain)) {
		return {
			emaildomaine:
				"Le domaine de votre adresse e-mail n'est pas valide (format : gmail.com, yahoo.com, outlook.com, hotmail.com, hotmail.fr, aol.com, protonmail.com, tutanota.com, posteo.com, icloud.com)",
		}
	} else {
		return
	}
}
