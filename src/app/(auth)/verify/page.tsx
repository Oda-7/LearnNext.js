'use strict'
import FormNewForgetPassword from '@/app/components/authForm/FormNewForgetPassword'
import { checkUrl } from '@/app/lib/auth/verify/checkUrl'
import prisma from '@/app/lib/prisma'

export default async function VerifyPage({
	searchParams,
}: {
	searchParams: { token: any; email: any; tokenUnlock: any; tokenForget: any }
}) {
	// console.log(searchParams.token)
	const email = await searchParams.email
	const token = await searchParams.token
	const tokenForget = await searchParams.tokenForget
	const tokenUnlock = await searchParams.tokenUnlock
	// console.log(token)

	async function searchToken(token: string, email: string) {
		if (token && email) {
			token = await checkUrl(token)
			email = await checkUrl(email)
			// console.log(token)
			// console.log(email)
			const user = await prisma.users.findUnique({
				where: {
					email: email,
					registerToken: token,
				},
			})
			// console.log(user)
			if (user) {
				await prisma.users.update({
					where: {
						email: email,
						registerToken: token,
					},
					data: {
						registerToken: null,
						registerDate: new Date(),
					},
				})
				return true
			} else {
				return false
			}
		}
	}

	async function searchTokenUnlock(token: string, email: string) {
		if (token && email) {
			token = await checkUrl(token)
			email = await checkUrl(email)
			// console.log(token)
			// console.log(email)
			// console.log(user)
			const user = await prisma.users.findUnique({
				where: {
					email: email,
					tokenRevalidateAccount: token,
					try10: true,
				},
			})
			// console.log(user)
			if (user) {
				// console.log(new Date().toLocaleDateString())
				const date = new Date()
				// console.log(date)
				await prisma.users.update({
					where: {
						email: email,
						tokenRevalidateAccount: token,
					},
					data: {
						revalitateAccountDate: date,
						try10: false,
						tokenRevalidateAccount: null,
					},
				})
				return true
			} else {
				return false
			}
		}
	}

	async function searchTokenForget(token: string, email: string) {
		if (token && email) {
			token = await checkUrl(token)
			email = await checkUrl(email)
			// console.log(token)
			// console.log(email)
			const user = await prisma.users.findUnique({
				where: {
					email: email,
					forgetToken: token,
				},
			})
			// console.log(user)
			// console.log(user)
			if (user && user.try10 === false) {
				// await prisma.users.update({
				// 	where: {
				// 		email: email,
				// 		forgetToken: token,
				// 	},
				// 	data: {
				// 		forgetToken: null,
				// 		forgetDate: new Date(),
				// 	},
				// })
				return user
			} else {
				return false
			}
		}
	}

	const verifyAccount = await searchToken(token, email)
	const verifyAccountUnlock = await searchTokenUnlock(tokenUnlock, email)
	const verifyAccountForget = await searchTokenForget(tokenForget, email)

	return (
		<>
			<h1>VerifyPage</h1>

			{/* {verifyAccount ? ( // if verifyAccount is true
					<p>{'Votre compte a bien été vérifié'}</p>
				) : (
					<p>
						{
							"soit l'url founit n'est pas bonne, soit votre compte est validé, essayé de vous connecté"
						}
					</p>
				)} */}
			{token && (
				<div>
					<h4>Verify register</h4>
					{verifyAccount ? (
						<p>{'Votre compte a bien été vérifié'}</p>
					) : (
						<p>
							{
								"soit l'url founit n'est pas bonne, soit votre compte est validé, essayé de vous connecté"
							}
						</p>
					)}
				</div>
			)}
			{tokenUnlock && (
				<div>
					<h4>Verify Unlock</h4>
					{verifyAccountUnlock ? (
						<p>{'Votre compte a bien été débloqué'}</p>
					) : (
						<p>
							{
								"Soit l'url n'est pas bonne, soit le compté n'est pas bloqué, soit le jeton a expiré, renouvellé le proccessus de débloquage."
							}
						</p>
					)}
				</div>
			)}
			{tokenForget && (
				<div>
					<h4>Verify Forget</h4>
					{verifyAccountForget ? (
						// <form onSubmit={}>
						// 	<input type='password' name='password' />
						// 	<input type='password' name='passwordConfirm' />
						// 	<input type='submit'>Envoyer</input>
						// </form>
						<FormNewForgetPassword user={verifyAccountForget.email} />
					) : (
						<p>
							{
								"Soit l'url founit n'est pas bonne, soit votre compte est bloqué, soit le jeton a expiré renouveler le processus de récupération de mot de passe."
							}
						</p>
					)}
				</div>
			)}
		</>
	)
}
