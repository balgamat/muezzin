import { Action, BatchCall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { startLoading } from "../actions/loading";
import { batchFinished } from "../actions/batchFinished";
import { handleCall } from "./handleCall";

export function* handleBatch({
  payload: { requests, onFinished }
}: Action<BatchCall>) {
  yield all(requests.map(action => call(handleCall, action)));
  if (onFinished) {
    yield all(
      typeof onFinished === "function" ? onFinished(yield select()) : onFinished
    );
  }
  yield put(batchFinished());
}
