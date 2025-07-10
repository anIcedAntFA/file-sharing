import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	ErrorComponent,
	HeadContent,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { I18N_CLIENT, I18N_LIB } from "@/shared/i18n";
import type { Todo } from "@/shared/lib/shared-types/utility.type";

const RootComponent = () => {
	return (
		<>
			<HeadContent />
			<div className="root h-[200vh] w-[200vw]">
				<Outlet />
				<TanStackRouterDevtools />
			</div>
		</>
	);
};

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: ({ params }) => {
		const detectedLng = I18N_CLIENT.language;

		if (!I18N_LIB.isValidLocale((params as Todo).locale)) {
			throw redirect({
				to: "/$locale",
				params: { locale: detectedLng },
			});
		}
	},
	component: RootComponent,
	errorComponent: ErrorComponent,
});
