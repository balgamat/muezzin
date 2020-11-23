import { PutEffect, CallEffect } from "redux-saga/effects";
import { SuccessAC } from "./actions/success";
import { ClearErrorsAC, ErrorAC } from "./actions/error";
import { EndLoadingAC, StartLoadingAC } from "./actions/loading";
import { AxiosRequestConfig } from "axios";

export type Action<P, T = string> = {
  type: T;
  payload: P;
};

export type APIAction = ReturnType<
  SuccessAC | ErrorAC | StartLoadingAC | EndLoadingAC | ClearErrorsAC
>;

export interface APIResult {
  response?: object;
  origin: string;
  reducer?: (data: any, state: State) => object;
}

export type APIState = Record<string, any> & {
  api: {
    errors: Record<string, any[]>;
    loading: Record<string, null>;
  };
};

export interface AppState {
  [key: string]: any;
}

export type State<S = AppState> = S & APIState;

export interface BatchCall {
  requests: Action<APICall>[];
  onFinished?: APICall["preActions"];
}

export enum CallBehavior {
  TakeEvery = "takeEvery",
  TakeFirst = "takeFirst",
  TakeLatest = "takeLatest"
}

export interface APICall {
  behavior?: CallBehavior;
  errorActions?:
    | ((error: any, state: State) => Array<PutEffect | CallEffect>)
    | Array<PutEffect | CallEffect>;
  errorReducer?: (data: any, state: State) => State;
  name: string;
  params?: ((state: State) => AxiosRequestConfig) | AxiosRequestConfig;
  postActions?:
    | ((data: any, state: State) => Array<PutEffect | CallEffect>)
    | Array<PutEffect | CallEffect>;
  preActions?:
    | ((state: State) => Array<PutEffect | CallEffect>)
    | Array<PutEffect | CallEffect>;
  reducer?: (data: any, state: State) => State;
  url: ((state: State) => string) | string;
}
