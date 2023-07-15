import { Action } from "@app/redux";
import { SetNotificationsBadgeToZero } from "@app/redux/notificator";

/**
 * Get redux action "Set notifications badge to 0"
 * @returns State updating action
 */
export const setNotificationsBadgeToZero = (): Action => ({
    type: SetNotificationsBadgeToZero,
});
