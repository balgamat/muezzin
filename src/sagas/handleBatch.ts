import { Action, BatchCall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { startLoading } from "../loading";
import { batchFinished } from "../actions/batchFinished";
import { handleCall } from "./handleCall";

export function* handleBatch({
  payload: { calls, onFinished }
}: Action<BatchCall>) {
  yield put(startLoading({ itemsToLoadCount: calls.length }));
  yield all(calls.map(action => call(handleCall, action)));
  if (onFinished) {
    yield all(onFinished(yield select()));
  }
  yield put(batchFinished());
}
