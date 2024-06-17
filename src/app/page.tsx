import { NextRequest, NextResponse } from 'next/server'
import Template from './template'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { headers } from 'next/headers'
import { get } from 'http'

// loading
async function getData() {
	const urlLocal = 'http://localhost:8000'
	const res = await fetch(`${urlLocal}/api`, {
		next: { revalidate: 5 },
	})
	const data = await res.json()
	return data
}

let variable = 1223
console.log(variable)

export default async function Home() {
	const data = await getData()

	return (
		<div>
			<Template>
				<h2>Page d&apos;accueil</h2>
				<p>{data.list.message}</p>
				<p>{data.list.secondmessage}</p>
			</Template>
		</div>
	)
}
