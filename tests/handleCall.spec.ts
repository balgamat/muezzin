import { handleCall } from "../src/sagas/handleCall";
import { api } from "../src";
import { call, put, select, all } from "redux-saga/effects";
import { endLoading, startLoading } from "../src/actions/loading";
import { API, defineAPI } from "../src/withAPI";
import { Success } from "../src/actions/success";

const successResponse = { data: "Test Passed" }; // undefined; // with undefined it passes
defineAPI({
  saga: {
    test: () =>
      new Promise(resolve => {
        setTimeout(() => resolve(successResponse), 100);
      })
  }
});

describe("Handle Call Saga", () => {
  it("Should receive data and dispatch Success", () => {
    const action = api({ endpoint: ["saga", "test"] });
    const origin = "saga/test";
    const gen = handleCall(action);

    expect(gen.next().value).toEqual(put(startLoading({ origin })));
    expect(gen.next().value).toEqual(select());
    expect(gen.next().value).toEqual(
      // @ts-ignore
      call(API.saga.test, { params: undefined })
    );
    expect(gen.next().value).toEqual(
      all([
        put(Success({ data: successResponse, origin, reducer: undefined })),
        put(endLoading({ origin }))
      ])
    );
    expect(gen.next().done).toBeTruthy();
  });
});
