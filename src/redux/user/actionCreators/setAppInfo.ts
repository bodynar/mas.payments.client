import { ApplicationInfo } from "@app/models/user";
import { ActionWithPayload } from "@app/redux/types";

import { SetAppInfo } from "../actions";

/**
 * Get redux action "Set application info"
 * @param appInfo Application info
 * @returns Redux action to update state
 */
export const getSetAppInfoAction = (appInfo: ApplicationInfo): ActionWithPayload => ({
    type: SetAppInfo,
    payload: { appInfo },
});
