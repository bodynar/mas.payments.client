import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NotificationItem } from "@app/models/notification";

import { NotificatorState } from "./types";

const initialState: NotificatorState = {
    notifications: [],
    history: [],
    historyBadgeCount: 0,
};

const notificatorSlice = createSlice({
    name: "mas.payments/notification",
    initialState,
    reducers: {
        addNotifications(state, action: PayloadAction<{ notifications: NotificationItem[]; displayDismissibleNotification: boolean }>) {
            let adding = action.payload.notifications;

            if (adding.length === 0) {
                return;
            }

            adding = adding.filter(({ id }) => !state.notifications.some(x => x.id === id));

            if (adding.length === 0) {
                return;
            }

            const historyBadgeCount = action.payload.displayDismissibleNotification
                ? state.historyBadgeCount
                : state.historyBadgeCount + 1;

            state.history = [...adding, ...state.history];
            state.notifications = [...adding, ...state.notifications];
            state.historyBadgeCount = historyBadgeCount;
        },
        hideNotifications(state, action: PayloadAction<string[]>) {
            if (action.payload.length === 0) {
                return;
            }

            state.notifications = state.notifications.filter(n => !action.payload.includes(n.id));
        },
        setBadgeToZero(state) {
            state.historyBadgeCount = 0;
        },
    },
});

export const {
    addNotifications,
    hideNotifications,
    setBadgeToZero,
} = notificatorSlice.actions;

export default notificatorSlice.reducer;
