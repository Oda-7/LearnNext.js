'use client'
import Link from 'next/link'
import React, { use, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth.context'
import NavBar from './Navbar'
import { decrypted, encrypted } from '../lib/encrypte/encrypted'

// import { createContext } from 'vm'

export default function Header({
	children,
	userCookie,
}: {
	children: React.ReactNode
	userCookie: any
}) {
	// console.log(props)
	// console.log(userCookie)
	// userCookie.username = decrypted(userCookie.username)
	// console.log(userCookie.username)
	// const AuthContext = createContext({ user: {} })

	const [user, setUser] = useState({})
	useEffect(() => {
		if (userCookie) {
			setUser(userCookie)
		}
	}, [userCookie])
	// userCookie.username = encrypted(userCookie.username)
	// console.log(userCookie.username)
	// userCookie.username = decrypted(userCookie.username)
	// console.log(userCookie.username)

	// console.log(user)

	return (
		<>
			<AuthContext.Provider value={{ user }}>
				<NavBar setUser={setUser}></NavBar>
				{children}
			</AuthContext.Provider>
		</>
	)
}
