import { APIState } from "../types";
import { pathOr, pipe, props, values } from "ramda";

export interface ErrorsSelector {
  (...origins: string[]): (state: APIState) => APIState["errors"];
}

export const getErrors: ErrorsSelector = (...origins) =>
  pipe(
    pathOr({}, ["api", "errors"]),
    !!origins.length ? props(origins) : values
  );
