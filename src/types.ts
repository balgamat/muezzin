import { PutEffect, CallEffect } from "redux-saga/effects";
import { SuccessAC } from "./actions/success";
import { ClearErrorsAC, ErrorAC } from "./actions/error";
import { EndLoadingAC, StartLoadingAC } from "./actions/loading";

export type Action<T, S = string> = {
  type: S;
  payload: T;
};

export type APIAction = ReturnType<
  SuccessAC | ErrorAC | StartLoadingAC | EndLoadingAC | ClearErrorsAC
>;

export interface BatchCall {
  calls: Action<APICall>[];
  onFinished?: APICall["preActions"];
}

export enum CallBehavior {
  TakeEvery = "takeEvery",
  TakeLatest = "takeLatest",
  TakeFirst = "takeFirst"
}

export interface APICall {
  behavior?: CallBehavior;
  callParams?: ((state: any) => object) | object;
  endpoint: string[];
  errorActions?: (apiCallResult: any) => Array<PutEffect | CallEffect>;
  errorReducer?: (data: any, state?: any) => object;
  postActions?: (apiCallResult: any) => Array<PutEffect | CallEffect>;
  preActions?: (state: object) => Array<PutEffect | CallEffect>;
  reducer?: (data: any, state?: any) => object;
}

export interface APIResult {
  origin: string;
  data: object;
  reducer?: (data: any, state?: any) => object;
}

export interface Endpoint<T, R = any> {
  (params?: T): R;
}

type Level0 = Record<string, Endpoint<any>>;
type Level1 = Record<string, Level0>;
type Level2 = Record<string, Level0 | Level1>;
type Level3 = Record<string, Level0 | Level1 | Level2>;
type Level4 = Record<string, Level0 | Level1 | Level2 | Level3>;
type Level5 = Record<string, Level0 | Level1 | Level2 | Level3 | Level4>;
type Level6 = Record<
  string,
  Level0 | Level1 | Level2 | Level3 | Level4 | Level5
>;
type Level7 = Record<
  string,
  Level0 | Level1 | Level2 | Level3 | Level4 | Level5 | Level6
>;
type Level8 = Record<
  string,
  Level0 | Level1 | Level2 | Level3 | Level4 | Level5 | Level6 | Level7
>;
type Level9 = Record<
  string,
  Level0 | Level1 | Level2 | Level3 | Level4 | Level5 | Level6 | Level7 | Level8
>;

export type APIDefinition =
  | Level0
  | Level1
  | Level2
  | Level3
  | Level4
  | Level5
  | Level6
  | Level7
  | Level8
  | Level9;

export type APIState = Record<string, any> & {
  api: {
    loading: Record<string, null>;
    errors: Record<string, any[]>;
  };
};
