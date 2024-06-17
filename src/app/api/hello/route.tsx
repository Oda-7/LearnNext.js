import prisma from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const allTodos = await prisma.todos.findMany({
		// select: {
		// 	title: true,
		// },
	})

	return NextResponse.json(allTodos)
}

export async function POST(req: NextRequest) {
	const todo = await req.json()
	if (!todo.title) return
	const newtodo = await prisma.todos.create({
		data: {
			title: todo.title,
		},
	})

	const data = await prisma.todos.findMany({
		// select: {
		// 	title: true,
		// },
	})

	return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
	const { id } = await req.json()
	// console.log(id)
	const deletetodo = await prisma.todos.delete({
		where: {
			id: id,
		},
	})

	const data = await prisma.todos.findMany({
		// select: {
		// 	title: true,
		// },
	})
	// console.log(data)

	return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
	const { id, title } = await req.json()
	console.log(title)
	const updatetodo = await prisma.todos.update({
		where: {
			id: id,
		},
		data: {
			title: title,
		},
	})

	const data = await prisma.todos.findMany({
		// select: {
		// 	title: true,
		// },
	})

	return NextResponse.json(data)
}
