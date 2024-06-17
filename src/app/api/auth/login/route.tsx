import { verifyPassword } from '@/app/lib/auth/password'
import { checkFirstPassword } from '@/app/lib/auth/register/passwordRegister'
import { checkEmail } from '@/app/lib/auth/register/validationRegister'
import { transformDataLogin } from '@/app/lib/auth/transformeData'
import { checkRecaptcha } from '@/app/lib/auth/validateRecaptcha'
import prisma from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
// import { userContext } from './auth.context'
// import { AuthContext } from '@/app/context/auth.context'
// import { useContext } from 'react'
// import { Encrypted } from '@/app/lib/encrypte/encrypted'
import { cookies } from 'next/headers'
import { encrypted } from '@/app/lib/encrypte/encrypted'
// import { Encrypted } from '@/app/lib/encrypte/encrypted'

// let userLogin = {}

// export async function GET(request: NextRequest) {
// 	const tokenRecaptcha = request.headers.get('X-Recaptcha-Token')
// 	let arrayError: { error: {} } = { error: {} }
// 	// console.log(userLogin)

// 	const recaptcha = await fetch(
// 		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
// 		{
// 			method: 'POST',
// 		}
// 	).then((res) => res.json())
// 	// console.log(recaptcha)

// 	if (!recaptcha) {
// 		// console.log(recaptcha)
// 		arrayError.error = {
// 			...arrayError.error,
// 			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
// 		}
// 	} else {
// 		checkRecaptcha(recaptcha, arrayError)
// 	}

// 	// if (Object.keys(userLogin).length === 0) {
// 	// 	arrayError.error = {
// 	// 		...arrayError.error,
// 	// 		login: "Vous n'êtes pas connecté",
// 	// 	}
// 	// }

// 	if (Object.keys(arrayError.error).length > 0) {
// 		return NextResponse.json(arrayError)
// 	} else {
// 		return NextResponse.json({
// 			success: 'Vous êtes connecté',
// 			// user: userLogin,
// 		})
// 	}
// }

export async function PUT(request: NextRequest) {
	const form = await request.json()

	const user = await prisma.users.findUnique({
		where: {
			email: form.email,
		},
	})

	const verifyUserLock = await prisma.users.findUnique({
		where: {
			email: form.email,
			try10: true,
		},
	})

	if (user && !verifyUserLock) {
		const userSleep = await prisma.users.update({
			where: {
				email: form.email,
			},
			data: {
				try10: true,
			},
		})
	}

	return NextResponse.json({
		success: 'Compte bloqué',
	})
}

export async function POST(request: NextRequest) {
	const form = await request.json()
	const tokenCsrf = request.headers.get('X-CSRF-Token')
	const tokenRecaptcha = request.headers.get('X-Recaptcha-Token')
	let arrayError: { error: {} } = { error: {} }

	const recaptcha = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
		{
			method: 'POST',
		}
	).then((res) => res.json())
	// console.log(recaptcha)

	if (tokenCsrf !== form.tokenCsrf || tokenCsrf === '') {
		arrayError.error = {
			...arrayError.error,
			tokenCsrf: 'Recharger la page est soumettez à nouveau le formulaire',
		}
	}

	const goodData = await transformDataLogin(form)
	// console.log(goodData)

	const user = await prisma.users.findUnique({
		where: {
			email: goodData.email,
		},
	})
	// console.log(tokenCsrf, form.tokenCsrf)

	if (!recaptcha || recaptcha.success === false) {
		// console.log(recaptcha)
		arrayError.error = {
			...arrayError.error,
			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
		}
	} else if (recaptcha.score < 0.5) {
		arrayError.error = {
			...arrayError.error,
			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
		}
	} else {
		checkRecaptcha(recaptcha, arrayError)
	}

	// checkFirstPassword(goodData.password, arrayError)
	// console.log(arrayError.error)
	if (Object.keys(arrayError.error).length > 0) {
		return NextResponse.json(arrayError)
	} else {
		// console.log(arrayError.error)
		checkEmail(goodData.email, arrayError)
		// console.log(arrayError.error)

		if (Object.keys(arrayError.error).length > 0) {
			// console.log(arrayError.error)
			return NextResponse.json(arrayError)
		} else if (!user) {
			// console.log(user)
			arrayError.error = {
				email: "Ce compte n'existe pas",
			}
			return NextResponse.json(arrayError)
		} else if (user.try10) {
			// console.log(user.try20)
			arrayError.error = {
				accountBlocked:
					'Votre compte est bloqué cliqué sur le lien ci-dessous pour suivre les étapes de déblocage',
			}
			return NextResponse.json(arrayError)
		} else {
			checkFirstPassword(goodData.password, arrayError)

			if (Object.keys(arrayError.error).length > 0) {
				return NextResponse.json(arrayError)
			} else {
				const verification = await verifyPassword(
					goodData.password,
					user.password
				)
				// console.log(verification)
				if (!verification) {
					arrayError.error = {
						passwordVerify: 'Votre mot de passe est invalide',
					}
					return NextResponse.json(arrayError)
				} else {
					// user.username = encrypted(user.username)
					// user.email = encrypted(user.email)
					// user.lastname = encrypted(user.lastname)
					// console.log(user)
					const cookieStore = cookies()
					cookieStore.set('user', JSON.stringify(user), {
						path: '/',
						maxAge: 60 * 60 * 24 * 90, // Expires after 90 days
						httpOnly: true,
					})
					return NextResponse.json({
						success: 'Vous êtes connecté vous allez être redirigé',
						user: { user },
					})
				}
			}
		}
	}
}
