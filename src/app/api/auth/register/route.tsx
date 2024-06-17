import {
	checkAllPassword,
	checkFirstPassword,
} from '@/app/lib/auth/register/passwordRegister'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/app/lib/mailer/templateMail'
import {
	checkEmail,
	checkFirstname,
	checkLastname,
	checkPhone,
} from '@/app/lib/auth/register/validationRegister'
import { transformDataRegister } from '@/app/lib/auth/transformeData'
import { checkRecaptcha } from '@/app/lib/auth/validateRecaptcha'
import prisma from '@/app/lib/prisma'
import { verifyPassword } from '@/app/lib/auth/password'

export async function POST(request: NextRequest) {
	const form = await request.json()
	const tokenCsrf = request.headers.get('X-CSRF-Token')
	const tokenRecaptcha = request.headers.get('X-Recaptcha-Token')
	// console.log(tokenRecaptcha):
	const recaptcha = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
		{
			method: 'POST',
		}
	).then((res) => res.json())

	let arrayError: { error: {} } = { error: {} }

	if (!recaptcha || recaptcha.success === false) {
		console.log(recaptcha)
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

	if (tokenCsrf !== form.tokenCsrf || tokenCsrf === '') {
		arrayError.error = {
			...arrayError.error,
			tokenCsrf: 'Recharger la page est soumettez à nouveau le formulaire',
		}
	}

	if (Object.keys(arrayError.error).length > 0) {
		return NextResponse.json(arrayError)
	} else {
		if (!form.civility) {
			if (form.civility !== '1' && form.civility !== '2') {
				arrayError.error = {
					...arrayError.error,
					civility: 'Vous navez pas donné de civilité',
				}
			}
		}

		checkFirstname(form.username, arrayError)
		checkLastname(form.lastname, arrayError)
		checkEmail(form.email, arrayError)
		checkFirstPassword(form.password, arrayError)
		checkAllPassword(form.password, form.second_password, arrayError, form)

		const goodData = await transformDataRegister(form)

		checkPhone(form.phone, arrayError)

		if (Object.keys(arrayError.error).length > 0) {
			return NextResponse.json(arrayError)
		} else {
			goodData.civility = parseInt(goodData.civility)
			// console.log(goodData)
			//envoie de données si il n'existe pas
			const findUser = await prisma.users.findUnique({
				where: {
					email: goodData.email,
				},
			})
			// console.log(findUser)

			if (findUser) {
				arrayError.error = {
					...arrayError.error,
					email: 'Cet email est déjà utilisé',
				}
				return NextResponse.json(arrayError)
			} else {
				// console.log(goodData)
				const tokenRegister = crypto.randomUUID()
				sendMail(form, tokenRegister)
				const user = await prisma.users.create({
					data: {
						civility: goodData.civility,
						username: goodData.username,
						lastname: goodData.lastname,
						email: goodData.email,
						password: goodData.password,
						phone: goodData.phone,
						doubleAuth: false,
						role: 1,
						try5: false,
						try10: false,
						registerToken: tokenRegister,
						rememberToken: null,
						forgetToken: null,
						tokenRevalidateAccount: null,
					},
				})
				console.log(user)

				if (!user) {
					arrayError.error = {
						...arrayError.error,
						email:
							'Une erreur est survenue lors de la création de votre compte',
					}
					return NextResponse.json(arrayError)
				}

				return NextResponse.json({
					success:
						'Votre compte a bien été créé veuillez confirmer votre email',
				})
			}
		}
	}
}
