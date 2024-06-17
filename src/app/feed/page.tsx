import Image from 'next/image'
import photos from '@/app/photo'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Gallery',
}


export default function Page() {
	return (
		<div>
			<h1>Photos</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-max	 gap-6 m-10 '>
				{photos.map(({ id, name, src }) => (
					<div key={id}>
						<Link key={id} href={`/photos/${id}`}>
							<Image
								decoding='auto'
								src={src}
								alt={name}
								width={500}
								height={500}
								className='object-cover aspect-[1/1.1]'
							/>
						</Link>
					</div>
				))}
				{/* <div className=''>
					<Image
						height={600}
						width={500}
						alt='première Image'
						src={firstImageNext}
						className='object-cover aspect-[1/1.1]'
					></Image>
				</div>
				<div>
					<Image
						height={600}
						width={500}
						className='object-cover aspect-[1/1.1]'
						alt='seconde Image'
						src={secondImageNext}
					></Image>
				</div>
				<div>
					<Image
						className='object-cover aspect-[1/1.1]'
						alt='troisième Image'
						src={thirdImageNext}
					></Image>
				</div> */}
			</div>
		</div>
	)
}
