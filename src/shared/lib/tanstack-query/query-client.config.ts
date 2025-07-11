import { MutationCache, QueryClient } from '@tanstack/react-query';
import { HttpStatusCode, isAxiosError } from 'axios';
import { ZodError } from 'zod';

import { MINUTE } from '@/shared/config/date.config';

// A centralized function to determine if an error should be thrown
// This can be used in both queries and mutations if needed.
const shouldThrowError = (error: unknown): boolean => {
	if (error instanceof ZodError && import.meta.env.MODE !== 'production') {
		return true;
	}
	if (isAxiosError(error) && error.response) {
		return error.response.status >= HttpStatusCode.InternalServerError;
	}
	return false;
};

export const QUERY_CLIENT = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			retry: false,
			staleTime: MINUTE * 5,
			throwOnError: shouldThrowError,
		},
	},
	mutationCache: new MutationCache({
		onError: (error) => {
			//TODO: Show a toast or log the error
			console.error('MutationCache error:', error);
		},
	}),
});
