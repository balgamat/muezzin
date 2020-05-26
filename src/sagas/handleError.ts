import { all, put, select } from "redux-saga/effects";
import { Error } from "../actions/error";
import { endLoading } from "../actions/loading";
import { APICall } from "../types";

export function* handleError(
  params: { errorData: any; origin: string } & Pick<
    APICall,
    "errorActions" | "errorReducer"
  >
) {
  const { errorActions, errorData, errorReducer, origin } = params;

  yield all([
    put(
      Error({
        data: errorData,
        origin,
        reducer: errorReducer
      })
    ),
    put(endLoading({ origin }))
  ]);

  if (errorActions) {
    yield all(
      typeof errorActions === "function"
        ? errorActions(errorData, yield select())
        : errorActions
    );
  }
}
