// 'use client'
import { NextRequest } from 'next/server'
import { useEffect, useState } from 'react'

// async function getData() {
// 	const urlLocal = 'http://localhost:8000'
// 	const res = await fetch(`${urlLocal}/api/hello`, {
// 		next: { revalidate: 60 },
// 		// cache: 'no-cache',
// 	})
// 	const data = await res.json()
// 	return data
// }

export default async function DataTodo() {
	// // const [data, setData] = useState()
	// const urlLocal = 'http://localhost:8000'
	// let res
	// if (request.method === 'GET') {
	// 	res = await fetch(`${urlLocal}/api/hello`, {
	// 		next: { revalidate: 60 },
	// 		// cache: 'no-cache',
	// 	})
	// 	console.log(res)
	// }
	// 	setData(await res.json())
	// 	const response = res.json()
	// 	console.log(response)
	// }
	// // 	const data = await res.json()
	// // 	return data
	// const allTodos = await getData()
	// console.log(allTodos)

	// if (request.method == 'POST') {
	// 	const res = await fetch('/api/hello?title=', {
	// 		method: 'POST',
	// 		body: JSON.stringify({ title: 'test' }),
	// 	})
	// }
	//
	// console.log(data)

	return (
		<>
			<h2>Yo</h2>
		</>
	)
}
