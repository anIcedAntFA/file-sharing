import type { DefaultError, UseMutationOptions } from '@tanstack/react-query';
import type { SVGProps } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: <todo to remind>
export type Todo = any;

export type SvgComponentProps = SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
};

export type MutateOptions<Data = unknown, Params = unknown> = Pick<
  UseMutationOptions<Data, DefaultError, Params, unknown>,
  'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
>;
