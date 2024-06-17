'use client'
import {
	FormEvent,
	MouseEventHandler,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { FormUpdate } from './formupdate'
import { set } from 'date-fns'

const urlLocal = 'http://localhost:8000'

export default function SimpleForm(allPost: any) {
	const [data, setData] = useState(allPost.allPost)
	// console.log(data)
	const [searchdata, setSearchdata] = useState(null)
	// const [formupdateVisible, setFormUpdateVisible] = useState('hidden')

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget
		const formData = new FormData(form)
		const formDataObject = Object.fromEntries(formData)

		if (!formDataObject.title) return
		const res = await fetch(`${urlLocal}/api/hello`, {
			method: 'POST',
			body: JSON.stringify(formDataObject),
		}).then((res) => res.json())
		form.reset()
		// console.log(res)

		if (!res) return
		setData(res.map((todo: any) => Object.values(todo)))
	}

	async function handleDelete(event: any) {
		const button = event.currentTarget as HTMLButtonElement
		// console.log(button.id)
		const buttonid = button.id
		const res = await fetch(`${urlLocal}/api/hello`, {
			method: 'DELETE',
			body: JSON.stringify({ id: buttonid }),
		}).then((res) => res.json())
		// console.log(res)

		if (!res) return
		setData(res.map((todo: any) => Object.values(todo)))
	}

	// function formupdateVisible() {
	// 	if (searchdata === '') {
	// 		return 'hidden'
	// 	} else {
	// 		return 'visible'
	// 	}
	// }
	// console.log(searchdata)

	async function handleModify(event: any) {
		const button = event.currentTarget as HTMLButtonElement
		const buttonid = button.id as string
		const searchdataFilter = data.find((todo: any) => todo[1] === buttonid)
		// console.log(searchdataFilter)
		if (!searchdataFilter) return
		setSearchdata(searchdataFilter)
	}

	async function handleSubmitUpdate(event: any) {
		event.preventDefault()
		// console.log(event)
		const form = event.currentTarget
		const formData = new FormData(form)
		const formDataObject = Object.fromEntries(formData)
		if (!formDataObject.title) return
		// form.className = 'hidden'
		// console.log(formDataObject)

		if (!searchdata) return
		const res = await fetch(`${urlLocal}/api/hello`, {
			method: 'PUT',
			body: JSON.stringify({ id: searchdata[1], title: formDataObject.title }),
		}).then((res) => res.json())
		setSearchdata(null)
		// console.log(res)
		if (!res) return
		setData(res.map((todo: any) => Object.values(todo)))
	}

	// console.log(handleSubmitUpdate)
	// console.log(data)

	return data.length !== 0 ? (
		<>
			<ul>
				{data.map((todo: any) => (
					<li key={todo[0]} className='flex gap-2' id='liTodo'>
						{todo[0]}
						<button id={todo[1]} onClick={handleModify}>
							Modifier
						</button>
						<button id={todo[1]} onClick={handleDelete}>
							Supprimer
						</button>
					</li>
				))}
			</ul>
			{/* {formupdateVisible() === 'visible' &&
				(console.log(searchdata), (<FormUpdate todoUpdate={searchdata} />))} */}
			{/* {searchdata ? <FormUpdate todoUpdate={searchdata} /> : null} */}
			{/* <FormUpdate todoUpdate={searchdata} /> */}
			{searchdata && (
				<FormUpdate todoUpdate={searchdata} onSubmit={handleSubmitUpdate} />
			)}
			<form onSubmit={handleSubmit}>
				<label>
					title:
					<input type='text' name='title' />
				</label>
				{/* <input type='submit' value='Submit' /> */}
				<button className='btn-primary'>Reset</button>
			</form>
		</>
	) : (
		<>
			<div>
				<p>Il n&apos;y a pas de todo</p>
			</div>
			<form onSubmit={handleSubmit}>
				<label>
					title:
					<input type='text' name='title' />
				</label>
				<input type='submit' value='Submit' />
			</form>
		</>
	)
}
