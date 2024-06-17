import Link from 'next/link'
import React from 'react'

async function NotFound() {
	return (
		<section className='flex justify-center'>
			<div>Page pas trouvé</div>
			<Link className='text-blue-500 hover:underline' href='/'>
				Retourné a la page d&apos;accueil
			</Link>
		</section>
	)
}

export default NotFound
