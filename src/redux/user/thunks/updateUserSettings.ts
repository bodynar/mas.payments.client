import { createAppAsyncThunk } from "@app/redux";

import { updateUserSettings as updateUserSettingsApi } from "@app/core/user";
import { UpdatedUserSetting } from "@app/models/user";

/**
 * Save user settings
 */
export const updateUserSettings = createAppAsyncThunk(
    async ({ showSuccess }, updatedSettings: Array<UpdatedUserSetting>) => {
        await updateUserSettingsApi(updatedSettings);
        showSuccess("Settings updated successfully", false);
    }
);
