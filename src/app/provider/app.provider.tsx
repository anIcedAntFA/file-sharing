import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { I18nextProvider } from 'react-i18next';

import { DEFAULT_NS, I18N_CLIENT } from '@/shared/i18n';
import { QUERY_CLIENT } from '@/shared/lib/tanstack-query';
import { ROUTE_CLIENT } from '@/shared/lib/tanstack-router';
// import { Provider as ThemeProvider } from '@/shared/ui/provider';

export const AppProvider = () => {
	return (
		<I18nextProvider defaultNS={DEFAULT_NS} i18n={I18N_CLIENT}>
			<QueryClientProvider client={QUERY_CLIENT}>
				{/* <ThemeProvider> */}
				<RouterProvider router={ROUTE_CLIENT} />
				<ReactQueryDevtools initialIsOpen={false} />
				{/* </ThemeProvider> */}
			</QueryClientProvider>
		</I18nextProvider>
	);
};
