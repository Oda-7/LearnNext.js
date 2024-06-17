import { parseISO, format } from 'date-fns'
import { fr, frCA } from 'date-fns/locale'

export default function Date({ dateString }: { dateString: string }) {
	const date = parseISO(dateString)
	return (
		<time dateTime={dateString}>
			{format(date, 'do LLLL yyyy', { locale: fr })}
		</time>
	)
}
