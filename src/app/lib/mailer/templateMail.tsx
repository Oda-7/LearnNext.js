import nodemailer from 'nodemailer'

// authentification mail
const mailOptions = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD_MAIL,
	},
	logger: false,
}

let protocol = 'http'
if (process.env.NODE_ENV === 'production') {
	protocol = 'https'
}

let host = 'localhost:8000'
if (process.env.NODE_ENV === 'production') {
	host = window.location.origin
}

export function sendMail(user: any, token: string) {
	const transporter = nodemailer.createTransport(mailOptions)
	// console.log(user)
	// console.log(mailOptions)
	const url = `${protocol}://${host}/verify?token=${token}&email=${user.email}`
	// console.log(host)        <title>${mailOptions.auth.user}</title>
	const template = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
        <meta charset="UTF-8">
        </head>
        <body>
        <h1>Vérification d'email</h1>
        <p>
            Bonjour,

            Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail: <a href="${url}">${url}</a>

            Cordialement,
            <br>
            ${user.lastname} ${user.username}
        </p>
        </body>
        </html>
    `
	// transporter.verify((error, success) => {
	// 	if (error) {
	// 		console.log(error)
	// 	} else {
	// 		console.log('Server is ready to take our messages')
	// 	}
	// })
	transporter.sendMail({
		from: mailOptions.auth.user,
		to: user.email,
		subject: 'Vérification de votre adresse e-mail',
		html: template,
	})
}

export function sendMailUnlockAccount(email: any, token: string) {
	const transporter = nodemailer.createTransport(mailOptions)

	const url = `${protocol}://${host}/verify?tokenUnlock=${token}&email=${email}`

	const template = ` 
		<!DOCTYPE html>
		<html lang="fr">
		<head>
		<meta charset="UTF-8">
		</head>
		<body>
		<h1>Déblocage de votre compte</h1>
		<p>
			Bonjour,

			Veuillez cliquer sur le lien ci-dessous pour débloquer votre compte: <a href="${url}">${url}</a>

			Cordialement,
			<br>
			L'équipe de ${mailOptions.auth.user}
		</p>
		</body>
		</html>
	`

	transporter.sendMail({
		from: mailOptions.auth.user,
		to: email,
		subject: 'Déblocage de votre compte',
		html: template,
	})
}

export function sendMailForgetPassword(email: any, token: string) {
	console.log(email)
	const transporter = nodemailer.createTransport(mailOptions)

	const url = `${protocol}://${host}/verify?tokenForget=${token}&email=${email}`

	const template = ` 
		<!DOCTYPE html>
		<html lang="fr">
		<head>
		<meta charset="UTF-8">
		</head>
		<body>
		<h1>Réinitialisation de votre mot de passe</h1>
		<p>
			Bonjour,

			Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe: <a href="${url}">${url}</a>

			Cordialement,
			<br>
			L'équipe de ${mailOptions.auth.user}
		</p>
		</body>
		</html>
	`

	transporter.sendMail({
		from: mailOptions.auth.user,
		to: email,
		subject: 'Réinitialisation de votre mot de passe',
		html: template,
	})
}
