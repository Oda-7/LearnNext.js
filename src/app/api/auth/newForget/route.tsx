import {
	checkAllPassword,
	checkFirstPassword,
} from '@/app/lib/auth/register/passwordRegister'
import { transformDataRegister } from '@/app/lib/auth/transformeData'
import { checkRecaptcha } from '@/app/lib/auth/validateRecaptcha'
import prisma from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const form = await req.json()
	console.log(form)
	const arrayError = { error: {} }
	const tokenCsrf = req.headers.get('X-CSRF-Token')
	const tokenRecaptcha = req.headers.get('X-Recaptcha-Token')

	const recaptcha = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokenRecaptcha}`,
		{
			method: 'POST',
		}
	).then((res) => res.json())

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
		checkFirstPassword(form.password, arrayError)
		checkAllPassword(form.password, form.passwordConfirm, arrayError, form)

		if (Object.keys(arrayError.error).length > 0) {
			return NextResponse.json(arrayError)
		} else {
			const goodData = await transformDataRegister(form)
			const user = await prisma.users.findUnique({
				where: {
					email: goodData.email,
				},
			})
			if (!user) {
				arrayError.error = {
					...arrayError.error,
					email: 'Votre email est incorrect',
				}
			} else if (user && user.try10 === true) {
				arrayError.error = {
					...arrayError.error,
					email: 'Votre compte est bloqué',
				}
			}

			if (Object.keys(arrayError.error).length > 0) {
				return NextResponse.json(arrayError)
			} else {
				const userUpdate = await prisma.users.update({
					where: {
						email: goodData.email,
					},
					data: {
						forgetToken: null,
						forgetDate: new Date(),
						password: goodData.password,
					},
				})
				return NextResponse.json({
					success: 'Votre mot de passe a bien été modifié',
				})
			}
		}
	}
}
