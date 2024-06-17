import utilStyles from '@/app/styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'

async function getAllPostsData() {
	const allPostsData = await getSortedPostsData()
	return allPostsData
}

export const metadata: Metadata = {
	title: 'Posts',
}

export default async function Page() {
	/* staticProps */
	const allPostsData = await getAllPostsData()
	// const allPostsData = await getSortedPostsData()

	return (
		<div className='flex justify-center my-3 '>
			<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
				<h2 className={utilStyles.headingLg}>Blog</h2>
				<ul className={utilStyles.list}>
					{allPostsData.map(({ id, date, title }: any) => (
						<div className='flex flex-col' key={id}>
							<li className={utilStyles.listItem}>
								{title} - <b>{id}</b>
								<br />
								{date}
							</li>
							<li className={`${utilStyles.listItem}, w-fit`}>
								<Link
									href={`/product/${id}`}
									className='rounded-full border-4 border-green-500 p-2 flex '
								>
									{id}
								</Link>
							</li>
						</div>
					))}
				</ul>
			</section>
		</div>
	)
}
