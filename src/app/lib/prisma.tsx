import { PrismaClient, Prisma } from '@prisma/client'

let prisma = new PrismaClient()

// async function createMany() {
// 	let todos = await prisma.todos.findMany()

// 	// if (todos.length === 0) {
// 	// 	await prisma.todos.createMany({
// 	// 		data: [{ title: 'Todo 1' }, { title: 'Todo 2' }, { title: 'Todo 3' }],
// 	// 		skipDuplicates: true,
// 	// 	})
// 	// }
// }

// createMany()

// if (prisma.todos.findMany() == null) {
//
// }

export default prisma
