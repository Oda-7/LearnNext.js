import { checkEmail } from '@/app/lib/auth/register/validationRegister'
import { transformDataLogin } from '@/app/lib/auth/transformeData'
import { checkRecaptcha } from '@/app/lib/auth/validateRecaptcha'
import { sendMailUnlockAccount } from '@/app/lib/mailer/templateMail'
import prisma from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const unlockAccount = crypto.randomUUID()

export async function POST(request: NextRequest) {
	const form = await request.json()
	const tokenCsrf = request.headers.get('X-CSRF-Token')
	// console.log(tokenCsrf)
	// console.log(form)
	// console.log(form.tokenCsrf)
	const tokenRecaptcha = request.headers.get('X-Recaptcha-Token')
	let arrayError: { error: {} } = { error: {} }

	const recaptcha = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
		{
			method: 'POST',
		}
	).then((res) => res.json())

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
			tokenCsrf: 'Recharger la page est soumettez à nouveau le formulaire',
		}
	}

	const goodData = await transformDataLogin(form)

	if (Object.keys(arrayError.error).length > 0) {
		return NextResponse.json(arrayError)
	} else {
		checkEmail(goodData.email, arrayError)

		if (Object.keys(arrayError.error).length > 0) {
			return NextResponse.json(arrayError)
		} else {
			const findUser = await prisma.users.findUnique({
				where: {
					email: goodData.email,
				},
			})
			// console.log(goodData)

			if (!findUser) {
				arrayError.error = {
					...arrayError.error,
					email: 'Email incorrect',
				}
				return NextResponse.json(arrayError)
			} else {
				if (findUser.try10) {
					// send mail with link contain token and insert in to user
					await prisma.users.update({
						where: {
							id: findUser.id,
						},
						data: { tokenRevalidateAccount: unlockAccount },
						// chercher pour un timer de token
					})
					sendMailUnlockAccount(findUser.email, unlockAccount)
					return NextResponse.json({
						success:
							'Un email vous a été envoyé pour débloquer votre compte votre token sera valide pendant 2h',
					})
				} else {
					return NextResponse.json({
						error: "Votre compte n'est pas bloqué",
					})
				}
			}
		}
	}
}
