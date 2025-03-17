import { ActionWithPayload } from "@app/redux";
import { HideNotification } from "@app/redux/notificator";

/**
 * Get redux action "Hide specified notification"
 * @param notificationId Notification identifier
 * @returns State updating action
 */
export const getHideNotificationAction = (notificationId: string): ActionWithPayload => {
    return getHideNotificationsAction([notificationId]);
};

/**
 * Get redux action "Hide specified notifications"
 * @param notificationIds Notification identifiers
 * @returns State updating action
 */
export const getHideNotificationsAction = (notificationIds: Array<string>): ActionWithPayload => {
    return {
        type: HideNotification,
        payload: { notificationIds },
    };
};
