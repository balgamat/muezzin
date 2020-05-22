import { APIState } from "../types";
import { allPass, always, has, ifElse, map, pathOr, pipe } from "ramda";
import { notEmpty } from "../utils/notEmpty";

export interface LoadingSelector {
  (...origins: string[]): (state: APIState) => boolean;
}

export const isLoading: LoadingSelector = (...origins ) =>
  pipe(
    pathOr({}, ["api", "loading"]),
    ifElse(
      always(!origins.length),
      notEmpty,
      allPass(map(has)(origins))
    )
  );
