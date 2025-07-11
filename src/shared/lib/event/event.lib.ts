import type { Todo } from '../shared-types/utility.type';

const debounce = <T extends (...args: unknown[]) => void>(
	func: T,
	delay: number,
): ((...args: Parameters<T>) => void) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

const callAllHandlers =
	<T extends (event: Todo) => void>(...fns: (T | undefined)[]) =>
	(event: Parameters<T>[0]) => {
		fns.some((fn) => {
			fn?.(event);
			return event?.defaultPrevented;
		});
	};

export const EVENT_LIB = {
	debounce,
	callAllHandlers,
};
