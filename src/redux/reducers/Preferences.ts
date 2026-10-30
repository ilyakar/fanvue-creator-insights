/* ------------------------------------------------------------
Stores the creator workspace layout preference.
---------------------------------------------------------------*/

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const preferencesSlice = createSlice({
  name: 'Preferences',
  initialState: { isSidebarCollapsed: false },
  reducers: {
    // Saves only a harmless layout preference in browser storage.
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
    }
  }
})

export const { setSidebarCollapsed } = preferencesSlice.actions
export default preferencesSlice.reducer
