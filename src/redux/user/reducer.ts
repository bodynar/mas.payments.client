import { getPropertyValueWithCheck } from "@bodynarf/utils";

import { ApplicationInfo, UserSetting, UserNotification } from "@app/models/user";

import { ActionWithPayload } from "@app/redux";
import { SetAppInfo, SetNotifications, ToggleNotificationsSortOrder, SetSettings, SetMeasurementsWithoutDiff, UserModuleState } from "@app/redux/user";

/** Initial user module state */
const defaultState: UserModuleState = {
    appInfo: undefined,
    notificationHistory: [],
    settings: [],
    isNotificationSortOrderAsc: true,
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
            const appInfo: ApplicationInfo = getPropertyValueWithCheck(action.payload, "appInfo");

            return {
                ...state,
                appInfo,
            };
        }
        case SetNotifications: {
            const notifications: Array<UserNotification> = getPropertyValueWithCheck(action.payload, "notifications") || [];

            return {
                ...state,
                notificationHistory: notifications,
            };
        }
        case SetSettings: {
            const settings: Array<UserSetting> = getPropertyValueWithCheck(action.payload, "settings") || [];

            return {
                ...state,
                settings,
            };
        }
        case ToggleNotificationsSortOrder: {
            return {
                ...state,
                isNotificationSortOrderAsc: !state.isNotificationSortOrderAsc
            };
        }
        case SetMeasurementsWithoutDiff: {
            const count: number = getPropertyValueWithCheck(action.payload, "measurementsCount") || 0;

            return {
                ...state,
                options: {
                    ...state.options,
                    measurementsWithoutDiff: count
                }
            };
        }
        default: {
            return state;
        }
    }
}
