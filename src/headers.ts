export let defaultHeaders: Record<string, any> = {};

export const getDefaultHeaders = () => defaultHeaders;

export const setDefaultHeaders = (headers: HeadersInit) => {
  defaultHeaders = headers;
};

export const addDefaultHeaderKey = (key: string, value: any) => {
  defaultHeaders[key] = value;
};

export const clearDefaultHeaderKey = (key: string) => {
  delete defaultHeaders[key];
};