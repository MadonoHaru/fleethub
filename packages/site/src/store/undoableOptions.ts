import { nanoid } from "@reduxjs/toolkit";
import { FilterFunction, GroupByFunction, UndoableOptions } from "redux-undo";

import { appSlice } from "./appSlice";

const undoableState: { ignore: boolean; group?: string } = {
  ignore: false,
};

export const ignoreUndoable = (cb: () => void) => {
  undoableState.ignore = true;
  cb();
  undoableState.ignore = false;
};

export const batchUndoable = (cb: () => void, group = nanoid()) => {
  undoableState.group = group;
  cb();
  undoableState.group = undefined;
};

export const batchGroupBy: GroupByFunction = () => undoableState.group;

const actionTypeFilter: FilterFunction = (action) =>
  ["entities", appSlice.actions.openFile.type].some((key) =>
    (action.type as string).startsWith(key)
  );

const filter: FilterFunction = (...args) =>
  !undoableState.ignore && actionTypeFilter(...args);

const undoableOptions: UndoableOptions = {
  filter,
  groupBy: batchGroupBy,
  limit: 10,
  neverSkipReducer: true,
};

export default undoableOptions;
