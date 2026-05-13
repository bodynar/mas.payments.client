import { createAppAsyncThunk } from "@app/redux";

import { updateUserSettings as updateUserSettingsApi } from "@app/core/user";
import { UpdatedUserSetting } from "@app/models/user";

import { loadSettings } from "./loadSettings";

/**
 * Save user settings
 */
export const updateUserSettings = createAppAsyncThunk(
    async ({ showSuccess, dispatch }, updatedSettings: Array<UpdatedUserSetting>) => {
        await updateUserSettingsApi(updatedSettings);
        await dispatch(loadSettings());
        showSuccess("Settings updated successfully", false);
    }
);
