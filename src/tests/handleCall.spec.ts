import { handleCall } from "../sagas/handleCall";
import { api } from "../api";
import { call, put, select, all } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Success } from "../actions/success";

describe("Saga: handleCall", () => {
  const successResponse = { data: "Test Passed" };
  const preAction = { type: "preActionTest" };
  const postAction = { type: "postActionTest" };
  const action = api({
    name: "saga/test",
    url: "http://test.com/",
    preActions: [put(preAction)],
    postActions: [put(postAction)],
    params: {
      body: JSON.stringify({ data: 'Test data' }),
    },
  });

  const origin = "saga/test";
  const gen = handleCall(action);

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

  it("should call success with received data", () => {
    expect(gen.next(successResponse).value).toEqual(
      all([
        put(Success({ data: successResponse, origin, reducer: undefined })),
        put(endLoading({ origin }))
      ])
    );
  });

  it("should finish successfully", () => {
    expect(gen.next().done).toBeTruthy();
  });
});
