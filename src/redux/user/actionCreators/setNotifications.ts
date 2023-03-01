import { UserNotification } from "@app/models/user";
import { ActionWithPayload } from "@app/redux/types";

import { SetNotifications } from "../actions";

/**
 * Get redux action "Set user notification history"
 * @param notifications Notification history
 * @returns Redux action to update state
 */
export const getSetNotificationsAction = (notifications: Array<UserNotification>): ActionWithPayload => ({
    type: SetNotifications,
    payload: { notifications },
});
