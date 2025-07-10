import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";
import { DEFAULT_NS, I18N_CLIENT } from "@/shared/i18n";
import { QUERY_CLIENT } from "@/shared/lib/tanstack-query";
import { ROUTE_CLIENT } from "@/shared/lib/tanstack-router";

export const AppProvider = () => {
	return (
		<I18nextProvider i18n={I18N_CLIENT} defaultNS={DEFAULT_NS}>
			<QueryClientProvider client={QUERY_CLIENT}>
				<RouterProvider router={ROUTE_CLIENT} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</I18nextProvider>
	);
};
