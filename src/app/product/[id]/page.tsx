import utilStyles from '@/styles/utils.module.css'
import { getAllPostIds, getPostData } from '@/app/lib/posts'
import Link from 'next/link'
import Image from 'next/image'
import Date from '@/app/components/date'

export const dynamicParams = true

export async function generateStaticParams() {
	const paths = await getAllPostIds()
	// console.log(allId.map((id) => id.params))
	return paths.map((path) => ({ id: path.params.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	const title = params.id
	return { title }
}

export default async function Page({ params }: { params: { id: string } }) {
	const { id, title, date, contentHtml } = await getPostData(params.id)

	return (
		<>
			<section className='flex flex-wrap justify-center '>
				<div className='flex flex-wrap flex-col m-4 w-4/5 gap-3'>
					<div>
						<Link
							href={'/product'}
							className='rounded-full bg-green-500 p-0 flex w-fit'
						>
							<Image
								src={'/svg/arrow.svg'}
								alt='Retour'
								width={50}
								height={50}
								priority
							/>
						</Link>
					</div>
					{title}
					<br />
					{id}
					<div className='border-b-2 border-black'></div>
					<Date dateString={date} />
					<br />
					<div dangerouslySetInnerHTML={{ __html: contentHtml }} />
				</div>
			</section>
		</>
	)
}
