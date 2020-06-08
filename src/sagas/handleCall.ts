import { Action, APICall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Success } from "../actions/success";
import { handleError } from "./handleError";
import { defaultHeaders } from "../headers";
import { axios } from "../axios";

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

    const response = yield call(axios, url, {
      ...req,
      method,
      headers
    });

    yield all([
      put(
        Success({
          response,
          origin,
          reducer: reducer
        })
      ),
      put(endLoading({ origin }))
    ]);

    if (postActions) {
      yield all(
        typeof postActions === "function"
          ? postActions(response, yield select())
          : postActions
      );
    }
  } catch (e) {
    const errorData = e.response || e.request || e.message;

    yield call(handleError, {
      errorData,
      errorActions,
      errorReducer,
      origin
    });
  }
}
