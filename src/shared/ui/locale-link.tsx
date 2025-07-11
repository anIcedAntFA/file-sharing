import { Link, type LinkProps, useParams } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * `ComponentPropsWithoutRef<'a'>` gives you native anchor tag props (`className`, `target`, etc.)
 * `Omit<..., keyof LinkProps<T>>` ensures no duplication/conflict with `LinkProps` (e.g., `to`, `params`)
 * `ExtendedLinkProps<T>` merges them cleanly so that your `LocaleLink` supports both router + HTML props
 */
type ExtendedLinkProps<T extends Record<string, unknown>> = LinkProps<T> &
	Omit<ComponentPropsWithoutRef<'a'>, keyof LinkProps<T>>;

export const LocaleLink = <T extends Record<string, unknown>>(
	props: ExtendedLinkProps<T>,
) => {
	const { locale } = useParams({ from: '/$locale' });

	return (
		<Link
			{...props}
			params={{
				...(typeof props.params === 'object' && props.params !== null
					? props.params
					: {}),
				locale,
			}}
		/>
	);
};
