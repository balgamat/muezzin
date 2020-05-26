import fetch from "cross-fetch";
import { Action, APICall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Success } from "../actions/success";
import { handleError } from "./handleError";
import { defaultHeaders } from "../headers";

export function* handleCall(action: Action<APICall>) {
  const origin = action.payload.name;
  yield put(startLoading({ origin }));

  const {
    payload: {
      errorActions,
      errorReducer,
      params,
      postActions,
      preActions,
      reducer,
      url
    }
  } = action;

  try {
    if (preActions) {
      yield all(
        typeof preActions === "function"
          ? preActions(yield select())
          : preActions
      );
    }

    const { headers = defaultHeaders, method = "GET", ...req }: any =
      (typeof params === "function" ? params(yield select()) : params) || {};

    // @ts-ignore
    const response = yield call(fetch, url, {
      ...req,
      method,
      headers
    });
    const data = yield response.json();

    if (response.ok) {
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
        yield all(
          typeof postActions === "function"
            ? postActions(data, yield select())
            : postActions
        );
      }
    } else {
      yield call(handleError, {
        errorData: data,
        errorActions,
        errorReducer,
        origin
      });
    }
  } catch (e) {
    yield call(handleError, {
      errorData: e,
      errorActions,
      errorReducer,
      origin
    });
  }
}
