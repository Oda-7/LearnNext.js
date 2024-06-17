'use static'
import './styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/header'
import Link from 'next/link'
import { AuthContext } from './context/auth.context'
import { cookies } from 'next/headers'
import { decrypted } from './lib/encrypte/encrypted'
// import { useContext } from 'react'
// import { AuthContext, useAuth } from './context/auth.context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: { default: 'Todolist Oda', template: '%s | Todolist Oda' },
	description: 'Todolist Oda',
}

async function getUser() {
	const cookieStore = await cookies()
	let cookie = cookieStore.get('user')?.value
	if (cookie) {
		const cookieParse = JSON.parse(cookie)
		console.log(cookieParse)
		// cookieParse.username = decrypted(cookieParse.username)
	}
	// console.log(cookie)

	return cookie
}

export default async function RootLayout(props: {
	auth: React.ReactNode
	children: React.ReactNode
}) {
	const user = await getUser()
	// console.log(user)
	const cookieStore = cookies()
	let userCookie: any
	if (cookieStore.get('user')) {
		userCookie = cookies().get('user')?.value
		userCookie = JSON.parse(userCookie)
	}
	// console.log(userCookie)
	// userCookie= userCookie.user?
	// useContext(AuthContext)
	// const user : any
	return (
		<html lang='en'>
			<body className={inter.className}>
				{/* <Header></Header> */}
				<Header userCookie={userCookie}>{props.auth}</Header>div
				{props.children}
			</body>
		</html>
	)
}
