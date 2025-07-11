import { createFileRoute, Outlet } from '@tanstack/react-router';

import { I18N_CLIENT } from '@/shared/i18n';

export const Route = createFileRoute('/$locale')({
	beforeLoad: async ({ params }) => {
		// Sync i18n language with route
		if (I18N_CLIENT.language !== params.locale) {
			await I18N_CLIENT.changeLanguage(params.locale);
		}
		// Set the HTML lang attribute
		document.documentElement.lang = params.locale;
	},
	component: Outlet,
	// Catch-all for any routes not found under this locale
	notFoundComponent: () => <div>Not found</div>,
});
