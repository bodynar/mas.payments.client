import { post } from "@app/utils";

import { createAppAsyncThunk } from "@app/redux";

/**
 * Save user settings
 */
export const updateUserSettings = createAppAsyncThunk(
    async ({ showSuccess }, updatedSettings: Array<UpdatedUserSetting>) => {
        await post(`api/user/updateUserSettings`, updatedSettings);
        showSuccess("Settings updated successfully", false);
    }
);

/** Updated user setting */
export interface UpdatedUserSetting {
    /** Setting id */
    id: number;

    /** Textual value */
    rawValue: string;
}
