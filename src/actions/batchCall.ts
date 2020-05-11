import { Action, BatchCall } from "../types";

export const BATCH_CALL_ACTION_TYPE = '@api/______________BATCH__STARTED______________';
export const batchCall = (params: BatchCall): Action<BatchCall> => ( {
  type: BATCH_CALL_ACTION_TYPE,
  payload: params,
} );