'use static'
import React, { FormEvent, ReactNode, useEffect, useState } from 'react'
import { ButtonVisible } from './ButtonVisiblePassword'
import Link from 'next/link'
import Modal from '../modal'
import { set } from 'date-fns'
import { encrypted } from '@/app/lib/encrypte/encrypted'
// import { Encrypted } from '@/app/lib/encrypte/encrypted'
// import { Encrypted } from '@/app/lib/encrypte/encrypted'

// const encrypt = encrypted('thomas')
// console.log(encrypt)
const tokenCrypto = crypto.randomUUID()

export default function FormLogin(props: { setClickLogin: any; setUser: any }) {
	const { setClickLogin, setUser } = props
	const [visibleForm, setVisibleForm] = useState(true)
	const [data, setData] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState({})
	const [success, setSuccess] = useState(null)
	const [visiblePassword, setVisiblePassword] = useState('password')
	const [tokenCsrf, setTokenCsrf] = useState('')
	const [countTry, setCountTry] = useState({ try: 0 })

	useEffect(() => {
		setTokenCsrf(tokenCrypto)
		setTimeout(() => setTokenCsrf(''), 120 * 1000) // 2 minutes
		const formStorage = window.localStorage.getItem('formLogin')

		if (formStorage) {
			const formStorageGood = JSON.parse(formStorage)
			setData(formStorageGood)
			window.localStorage.removeItem('formLogin')
		}
	}, [tokenCrypto])
	// console.log(data)

	async function handleSubmitLogin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const form = event.currentTarget
		const formData = new FormData(form)
		const formDataObject = Object.fromEntries(formData)
		const grecaptcha = (window as any).grecaptcha
		const tokenRecaptcha = await grecaptcha.execute(
			process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
			{ action: 'login' }
		)
		let arrayError = {}
		let errorTry = {
			countTry5: '',
			countTry10: '',
		}
		if (!formDataObject.email) {
			arrayError = {
				email: 'Veuillez renseigner votre email',
			}
		}

		if (!formDataObject.password) {
			arrayError = {
				...arrayError,
				password: 'Veuillez renseigner votre mot de passe',
			}
		}

		if (Object.keys(arrayError).length > 0) {
			setError({})
			setError(arrayError)
			setTimeout(() => setError({}), 10 * 1000)
			setSuccess(null)
			return
		} else {
			// const encrypt = new Encrypted()
			const res = await fetch('/api/auth/login', {
				headers: {
					'X-CSRF-Token': tokenCsrf,
					'X-Recaptcha-Token': tokenRecaptcha,
				},
				method: 'POST',
				body: JSON.stringify(formDataObject),
			})
				.then((res) => res.json())
				.catch(() => {
					return (
						setError({ error: 'Une erreur est survenue', ...arrayError }),
						setSuccess(null)
					)
				})

			// console.log(res)
			if (
				res &&
				res.error &&
				!res.error.email &&
				!res.error.password &&
				!res.error.emaildomaine
			) {
				// si
				if (countTry.try !== 10) {
					setCountTry({ try: (countTry.try += 1) })
				}

				if (countTry.try === 5) {
					errorTry.countTry5 =
						'Vous avez dépassé le premier palier de tentative de connexion, il ne vous reste plus que 5 tentatives avant une blocage de votre compte'
				}
				if (countTry.try >= 10) {
					const res = await fetch('/api/auth/login', {
						method: 'PUT',
						body: JSON.stringify(formDataObject),
					}).then((res) => res.json())
					errorTry.countTry10 = await res.success
				}
			}

			if (res) {
				if (res.error && res.error.tokenCsrf) {
					// si le tokenCsrf est invalide
					setError({})
					setError({ errorTokenCsrf: res.error.tokenCsrf })
					setSuccess(null)
					window.localStorage.setItem(
						'formLogin',
						JSON.stringify(formDataObject)
					)
					window.localStorage.setItem('clickLogin', 'true')
				} else if (res.error) {
					if (!res.error.email && errorTry.countTry5) {
						setError({})
						setError({ ...res.error, ...errorTry })
						setSuccess(null)
					} else if (!res.error.email && errorTry.countTry10) {
						setError({})
						setError({ accountBlocked: errorTry.countTry10 })
						setSuccess(null)
					} else {
						setError(res.error)
						setTimeout(() => setError({}), 10 * 1000)
						setSuccess(null)
					}
				} else if (res.success) {
					setSuccess(res.success)
					form.reset()

					// isLogin.user = res.user
					// setVisibleForm(false)
					// res.user.username = encrypted(res.user.username)
					setUser(res.user)
					// setTimeout(() => {
					// 	setClickLogin(false)
					// }, 10 * 1000)

					setTimeout(() => setTokenCsrf(crypto.randomUUID()), 120 * 1000) // 2 minutes
					setError({})
				}
			}
		}
		setTokenCsrf(crypto.randomUUID())
	}
	// console.log(isLogin)

	async function changeData(event: any) {
		const input = event.currentTarget
		input.value = event.target.value

		setData({
			...data,
			[input.name]: input.value,
		})
	}

	return (
		<>
			<Modal>
				<h3> Form Login </h3>
				<div id='recaptcha-container'></div>
				<button
					onClick={() => {
						setClickLogin(false)
					}}
				>
					Fermer la fenêtre
				</button>

				{error && (
					<div className='bg-red-700'>
						{Object.entries(error).map(([key, value]) => {
							// console.log(key, value)
							if (key === 'accountBlocked') {
								return (
									<>
										<p className='p-2' key={key}>
											{value as ReactNode}
										</p>
										<Link
											className='bg-blue-600'
											href={`/unlockAccount?email=${data.email}`}
										>
											Récupérer son compte
										</Link>
									</>
								)
							} else {
								return (
									<p className='p-2' key={key}>
										{value as ReactNode}
									</p>
								)
							}
						})}
					</div>
				)}
				{success && (
					<div className='bg-green-700'>
						<p>{success as ReactNode}</p>
					</div>
				)}

				{visibleForm && (
					<form className='flex flex-col' onSubmit={handleSubmitLogin}>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							placeholder='Votre email'
							value={data.email}
							onChange={changeData}
							required
						/>

						<label htmlFor='password' className='flex flex-col'>
							Mot de passe
							<input
								type={visiblePassword}
								name='password'
								id='password'
								placeholder='Votre mot de passe'
								value={data.password}
								onChange={changeData}
								required
							/>
							<ButtonVisible
								visible={visiblePassword}
								setVisible={setVisiblePassword}
							/>
						</label>
						{tokenCsrf && (
							<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
						)}

						<button type='submit' className='btn-primary'>
							Se connecter
						</button>

						<div>
							<Link href={`/forget`} className='bg-green-600'>
								Mot de passe oublié
							</Link>
							<Link className='bg-blue-600' href={`/unlockAccount`}>
								Récupérer son compte
							</Link>
						</div>
					</form>
				)}

				<script
					src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
					async
					defer
				></script>
			</Modal>
		</>
	)
}
