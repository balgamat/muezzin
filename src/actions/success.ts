import { Action, APIResult } from "../types";

export interface SuccessAC {
  (params: APIResult): Action<APIResult>
}

export const Success: SuccessAC = params => ( {
  type: `@api/${params.origin}/SUCCESS`,
  payload: params,
} );