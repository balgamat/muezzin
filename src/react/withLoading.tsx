import React, {
  createElement,
  ComponentType,
  ReactNode,
  ReactChildren,
  FC, ReactElement
} from "react";
import { useSelector } from "react-redux";
import { isLoading } from "..";

export const withLoading = (
  loadingComponent: ReactElement,
  ...waitFor: string[]
) => (Component: ComponentType): FC => props =>
  useSelector(isLoading(...waitFor)) ? (
    loadingComponent
  ) : (
    <Component {...props}>{props.children as ReactChildren}</Component>
  );
