/* eslint-disable @typescript-eslint/no-empty-interface */
import "@emotion/react/types/css-prop";

import { AppDispatch, RootState } from "./store";

declare module "react" {
  import { Interpolation, Theme } from "@emotion/react";

  type FCX<P = {}> = FC<P & { className?: string }>;
}

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
  export function useDispatch(): AppDispatch;
}

declare module "@reduxjs/toolkit" {
  export type AppThunk = import("./store").AppThunk;
  export type AppStore = import("./store").AppStore;
}

declare module "@emotion/react" {
  type MyTheme = import("./styles").Theme;
  export interface Theme extends MyTheme {}
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VERSION: string;
    }
  }
}
