import { Action } from "@app/redux";
import { HideAllNotifications } from "@app/redux/notificator";

/**
 * Get redux action "Hide all notifications"
 * @returns State updating action
 */
export const getHideAllNotificationsAction = (): Action => ({
    type: HideAllNotifications
});
