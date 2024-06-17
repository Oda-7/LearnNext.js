import { StaticImageData } from 'next/image'
import firstImageNext from 'public/images/image.png'
import secondImageNext from 'public/images/imagen.png'
import thirdImageNext from 'public/images/imageNext.png'

export type Photo = {
	id: number
	name: string
	src: StaticImageData | string
}

const photos: Photo[] = [
	{
		id: 1,
		name: 'Photo 1 Next',
		src: firstImageNext,
	},
	{
		id: 2,
		name: 'Photo 2 Next',
		src: secondImageNext,
	},
	{
		id: 3,
		name: 'Photo 3 Next',
		src: thirdImageNext,
	},
]

export default photos
