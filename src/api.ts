import { Action, APICall } from "./types";

export const api = (def: APICall): Action<APICall> => ({
  type: `@API/${def.name}`,
  payload: def,
});