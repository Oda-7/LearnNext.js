import { useEffect, useState } from 'react'

export function FormUpdate({
	todoUpdate,
	onSubmit,
}: {
	todoUpdate: any
	onSubmit: any
}) {
	const [data, setData] = useState(todoUpdate)
	console.log(todoUpdate)

	if (data[0] !== todoUpdate[0]) {
		setData(todoUpdate)
	}
	const functionGetParent = onSubmit

	return (
		<>
			<form className='' id='formModify' onSubmit={functionGetParent}>
				<label htmlFor='inputModify'>{data[0]}</label>
				<input
					type='text'
					name='title'
					id='inputModify'
					placeholder={data[0]}
				/>
				<button type='submit'>Update</button>
			</form>
		</>
	)
}
