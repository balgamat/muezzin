import { Action, APIDefinition, APIResult } from "./types";
import { Reducer } from "redux";

let API = {};

export const withAPI = (definition: APIDefinition) => {
  API = definition;

  return (rootReducer: Reducer) => (state: any, action: Action<any>) => {
    if (
      action.type.startsWith("@api/") &&
      (action.type.endsWith("/SUCCESS") || action.type.endsWith("/ERROR"))
    ) {
      const {
        payload: { data, selector }
      } = action as Action<APIResult>;

      return selector
        ? {
            ...state,
            ...selector(data, state)
          }
        : state;
    }

    if (action.type === "@api/loadingStart") {
      return {
        ...state,
        loading: state.loading + action.payload.itemsToLoadCount
      };
    }

    if (action.type === "@api/loadingEnd") {
      return {
        ...state,
        loading: Math.max(state.loading - 1, 0)
      };
    }

    return { loading: state.loading, ...rootReducer(state, action) };
  };
};
