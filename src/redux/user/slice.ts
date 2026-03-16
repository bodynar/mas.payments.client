import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApplicationInfo, UserSetting, UserNotification } from "@app/models/user";

import { UserModuleState } from "./types";

const initialState: UserModuleState = {
    appInfo: undefined,
    notificationHistory: [],
    settings: [],
    isNotificationSortOrderAsc: true,
};

const userSlice = createSlice({
    name: "mas.payments/user",
    initialState,
    reducers: {
        setAppInfo(state, action: PayloadAction<ApplicationInfo>) {
            state.appInfo = action.payload;
        },
        setNotifications(state, action: PayloadAction<UserNotification[]>) {
            state.notificationHistory = action.payload ?? [];
        },
        setSettings(state, action: PayloadAction<UserSetting[]>) {
            state.settings = action.payload ?? [];
        },
        toggleNotificationsSortOrder(state) {
            state.isNotificationSortOrderAsc = !state.isNotificationSortOrderAsc;
        },
        setMeasurementsWithoutDiff(state, action: PayloadAction<number>) {
            state.options = { ...state.options, measurementsWithoutDiff: action.payload ?? 0 };
        },
    },
});

export const {
    setAppInfo,
    setNotifications,
    setSettings,
    toggleNotificationsSortOrder,
    setMeasurementsWithoutDiff,
} = userSlice.actions;

export default userSlice.reducer;
