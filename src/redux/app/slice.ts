import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppState } from "./types";

const initialState: AppState = {
    isCurrentTabFocused: true,
    loading: false,
};

const appSlice = createSlice({
    name: "mas.payments/app",
    initialState,
    reducers: {
        setTabIsFocused(state, action: PayloadAction<boolean>) {
            state.isCurrentTabFocused = action.payload;
        },
        setAppIsLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {
    setTabIsFocused,
    setAppIsLoading,
} = appSlice.actions;

export default appSlice.reducer;
