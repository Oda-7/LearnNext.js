import FormUAwithParams from '@/app/components/authForm/FormUAwithParams'

export default function FormUnlockAccount({
	searchParams,
}: {
	searchParams: { email: string }
}) {
	return (
		<>
			<FormUAwithParams email={searchParams.email} />
		</>
	)
}
