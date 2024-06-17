'use client'
import React from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
	return (
		<div className='bg-blue-700 p-2 '>
			<h4>Fenêtre Modal</h4>
			{children}
		</div>
	)
}
