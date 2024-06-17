// Error components must be Client Components
'use client'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	// Log the error to an error reporting service
	// console.log(error)
	return (
		<div className='m-5'>
			<div className='bg-red-600 border-red-700 p-4'>
				<h2>Vous rencontrez une erreur !</h2>
				<p>{error.message}</p>
				<button
					className='btn bg-red-900'
					onClick={
						// Attempt to recover by trying to re-render the segment
						() => reset()
					}
				>
					Essayer a nouveau
				</button>
			</div>
		</div>
	)
}

// ;('use client')

// const error = ({ error, reset }: { error: Error; reset: () => void }) => {
// 	return (
// 		<div className='bg-red-600 border-red-700'>
// 			<h2>Il y a une erreur</h2>
// 			<button onClick={() => reset()}>Recharger</button>
// 		</div>
// 	)
// }

// const error = ({}) => {
// 	return <div>Erreur</div>
// }
// export default error
