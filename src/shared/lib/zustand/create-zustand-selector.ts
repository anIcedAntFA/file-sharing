import type { StoreApi, UseBoundStore } from 'zustand';

import type { Todo } from '../shared-types/utility.type';

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S,
) => {
	const store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (const k of Object.keys(store.getState())) {
		(store.use as Todo)[k] = () => store((s) => s[k as keyof typeof s]);
	}

	return store;
};
