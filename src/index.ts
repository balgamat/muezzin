import { api } from "./api";
import { withAPI, apiReducer } from "./withAPI";
import { clearErrors, ClearErrorBehavior } from "./actions/error";
import { watchAPI } from "./sagas/watchAPI";
import { isLoading } from "./selectors/isLoading";
import { getErrors } from "./selectors/getErrors";
import { CallBehavior } from "./types";

export {
  api,
  apiReducer,
  CallBehavior,
  ClearErrorBehavior,
  clearErrors,
  getErrors,
  isLoading,
  watchAPI,
  withAPI
};
