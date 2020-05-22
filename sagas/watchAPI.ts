import { all, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import { BATCH_CALL_ACTION_TYPE } from "../actions/batchCall";
import { handleBatch } from "./handleBatch";
import { Action, APICall, CallBehavior } from "../types";
import { handleCall } from "./handleCall";

const shouldTakeEvery: any = (a: Action<APICall>) =>
  ( a.payload?.behavior === CallBehavior.TakeEvery || !!a.payload?.behavior ) &&
  new RegExp("@API/").test(a.type);

const shouldTakeLatest: any = (a: Action<APICall>) =>
  a.payload?.behavior === CallBehavior.TakeLatest &&
  new RegExp("@API/").test(a.type);

const shouldTakeFirst: any = (a: Action<APICall>) =>
  a.payload?.behavior === CallBehavior.TakeFirst &&
  new RegExp("@API/").test(a.type);

export function* watchAPI() {
  yield all([
    takeEvery(shouldTakeEvery, handleCall),
    takeLatest(shouldTakeLatest, handleCall),
    takeLeading(shouldTakeFirst, handleCall),
    takeEvery(BATCH_CALL_ACTION_TYPE, handleBatch)
  ]);
}
