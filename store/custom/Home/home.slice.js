import { createSlice } from "@reduxjs/toolkit"

const initial = {
  filterObj: {},
  hasFilters: false
}

export const homeSlice = createSlice({
  name: "home",
  initialState: initial,
  reducers: {
    applyFilter: (state, payload) => {
      state.hasFilters = true
      state.filterObj = payload.payload
    },
    resetFilter: state => {
      console.log("reset filter")
      state.filterObj = {}
      state.hasFilters = false
    }
  }
})

// each case under reducers becomes an action
export const { applyFilter, resetFilter } = homeSlice.actions

export default homeSlice.reducer
