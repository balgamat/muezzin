import fetch from "cross-fetch";
import { handleCall } from "../sagas/handleCall";
import { api } from "../api";
import { call, put, all } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Success } from "../actions/success";
import { Error } from "../actions/error";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import { handleError } from "../sagas/handleError";

describe("Saga: handleCall", () => {
  const successResponse = { data: "Test Passed" };
  const errorResponse = { data: "Error" };
  const preAction = { type: "preActionTest" };
  const postAction = { type: "postActionTest" };
  const action = api({
    name: "saga/test",
    url: "http://test.com/",
    preActions: [put(preAction)],
    postActions: [put(postAction)],
    params: {
      body: JSON.stringify({ data: "Test data" })
    }
  });
  const origin = "saga/test";
  const gen = cloneableGenerator(handleCall)(action);

  it("should start loading", () => {
    expect(gen.next().value).toEqual(put(startLoading({ origin })));
  });

  it("should perform preActions", () => {
    expect(gen.next().value).toEqual(all([put(preAction)]));
  });

  it("should call API", () => {
    expect(gen.next().value).toEqual(
      // @ts-ignore
      call(fetch, action.payload.url, action.payload.params)
    );
  });

  it("should fail when response not ok", () => {
    const failGen = gen.clone();
    const val = failGen.next({
      ok: false,
      json: () => errorResponse
    }).value;
    expect(
      failGen.next(val).value
      // @ts-ignore
    ).toEqual(call(handleError, {
      errorData: errorResponse,
      errorActions: action.payload.errorActions,
      errorReducer: action.payload.errorReducer,
      origin
    }));
  });

  it("should get json data", () => {
    expect(
      gen.next({
        ok: true,
        json: () => successResponse
      }).value
    ).toEqual(successResponse);
  });

  it("should fail on error", () => {
    const throwGen = gen.clone();
    // @ts-ignore
    expect(throwGen.throw(errorResponse).value).toEqual(
      // @ts-ignore
      call(handleError, {
        errorData: errorResponse,
        errorActions: action.payload.errorActions,
        errorReducer: action.payload.errorReducer,
        origin
      })
    );
  });

  it("should call success with received data", () => {
    expect(gen.next(successResponse).value).toEqual(
      all([
        put(Success({ data: successResponse, origin, reducer: undefined })),
        put(endLoading({ origin }))
      ])
    );
  });

  it("should perform postActions", () => {
    expect(gen.next().value).toEqual(all([put(postAction)]));
  });

  it("should finish successfully", () => {
    expect(gen.next().done).toBeTruthy();
  });
});
