import { Action, BatchCall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { startLoading } from "../actions/loading";
import { batchFinished } from "../actions/batchFinished";
import { handleCall } from "./handleCall";

export function* handleBatch({
  payload: { calls, onFinished }
}: Action<BatchCall>) {
  yield all(calls.map(action => call(handleCall, action)));
  if (onFinished) {
    yield all(onFinished(yield select()));
  }
  yield put(batchFinished());
}
