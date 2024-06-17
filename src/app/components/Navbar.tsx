'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth.context'
import FormLogin from './authForm/FormLogin'
import { decrypted, encrypted } from '../lib/encrypte/encrypted'

export default function NavBar(props: { setUser: any }) {
	const { setUser } = props
	const [clickLogin, setClickLogin] = useState(false)

	useEffect(() => {
		const isclick = window.localStorage.getItem('clickLogin')
		if (isclick) {
			setClickLogin(true)
		}
		window.localStorage.removeItem('clickLogin')
	}, [])

	let isLogin = useContext(AuthContext)
	// console.log(isLogin)
	// console.log(isLogin.user)

	// if (Object.keys(isLogin.user).length !== 0) {
	// console.log(isLogin.user)
	// if (isLogin.user.username !== undefined) {
	// 	const user = isLogin.user.username
	// 	console.log(user)

	// 	let encrypteduser: any
	// 	if (encrypteduser === undefined) {
	// 		encrypteduser = encrypted(user)
	// 	}
	// 	// console.log(encrypteduser)
	// 	if (encrypteduser !== undefined) {
	// 		console.log(encrypteduser)
	// 		const userDecrypte = decrypted(encrypteduser)
	// 		console.log(userDecrypte)
	// 	}
	// } // Fonctionne

	// console.log(isLogin.user.username)
	// console.log(isLogin.username)
	// isLogin.username = decrypted(isLogin.username)
	// console.log(isLogin.username)
	// }

	const router = useRouter()

	return (
		<>
			<div className='bg-gray-500 text-white flex flex-wrap items-center'>
				<h3>Todolist Oda</h3>
				<nav>
					<ul className='flex items-center gap-1 px-1'>
						<li>
							<Link href='/'>Accueil</Link>
						</li>
						<li>
							{/*
							const path = isAuthed ? '/auth/dashboard' : '/dashboard'
							<Link as="/dashboard" href={path}>
							 */}
							<Link href='/dashboard'>Dashboard</Link>
						</li>
						<li>
							<button
								className='btn-primary '
								type='button'
								onClick={() => router.push('/blog')}
							>
								Blog d&apos;Elvyn
							</button>
						</li>

						{Object.keys(isLogin.user).length === 0 ? (
							<>
								<li>
									<button
										onClick={() => {
											setClickLogin(!clickLogin)
											// console.log(click)
										}}
									>
										Login
									</button>
								</li>
								<li>
									<Link href='/register'>Register</Link>
								</li>
								{/* <React.Fragment>{children}</React.Fragment> */}
							</>
						) : (
							<li>
								<button
									className='btn-primary '
									type='button'
									onClick={() => router.push('/logout')}
								>
									Logout
								</button>
							</li>
						)}
						{/* {children} */}

						<li>
							<Link href={'/feed'}>Photos</Link>
						</li>
						<li>
							<Link href={'/product'}>Posts</Link>
						</li>
						<li>
							<Link href={'/trello'}>Trello</Link>
						</li>
					</ul>
				</nav>
			</div>

			{clickLogin && (
				<FormLogin setClickLogin={setClickLogin} setUser={setUser} />
			)}
		</>
	)
}
