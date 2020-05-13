import { compose, isEmpty, not } from "ramda";

export const notEmpty = compose(not, isEmpty);