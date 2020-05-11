import { Action, APIResult } from "../types";

export const Success = (params: APIResult): Action<APIResult> => ( {
  type: `@api/${params.origin}/SUCCESS`,
  payload: params,
} );