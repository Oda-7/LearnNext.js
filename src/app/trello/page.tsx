import { Metadata } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import SimpleForm from '../components/datatodo/simpleform'
import DataTodo from '../components/datatodo/datatodo'

export const metadata: Metadata = {
	title: 'Trello',
}

const urlLocal = 'http://localhost:8000'
async function getData() {
	const res = await fetch(`${urlLocal}/api/hello`, {
		next: { revalidate: 5 },
		// cache: 'no-cache',
	}) //${urlLocal}
	if (!res) return
	// const data = await res.map((todo: any) => Object.values(todo))

	return res.json()
}

export default async function Trello() {
	let allTodos = await getData()
	allTodos = allTodos.map((todo: any) => Object.values(todo))
	// console.log(allTodos)
	// console.log(await req.method)
	// const [req, setReq] = useState()
	//
	// console.log(allTodos)
	return (
		/* <div>
				<h2>Trello</h2>
				{allTodos.map((todo: any) => (
					<p key={todo.id}>{todo.title}</p>
				))}
			</div> */

		//<DataTodo />
		<SimpleForm allPost={allTodos} />
	)
}
