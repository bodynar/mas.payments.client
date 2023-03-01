import { ApplicationInfo } from "@app/models/user";

import { ActionWithPayload } from "@app/redux";
import { SetAppInfo } from "@app/redux/user";

/**
 * Get redux action "Set application info"
 * @param appInfo Application info
 * @returns Redux action to update state
 */
export const getSetAppInfoAction = (appInfo: ApplicationInfo): ActionWithPayload => ({
    type: SetAppInfo,
    payload: { appInfo },
});
