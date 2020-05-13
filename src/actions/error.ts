import { Action, APIResult } from "../types";

export interface ErrorAC {
  (params: APIResult): Action<APIResult>;
}

export const Error: ErrorAC = params => ({
  type: `@api/${params.origin}/ERROR`,
  payload: params
});

export enum ClearErrorBehavior {
  ClearAll,
  ClearFirst,
  ClearLast
}

export type ClearErrors = {
  atOrigin?: string;
  behavior?: ClearErrorBehavior;
};

export interface ClearErrorsAC {
  (payload: ClearErrors): Action<ClearErrors, "@api/clearErrors">;
}

export const clearErrors: ClearErrorsAC = payload => ({
  type: `@api/clearErrors`,
  payload
});
