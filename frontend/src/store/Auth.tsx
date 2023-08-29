import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User from '../models/User'

type AuthState = {
  currentUser?: User
  token?: string
}

const initialState: AuthState = {}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, { payload: user }: PayloadAction<User>) => {
      state.currentUser = user
    },
    clearCurrentUser: (state) => {
      state.currentUser = undefined
    },
    setToken: (state, { payload: token }: PayloadAction<string>) => {
      state.token = token
    }
  }
})

export const { setCurrentUser, clearCurrentUser, setToken } = slice.actions

export const authReducer = slice.reducer
