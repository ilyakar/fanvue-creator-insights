import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  archetypeName: 'Warrior' | 'Stoic' | 'Strategist' | 'Shadow' | null
  gender: 'male' | 'female' | null
  skinTone: 'light' | 'dark' | null
  values: string[]
  rituals: string[]
}

const initialState: UserState = {
  archetypeName: null,
  gender: 'male',
  skinTone: 'light',
  values: [],
  rituals: []
}

// Redux slice storing basic user profile info
export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    // Merges new user attributes into state
    updateUser: (state, { payload }: PayloadAction<Partial<UserState>>) => {
      return {
        ...state,
        ...payload
      }
    },
    // Resets user state to defaults
    resetUser: () => {
      return initialState
    }
  }
})

const { actions, reducer } = userSlice
const { updateUser } = actions

export { updateUser }
export default reducer
