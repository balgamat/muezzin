import { Action, APICall } from "../types";
import isCallable from "is-callable";
import { all, call, put, select } from "redux-saga/effects";
import { API } from "../withAPI";
import { endLoading, startLoading } from "../actions/loading";
import { Error } from "../actions/error";
import { path } from "ramda";
import { Success } from "../actions/success";

export function* handleCall(action: Action<APICall>) {
  const origin = action.type.slice(5);
  yield put(startLoading({ origin }));

  const state = yield select();
  const {
    payload: {
      callParams,
      endpoint,
      errorActions,
      errorReducer,
      postActions,
      preActions,
      reducer
    }
  } = action;

  try {
    if (preActions) {
      yield all(preActions(state));
    }

    // @ts-ignore
    const data = yield call(path(endpoint, API), {
      params: isCallable(callParams) ? callParams(state) : callParams
    });

    yield all([
      put(
        Success({
          data,
          origin,
          reducer: reducer
        })
      ),
      put(endLoading({ origin }))
    ]);

    if (postActions) {
      yield all(postActions(data.body));
    }
  } catch (e) {
    yield all([
      put(
        Error({
          data: e,
          origin,
          reducer: errorReducer
        })
      ),
      put(endLoading({ origin }))
    ]);

    if (errorActions) {
      yield all(errorActions(e));
    }
  }
}
