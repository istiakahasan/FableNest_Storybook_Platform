import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BackgroundState {
  shouldRotate: boolean;
}

const initialState: BackgroundState = {
  shouldRotate: false,
};

const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    setShouldRotate: (state, action: PayloadAction<boolean>) => {
      state.shouldRotate = action.payload;
    },
  },
});

export const { setShouldRotate } = backgroundSlice.actions;
export default backgroundSlice.reducer;

