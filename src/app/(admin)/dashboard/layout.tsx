'use client'

import { Lobster } from 'next/font/google'
import styles from '@/app/styles/layout_team.module.css'

const lobster = Lobster({ subsets: ['latin'], weight: ['400'] })

export default function DashboardLayout(props: {
	children: React.ReactNode
	analytics: React.ReactNode
	team: React.ReactNode
}) {
	return (
		<section className={lobster.className}>
			<h2>Page du tableau de bord</h2>
			<>
				{props.children}
				{props.analytics}
				<div className={styles.layout}>{props.team}</div>
			</>
		</section>
	)
}
