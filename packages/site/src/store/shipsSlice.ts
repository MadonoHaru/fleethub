import { ShipParams } from "@fleethub/core";
import { FhEntity, GearKey, Role, ShipKey } from "@fleethub/utils";
import {
  createEntityAdapter,
  createSlice,
  EntitySelectors,
} from "@reduxjs/toolkit";
import { DefaultRootState } from "react-redux";

import { gearsSlice } from "./gearsSlice";
import { selectShipsState } from "./selectors";

export type ShipEntity = FhEntity<ShipParams, GearKey>;

export type ShipPosition = { id: string; role: Role; key: ShipKey };

const adapter = createEntityAdapter<ShipEntity>();
export const shipsSelectors: EntitySelectors<ShipEntity, DefaultRootState> =
  adapter.getSelectors(selectShipsState);

export const shipsSlice = createSlice({
  name: "ships",
  initialState: adapter.getInitialState(),
  reducers: {
    add: {
      reducer: adapter.addOne,
      prepare: (state: ShipEntity, to: ShipPosition) => ({
        payload: state,
        meta: { fleet: to },
      }),
    },
    update: adapter.updateOne,
    remove: adapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(gearsSlice.actions.add, (state, { payload, meta }) => {
      const { position } = meta;
      const entity =
        "ship" in position && position.ship && state.entities[position.ship];
      if (!entity) return;

      entity[position.key] = payload.id;
    });
  },
});
