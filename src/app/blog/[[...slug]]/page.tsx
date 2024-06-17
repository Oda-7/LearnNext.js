import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Blog',
}

export default function Page({ params }: { params: { slug: string } }) {
	return (
		<div>
			{/* <h3>Blog d'Elvyn</h3> */}
			<p>My Blog Post : {params.slug} </p>
		</div>
	)
}
// export async function generateStaticParams() {
// 	const posts = await fetch('http://.../blog/Elvyn').then((res) => res.json())

// 	return posts.map((post: { slug: any }) => ({
// 		slug: post.slug,
// 	}))
// }

// // Multiple versions of this page will be statically generated
// // using the `params` returned by `generateStaticParams`
// export default function Page({ params }: { params: { slug: string } }) {
// 	const { slug } = params
// 	// ...
// }
