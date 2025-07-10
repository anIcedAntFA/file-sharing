import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/')({
	beforeLoad: ({ params: { locale } }) => {
		throw redirect({
			to: '/$locale/about',
			params: { locale },
		});
	},
});
