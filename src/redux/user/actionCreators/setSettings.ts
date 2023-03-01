import { UserSetting } from "@app/models/user";

import { ActionWithPayload } from "@app/redux";
import { SetSettings } from "@app/redux/user";

/**
 * Get redux action "Set user settings"
 * @param settings User settings
 * @returns Redux action to update state
 */
export const getSetSettingsAction = (settings: Array<UserSetting>): ActionWithPayload => ({
    type: SetSettings,
    payload: { settings },
});
