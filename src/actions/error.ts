import { Action, APIResult } from "../types";

export const Error = (params: APIResult): Action<APIResult> => ( {
  type: `@api/${params.origin}/ERROR`,
  payload: params,
} );