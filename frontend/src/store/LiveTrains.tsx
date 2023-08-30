import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Train from '../models/Train'

type LiveTrainsState = {
  trains: Record<string, Train>
}

const initialState: LiveTrainsState = {
  trains: {}
}

const slice = createSlice({
  name: 'trains',
  initialState,
  reducers: {
    upsertTrain: (state, { payload: train }: PayloadAction<Train>) => {
      state.trains = { ...state.trains, [train.trainNumber]: train }
    }
  }
})

export const { upsertTrain } = slice.actions

export const liveTrainsReducer = slice.reducer
