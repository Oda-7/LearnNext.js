'use client'
import FormRegister from '@/app/components/authForm/FormRegister'
import Modal from '@/app/components/modal'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
	const router = useRouter()

	return (
		<Modal>
			<h1>Register</h1>
			<button onClick={() => router.back()}>Fermer la fenêtre</button>
			<FormRegister />
		</Modal>
	)
}
