import { Action } from "@app/redux";

import { ToggleNotificationsSortOrder } from "@app/redux/user";

/**
 * Get redux action "Toggle sort order for notifications"
 * @returns Redux action to update state
 */
export const getToggleNotificationsSortOrderAction = (): Action => ({
    type: ToggleNotificationsSortOrder,
});
