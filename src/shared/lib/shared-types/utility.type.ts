import type { DefaultError, UseMutationOptions } from '@tanstack/react-query';
import type { ComponentType, SVGProps } from 'react';
import type { FieldError } from 'react-hook-form';

// biome-ignore lint/suspicious/noExplicitAny: <todo to remind>
export type Todo = any;

export type SvgComponentProps = SVGProps<SVGSVGElement> & {
	title?: string;
	titleId?: string;
	desc?: string;
	descId?: string;
};

export type Dict<T = Todo> = Record<string, T>;

export type Nullable<T> = T | null;

export type Either<L, R> = L | R;

export type KeyType<T> = keyof T;

export type ValueType<T> = T[keyof T];

export type OverrideProps<T, TOverridden> = Omit<T, keyof TOverridden> &
	TOverridden;

export type NonEmptyArray<A> = [A, ...A[]];

export type NonEmptyObject<O> = keyof O extends never ? never : O;

export type EmptyObject = Record<PropertyKey, never>;

export type Primitive = string | number | boolean | null | undefined;

export interface ISelectOption<T> {
	/** The text to display for the option. */
	label: string;
	/** The unique value associated with the option. */
	value: T;
	/** Optional icon component to display alongside the option. */
	icon?: ComponentType<{ className?: string }>;
}

export interface IFieldErrorType {
	required: FieldError['message'];
	invalidEmail?: FieldError['message'];
	invalidTypes?: FieldError['message'];
	invalidSize?: FieldError['message'];
}

export type MutateOptions<Data = unknown, Params = unknown> = Pick<
	UseMutationOptions<Data, DefaultError, Params, unknown>,
	'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
>;
