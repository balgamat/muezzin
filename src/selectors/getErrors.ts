import { APIState } from "../types";
import { allPass, always, has, ifElse, map, pathOr, pipe, props } from "ramda";
import { notEmpty } from "../utils/notEmpty";

export interface ErrorsSelector {
  (...origins: string[]): (state: APIState) => any[];
}

export const getErrors: ErrorsSelector = (...origins) =>
  pipe(
    pathOr({}, ["api", "errors"]),
    props(origins),
  );
