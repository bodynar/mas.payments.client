import { Action } from "@app/redux/types";

import { HideAllNotifications } from "../actions";

/**
 * Get redux action "Hide all notifications"
 * @returns State updating action
 */
export const getHideAllNotificationsAction = (): Action => ({
    type: HideAllNotifications
});
