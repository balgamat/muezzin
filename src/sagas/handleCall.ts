import { Action, APICall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import * as R from "ramda";
import isCallable from "is-callable";
import { Success } from "../actions/success";
import { endLoading } from "../loading";
import { Error } from "../actions/error";

export function* handleCall(action: Action<APICall>) {
  const origin = action.type.slice(5);
  const state = yield select();
  const {
    payload: {
      callParams,
      endpoint: endpoint,
      errorSelector,
      postActions,
      preActions,
      selector
    }
  } = action;

  try {
    if (preActions) {
      yield all(preActions(state));
    }

    const data = yield call(
      // @ts-ignore
      R.path(endpoint, API),
      // @ts-ignore
      {
        params: isCallable(callParams) ? callParams(state) : callParams
      }
    );

    if (data.ok) {
      yield all([
        put(
          Success({
            data: data.body,
            origin,
            selector
          })
        ),
        put(endLoading())
      ]);

      if (postActions) {
        yield all(postActions(data.body));
      }
    } else {
      yield all([
        put(
          Error({
            data,
            origin,
            selector: errorSelector
          })
        ),
        put(endLoading())
      ]);
    }
  } catch (e) {
    yield all([
      put(
        Error({
          data: e,
          origin,
          selector: errorSelector
        })
      ),
      put(endLoading())
    ]);

    if (!errorSelector) {
      console.error(
        "Error occurred. Please add errorSelector if you wish to handle it within your state."
      );
    }
  }
}