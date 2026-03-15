import { get } from "@app/utils";

import { UserSetting } from "@app/models/user";

import { createAppAsyncThunk } from "@app/redux";
import { setSettings } from "@app/redux/user";

/**
 * Get user settings
 */
export const loadSettings = createAppAsyncThunk(
    async ({ dispatch }) => {
        const settings = await get<Array<Record<string, unknown>>>(`api/user/getSettings`);

        dispatch(
            setSettings(
                settings.map(x => ({
                    displayName: x["displayName"],
                    id: x["id"],
                    name: x["name"],
                    rawValue: x["rawValue"],
                    type: (x["typeName"] as string).toLowerCase()
                }) as UserSetting)
            )
        );
    }
);
