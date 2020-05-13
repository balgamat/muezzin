import { Action } from "../types";

export type LoadingPayload = {
  origin: string;
};

export interface StartLoadingAC {
  (payload: LoadingPayload): Action<LoadingPayload, "@api/loadingStart">;
}

export const startLoading: StartLoadingAC = ({ origin }) => ({
  type: "@api/loadingStart",
  payload: {
    origin: origin
  }
});

export interface EndLoadingAC {
  (payload: LoadingPayload): Action<LoadingPayload, "@api/loadingEnd">;
}

export const endLoading: EndLoadingAC = ({ origin }) => ({
  type: "@api/loadingEnd",
  payload: {
    origin: origin
  }
});
