import {
  always,
  append,
  assoc,
  dissoc,
  drop,
  dropLast,
  evolve,
  ifElse,
  lensPath,
  over
} from "ramda";
import { Action, APIAction, APIDefinition, APIResult, APIState } from "./types";
import { ClearErrorBehavior, ClearErrors } from "./actions/error";
import { LoadingPayload } from "./actions/loading";
import { Reducer } from "redux";

export let API = {};

export const initialState: APIState = {
  api: {
    loading: {},
    errors: {}
  }
};

export const withAPI = (definition: APIDefinition) => {
  API = definition;

  return (rootReducer: Reducer) => (
    state: APIState = initialState,
    action: APIAction
  ) => {
    if (
      action.type.startsWith("@api/") &&
      (action.type.endsWith("/SUCCESS") || action.type.endsWith("/ERROR"))
    ) {
      const {
        payload: { data, origin, reducer }
      } = action as Action<APIResult>;

      const stateWithErrors = action.type.endsWith("/ERROR")
        ? over(lensPath(["api", "errors", origin]), append(data), state)
        : state;

      return reducer
        ? {
            ...stateWithErrors,
            ...reducer(data, stateWithErrors)
          }
        : stateWithErrors;
    }

    if (action.type === "@api/loadingStart") {
      return evolve(
        {
          api: {
            loading: assoc(
              (action as Action<LoadingPayload, "@api/loadingStart">).payload
                .origin,
              null
            )
          }
        },
        state
      );
    }

    if (action.type === "@api/loadingEnd") {
      return evolve(
        {
          api: {
            loading: dissoc(
              (action as Action<LoadingPayload, "@api/loadingStart">).payload
                .origin
            )
          }
        },
        state
      );
    }

    if (action.type === "@api/clearErrors") {
      const {
        atOrigin,
        behavior = ClearErrorBehavior.ClearAll
      } = action.payload as ClearErrors;
      return evolve({
        api: {
          errors: ifElse(
            always(!!atOrigin),
            ifElse(
              always(behavior === ClearErrorBehavior.ClearAll),
              assoc(atOrigin!, []),
              evolve({
                [atOrigin!]: ifElse(
                  always(behavior === ClearErrorBehavior.ClearFirst),
                  drop(1),
                  dropLast(1)
                )
              })
            ),
            always({})
          )
        }
      });
    }

    return { api: state.api, ...rootReducer(state, action) };
  };
};
