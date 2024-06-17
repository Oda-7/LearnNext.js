'use client'
import FormLogin from '@/app/components/authForm/FormLogin'
import Modal from '@/app/components/modal'
import { AuthContext } from '@/app/context/auth.context'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const isLogin = useContext(AuthContext)

	return (
		<Modal>
			<h1>Login</h1>
			<button onClick={() => router.back()}>Fermer la fenêtre</button>

			{/* <FormLogin  /> */}
		</Modal>
	)
}
