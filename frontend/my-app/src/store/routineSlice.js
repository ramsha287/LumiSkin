import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routines: [],
  currentRoutine: null,
  loading: false,
  error: null,
};

const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    setRoutines: (state, action) => {
      state.routines = action.payload;
    },
    setCurrentRoutine: (state, action) => {
      state.currentRoutine = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setRoutines, setCurrentRoutine, clearError } = routineSlice.actions;
export default routineSlice.reducer; 