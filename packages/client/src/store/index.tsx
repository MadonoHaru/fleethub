import React from "react"
import { combineReducers, configureStore, getDefaultMiddleware, AnyAction } from "@reduxjs/toolkit"
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "localforage"
import undoable, { UndoableOptions, excludeAction } from "redux-undo"
import { ThunkAction } from "redux-thunk"

import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { makeGroupBy } from "../utils"

import { uiSlice } from "./uiSlice"
import { entitiesReducer } from "./entities"

const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]

const undoableOptions: UndoableOptions = {
  filter: excludeAction(ignoredActions),
  groupBy: makeGroupBy(),
  ignoreInitialState: true,
  limit: 10,
}

const rootReducer = combineReducers({
  entities: undoable(persistReducer({ key: "entities", storage }, entitiesReducer), undoableOptions),
  ui: uiSlice.reducer,
})

const extraArgument = undefined

export const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      thunk: {
        extraArgument,
      },
      serializableCheck: {
        ignoredActions,
      },
    }),
  })

  return store
}

export const StoreProvider: React.FC = ({ children }) => {
  const store = createStore()
  const persistor = persistStore(store)

  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </ReduxProvider>
  )
}

type Store = ReturnType<typeof createStore>
export type RootState = ReturnType<Store["getState"]>
export type AppDispatch = Store["dispatch"]
export type AppThunk = ThunkAction<void, RootState, typeof extraArgument, AnyAction>

export * from "./plansSlice"
export * from "./filesSlice"
export * from "./uiSlice"
export * from "./entities"