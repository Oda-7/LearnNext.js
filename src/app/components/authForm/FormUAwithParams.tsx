'use client'

import { ReactNode, useEffect, useState } from 'react'

const tokenCrypto = crypto.randomUUID()

export default function FormUnlockAccount(props: { email: string }) {
	const [data, setData] = useState({
		email: '',
	})
	const [error, setError] = useState({})
	const [success, setSuccess] = useState(null)
	const [tokenCsrf, setTokenCsrf] = useState('')

	useEffect(() => {
		setTokenCsrf(tokenCrypto)
		setTimeout(() => setTokenCsrf(''), 120 * 1000) // 2 minutes

		const formStorage = window.localStorage.getItem('formUnlockAccount')
		if (formStorage) {
			const formStorageGood = JSON.parse(formStorage)
			setData(formStorageGood)
			window.localStorage.removeItem('formUnlockAccount')
		} else if (props.email) {
			setData({
				...data,
				email: props.email,
			})
		}
		// console.log(formStorage)
	}, [])
	// console.log(tokenCsrf)
	// console.log(data)
	// console.log(error)

	async function handleSubmitUnlockAccount(event: any) {
		let timeOut
		event.preventDefault()

		const form = event.currentTarget
		const formData = new FormData(form)
		const formDataObject = Object.fromEntries(formData)
		const grecaptcha = (window as any).grecaptcha
		const tokenRecaptcha = await grecaptcha.execute(
			process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
			{ action: 'unlockAccount' }
		)
		// console.log(formDataObject)
		let arrayError = {}
		if (!formDataObject.email) {
			arrayError = {
				email: 'Veuillez renseigner votre email',
			}
		}
		// console.log(formDataObject)

		if (Object.keys(arrayError).length > 0) {
			return setError(arrayError)
		} else {
			const res = await fetch('/api/auth/unlockAccount', {
				method: 'POST',
				headers: {
					// 'Content-Type': 'application/json',
					'X-CSRF-Token': tokenCsrf,
					'X-Recaptcha-Token': tokenRecaptcha,
				},
				body: JSON.stringify(formDataObject),
			}).then((res) => res.json())
			console.log(res)
			// console.log(data)
			if (res.error) {
				if (res.error.tokenCsrf) {
					setError({ errorTokenCsrf: res.error.tokenCsrf })
					clearTimeout(timeOut)
					timeOut = setTimeout(() => setError({}), 15 * 1000)
					setSuccess(null)
					window.localStorage.setItem(
						'formUnlockAccount',
						JSON.stringify(formDataObject)
					)
				} else {
					setError(res.error)
					setSuccess(null)
				}
			} else {
				setError({})
				setSuccess(res.success)
				setTokenCsrf(crypto.randomUUID())
			}
		}
	}

	async function changeData(event: any) {
		const input = event.currentTarget
		input.value = event.target.value

		setData({
			...data,
			[input.name]: input.value,
		})
	}
	// console.log(error)

	// console.log(tokenCsrf)
	return (
		<>
			{error && (
				<div className='bg-red-700'>
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
					<p>{success}</p>
				</div>
			)}

			{props.email ? (
				<>
					<div>
						<h1>FormUnlockAccount</h1>
						<form onSubmit={handleSubmitUnlockAccount}>
							<input
								type='email'
								name='email'
								id='email'
								placeholder='Votre email'
								value={data.email}
								onChange={changeData}
								required
							/>
							<input className='bg-yellow-600' type='submit' value='Valider' />
							{tokenCsrf && (
								<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
							)}
						</form>
					</div>
				</>
			) : (
				<>
					{/* {console.log('pas de parametre')} */}
					<div>
						<h1>FormUnlockAccount</h1>
						<form onSubmit={handleSubmitUnlockAccount}>
							<input
								type='email'
								name='email'
								id='email'
								value={data.email}
								placeholder='Votre email'
								onChange={changeData}
								required
							/>
							<input className='bg-yellow-600' type='submit' value='Valider' />
							{tokenCsrf && (
								<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
							)}
						</form>
					</div>
				</>
			)}

			<div id='recaptcha-container'></div>
			<script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
				async
				defer
			></script>
		</>
	)
}
