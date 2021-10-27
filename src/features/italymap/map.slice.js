import { createSlice } from '@reduxjs/toolkit'

const initialState = { region: null }

const mapSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setCurrentRegion(state, action) {
      state.region = action.payload
    },
  },
})

export const { setCurrentRegion } = mapSlice.actions
export default mapSlice.reducer
