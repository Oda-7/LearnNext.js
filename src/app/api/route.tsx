import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const data = { list: { message: 'Hello world!', secondmessage: 'test109' } }
	// let dataJson = await fetch('https://jsonplaceholder.typicode.com/todos', {
	// 	headers: {
	// 		'Content-type': 'application/json; charset=UTF-8',
	// 	},
	// })
	// console.log(dataJson.json())

	const response = NextResponse.json(data)
	response.headers.set('Content-type', 'application/json')

	return response
}
