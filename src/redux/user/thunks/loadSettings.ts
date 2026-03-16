import { createAppAsyncThunk } from "@app/redux";
import { setSettings } from "@app/redux/user";

import { getUserSettings } from "@app/core/user";

/**
 * Get user settings
 */
export const loadSettings = createAppAsyncThunk(
    async ({ dispatch }) => {
        const settings = await getUserSettings();
        dispatch(setSettings(settings));
    }
);
