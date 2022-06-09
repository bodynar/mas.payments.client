import { Action } from "@app/redux/types";

import { SetNotificationsBadgeToZero } from "../actions";

/**
 * Get redux action "Set notifications badge to 0"
 * @returns State updating action
 */
export const setNotificationsBadgeToZero = (): Action => ({
    type: SetNotificationsBadgeToZero,
});
