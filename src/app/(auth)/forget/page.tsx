'use client'

import FormForgetPassword from '@/app/components/authForm/FormForgetPassword'

export default function SendForgetMail() {
	// console.log(searchParams.email)
	return (
		<>
			<div>
				<h1>SendForgetMail</h1>
				<FormForgetPassword />
			</div>
		</>
	)
}
