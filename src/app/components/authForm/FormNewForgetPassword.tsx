'use client'
import { ReactNode, useEffect, useState } from 'react'
import { ButtonVisible } from './ButtonVisiblePassword'

const tokenCrypto = crypto.randomUUID()

export default function FormNewForgetPassword(props: { user: any }) {
	const [submit, setSubmit] = useState(false)
	const [tokenCsrf, setTokenCsrf] = useState('')
	const [error, setError] = useState({})
	const [success, setSuccess] = useState(null)
	const [visibleFirstPassword, setVisibleFirstPassword] = useState('password')
	const [visibleSecondPassword, setVisibleSecondPassword] = useState('password')

	// console.log(props.user)

	useEffect(() => {
		setTokenCsrf(tokenCrypto)
		setTimeout(() => setTokenCsrf(''), 120 * 1000) // 2 minutes
	}, [tokenCrypto])

	async function handleSubmitForgetPassword(event: any) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const formDataObject = Object.fromEntries(formData.entries())
		const grecaptcha = (window as any).grecaptcha
		const tokenRecaptcha = await grecaptcha.execute(
			process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
			{ action: 'login' }
		)
		let arrayError = {}

		if (!formDataObject.password) {
			arrayError = {
				...arrayError,
				password: 'Veuillez renseigner votre mot de passe',
			}
		}

		if (!formDataObject.passwordConfirm) {
			arrayError = {
				...arrayError,
				passwordConfirm:
					'Veuillez renseigner la confirmation de votre mot de passe',
			}
			// setError({
			// 	passwordConfirm:
			// 		'Veuillez renseigner la confirmation de votre mot de passe',
			// })
			// return
		}

		if (Object.keys(arrayError).length > 0) {
			setError(arrayError)
			setTimeout(() => setError({}), 10 * 1000)
		} else {
			console.log(props.user)
			const res = await fetch('/api/auth/newForget', {
				method: 'POST',
				headers: {
					'X-CSRF-Token': tokenCsrf,
					'X-Recaptcha-Token': tokenRecaptcha,
				},
				body: JSON.stringify({ ...formDataObject, email: props.user }),
			}).then((res) => res.json())
			// console.log(res)

			if (res.error) {
				if (res.error.tokenCsrf) {
					// console.log(res.error.tokenCsrf)
					// si le tokenCsrf ou le tokenRecaptcha et pas l'erreur email alors on recharge la page
					window.localStorage.setItem(
						'formForget',
						JSON.stringify(formDataObject)
					)
					setError({})
					setError({ errorTokenCsrf: res.error.tokenCsrf })
					setSuccess(null)
				} else {
					setError(res.error)
					setTimeout(() => setError({}), 10 * 1000)
					setSuccess(null)
				}
			} else if (res.success) {
				setError({})
				setSuccess(res.success)
				setTokenCsrf(crypto.randomUUID())
				setSubmit(true)
			}
		}
	}

	return (
		<>
			{submit ? (
				<div className='bg-green-600 p-2 m-2'>
					<p className='text-center'>
						Votre mot de passe à bien été modifié, vous pouvez vous connecter
					</p>
				</div>
			) : (
				(Object.keys(error).length > 0 && (
					<div className='bg-red-700 p-2 m-2'>
						{Object.entries(error).map(([key, value]) => {
							return <p key={key}>{value as ReactNode}</p>
						})}
					</div>
				),
				success && <p className='p-2 bg-green-600'>{success}</p>,
				(
					<>
						<div id='recaptcha-container'></div>
						<form
							onSubmit={handleSubmitForgetPassword}
							className='flex flex-col p-2 bg-gray-500 gap-1'
						>
							<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
							<div className='flex'>
								<label htmlFor='password' className='flex flex-col'>
									Mot de passe
									<input type={visibleFirstPassword} name='password' />
								</label>
								<ButtonVisible
									visible={visibleFirstPassword}
									setVisible={setVisibleFirstPassword}
								/>
							</div>
							<div className='flex'>
								<label htmlFor='passwordConfirm' className='flex flex-col'>
									Confirmation votre mot de passe
									<input type={visibleSecondPassword} name='passwordConfirm' />
								</label>
								<ButtonVisible
									visible={visibleSecondPassword}
									setVisible={setVisibleSecondPassword}
								/>
							</div>
							<input
								type='submit'
								className='bg-yellow-500 rounded m-2'
								value='Envoyer'
							/>
						</form>{' '}
					</>
				))
			)}
			<script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
				async
				defer
			></script>
		</>
	)
}
