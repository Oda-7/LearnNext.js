export function ButtonVisible(props: { visible: any; setVisible: any }) {
	const { visible, setVisible } = props

	return (
		<button
			className='bg-red-700 m-2 p-2 rounded'
			type='button'
			onClick={() => {
				if (visible === 'password') {
					setVisible('text')
				} else {
					setVisible('password')
				}
			}}
		>
			{visible === 'password' ? 'Afficher' : 'Masquer'}
		</button>
	)
}