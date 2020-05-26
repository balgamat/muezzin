import React, {
  createElement,
  ComponentType,
  ReactNode,
  ReactChildren,
  FC,
  ReactElement
} from "react";
import { useSelector } from "react-redux";
import { isLoading } from "..";

export const withLoading = (spinner: ReactElement) => (
  ...waitFor: string[]
) => (Component: ComponentType): FC => props =>
  useSelector(isLoading(...waitFor)) ? (
    spinner
  ) : (
    <Component {...props}>{props.children as ReactChildren}</Component>
  );