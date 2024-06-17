import { set } from 'date-fns'
import { ReactNode, useEffect, useState } from 'react'

const tokenCrypto = crypto.randomUUID()

export default function FormForgetPassword() {
	const [data, setData] = useState({
		email: '',
	})
	const [tokenCsrf, setTokenCsrf] = useState('')
	const [error, setError] = useState({})
	const [success, setSuccess] = useState(null)

	useEffect(() => {
		setTokenCsrf(tokenCrypto)
		setTimeout(() => setTokenCsrf(''), 120 * 1000) // 2 minutes
		// setTimeout(() => setTokenCsrf(''), 10 * 1000) // 5 secondes
		const formStorage = window.localStorage.getItem('formForget')
		// console.log(formStorage)
		if (formStorage) {
			const formStorageGood = JSON.parse(formStorage)
			// console.log(formStorageGood)
			setData(formStorageGood)
			// console.log(window.localStorage.getItem('formLogin'))
			window.localStorage.removeItem('formForget')
		}
		// console.log(data)
	}, [tokenCrypto])

	async function handleSubmitFormForget(event: any) {
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
		// console.log(formDataObject.email)
		if (!formDataObject.email) {
			arrayError = {
				email: 'Veuillez renseigner votre email',
			}
		}
		// console.log(arrayError)

		if (Object.keys(arrayError).length > 0) {
			setError(arrayError)
			setTimeout(() => setError({}), 10 * 1000)
			return
		} else {
			const res = await fetch('/api/auth/forget', {
				method: 'POST',
				headers: {
					'X-CSRF-Token': tokenCsrf,
					'X-Recaptcha-Token': tokenRecaptcha,
				},
				body: JSON.stringify(formDataObject),
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
				// setSubmit(true)
				setTokenCsrf(crypto.randomUUID())
				return
			}
		}
	}

	async function changeData(event: any) {
		const input = event.currentTarget
		input.value = input.value
		setData({ ...data, [input.name]: input.value })
	}

	return (
		<>
			<div>
				<div id='recaptcha-container'></div>
				<h1>FormForgetPassword</h1>
				{error && (
					<div className='bg-red-600'>
						{Object.entries(error).map(([key, value]) => {
							return <div key={key}>{value as ReactNode}</div>
						})}
					</div>
				)}
				{success && <div className='bg-green-600'>{success}</div>}
				<form onSubmit={handleSubmitFormForget}>
					<input
						type='email'
						name='email'
						id='email'
						value={data.email}
						onChange={changeData}
						placeholder='Votre email'
					/>
					<input className='bg-yellow-600' type='submit' value='Valider' />
					{tokenCsrf && (
						<input type='hidden' name='tokenCsrf' value={tokenCsrf} />
					)}
				</form>
			</div>
			<script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
				async
				defer
			></script>
		</>
	)
}
