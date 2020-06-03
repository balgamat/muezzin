import { CallEffect, PutEffect } from "redux-saga/effects";

let defaultErrorInterceptors: ((
  error: any,
  state: any
) => Array<PutEffect | CallEffect>) | undefined = undefined;

export const getDefaultErrorInterceptors = () => defaultErrorInterceptors;

export const setDefaultErrorInterceptors = (
  interceptors: (error: any, state: any) => Array<PutEffect | CallEffect>
) => (defaultErrorInterceptors = interceptors);
