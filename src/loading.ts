import { Action } from './types';

export type StartLoadingPayload = {
	itemsToLoadCount: number;
};

export const startLoading = ({itemsToLoadCount}: StartLoadingPayload): Action<StartLoadingPayload, '@api/loadingStart'> => ({
  type: '@api/loadingStart',
  payload: {
    itemsToLoadCount,
  },
});

export const endLoading = (): Action<null, '@api/loadingEnd'> => ({
	type: '@api/loadingEnd',
	payload: null,
});
