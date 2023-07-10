import { getPropertyValueWithCheck, removeByKey } from "@bodynarf/utils";

import { NotificationItem } from "@app/models/notification";

import { ActionWithPayload } from "@app/redux";
import { AddNotification, HideAllNotifications, HideNotification, SetNotificationsBadgeToZero, NotificatorState } from "@app/redux/notificator";

/** Default state of notification module */
const defaultState: NotificatorState = {
    notifications: [],
    history: [],
    historyBadgeCount: 0,
};

/** Notification redux reducer function */
export default function (state: NotificatorState = defaultState, action: ActionWithPayload): NotificatorState {
    switch (action.type) {
        case AddNotification: {
            let addingNotifications: Array<NotificationItem> = getPropertyValueWithCheck(action.payload, "notifications", false);

            if (addingNotifications.length === 0) {
                // TODO: v2 log warning
                return state;
            }

            addingNotifications = addingNotifications.filter(({ id }) => !state.notifications.some(x => x.id === id));

            if (addingNotifications.length === 0) {
                return state;
            }

            const displayDismissibleNotification: boolean = getPropertyValueWithCheck(action.payload, "displayDismissibleNotification", false) || false;

            const historyBadgeCount: number = displayDismissibleNotification
                ? state.historyBadgeCount
                : state.historyBadgeCount + 1;

            return {
                ...state,
                history: [
                    ...addingNotifications,
                    ...state.history,
                ],
                notifications: [...addingNotifications, ...state.notifications],
                historyBadgeCount: historyBadgeCount,
            };
        }
        case HideNotification: {
            const notifications: Array<string> = getPropertyValueWithCheck(action.payload, "notificationIds", false);

            if (notifications.length === 0) {
                // TODO: v2 log warning
                return state;
            }

            return {
                ...state,
                notifications: removeByKey(state.notifications, x => x.id, notifications),
            };
        }
        case HideAllNotifications: {
            return {
                ...state,
                notifications: [],
            };
        }
        case SetNotificationsBadgeToZero: {
            return {
                ...state,
                historyBadgeCount: 0,
            };
        }
        default: {
            return state;
        }
    }
}
