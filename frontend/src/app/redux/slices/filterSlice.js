import { createSlice } from '@reduxjs/toolkit';

const filterSlices = createSlice({
  name: 'filter',
  initialState: {min:1000000,max:3000000},
  reducers: {
    setMin: (state, action) => {
      state.min = action.payload;
    },
    setMax: (state, action) => {
      state.max = action.payload;
    },
  },
});

export const { setMin, setMax, setPriceValue } = filterSlices.actions;
export default filterSlices.reducer;
