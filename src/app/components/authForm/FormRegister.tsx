import React, { FormEvent, ReactNode, useEffect, useState } from 'react'
import { ButtonVisible } from './ButtonVisiblePassword'
const tokenCrypto = crypto.randomUUID()

export default function FormRegister() {
	const [data, setData] = useState({
		civility: '',
		username: '',
		lastname: '',
		email: '',
		phone: '',
		password: '',
		second_password: '',
	})
	const [error, setError] = useState({})
	const [success, setSuccess] = useState(null)
	const [visibleFirstPassword, setVisibleFirstPassword] = useState('password')
	const [visibleSecondPassword, setVisibleSecondPassword] = useState('password')
	const [tokenCsrf, setTokenCsrf] = useState('')

	useEffect(() => {
		setTokenCsrf(tokenCrypto)
		setTimeout(() => setTokenCsrf(''), 120 * 1000) // 3 minutes
		// setTimeout(() => setTokenCsrf(''), 5 * 1000) // 5 secondes

		const formStorage = window.localStorage.getItem('formRegister')
		if (formStorage) {
			const formStorageGood = JSON.parse(formStorage)
			// console.log(formStorageGood.phone.slice(9, 12))
			formStorageGood.phone =
				formStorageGood.phone.slice(0, 2) +
				' ' +
				formStorageGood.phone.slice(3, 5) +
				' ' +
				formStorageGood.phone.slice(6, 8) +
				' ' +
				formStorageGood.phone.slice(9, 11) +
				' ' +
				formStorageGood.phone.slice(12, 14)
			// console.log(formStorageGood.phone)
			setData(formStorageGood)
			window.localStorage.removeItem('formRegister')
		}
	}, [tokenCrypto]) // data, tokenCsrf

	async function handleSubmitRegister(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const form = event.currentTarget
		const formData = new FormData(form)
		const formDataObject = Object.fromEntries(formData)
		const grecaptcha = (window as any).grecaptcha
		const tokenRecaptcha = await grecaptcha.execute(
			process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
			{ action: 'register' }
		)

		let arrayError = {}
		if (!formDataObject.username) {
			arrayError = {
				username: 'Veuillez renseigner votre prénom',
			}
		}

		if (!formDataObject.lastname) {
			arrayError = {
				...arrayError,
				lastname: 'Veuillez renseigner votre nom',
			}
		}

		if (!formDataObject.email) {
			arrayError = {
				...arrayError,
				email: 'Veuillez renseigner votre email',
			}
		}
		if (!formDataObject.phone) {
			arrayError = {
				...arrayError,
				phone: 'Veuillez renseigner votre numéro de téléphone',
			}
		}
		if (!formDataObject.password) {
			arrayError = {
				...arrayError,
				password: 'Veuillez renseigner votre mot de passe',
			}
		}

		if (!formDataObject.second_password) {
			arrayError = {
				...arrayError,
				second_password: 'Veuillez renseigner la vérification de mot de passe',
			}
		}

		if (Object.keys(arrayError).length > 0) {
			return (
				setError(arrayError),
				setTimeout(() => setError({}), 10 * 1000),
				setSuccess(null)
			)
		}

		const res = await fetch(`/api/auth/register`, {
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
					setError({ requesterror: 'Une erreur est survenue' }),
					setSuccess(null),
					setTimeout(() => setError({}), 10000)
				)
			})

		// console.log(JSON.s(formDataObject))
		// console.log(res)
		if (formDataObject.phone.length === 10) {
			let newPhone = JSON.stringify(formDataObject.phone)
			newPhone = newPhone.replaceAll('"', '')
			newPhone =
				newPhone.slice(0, 2) +
				' ' +
				newPhone.slice(2, 4) +
				' ' +
				newPhone.slice(4, 6) +
				' ' +
				newPhone.slice(6, 8) +
				' ' +
				newPhone.slice(8, 10)
			// console.log(newPhone)
			formDataObject.phone = newPhone
		}
		// console.log(formDataObject.phone)

		if (res.error && res.error.tokenCsrf)
			return (
				setError({ errorTokenCsrf: res.error.tokenCsrf }),
				setTimeout(() => setError({}), 10000),
				window.localStorage.setItem(
					'formRegister',
					JSON.stringify(formDataObject)
				),
				setSuccess(null)
			) // ajouter un bouton de reload de la page
		if (res.error)
			return (
				setError(res.error),
				setTimeout(() => setError({}), 10000),
				setSuccess(null)
			)

		if (res.success)
			return (
				setTokenCsrf(crypto.randomUUID()),
				setTimeout(() => setTokenCsrf(''), 120 * 1000),
				setSuccess(res.success),
				setTimeout(() => setSuccess(null), 10000),
				setError({})
				// form.reset()
			)
	}

	async function changeData(event: any) {
		const input = event.currentTarget
		input.value = event.target.value
		// console.log(event):
		if (input.name === 'phone') {
			if (
				input.value.length === 2 ||
				input.value.length === 5 ||
				input.value.length === 8 ||
				input.value.length === 11
			) {
				input.value = input.value + ' '
			} else if (
				input.value.length === 12 ||
				input.value.length === 9 ||
				input.value.length === 6 ||
				input.value.length === 3
			) {
				input.value = input.value.slice(0, -1)
			}
		}
		setData({
			...data,
			[input.name]: input.value,
		})
	}
	// console.log(error)
	return (
		<>
			<h3>FormRegister</h3>
			<div id='recaptcha-container'></div>
			{/* <div className='bg-red-800'></div> */}
			{error && (
				<div className='bg-red-800 '>
					{Object.entries(error).map(([key, value]) => {
						return (
							<p className='p-2' key={key}>
								{value as ReactNode}
							</p>
						)
					})}
				</div>
			)}
			{success && (
				<div className='bg-green-700 p-2'>
					<p>{success as ReactNode}</p>
				</div>
			)}

			<form className='flex flex-col' onSubmit={handleSubmitRegister}>
				<label htmlFor='civility'>Civilité</label>
				<select name='civility' id='civility'>
					{data.civility && (
						<option value={data.civility} selected>
							{data.civility === '1' ? 'Monsieur' : 'Madame'}
						</option>
					)}
					<option value='1'>Monsieur</option>
					<option value='2'>Madame</option>
				</select>
				<label htmlFor='username'>Prénom</label>
				{data.username ? (
					<input
						type='text'
						name='username'
						id='username'
						value={data.username}
						onChange={changeData}
						required
					/>
				) : (
					<input type='text' name='username' id='username' required />
				)}
				<label htmlFor='lastname'>Nom</label>
				{data.lastname ? (
					<input
						type='text'
						name='lastname'
						id='lastname'
						value={data.lastname}
						onChange={changeData}
						required
					/>
				) : (
					<input type='text' name='lastname' id='lastname' required />
				)}
				<label htmlFor='phone'>Téléphone</label>
				{data.phone ? (
					<input
						type='text'
						name='phone'
						id='phone'
						value={data.phone}
						onChange={changeData}
						required
					/>
				) : (
					<input
						type='text'
						name='phone'
						id='phone'
						onChange={changeData}
						required
					/>
				)}
				<label htmlFor='email'>Email</label>
				{data.email ? (
					<input
						type='email'
						name='email'
						id='email'
						value={data.email}
						onChange={changeData}
						required
					/>
				) : (
					<input type='email' name='email' id='email' required />
				)}
				{tokenCsrf && (
					<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
				)}

				<div className='flex '>
					<label className='flex flex-col' htmlFor='password'>
						Mot de passe
						{data.password ? (
							<input
								type={visibleFirstPassword}
								name='password'
								id='password'
								value={data.password}
								onChange={changeData}
								required
							/>
						) : (
							<input
								type={visibleFirstPassword}
								name='password'
								id='password'
								required
							/>
						)}
					</label>
					<ButtonVisible
						visible={visibleFirstPassword}
						setVisible={setVisibleFirstPassword}
					/>
				</div>
				<div className='flex '>
					<label className='flex flex-col' htmlFor='second_password'>
						Confirmé votre mot de passe
						{data.second_password ? (
							<input
								type={visibleSecondPassword}
								name='second_password'
								id='second_password'
								value={data.second_password}
								onChange={changeData}
								required
							/>
						) : (
							<input
								type={visibleSecondPassword}
								name='second_password'
								id='second_password'
								required
							/>
						)}
					</label>
					<ButtonVisible
						visible={visibleSecondPassword}
						setVisible={setVisibleSecondPassword}
					/>
				</div>
				<input className='btn-primary' type='submit' value='Envoyer' />
			</form>

			{/* <Script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
			/> */}
			<script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
				async
				defer
			></script>
		</>
	)
}
