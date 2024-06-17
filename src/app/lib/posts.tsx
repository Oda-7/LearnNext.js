import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

const postsDirectory = path.join(process.cwd(), 'public/posts')

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory)

	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '')

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents)
		const date: string = matterResult.data.date
		const title: string = matterResult.data.title

		// Combine the data with the id
		return {
			id,
			date,
			title,
		}
	})

	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1
		} else {
			return -1
		}
	})
	// return console.log(allPostsData)
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory)

	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ''),
			},
		}
	})
}

export async function getPostData(id: any) {
	const fullPath = path.join(postsDirectory, `${id}.md`)
	const fileContents = fs.readFileSync(fullPath, 'utf8')

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents)
	const date: string = matterResult.data.date
	const title: string = matterResult.data.title

	const processedContent = await remark()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(matterResult.content)
	const contentHtml = processedContent.toString()
	// Combine the data with the id
	return {
		id,
		date,
		title,
		contentHtml,
	}
}
