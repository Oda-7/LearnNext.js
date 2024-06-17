'use client'
import { redirect } from 'next/navigation'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<html lang='fr'>
			<body>
				<div className='bg-red-600 border-red-700 p-4'>
					<h2>Erreur sur le layout</h2>
					<p>{error.message}</p>
					<button onClick={() => reset()}>Try again</button>
				</div>
			</body>
		</html>
	)
}
