import type { NavigateOptions, Register } from '@tanstack/react-router';
import { useNavigate, useParams } from '@tanstack/react-router';

/**
 * Custom navigate function that auto-injects the `SupportedLocale` param.
 * Keeps all other NavigateOptions fully type-safe and intact.
 */
export const useLocaleNavigate = () => {
	const navigate = useNavigate<Register['router']>();
	const { locale } = useParams({ from: '/$locale' });

	return (opts: NavigateOptions<Register['router']>) => {
		return navigate({
			...opts,
			params: {
				locale,
				...(typeof opts.params === 'object' && opts.params !== null
					? opts.params
					: {}),
			},
		});
	};
};
