import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User from '../models/User'
import Train from '../models/Train'

type TrainsState = {
  trains: Record<string, Train>
}

const initialState: TrainsState = {
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

export const trainsReducer = slice.reducer
