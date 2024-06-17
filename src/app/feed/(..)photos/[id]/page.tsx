'use client'
import photos, { Photo } from '@/app/photo'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'

export default function PhotoPage({
	params: { id },
}: {
	params: { id: number }
}) {
	const photo = photos.find((p) => p.id == id)
	const { name, src } = photo as Photo
	const router = useRouter()
	return (
		<div className='container mx-auto my-10 flex'>
			<div className=' mx-auto border border-gray-700 flex flex-col items-center'>
				<button onClick={() => router.back()}>Fermer la fenêtre</button>
				<Image alt={name} src={src} className='object-cover aspect-[2/2]' />
			</div>
		</div>
	)
}
