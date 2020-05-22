import { handleCall } from "../sagas/handleCall";
import { api } from "../api";
import { call, put, select, all } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Success } from "../actions/success";
import fetch from 'cross-fetch';

describe("Saga: handleCall", () => {
  const successResponse = { data: "Test Passed" };
  const action = api({ name: 'saga/test', url: 'http://test.com/', preActions:  });
  const origin = "saga/test";
  const gen = handleCall(action);

  it("should start loading", () => {
    expect(gen.next().value).toEqual(put(startLoading({ origin })));
  });

  it("should call API", () => {
    expect(gen.next().value).toEqual(select());
    expect(gen.next().value).toEqual(
      // @ts-ignore
      call(fetch, action.url)
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
