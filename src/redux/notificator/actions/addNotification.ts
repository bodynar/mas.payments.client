import { ActionWithPayload } from "@app/redux/types";

import { NotificationItem } from "@app/models/notification";

import { AddNotification } from "../actions";

/**
 * Get redux action "Add notification"
 * @param notification Notification to add
 * @param notifyOnBadge Should notification appear on bell as badge
 * @returns State updating action
 */
export const getAddNotificationAction = (notification: NotificationItem, notifyOnBadge: boolean): ActionWithPayload => {
    return getAddNotificationsAction([notification], notifyOnBadge);
};

/**
 * Get redux action "Add stack of notifications"
 * @param notifications Notifications to add
 * @param notifyOnBadge Should these notifications appears on bell as badge
 * @returns State updating action
 */
export const getAddNotificationsAction = (notifications: Array<NotificationItem>, notifyOnBadge: boolean): ActionWithPayload => {
    return {
        type: AddNotification,
        payload: {
            notifications: notifications,
            displayDismissableNotification: notifyOnBadge
        },
    };
};
