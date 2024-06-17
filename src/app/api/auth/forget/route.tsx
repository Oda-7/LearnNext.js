import { checkEmail } from '@/app/lib/auth/register/validationRegister'
import { transformDataLogin } from '@/app/lib/auth/transformeData'
import { checkRecaptcha } from '@/app/lib/auth/validateRecaptcha'
import { sendMailForgetPassword } from '@/app/lib/mailer/templateMail'
import prisma from '@/app/lib/prisma'
import { ar } from 'date-fns/locale'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const form = await req.json()
	const tokenCsrf = req.headers.get('X-CSRF-Token')
	const tokenRecaptcha = req.headers.get('X-Recaptcha-Token')
	let arrayError = { error: {} }
	// console.log(form)
	// console.log(arrayError)

	const recaptcha = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
		{
			method: 'POST',
		}
	).then((res) => res.json())

	checkEmail(form.email, arrayError)

	if (tokenCsrf !== form.tokenCsrf || tokenCsrf === '') {
		arrayError.error = {
			...arrayError.error,
			tokenCsrf: 'Recharger la page est soumettez à nouveau le formulaire',
		}
	}

	if (!recaptcha) {
		arrayError.error = {
			...arrayError.error,
			tokenRecaptcha: 'Vous ne pouvait pas vous connecter, bien essayé',
		}
	} else {
		checkRecaptcha(recaptcha, arrayError)
	}

	if (Object.keys(arrayError.error).length > 0) {
		return NextResponse.json(arrayError)
	} else {
		// return NextResponse.json({ success: 'Un email vous a été envoyé' })

		const goodData = await transformDataLogin(form)

		const user = await prisma.users.findUnique({
			where: {
				email: goodData.email,
			},
		})

		if (user && user.email && user.try10 === true) {
			arrayError.error = {
				...arrayError.error,
				email:
					'Vous ne pouvez pas réinitialiser votre mot de passe votre compte est bloqué',
			}
			return NextResponse.json(arrayError)
		} else if (!user) {
			arrayError.error = {
				...arrayError.error,
				email: "Il n'y a pas de compte lié à cette adresse email",
			}
			return NextResponse.json(arrayError)
		} else {
			const forgetToken = crypto.randomUUID()
			sendMailForgetPassword(user.email, forgetToken)
			await prisma.users.update({
				where: {
					id: user.id,
				},
				data: {
					forgetToken: forgetToken,
				},
			})
			// send mail
			return NextResponse.json({ success: 'Un email vous a été envoyé' })
		}
	}
}
