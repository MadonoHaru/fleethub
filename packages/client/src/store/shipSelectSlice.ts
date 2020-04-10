import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ShipPosition } from "./entities"

export type ShipSelectState = {
  abyssal: boolean
  shipTypeFilter: string
  position?: ShipPosition
}

const initialState: ShipSelectState = {
  abyssal: false,
  shipTypeFilter: "戦艦級",
}

export default createSlice({
  name: "shipSelect",
  initialState,
  reducers: {
    set: (state, { payload }: PayloadAction<Partial<ShipSelectState>>) => {
      Object.assign(state, payload)
    },
  },
})
