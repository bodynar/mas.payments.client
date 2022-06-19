import { ApplicationInfo, Setting, UserNotification } from "@app/models/user";
import { getPropertyValueWithCheck } from "@bodynarf/utils/object";

import { ActionWithPayload } from "../types";
import { SetAppInfo, SetNotifications, ToggleNotificationsSortOrder, SetSettings } from "./actions";

import { UserModuleState } from "./types";

/** Initial user module state */
const defaultState: UserModuleState = {
    appInfo: undefined,
    notificationHistory: [],
    settings: [],
    isNotificationSortOrderAsc: false,
};

/**
 * Update user module state depending on dispatched action
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function (state: UserModuleState = defaultState, action: ActionWithPayload): UserModuleState {
    switch (action.type) {
        case SetAppInfo: {
            const appInfo: ApplicationInfo = getPropertyValueWithCheck(action.payload, 'appInfo');

            return {
                ...state,
                appInfo,
            };
        }
        case SetNotifications: {
            const notifications: Array<UserNotification> = getPropertyValueWithCheck(action.payload, 'notifications') || [];

            return {
                ...state,
                notificationHistory: notifications,
            };
        }
        case SetSettings: {
            const settings: Array<Setting> = getPropertyValueWithCheck(action.payload, 'settings') || [];

            return {
                ...state,
                settings: [...state.settings, ...settings],
            };
        }
        case ToggleNotificationsSortOrder: {
            return {
                ...state,
                isNotificationSortOrderAsc: !state.isNotificationSortOrderAsc
            };
        }
        default: {
            return state;
        }
    }
}
