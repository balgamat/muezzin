import { AxiosStatic } from "axios";
export let axios = require("axios").default;

export const setupAxios = (setupFn: (axios: AxiosStatic) => void) => setupFn(axios);
