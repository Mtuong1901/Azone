import { createSlice } from "@reduxjs/toolkit";
const sortSlices = createSlice({
  name: "sort",
  initialState: null,
  reducers: {
    sortDefault: (state) => null,
    sortASC: (state) => "ASC",
    sortDESC: (state) => "DESC"
  }
});

export const { sortDefault, sortASC, sortDESC } = sortSlices.actions;
export default sortSlices.reducer;
