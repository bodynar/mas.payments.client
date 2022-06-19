import { Action } from "@app/redux/types";

import { ToggleNotificationsSortOrder } from "../actions";

/**
 * Get redux action "Toggle sort order for notifications"
 * @returns Redux action to update state
 */
export const getToggleNotificationsSortOrderAction = (): Action => ({
    type: ToggleNotificationsSortOrder,
});
